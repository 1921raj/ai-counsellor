from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import University, Base

def seed_universities():
    db = SessionLocal()
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    universities = [
        {
            "name": "University of Oxford",
            "country": "United Kingdom",
            "city": "Oxford",
            "ranking": 1,
            "programs": "Arts, Humanities, Law, Medicine, Sciences, Engineering",
            "tuition_fee_min": 35000,
            "tuition_fee_max": 50000,
            "living_cost_yearly": 15000,
            "scholarship_available": True,
            "min_gpa": 3.8,
            "min_ielts": 7.5,
            "acceptance_rate": 17,
            "description": "One of the oldest and most prestigious universities in the world.",
            "website": "https://www.ox.ac.uk"
        },
        {
            "name": "Stanford University",
            "country": "United States",
            "city": "Stanford",
            "ranking": 3,
            "programs": "Computer Science, Engineering, Business, Law, Medicine",
            "tuition_fee_min": 55000,
            "tuition_fee_max": 65000,
            "living_cost_yearly": 22000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.5,
            "acceptance_rate": 4,
            "description": "A premier research institution located in the heart of Silicon Valley.",
            "website": "https://www.stanford.edu"
        }
    ]

    for uni_data in universities:
        uni = University(**uni_data)
        db.add(uni)
    
    db.commit()
    db.close()
    print("✅ Seeding complete!")

if __name__ == "__main__":
    seed_universities()
