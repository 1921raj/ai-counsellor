from database import SessionLocal, engine, Base
from models import University
import json

def seed_universities():
    db = SessionLocal()
    
    universities_data = [
        # --- USA: STEM & IVY ---
        { "name": "Massachusetts Institute of Technology (MIT)", "country": "USA", "city": "Cambridge, MA", "ranking": 1, "programs": json.dumps(["Computer Science", "Engineering", "Business", "Data Science"]), "min_gpa": 3.7, "min_ielts": 7.0, "min_toefl": 100, "min_gre": 325, "tuition_fee_min": 53000, "tuition_fee_max": 55000, "living_cost_yearly": 20000, "acceptance_rate": 4.0, "description": "World leader in tech and innovation.", "website": "https://www.mit.edu" },
        { "name": "Stanford University", "country": "USA", "city": "Stanford, CA", "ranking": 2, "programs": json.dumps(["Computer Science", "MBA", "Engineering", "AI/ML"]), "min_gpa": 3.7, "min_ielts": 7.0, "min_toefl": 100, "min_gre": 325, "min_gmat": 730, "tuition_fee_min": 54000, "tuition_fee_max": 56000, "living_cost_yearly": 22000, "acceptance_rate": 3.9, "description": "Silicon Valley's premier research hub.", "website": "https://www.stanford.edu" },
        { "name": "Harvard University", "country": "USA", "city": "Cambridge, MA", "ranking": 5, "programs": json.dumps(["Law", "Medicine", "Business", "Public Policy", "History"]), "min_gpa": 3.8, "min_ielts": 7.5, "min_toefl": 105, "tuition_fee_min": 55000, "tuition_fee_max": 60000, "living_cost_yearly": 22000, "acceptance_rate": 4.0, "description": "Global leader in law and social sciences.", "website": "https://www.harvard.edu" },
        
        # --- USA: Arts & Design ---
        { "name": "Parsons School of Design", "country": "USA", "city": "New York, NY", "ranking": 150, "programs": json.dumps(["Fashion Design", "Fine Arts", "Graphic Design", "Interior Design"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 48000, "tuition_fee_max": 52000, "living_cost_yearly": 25000, "acceptance_rate": 35.0, "description": "Top fashion and creative arts institution.", "website": "https://www.newschool.edu/parsons" },
        { "name": "Rhode Island School of Design (RISD)", "country": "USA", "city": "Providence, RI", "ranking": 200, "programs": json.dumps(["Illustration", "Animation", "Architecture", "Fine Arts"]), "min_gpa": 3.2, "min_ielts": 7.0, "tuition_fee_min": 54000, "tuition_fee_max": 58000, "living_cost_yearly": 18000, "acceptance_rate": 19.0, "description": "Elite private design school.", "website": "https://www.risd.edu" },
        { "name": "The Juilliard School", "country": "USA", "city": "New York, NY", "ranking": 300, "programs": json.dumps(["Music Performance", "Dance", "Drama"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 50000, "tuition_fee_max": 55000, "living_cost_yearly": 24000, "acceptance_rate": 7.0, "description": "World-leading conservatory for performing arts.", "website": "https://www.juilliard.edu" },
        
        # --- USA: Medicine & Public Health ---
        { "name": "Johns Hopkins University", "country": "USA", "city": "Baltimore, MD", "ranking": 28, "programs": json.dumps(["Medicine", "Public Health", "Biomedical Engineering"]), "min_gpa": 3.6, "min_ielts": 7.0, "tuition_fee_min": 52000, "tuition_fee_max": 58000, "living_cost_yearly": 18000, "acceptance_rate": 11.0, "description": "Top research in medical and health sectors.", "website": "https://www.jhu.edu" },
        
        # --- UK: Prestigious & Diverse ---
        { "name": "University of Oxford", "country": "UK", "city": "Oxford", "ranking": 3, "programs": json.dumps(["Computer Science", "Engineering", "Philosophy", "Law", "History"]), "min_gpa": 3.7, "min_ielts": 7.5, "min_toefl": 110, "tuition_fee_min": 30000, "tuition_fee_max": 35000, "living_cost_yearly": 15000, "acceptance_rate": 17.5, "description": "Oldest and most prestigious English university.", "website": "https://www.ox.ac.uk" },
        { "name": "London School of Economics (LSE)", "country": "UK", "city": "London", "ranking": 45, "programs": json.dumps(["Economics", "International Relations", "Sociology", "Data Science"]), "min_gpa": 3.5, "min_ielts": 7.5, "tuition_fee_min": 25000, "tuition_fee_max": 30000, "living_cost_yearly": 20000, "acceptance_rate": 12.0, "description": "Global hub for social science research.", "website": "https://www.lse.ac.uk" },
        { "name": "Royal College of Music (RCM)", "country": "UK", "city": "London", "ranking": 120, "programs": json.dumps(["Music Performance", "Composition", "Conducting"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 24000, "tuition_fee_max": 28000, "living_cost_yearly": 18000, "acceptance_rate": 18.0, "description": "Elite music education center.", "website": "https://www.rcm.ac.uk" },
        { "name": "University of Cambridge", "country": "UK", "city": "Cambridge", "ranking": 4, "programs": json.dumps(["Computer Science", "Engineering", "Mathematics", "Physics"]), "min_gpa": 3.7, "min_ielts": 7.5, "min_toefl": 110, "tuition_fee_min": 30000, "tuition_fee_max": 35000, "living_cost_yearly": 14000, "acceptance_rate": 21.0, "description": "Leader in worldwide research and physics.", "website": "https://www.cam.ac.uk" },
        
        # --- Canada: Research & Environment ---
        { "name": "University of Toronto", "country": "Canada", "city": "Toronto", "ranking": 18, "programs": json.dumps(["Computer Science", "Engineering", "Business", "Medicine", "Philosophy"]), "min_gpa": 3.5, "min_ielts": 7.0, "min_toefl": 100, "tuition_fee_min": 35000, "tuition_fee_max": 40000, "living_cost_yearly": 15000, "acceptance_rate": 43.0, "description": "Canada's top research powerhouse.", "website": "https://www.utoronto.ca" },
        { "name": "University of British Columbia", "country": "Canada", "city": "Vancouver", "ranking": 34, "programs": json.dumps(["Environmental Science", "Forestry", "Marine Biology", "Psychology"]), "min_gpa": 3.3, "min_ielts": 6.5, "tuition_fee_min": 32000, "tuition_fee_max": 36000, "living_cost_yearly": 14000, "acceptance_rate": 52.0, "description": "Global leader in ecology and earth sciences.", "website": "https://www.ubc.ca" },
        
        # --- Europe: Architecture & Social Science ---
        { "name": "Delft University of Technology", "country": "Netherlands", "city": "Delft", "ranking": 47, "programs": json.dumps(["Architecture", "Aerospace Engineering", "Urban Design"]), "min_gpa": 3.2, "min_ielts": 7.0, "tuition_fee_min": 16000, "tuition_fee_max": 20000, "living_cost_yearly": 12000, "acceptance_rate": 30.0, "description": "Top-ranked school for architecture.", "website": "https://www.tudelft.nl" },
        { "name": "Wageningen University", "country": "Netherlands", "city": "Wageningen", "ranking": 125, "programs": json.dumps(["Agriculture", "Food Technology", "Environmental Science"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 15000, "tuition_fee_max": 18000, "living_cost_yearly": 11000, "acceptance_rate": 45.0, "description": "World leader in climate and food science.", "website": "https://www.wur.nl" },
        { "name": "Sciences Po", "country": "France", "city": "Paris", "ranking": 240, "programs": json.dumps(["Political Science", "International Relations", "Public Administration"]), "min_gpa": 3.3, "min_ielts": 7.0, "tuition_fee_min": 14000, "tuition_fee_max": 18000, "living_cost_yearly": 15000, "acceptance_rate": 10.0, "description": "Europe's elite for political studies.", "website": "https://www.sciencespo.fr" },
        { "name": "Politecnico di Milano", "country": "Italy", "city": "Milan", "ranking": 139, "programs": json.dumps(["Industrial Design", "Architecture", "Automotive Engineering"]), "min_gpa": 3.0, "min_ielts": 6.0, "tuition_fee_min": 1500, "tuition_fee_max": 4000, "living_cost_yearly": 12000, "acceptance_rate": 25.0, "description": "Italy's crown jewel for industrial design.", "website": "https://www.polimi.it" },
        
        # --- Australia: Diverse branches ---
        { "name": "Australian National University", "country": "Australia", "city": "Canberra", "ranking": 27, "programs": json.dumps(["Computer Science", "Law", "Business", "Political Science"]), "min_gpa": 3.3, "min_ielts": 6.5, "tuition_fee_min": 35000, "tuition_fee_max": 40000, "living_cost_yearly": 18000, "acceptance_rate": 35.0, "description": "Australia's top research school.", "website": "https://www.anu.edu.au" },
        { "name": "University of Queensland", "country": "Australia", "city": "Brisbane", "ranking": 50, "programs": json.dumps(["Marine Biology", "Psychology", "Engineering", "Arts"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 32000, "tuition_fee_max": 37000, "living_cost_yearly": 17000, "acceptance_rate": 60.0, "description": "Strong focus on science and arts.", "website": "https://www.uq.edu.au" },
        
        # --- Germany: Technical & Low Tuition ---
        { "name": "Technical University of Munich", "country": "Germany", "city": "Munich", "ranking": 50, "programs": json.dumps(["Engineering", "CS", "Physics"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 0, "tuition_fee_max": 3000, "living_cost_yearly": 12000, "acceptance_rate": 8.0, "description": "Top-tier technical school.", "website": "https://www.tum.de" },
        
        # --- Asia: Top STEM ---
        { "name": "National University of Singapore (NUS)", "country": "Singapore", "city": "Singapore", "ranking": 11, "programs": json.dumps(["Computer Science", "Engineering", "Business", "Medicine", "Urban Planning"]), "min_gpa": 3.7, "min_ielts": 7.0, "tuition_fee_min": 25000, "tuition_fee_max": 30000, "living_cost_yearly": 15000, "acceptance_rate": 5.0, "description": "Asia's leading high-impact university.", "website": "https://www.nus.edu.sg" },

        # --- Belgium: Biotech & Vet ---
        { "name": "Ghent University", "country": "Belgium", "city": "Ghent", "ranking": 107, "programs": json.dumps(["Veterinary Medicine", "Biotech", "Psychology", "Fine Arts"]), "min_gpa": 3.0, "min_ielts": 6.5, "tuition_fee_min": 1000, "tuition_fee_max": 6000, "living_cost_yearly": 10000, "acceptance_rate": 40.0, "description": "Europe's leader in biotechnology.", "website": "https://www.ugent.be" }
    ]
    
    count = 0
    for uni_data in universities_data:
        exists = db.query(University).filter(University.name == uni_data["name"]).first()
        if not exists:
            university = University(**uni_data)
            db.add(university)
            count += 1
        else:
            # Update existing to ensure programs are diverse
            exists.programs = uni_data["programs"]
            exists.description = uni_data["description"]
    
    db.commit()
    print(f"Successfully seeded {count} new universities and updated existing ones! Total in DB: {db.query(University).count()}")
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_universities()
