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
        {
            "name": "University of Edinburgh",
            "country": "United Kingdom",
            "city": "Edinburgh",
            "ranking": 22,
            "programs": "Social Sciences, Arts, Law, Medicine, Informatics",
            "tuition_fee_min": 24000,
            "tuition_fee_max": 35000,
            "living_cost_yearly": 13000,
            "scholarship_available": True,
            "min_gpa": 3.5,
            "min_ielts": 6.5,
            "acceptance_rate": 33,
            "description": "A historic university offering a wide range of academic opportunities in the Scottish capital.",
            "website": "https://www.ed.ac.uk"
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
            "name": "MIT",
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
        {
            "name": "NYU (New York University)",
            "country": "United States",
            "city": "New York",
            "ranking": 38,
            "programs": "Business, Film, Law, Media, Psychology",
            "tuition_fee_min": 53000,
            "tuition_fee_max": 58000,
            "living_cost_yearly": 25000,
            "scholarship_available": True,
            "min_gpa": 3.6,
            "min_ielts": 7.0,
            "acceptance_rate": 13,
            "description": "A global university with campuses in NYC, Abu Dhabi, and Shanghai.",
            "website": "https://www.nyu.edu"
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
        {
            "name": "McGill University",
            "country": "Canada",
            "city": "Montreal",
            "ranking": 31,
            "programs": "Medicine, Engineering, Science, Arts",
            "tuition_fee_min": 25000,
            "tuition_fee_max": 55000,
            "living_cost_yearly": 14000,
            "scholarship_available": True,
            "min_gpa": 3.6,
            "min_ielts": 7.0,
            "acceptance_rate": 46,
            "description": "A world-class research university in the vibrant city of Montreal.",
            "website": "https://www.mcgill.ca"
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
            "name": "University of Sydney",
            "country": "Australia",
            "city": "Sydney",
            "ranking": 19,
            "programs": "Law, Medicine, Arts, Science, Business",
            "tuition_fee_min": 38000,
            "tuition_fee_max": 50000,
            "living_cost_yearly": 28000,
            "scholarship_available": True,
            "min_gpa": 3.4,
            "min_ielts": 6.5,
            "acceptance_rate": 30,
            "description": "Australia's first university, known for its academic reputation and stunning campus.",
            "website": "https://www.sydney.edu.au"
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
        # --- SWITZERLAND ---
        {
            "name": "ETH Zurich",
            "country": "Switzerland",
            "city": "Zurich",
            "ranking": 7,
            "programs": "Physics, Engineering, Computer Science, Mathematics",
            "tuition_fee_min": 1500,
            "tuition_fee_max": 2000,
            "living_cost_yearly": 25000,
            "scholarship_available": True,
            "min_gpa": 3.8,
            "min_ielts": 7.0,
            "acceptance_rate": 27,
            "description": "A leading technical university in continental Europe.",
            "website": "https://ethz.ch"
        },
        # --- JAPAN ---
        {
            "name": "University of Tokyo",
            "country": "Japan",
            "city": "Tokyo",
            "ranking": 28,
            "programs": "Science, Engineering, Law, Humanities",
            "tuition_fee_min": 5000,
            "tuition_fee_max": 8000,
            "living_cost_yearly": 15000,
            "scholarship_available": True,
            "min_gpa": 3.7,
            "min_ielts": 6.5,
            "acceptance_rate": 34,
            "description": "The top-ranked university in Japan for research and academia.",
            "website": "https://www.u-tokyo.ac.jp"
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
        # --- NETHERLANDS ---
        {
            "name": "University of Amsterdam",
            "country": "Netherlands",
            "city": "Amsterdam",
            "ranking": 61,
            "programs": "Communication, Psychology, Social Sciences, Arts",
            "tuition_fee_min": 10000,
            "tuition_fee_max": 20000,
            "living_cost_yearly": 12000,
            "scholarship_available": True,
            "min_gpa": 3.4,
            "min_ielts": 7.0,
            "acceptance_rate": 4,
            "description": "A research-led university in the heart of Amsterdam with deep cultural roots.",
            "website": "https://www.uva.nl"
        },
        # --- FRANCE ---
        {
            "name": "Sorbonne University",
            "country": "France",
            "city": "Paris",
            "ranking": 59,
            "programs": "Arts, Humanities, Science, Engineering, Medicine",
            "tuition_fee_min": 3000,
            "tuition_fee_max": 5000,
            "living_cost_yearly": 15000,
            "scholarship_available": True,
            "min_gpa": 3.5,
            "min_ielts": 6.5,
            "acceptance_rate": 20,
            "description": "A world-class university in the center of Paris, famous for its humanities.",
            "website": "https://www.sorbonne-universite.fr"
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
