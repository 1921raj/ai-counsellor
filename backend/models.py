from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserStage(str, enum.Enum):
    BUILDING_PROFILE = "building_profile"
    DISCOVERING_UNIVERSITIES = "discovering_universities"
    FINALIZING_UNIVERSITIES = "finalizing_universities"
    PREPARING_APPLICATIONS = "preparing_applications"

class ProfileStrength(str, enum.Enum):
    STRONG = "strong"
    AVERAGE = "average"
    WEAK = "weak"

class UniversityCategory(str, enum.Enum):
    DREAM = "dream"
    TARGET = "target"
    SAFE = "safe"

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    onboarding_completed = Column(Boolean, default=False)
    current_stage = Column(SQLEnum(UserStage), default=UserStage.BUILDING_PROFILE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    shortlisted_universities = relationship("ShortlistedUniversity", back_populates="user")
    tasks = relationship("Task", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Academic Background
    education_level = Column(String)
    degree = Column(String)
    major = Column(String)
    graduation_year = Column(Integer)
    gpa = Column(Float, nullable=True)
    age = Column(Integer, nullable=True)
    
    
    # Study Goals
    intended_degree = Column(String)
    field_of_study = Column(String)
    target_intake_year = Column(Integer)
    preferred_countries = Column(String)  # JSON string
    
    # Budget
    budget_min = Column(Float)
    budget_max = Column(Float)
    funding_plan = Column(String)
    
    # Exams & Readiness
    ielts_score = Column(Float, nullable=True)
    toefl_score = Column(Integer, nullable=True)
    gre_score = Column(Integer, nullable=True)
    gmat_score = Column(Integer, nullable=True)
    sop_status = Column(String)
    
    # Profile Strength
    academic_strength = Column(SQLEnum(ProfileStrength), default=ProfileStrength.AVERAGE)
    exam_strength = Column(SQLEnum(ProfileStrength), default=ProfileStrength.WEAK)
    sop_strength = Column(SQLEnum(ProfileStrength), default=ProfileStrength.WEAK)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="profile")

class University(Base):
    __tablename__ = "universities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    city = Column(String)
    ranking = Column(Integer, nullable=True)
    
    # Program Details
    programs = Column(Text)  # JSON string of available programs
    
    # Requirements
    min_gpa = Column(Float)
    min_ielts = Column(Float, nullable=True)
    min_toefl = Column(Integer, nullable=True)
    min_gre = Column(Integer, nullable=True)
    min_gmat = Column(Integer, nullable=True)
    
    # Costs
    tuition_fee_min = Column(Float)
    tuition_fee_max = Column(Float)
    living_cost_yearly = Column(Float)
    
    # Additional Info
    acceptance_rate = Column(Float)
    description = Column(Text)
    website = Column(String)
    
    # Financial Aid
    scholarship_available = Column(Boolean, default=False)
    scholarship_details = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    shortlisted_by = relationship("ShortlistedUniversity", back_populates="university")

class ShortlistedUniversity(Base):
    __tablename__ = "shortlisted_universities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    university_id = Column(Integer, ForeignKey("universities.id"))
    
    category = Column(SQLEnum(UniversityCategory))
    is_locked = Column(Boolean, default=False)
    fit_score = Column(Float)  # 0-100
    risk_level = Column(String)  # Low, Medium, High
    ai_reasoning = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    locked_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="shortlisted_universities")
    university = relationship("University", back_populates="shortlisted_by")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.PENDING)
    priority = Column(Integer, default=1)  # 1-5
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="tasks")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    role = Column(String, nullable=False)  # user or assistant
    content = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="chat_messages")
