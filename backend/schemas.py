from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserStage, ProfileStrength, UniversityCategory, TaskStatus

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool
    onboarding_completed: bool
    current_stage: UserStage
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Profile Schemas
class ProfileCreate(BaseModel):
    education_level: str
    degree: str
    major: str
    graduation_year: int
    gpa: Optional[float] = None
    intended_degree: str
    field_of_study: str
    target_intake_year: int
    preferred_countries: str
    budget_min: float
    budget_max: float
    funding_plan: str
    ielts_score: Optional[float] = None
    toefl_score: Optional[int] = None
    gre_score: Optional[int] = None
    gmat_score: Optional[int] = None
    sop_status: str

class ProfileUpdate(BaseModel):
    education_level: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    intended_degree: Optional[str] = None
    field_of_study: Optional[str] = None
    target_intake_year: Optional[int] = None
    preferred_countries: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    funding_plan: Optional[str] = None
    ielts_score: Optional[float] = None
    toefl_score: Optional[int] = None
    gre_score: Optional[int] = None
    gmat_score: Optional[int] = None
    sop_status: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    education_level: str
    degree: str
    major: str
    graduation_year: int
    gpa: Optional[float]
    intended_degree: str
    field_of_study: str
    target_intake_year: int
    preferred_countries: str
    budget_min: float
    budget_max: float
    funding_plan: str
    ielts_score: Optional[float]
    toefl_score: Optional[int]
    gre_score: Optional[int]
    gmat_score: Optional[int]
    sop_status: str
    academic_strength: ProfileStrength
    exam_strength: ProfileStrength
    sop_strength: ProfileStrength
    
    class Config:
        from_attributes = True

# University Schemas
class UniversityResponse(BaseModel):
    id: int
    name: str
    country: str
    city: Optional[str]
    ranking: Optional[int]
    programs: str
    min_gpa: float
    min_ielts: Optional[float]
    min_toefl: Optional[int]
    min_gre: Optional[int]
    min_gmat: Optional[int]
    tuition_fee_min: float
    tuition_fee_max: float
    living_cost_yearly: float
    acceptance_rate: float
    description: str
    website: str
    
    class Config:
        from_attributes = True

# Shortlist Schemas
class ShortlistCreate(BaseModel):
    university_id: int
    category: UniversityCategory
    fit_score: float
    risk_level: str
    ai_reasoning: str

class ShortlistResponse(BaseModel):
    id: int
    user_id: int
    university_id: int
    category: UniversityCategory
    is_locked: bool
    fit_score: float
    risk_level: str
    ai_reasoning: str
    created_at: datetime
    locked_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class LockUniversity(BaseModel):
    shortlist_id: int
    lock: bool

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int = 1
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: int
    due_date: Optional[datetime]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Chat Schemas
class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: int
    user_id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
