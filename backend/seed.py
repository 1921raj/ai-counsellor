from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import University, Base

def seed_universities():
    db = SessionLocal()
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    universities = [
        # --- UNITED KINGDOM ---
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
            "name": "University of Cambridge",
            "country": "United Kingdom",
            "city": "Cambridge",
            "ranking": 2,
            "programs": "Mathematics, Physics, Engineering, Law, History",
            "tuition_fee_min": 33000,
            "tuition_fee_max": 48000,
            "living_cost_yearly": 14500,
            "scholarship_available": True,
            "min_gpa": 3.8,
            "min_ielts": 7.5,
            "acceptance_rate": 21,
            "description": "A world-leading research university with a rich history of academic excellence.",
            "website": "https://www.cam.ac.uk"
        },
        {
            "name": "Imperial College London",
            "country": "United Kingdom",
            "city": "London",
            "ranking": 6,
            "programs": "Engineering, Medicine, Science, Business",
            "tuition_fee_min": 32000,
            "tuition_fee_max": 45000,
            "living_cost_yearly": 18000,
            "scholarship_available": True,
            "min_gpa": 3.7,
            "min_ielts": 7.0,
            "acceptance_rate": 14,
            "description": "Consistently ranked among the top universities for science and technology.",
            "website": "https://www.imperial.ac.uk"
        },
        # --- UNITED STATES ---
        {
            "name": "Harvard University",
            "country": "United States",
            "city": "Cambridge, MA",
            "ranking": 4,
            "programs": "Law, Medicine, Business, Arts, Social Sciences",
            "tuition_fee_min": 55000,
            "tuition_fee_max": 65000,
            "living_cost_yearly": 20000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.5,
            "acceptance_rate": 5,
            "description": "An Ivy League institution known for its global leadership and influence.",
            "website": "https://www.harvard.edu"
        },
        {
            "name": "Stanford University",
            "country": "United States",
            "city": "Stanford, CA",
            "ranking": 3,
            "programs": "Computer Science, Engineering, Entrepreneurship, Law",
            "tuition_fee_min": 58000,
            "tuition_fee_max": 62000,
            "living_cost_yearly": 22000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.5,
            "acceptance_rate": 4,
            "description": "A hub for innovation and technology in the heart of Silicon Valley.",
            "website": "https://www.stanford.edu"
        },
        {
            "name": "MIT (Massachusetts Institute of Technology)",
            "country": "United States",
            "city": "Cambridge, MA",
            "ranking": 5,
            "programs": "Engineering, Physics, AI, Robotics, Economics",
            "tuition_fee_min": 56000,
            "tuition_fee_max": 60000,
            "living_cost_yearly": 21000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.5,
            "acceptance_rate": 7,
            "description": "World-renowned for its pioneering research in science and engineering.",
            "website": "https://www.mit.edu"
        },
        # --- CANADA ---
        {
            "name": "University of Toronto",
            "country": "Canada",
            "city": "Toronto",
            "ranking": 21,
            "programs": "Computer Science, Medicine, Arts, Engineering",
            "tuition_fee_min": 45000,
            "tuition_fee_max": 60000,
            "living_cost_yearly": 15000,
            "scholarship_available": True,
            "min_gpa": 3.6,
            "min_ielts": 7.0,
            "acceptance_rate": 43,
            "description": "Canada's top-ranked university with a vast array of programs.",
            "website": "https://www.utoronto.ca"
        },
        {
            "name": "University of British Columbia",
            "country": "Canada",
            "city": "Vancouver",
            "ranking": 34,
            "programs": "Science, Forestry, Arts, Business",
            "tuition_fee_min": 40000,
            "tuition_fee_max": 52000,
            "living_cost_yearly": 16000,
            "scholarship_available": True,
            "min_gpa": 3.5,
            "min_ielts": 6.5,
            "acceptance_rate": 50,
            "description": "Known for its beautiful campus and strong research output.",
            "website": "https://www.ubc.ca"
        },
        # --- AUSTRALIA ---
        {
            "name": "University of Melbourne",
            "country": "Australia",
            "city": "Melbourne",
            "ranking": 14,
            "programs": "Business, Medicine, Engineering, Law",
            "tuition_fee_min": 35000,
            "tuition_fee_max": 48000,
            "living_cost_yearly": 25000,
            "scholarship_available": True,
            "min_gpa": 3.4,
            "min_ielts": 6.5,
            "acceptance_rate": 70,
            "description": "Australia's leading university with a focus on global impact.",
            "website": "https://www.unimelb.edu.au"
        },
        {
            "name": "Australian National University",
            "country": "Australia",
            "city": "Canberra",
            "ranking": 30,
            "programs": "Political Science, Law, Physics, International Relations",
            "tuition_fee_min": 32000,
            "tuition_fee_max": 45000,
            "living_cost_yearly": 22000,
            "scholarship_available": True,
            "min_gpa": 3.5,
            "min_ielts": 7.0,
            "acceptance_rate": 35,
            "description": "A research-intensive university in Australia's capital.",
            "website": "https://www.anu.edu.au"
        },
        # --- GERMANY ---
        {
            "name": "TU Munich (TUM)",
            "country": "Germany",
            "city": "Munich",
            "ranking": 37,
            "programs": "Engineering, Computer Science, Physics, Management",
            "tuition_fee_min": 0,
            "tuition_fee_max": 6000,
            "living_cost_yearly": 12000,
            "scholarship_available": False,
            "min_gpa": 3.3,
            "min_ielts": 6.5,
            "acceptance_rate": 8,
            "description": "One of Europe's top technical universities with very low tuition.",
            "website": "https://www.tum.de"
        },
        {
            "name": "Ludwig Maximilian University of Munich (LMU)",
            "country": "Germany",
            "city": "Munich",
            "ranking": 54,
            "programs": "Medicine, Law, Humanities, Natural Sciences",
            "tuition_fee_min": 0,
            "tuition_fee_max": 1000,
            "living_cost_yearly": 12000,
            "scholarship_available": False,
            "min_gpa": 3.5,
            "min_ielts": 7.0,
            "acceptance_rate": 10,
            "description": "A premier research university with a tradition since 1472.",
            "website": "https://www.lmu.de"
        },
        # --- SINGAPORE ---
        {
            "name": "National University of Singapore (NUS)",
            "country": "Singapore",
            "city": "Singapore",
            "ranking": 8,
            "programs": "Engineering, Computing, Business, Medicine",
            "tuition_fee_min": 30000,
            "tuition_fee_max": 50000,
            "living_cost_yearly": 10000,
            "scholarship_available": True,
            "min_gpa": 3.8,
            "min_ielts": 7.0,
            "acceptance_rate": 5,
            "description": "Consistently ranked as Asia's top university.",
            "website": "https://www.nus.edu.sg"
        },
        {
            "name": "Nanyang Technological University (NTU)",
            "country": "Singapore",
            "city": "Singapore",
            "ranking": 15,
            "programs": "Engineering, AI, Material Science, Science",
            "tuition_fee_min": 28000,
            "tuition_fee_max": 45000,
            "living_cost_yearly": 10000,
            "scholarship_available": True,
            "min_gpa": 3.7,
            "min_ielts": 6.5,
            "acceptance_rate": 10,
            "description": "A young and research-intensive university leading in tech.",
            "website": "https://www.ntu.edu.sg"
        },
        # --- ARTS, DESIGN & FASHION ---
        {
            "name": "Royal College of Art",
            "country": "United Kingdom",
            "city": "London",
            "ranking": 1,
            "programs": "Design, Fine Art, Architecture, Communication",
            "tuition_fee_min": 25000,
            "tuition_fee_max": 35000,
            "living_cost_yearly": 18000,
            "scholarship_available": True,
            "min_gpa": 3.2,
            "min_ielts": 6.5,
            "acceptance_rate": 15,
            "description": "The world's most influential post-graduate art and design university.",
            "website": "https://www.rca.ac.uk"
        },
        {
            "name": "Parsons School of Design",
            "country": "United States",
            "city": "New York City",
            "ranking": 2,
            "programs": "Fashion Design, Fine Arts, Graphic Design",
            "tuition_fee_min": 52000,
            "tuition_fee_max": 56000,
            "living_cost_yearly": 25000,
            "scholarship_available": True,
            "min_gpa": 3.0,
            "min_ielts": 7.0,
            "acceptance_rate": 35,
            "description": "A global leader in design education located in the heart of NYC.",
            "website": "https://www.newschool.edu/parsons"
        },
        # --- LAW & SOCIAL SCIENCES ---
        {
            "name": "Yale Law School",
            "country": "United States",
            "city": "New Haven, CT",
            "ranking": 1,
            "programs": "Law, Constitutional Law, International Law",
            "tuition_fee_min": 68000,
            "tuition_fee_max": 72000,
            "living_cost_yearly": 20000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.5,
            "acceptance_rate": 4,
            "description": "Consistently ranked as the top law school in the United States.",
            "website": "https://law.yale.edu"
        },
        {
            "name": "London School of Economics (LSE)",
            "country": "United Kingdom",
            "city": "London",
            "ranking": 45,
            "programs": "Economics, Political Science, International Relations, Law",
            "tuition_fee_min": 24000,
            "tuition_fee_max": 32000,
            "living_cost_yearly": 18000,
            "scholarship_available": True,
            "min_gpa": 3.7,
            "min_ielts": 7.0,
            "acceptance_rate": 9,
            "description": "A world-class center for social science research and teaching.",
            "website": "https://www.lse.ac.uk"
        },
        # --- MEDICINE & HEALTH ---
        {
            "name": "Johns Hopkins University",
            "country": "United States",
            "city": "Baltimore, MD",
            "ranking": 28,
            "programs": "Medicine, Public Health, Nursing, Biomedical Engineering",
            "tuition_fee_min": 58000,
            "tuition_fee_max": 62000,
            "living_cost_yearly": 18000,
            "scholarship_available": True,
            "min_gpa": 3.9,
            "min_ielts": 7.0,
            "acceptance_rate": 8,
            "description": "Renowned for its world-leading medical school and research.",
            "website": "https://www.jhu.edu"
        }
    ]

    for uni_data in universities:
        existing = db.query(University).filter(University.name == uni_data["name"]).first()
        if not existing:
            uni = University(**uni_data)
            db.add(uni)
        else:
            # Update existing data
            for key, value in uni_data.items():
                setattr(existing, key, value)
    
    db.commit()
    print(f"Successfully seeded {len(universities)} diverse universities.")
    db.close()

if __name__ == "__main__":
    seed_universities()
