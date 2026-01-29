import os
import json
import requests
import google.generativeai as genai
from database import SessionLocal, engine
from models import University
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def fetch_from_hipo(country):
    print(f"Fetching universities in {country} from Hipo API...")
    url = f"http://universities.hipolabs.com/search?country={country.replace(' ', '+')}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return []

def enrich_with_gemini(universities, country):
    if not universities:
        return []
    
    # Take first 20 to avoid overwhelming the model/token limits
    subset = universities[:20]
    names = [u['name'] for u in subset]
    
    prompt = f"""
    You are an expert university admissions consultant. I have a list of universities in {country}.
    Please provide realistic detailed data for these universities in a valid JSON format.
    The response must be a JSON array of objects, each with the following keys:
    "name", "country", "city", "ranking", "programs", "min_gpa", "min_ielts", "min_toefl", "min_gre", "min_gmat", "tuition_fee_min", "tuition_fee_max", "living_cost_yearly", "acceptance_rate", "description", "website"

    Rules:
    - "programs" must be a JSON array of strings (e.g. ["Computer Science", "Business"]).
    - "ranking" should be global ranking (realistic guess).
    - "tuition_fee_min" and "tuition_fee_max" are annual in USD.
    - "acceptance_rate" is a percentage (0-100).
    - If a field is unknown, provide a realistic average for that country/tier.

    University List: {', '.join(names)}

    Return ONLY the raw JSON array. No markdown, no backticks, no preamble.
    """
    
    print(f"Enriching {len(subset)} universities using Gemini AI...")
    response = model.generate_content(prompt)
    try:
        # Clean potential markdown
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3]
        elif text.startswith('```'):
            text = text[3:-3]
        
        data = json.loads(text.strip())
        # Ensure programs are strings
        for item in data:
            if isinstance(item.get('programs'), list):
                item['programs'] = json.dumps(item['programs'])
        return data
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        print(f"Raw response: {response.text}")
        return []

def import_universities(country):
    hipo_data = fetch_from_hipo(country)
    if not hipo_data:
        print(f"No universities found for {country}")
        return

    enriched_data = enrich_with_gemini(hipo_data, country)
    if not enriched_data:
        print("Failed to enrich data")
        return

    db = SessionLocal()
    count = 0
    for uni_data in enriched_data:
        # Check if exists by name
        exists = db.query(University).filter(University.name == uni_data["name"]).first()
        if not exists:
            # Add scholarship fields from models.py
            uni_data['scholarship_available'] = True if uni_data.get('ranking', 1000) < 500 else False
            uni_data['scholarship_details'] = "Merit-based scholarships available for international students." if uni_data['scholarship_available'] else None
            
            university = University(**uni_data)
            db.add(university)
            count += 1
    
    db.commit()
    print(f"Successfully imported {count} universities from {country}!")
    db.close()

if __name__ == "__main__":
    import sys
    target_country = sys.argv[1] if len(sys.argv) > 1 else "United Kingdom"
    import_universities(target_country)
