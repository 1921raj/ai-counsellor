from database import SessionLocal
from models import User
from auth import get_password_hash

def create_demo_user():
    db = SessionLocal()
    
    demo_email = "demo@example.com"
    demo_password = "password123"
    
    # Check if exists
    existing = db.query(User).filter(User.email == demo_email).first()
    if existing:
        print(f"Demo user already exists.")
    else:
        hashed_pw = get_password_hash(demo_password)
        user = User(
            email=demo_email,
            full_name="Demo Student",
            hashed_password=hashed_pw
        )
        db.add(user)
        db.commit()
        print(f"Successfully created demo user!")
    
    print("\n--- LOGIN CREDENTIALS ---")
    print(f"Email: {demo_email}")
    print(f"Password: {demo_password}")
    print("-------------------------\n")
    
    db.close()

if __name__ == "__main__":
    create_demo_user()
