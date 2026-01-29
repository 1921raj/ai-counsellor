from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json
import os
import traceback
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
import secrets

from database import engine, get_db, Base
from models import (
    User, UserProfile, University, ShortlistedUniversity,
    Task, ChatMessage, UserStage, ProfileStrength, TaskStatus
)
from schemas import (
    UserCreate, UserLogin, GoogleLogin, UserResponse, Token,
    ProfileCreate, ProfileUpdate, ProfileResponse,
    UniversityResponse, ShortlistCreate, ShortlistResponse,
    TaskCreate, TaskUpdate, TaskResponse,
    ChatMessageCreate, ChatMessageResponse, ChatRequest, LockUniversity, DashboardResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_active_user
)
from ai_counsellor import ai_counsellor
from external_unis import external_search

# Create database tables
# app = FastAPI
app = FastAPI(title="AI Counsellor API", version="1.0.0")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI Counsellor API is active",
        "version": "1.0.0",
        "research_engine": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.on_event("startup")
def startup_event():
    # Run on startup to seed/initialize
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if database is empty
    from seed import seed_universities
    db = next(get_db())
    if db.query(University).count() == 0:
        print("Production DB is empty. Initializing seed...")
        try:
            seed_universities()
        except Exception as e:
            print(f"Seed failed during startup: {e}")
    
    # Background loader for global uni data
    import threading
    threading.Thread(target=external_search.load_data, daemon=True).start()
    return {"status": "success", "message": "Backend is running with Global Research Engine"}

@app.get("/maintenance/seed")
def seed_production_data(db: Session = Depends(get_db)):
    from seed import seed_universities
    try:
        seed_universities()
        return {"status": "success", "message": "Database seeded successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ROUTES ====================

@app.post("/auth/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        print(f"Hashing password for {user_data.email}...")
        hashed_password = get_password_hash(user_data.password)
        print("Password hashed successfully")
        
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        print(f"SIGNUP ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/auth/google", response_model=Token)
def google_login(login_data: GoogleLogin, db: Session = Depends(get_db)):
    print(f"Received Google Login Request. Token prefix: {login_data.token[:10]}...")
    email = None
    name = ""
    
    # Try 1: Verify as ID Token (JWT)
    try:
        # Get Client ID from env or let library handle if only verifying signature
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        
        id_info = id_token.verify_oauth2_token(
            login_data.token,
            google_requests.Request(),
            audience=client_id
        )
        
        email = id_info['email']
        name = id_info.get('name', '')
        
    except ValueError:
        # Try 2: Verify as Access Token (fetch userinfo)
        try:
            response = requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {login_data.token}"}
            )
            
            if response.status_code == 200:
                user_info = response.json()
                email = user_info.get('email')
                name = user_info.get('name', '')
            else:
                raise ValueError("Invalid access token")
                
        except Exception as e:
            print(f"Access token verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not retrieve email from Google token"
        )
        
    try:
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create user with random password
            random_password = secrets.token_urlsafe(16)
            hashed_password = get_password_hash(random_password)
            
            user = User(
                email=email,
                full_name=name,
                hashed_password=hashed_password,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        print(f"Google Login Database Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login processing failed: {str(e)}")

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user

# ==================== PROFILE ROUTES ====================

@app.post("/profile", response_model=ProfileResponse)
def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if profile exists
    existing_profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    # Calculate profile strengths
    academic_strength = ProfileStrength.AVERAGE
    if profile_data.gpa:
        if profile_data.gpa >= 3.5:
            academic_strength = ProfileStrength.STRONG
        elif profile_data.gpa < 3.0:
            academic_strength = ProfileStrength.WEAK
    
    exam_strength = ProfileStrength.WEAK
    if profile_data.ielts_score or profile_data.toefl_score:
        if (profile_data.ielts_score and profile_data.ielts_score >= 7.0) or \
           (profile_data.toefl_score and profile_data.toefl_score >= 100):
            exam_strength = ProfileStrength.STRONG
        else:
            exam_strength = ProfileStrength.AVERAGE
    
    sop_strength = ProfileStrength.WEAK
    if profile_data.sop_status == "Ready":
        sop_strength = ProfileStrength.STRONG
    elif profile_data.sop_status == "Draft":
        sop_strength = ProfileStrength.AVERAGE
    
    # Create profile
    profile = UserProfile(
        user_id=current_user.id,
        **profile_data.model_dump(),
        academic_strength=academic_strength,
        exam_strength=exam_strength,
        sop_strength=sop_strength
    )
    
    db.add(profile)
    
    # Update user onboarding status
    current_user.onboarding_completed = True
    current_user.current_stage = UserStage.DISCOVERING_UNIVERSITIES
    
    db.commit()
    db.refresh(profile)
    
    # Create initial tasks
    initial_tasks = [
        Task(
            user_id=current_user.id,
            title="Complete English proficiency test",
            description="Take IELTS or TOEFL if not already done",
            priority=5
        ),
        Task(
            user_id=current_user.id,
            title="Start SOP draft",
            description="Begin writing your Statement of Purpose",
            priority=4
        ),
        Task(
            user_id=current_user.id,
            title="Research universities",
            description="Explore universities that match your profile",
            priority=3
        )
    ]
    
    for task in initial_tasks:
        db.add(task)
    
    db.commit()
    
    return profile

@app.get("/profile", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile

@app.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update fields
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    
    # Recalculate strengths
    if profile_data.gpa is not None:
        if profile.gpa >= 3.5:
            profile.academic_strength = ProfileStrength.STRONG
        elif profile.gpa >= 3.0:
            profile.academic_strength = ProfileStrength.AVERAGE
        else:
            profile.academic_strength = ProfileStrength.WEAK
    
    db.commit()
    db.refresh(profile)
    
    return profile

# ==================== UNIVERSITY ROUTES ====================

@app.get("/universities", response_model=List[UniversityResponse])
def get_universities(
    country: str = None,
    name: str = None,
    scholarship: bool = None,
    min_tuition: float = None,
    max_tuition: float = None,
    min_ranking: int = None,
    max_ranking: int = None,
    major: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(University)
    
    if country:
        # Case insensitive partial match
        query = query.filter(University.country.ilike(f"%{country}%"))
    
    if name:
        query = query.filter(University.name.ilike(f"%{name}%"))
    
    if scholarship:
        query = query.filter(University.scholarship_available == True)
        
    if max_tuition:
        query = query.filter(University.tuition_fee_min <= max_tuition)

    if min_tuition:
        query = query.filter(University.tuition_fee_max >= min_tuition)

    if min_ranking:
        query = query.filter(University.ranking >= min_ranking)

    if max_ranking:
        query = query.filter(University.ranking <= max_ranking)
        
    if major:
        # Simple text search within the JSON string/Text column
        query = query.filter(University.programs.ilike(f"%{major}%"))
    
    # Order by ranking by default
    query = query.order_by(University.ranking.asc().nulls_last())
    
    universities = query.all()
    return universities

@app.get("/universities/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Complete onboarding first."
        )
    
    # Get universities
    universities = db.query(University).all()
    
    # Get recommendations from AI
    raw_recommendations = ai_counsellor.recommend_universities(profile, universities)
    
    # Manually serialize to avoid 500 errors with SQLAlchemy objects
    serialized_recs = []
    for rec in raw_recommendations:
        uni = rec["university"]
        serialized_recs.append({
            "fit_score": rec["fit_score"],
            "category": rec["category"],
            "risk_level": rec["risk_level"],
            "reasoning": rec["reasoning"],
            "university": {
                "id": uni.id,
                "name": uni.name,
                "country": uni.country,
                "city": uni.city,
                "ranking": uni.ranking,
                "programs": uni.programs,
                "min_gpa": uni.min_gpa,
                "min_ielts": uni.min_ielts,
                "min_toefl": uni.min_toefl,
                "min_gre": uni.min_gre,
                "min_gmat": uni.min_gmat,
                "tuition_fee_min": uni.tuition_fee_min,
                "tuition_fee_max": uni.tuition_fee_max,
                "living_cost_yearly": uni.living_cost_yearly,
                "acceptance_rate": uni.acceptance_rate,
                "description": uni.description,
                "website": uni.website
            }
        })
    
    return serialized_recs

@app.get("/external-universities/search")
def search_global_universities(
    country: str = None,
    name: str = None,
    limit: int = 40,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user)
):
    """Search global university database (Hipo dataset)"""
    results = external_search.search(country=country, name=name, limit=limit, offset=offset)
    return results

@app.post("/universities/import", response_model=UniversityResponse)
def import_external_university(
    uni_data: dict, # Expecting the Hipo object {name, country, web_pages...}
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Convert an external global university search result into a local record with AI enrichment"""
    # Check if exists
    name = uni_data.get('name')
    existing = db.query(University).filter(University.name == name).first()
    if existing:
        return existing
    
    # Enrich with AI
    from hipo_import import enrich_with_gemini
    enriched = enrich_with_gemini([uni_data], uni_data.get('country'))
    
    if not enriched:
        # Fallback to basic data if AI fails
        new_uni = University(
            name=name,
            country=uni_data.get('country'),
            city="Unknown",
            ranking=1000,
            programs=json.dumps(["General Studies"]),
            website=uni_data.get('web_pages', [""])[0] if uni_data.get('web_pages') else ""
        )
    else:
        # Use AI enriched data
        data = enriched[0]
        # Add scholarship logic
        data['scholarship_available'] = True if data.get('ranking', 1000) < 500 else False
        data['scholarship_details'] = "International merit based scholarships available." if data['scholarship_available'] else None
        new_uni = University(**data)
    
    db.add(new_uni)
    db.commit()
    db.refresh(new_uni)
    return new_uni

# ==================== SHORTLIST ROUTES ====================

@app.post("/shortlist", response_model=ShortlistResponse)
def add_to_shortlist(
    shortlist_data: ShortlistCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if already shortlisted
    existing = db.query(ShortlistedUniversity).filter(
        ShortlistedUniversity.user_id == current_user.id,
        ShortlistedUniversity.university_id == shortlist_data.university_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University already shortlisted"
        )
    
    shortlist = ShortlistedUniversity(
        user_id=current_user.id,
        **shortlist_data.model_dump()
    )
    
    db.add(shortlist)
    
    # Update user stage
    if current_user.current_stage == UserStage.DISCOVERING_UNIVERSITIES:
        current_user.current_stage = UserStage.FINALIZING_UNIVERSITIES
    
    db.commit()
    db.refresh(shortlist)
    
    return shortlist

@app.get("/shortlist", response_model=List[ShortlistResponse])
def get_shortlist(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    shortlist = db.query(ShortlistedUniversity).filter(
        ShortlistedUniversity.user_id == current_user.id
    ).all()
    
    return shortlist

@app.post("/shortlist/lock")
async def lock_university(
    lock_data: LockUniversity,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    shortlist = db.query(ShortlistedUniversity).filter(
        ShortlistedUniversity.id == lock_data.shortlist_id,
        ShortlistedUniversity.user_id == current_user.id
    ).first()
    
    if not shortlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shortlisted university not found"
        )
    
    shortlist.is_locked = lock_data.lock
    if lock_data.lock:
        shortlist.locked_at = datetime.utcnow()
        # Update user stage
        current_user.current_stage = UserStage.PREPARING_APPLICATIONS
        
        # Generate custom AI tasks for this university
        try:
            profile = current_user.profile
            university = shortlist.university
            
            if profile and university:
                # Generate tasks
                ai_tasks = await ai_counsellor.generate_application_tasks(
                    current_user, profile, university, db
                )
                
                # Add tasks to DB
                for t_data in ai_tasks:
                    # Check for duplicates by title
                    existing = db.query(Task).filter(
                        Task.user_id == current_user.id,
                        Task.title == t_data["title"]
                    ).first()
                    
                    if not existing:
                        new_task = Task(
                            user_id=current_user.id,
                            title=t_data["title"],
                            description=t_data.get("description", ""),
                            priority=t_data.get("priority", 3)
                        )
                        db.add(new_task)
        except Exception as e:
            print(f"Error generating tasks: {e}")
    else:
        shortlist.locked_at = None
    
    db.commit()
    
    return {"success": True, "locked": lock_data.lock}

@app.delete("/shortlist/{shortlist_id}")
def remove_from_shortlist(
    shortlist_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    shortlist = db.query(ShortlistedUniversity).filter(
        ShortlistedUniversity.id == shortlist_id,
        ShortlistedUniversity.user_id == current_user.id
    ).first()
    
    if not shortlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shortlisted university not found"
        )
    
    db.delete(shortlist)
    db.commit()
    
    return {"success": True}

# ==================== TASK ROUTES ====================

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id
    ).order_by(Task.priority.desc(), Task.created_at).all()
    
    return tasks

@app.post("/tasks", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = Task(
        user_id=current_user.id,
        **task_data.model_dump()
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    
    if task_data.status == TaskStatus.COMPLETED and not task.completed_at:
        task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    return task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    
    return {"success": True}

# ==================== CHAT ROUTES ====================

@app.get("/chat/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at).all()
    
    return messages

@app.post("/chat", response_model=dict)
async def chat_with_ai(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get profile
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complete onboarding before using AI Counsellor"
        )
    
    # Save user message
    user_message = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=chat_data.message
    )
    db.add(user_message)
    db.commit()
    
    # Get chat history
    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at).all()
    
    chat_history = [{"role": msg.role, "content": msg.content} for msg in history]
    
    # Get AI response
    response = await ai_counsellor.chat(
        chat_data.message,
        current_user,
        profile,
        chat_history,
        db
    )
    
    # Save AI message
    ai_message = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=response["message"]
    )
    db.add(ai_message)
    db.commit()
    
    # Execute actions if any
    if response.get("actions"):
        for action in response["actions"]:
            execute_ai_action(action, current_user, db)
    
    return response

def execute_ai_action(action: dict, user: User, db: Session):
    """Execute actions requested by AI"""
    try:
        action_name = action.get("action")
        params = action.get("params", {})
        
        if action_name == "CREATE_TASK":
            priority = params.get("priority", 3)
            # Ensure priority is an integer
            if isinstance(priority, str):
                try:
                    priority = int(priority)
                except:
                    priority = 3
            
            task = Task(
                user_id=user.id,
                title=params.get("title", "New Task"),
                description=params.get("description", ""),
                priority=priority
            )
            db.add(task)
            db.commit()
        
        elif action_name == "UPDATE_STAGE":
            stage = params.get("stage")
            if stage in [s.value for s in UserStage]:
                user.current_stage = UserStage(stage)
                db.commit()

        elif action_name == "SHORTLIST_UNIVERSITY":
            uni_id = params.get("university_id")
            if uni_id:
                # Ensure uni_id is an integer
                if isinstance(uni_id, str):
                    try:
                        uni_id = int(uni_id)
                    except:
                        return

                # Check if exists
                existing = db.query(ShortlistedUniversity).filter(
                    ShortlistedUniversity.user_id == user.id,
                    ShortlistedUniversity.university_id == uni_id
                ).first()
                if not existing:
                    shortlist = ShortlistedUniversity(
                        user_id=user.id,
                        university_id=uni_id,
                        category=params.get("category", "target"),
                        fit_score=params.get("fit_score", 70),
                        risk_level=params.get("risk_level", "Medium"),
                        ai_reasoning=params.get("reasoning", "Recommended by AI Counsellor")
                    )
                    db.add(shortlist)
                    # Update stage if needed
                    if user.current_stage == UserStage.DISCOVERING_UNIVERSITIES:
                        user.current_stage = UserStage.FINALIZING_UNIVERSITIES
                    db.commit()

        elif action_name == "LOCK_UNIVERSITY":
            uni_id = params.get("university_id")
            if uni_id:
                # Ensure uni_id is an integer
                if isinstance(uni_id, str):
                    try:
                        uni_id = int(uni_id)
                    except:
                        return
                        
                shortlist = db.query(ShortlistedUniversity).filter(
                    ShortlistedUniversity.user_id == user.id,
                    ShortlistedUniversity.university_id == uni_id
                ).first()
                if shortlist:
                    shortlist.is_locked = True
                    shortlist.locked_at = datetime.utcnow()
                    user.current_stage = UserStage.PREPARING_APPLICATIONS
                    db.commit()

        elif action_name == "DELETE_TASK":
            task_id = params.get("task_id")
            if task_id:
                # Ensure task_id is an integer
                if isinstance(task_id, str):
                    try:
                        task_id = int(task_id)
                    except:
                        return
                task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
                if task:
                    db.delete(task)
                    db.commit()
    except Exception as e:
        print(f"Error executing AI action {action}: {e}")
        db.rollback()

# ==================== DASHBOARD ROUTE ====================

@app.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.status != TaskStatus.COMPLETED
    ).order_by(Task.priority.desc()).limit(5).all()
    
    shortlisted = db.query(ShortlistedUniversity).filter(
        ShortlistedUniversity.user_id == current_user.id
    ).all()
    
    locked = [s for s in shortlisted if s.is_locked]
    
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "is_active": current_user.is_active,
            "onboarding_completed": current_user.onboarding_completed,
            "current_stage": current_user.current_stage.value,
            "created_at": current_user.created_at
        },
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "education_level": profile.education_level,
            "degree": profile.degree,
            "major": profile.major,
            "graduation_year": profile.graduation_year,
            "gpa": profile.gpa,
            "age": profile.age,
            "intended_degree": profile.intended_degree,
            "field_of_study": profile.field_of_study,
            "target_intake_year": profile.target_intake_year,
            "preferred_countries": profile.preferred_countries,
            "budget_min": profile.budget_min,
            "budget_max": profile.budget_max,
            "funding_plan": profile.funding_plan,
            "ielts_score": profile.ielts_score,
            "toefl_score": profile.toefl_score,
            "gre_score": profile.gre_score,
            "gmat_score": profile.gmat_score,
            "sop_status": profile.sop_status,
            "academic_strength": profile.academic_strength.value if profile.academic_strength else "average",
            "exam_strength": profile.exam_strength.value if profile.exam_strength else "weak",
            "sop_strength": profile.sop_strength.value if profile.sop_strength else "weak"
        } if profile else None,
        "current_stage": current_user.current_stage.value if current_user.current_stage else "building_profile",
        "onboarding_completed": current_user.onboarding_completed,
        "tasks": tasks,
        "shortlisted_count": len(shortlisted),
        "locked_count": len(locked),
        "profile_strength": {
            "academic": profile.academic_strength.value if profile and profile.academic_strength else None,
            "exam": profile.exam_strength.value if profile and profile.exam_strength else None,
            "sop": profile.sop_strength.value if profile and profile.sop_strength else None
        }
    }

@app.get("/")
def root():
    return {
        "message": "AI Counsellor API",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
