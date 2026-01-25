import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("Starting API Tests...")
    
    # 1. Root
    print("\n--- Testing Root ---")
    try:
        res = requests.get(f"{BASE_URL}/")
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}")
    except Exception as e:
        print(f"Error: {e}")

    # 2. Signup
    print("\n--- Testing Signup ---")
    email = f"test_{int(time.time())}@example.com"
    signup_data = {
        "email": email,
        "full_name": "Test User",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    print(f"Signup Status: {res.status_code}")
    if res.status_code != 200:
        print(f"Error: {res.text}")
        return
    
    auth_data = res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"User ID: {auth_data['user']['id']}")

    # 3. Login
    print("\n--- Testing Login ---")
    login_data = {"email": email, "password": "password123"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login Status: {res.status_code}")

    # 4. Profile Create
    print("\n--- Testing Profile Create ---")
    profile_data = {
        "education_level": "Undergraduate",
        "degree": "Bachelors",
        "major": "Computer Science",
        "graduation_year": 2024,
        "gpa": 3.8,
        "intended_degree": "Masters",
        "field_of_study": "AI",
        "target_intake_year": 2025,
        "preferred_countries": "USA, Canada",
        "budget_min": 30000,
        "budget_max": 60000,
        "funding_plan": "Self-funded",
        "ielts_score": 7.5,
        "sop_status": "Draft"
    }
    res = requests.post(f"{BASE_URL}/profile", json=profile_data, headers=headers)
    print(f"Profile Create Status: {res.status_code}")
    if res.status_code == 200:
        print("Profile strength calculated successfully")

    # 5. Universities List
    print("\n--- Testing Universities List ---")
    res = requests.get(f"{BASE_URL}/universities", headers=headers)
    print(f"Universities Status: {res.status_code}")
    unis = res.json()
    print(f"Found {len(unis)} universities")
    if len(unis) > 0:
        first_uni_id = unis[0]["id"]
    else:
        print("Wait, no universities? Did you run seed.py?")
        return

    # 6. AI Recommendations
    print("\n--- Testing AI Recommendations ---")
    res = requests.get(f"{BASE_URL}/universities/recommendations", headers=headers)
    print(f"Recommendations Status: {res.status_code}")
    if res.status_code == 200:
        recs = res.json()
        print(f"Generated {len(recs)} recommendations")
        if len(recs) > 0:
            rec_uni_id = recs[0]["university"]["id"]
            rec_category = recs[0]["category"]
            rec_fit = recs[0]["fit_score"]
            rec_reasoning = recs[0]["reasoning"]
            rec_risk = recs[0]["risk_level"]

    # 7. Shortlist Add
    print("\n--- Testing Shortlist Add ---")
    shortlist_data = {
        "university_id": first_uni_id,
        "category": "target",
        "fit_score": 85.0,
        "risk_level": "Low",
        "ai_reasoning": "Great fit for your GPA"
    }
    res = requests.post(f"{BASE_URL}/shortlist", json=shortlist_data, headers=headers)
    print(f"Shortlist Add Status: {res.status_code}")
    if res.status_code == 200:
        shortlist_id = res.json()["id"]

    # 8. Tasks List
    print("\n--- Testing Tasks List ---")
    res = requests.get(f"{BASE_URL}/tasks", headers=headers)
    print(f"Tasks Status: {res.status_code}")
    tasks = res.json()
    print(f"Found {len(tasks)} tasks")
    if len(tasks) > 0:
        first_task_id = tasks[0]["id"]

    # 9. Task Update
    print("\n--- Testing Task Update ---")
    update_data = {"status": "completed"}
    res = requests.put(f"{BASE_URL}/tasks/{first_task_id}", json=update_data, headers=headers)
    print(f"Task Update Status: {res.status_code}")

    # 10. Dashboard
    print("\n--- Testing Dashboard ---")
    res = requests.get(f"{BASE_URL}/dashboard", headers=headers)
    print(f"Dashboard Status: {res.status_code}")
    if res.status_code == 200:
        dash = res.json()
        print(f"Current Stage: {dash['current_stage']}")
        print(f"Locked Count: {dash['locked_count']}")

    # 11. Chat (Note: Might fail without valid GEMINI_API_KEY)
    print("\n--- Testing AI Chat ---")
    chat_data = {"message": "Should I apply to MIT?"}
    res = requests.post(f"{BASE_URL}/chat", json=chat_data, headers=headers)
    print(f"Chat Status: {res.status_code}")
    if res.status_code == 200:
        print(f"AI Response: {res.json()['message'][:50]}...")
    else:
        print("Note: Chat failed - likely due to missing valid Gemini API Key in .env")

    print("\n✅ Tests Completed!")

if __name__ == "__main__":
    test_api()
