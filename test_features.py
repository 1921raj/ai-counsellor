#!/usr/bin/env python3
"""
AI Counsellor - Comprehensive Feature Testing Script
Tests all major features and API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name, status, message=""):
    symbol = f"{Colors.GREEN}✓{Colors.END}" if status else f"{Colors.RED}✗{Colors.END}"
    print(f"{symbol} {name}")
    if message:
        print(f"  {Colors.YELLOW}{message}{Colors.END}")

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        data = response.json()
        print_test("Backend Health Check", response.status_code == 200, f"Status: {data.get('status')}")
        return response.status_code == 200
    except Exception as e:
        print_test("Backend Health Check", False, str(e))
        return False

def test_frontend_health():
    """Test if frontend is running"""
    try:
        response = requests.get(FRONTEND_URL)
        print_test("Frontend Health Check", response.status_code == 200)
        return response.status_code == 200
    except Exception as e:
        print_test("Frontend Health Check", False, str(e))
        return False

def test_auth_signup():
    """Test user signup"""
    try:
        test_user = {
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "full_name": "Test User",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/signup", json=test_user)
        success = response.status_code in [200, 201]
        print_test("User Signup", success, f"Status: {response.status_code}")
        if success:
            return response.json().get("access_token")
        return None
    except Exception as e:
        print_test("User Signup", False, str(e))
        return None

def test_auth_login():
    """Test user login"""
    try:
        credentials = {
            "email": "raj@example.com",
            "password": "123456"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
        success = response.status_code == 200
        print_test("User Login", success)
        if success:
            return response.json().get("access_token")
        return None
    except Exception as e:
        print_test("User Login", False, str(e))
        return None

def test_universities_endpoint(token):
    """Test universities listing"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/universities", headers=headers)
        success = response.status_code == 200
        count = len(response.json()) if success else 0
        print_test("Universities Listing", success, f"Found {count} universities")
        return success
    except Exception as e:
        print_test("Universities Listing", False, str(e))
        return False

def test_external_search(token):
    """Test global university search"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        params = {"name": "Oxford", "limit": 5}
        response = requests.get(f"{BASE_URL}/external-universities/search", headers=headers, params=params)
        success = response.status_code == 200
        count = len(response.json()) if success else 0
        print_test("Global University Search", success, f"Found {count} results for 'Oxford'")
        return success
    except Exception as e:
        print_test("Global University Search", False, str(e))
        return False

def test_profile_endpoints(token):
    """Test profile creation and retrieval"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try to get existing profile
        response = requests.get(f"{BASE_URL}/profile", headers=headers)
        if response.status_code == 200:
            print_test("Profile Retrieval", True, "Profile exists")
            return True
        
        # Create new profile if doesn't exist
        profile_data = {
            "education_level": "Undergraduate",
            "degree": "Bachelor of Science",
            "major": "Computer Science",
            "gpa": 3.5,
            "graduation_year": 2024,
            "intended_degree": "Master's",
            "target_countries": ["USA", "UK"],
            "preferred_majors": ["Data Science"],
            "budget_min": 20000,
            "budget_max": 50000,
            "scholarship_interest": True,
            "age": 22
        }
        response = requests.post(f"{BASE_URL}/profile", headers=headers, json=profile_data)
        success = response.status_code in [200, 201]
        print_test("Profile Creation", success)
        return success
    except Exception as e:
        print_test("Profile Endpoints", False, str(e))
        return False

def test_shortlist_endpoints(token):
    """Test shortlist functionality"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get shortlist
        response = requests.get(f"{BASE_URL}/shortlist", headers=headers)
        success = response.status_code == 200
        count = len(response.json()) if success else 0
        print_test("Shortlist Retrieval", success, f"Found {count} shortlisted universities")
        return success
    except Exception as e:
        print_test("Shortlist Endpoints", False, str(e))
        return False

def test_dashboard_endpoint(token):
    """Test dashboard data"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
        success = response.status_code == 200
        if success:
            data = response.json()
            print_test("Dashboard Data", True, f"Stage: {data.get('current_stage')}")
        else:
            print_test("Dashboard Data", False)
        return success
    except Exception as e:
        print_test("Dashboard Data", False, str(e))
        return False

def test_chat_endpoint(token):
    """Test AI chat"""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        message = {"message": "Hello, can you help me find universities?"}
        response = requests.post(f"{BASE_URL}/chat", headers=headers, json=message)
        success = response.status_code == 200
        print_test("AI Chat", success)
        return success
    except Exception as e:
        print_test("AI Chat", False, str(e))
        return False

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}AI COUNSELLOR - COMPREHENSIVE FEATURE TEST{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    # Test infrastructure
    print(f"{Colors.BLUE}[1] Infrastructure Tests{Colors.END}")
    backend_ok = test_backend_health()
    frontend_ok = test_frontend_health()
    
    if not backend_ok:
        print(f"\n{Colors.RED}Backend is not running. Please start it first.{Colors.END}\n")
        return
    
    print()
    
    # Test authentication
    print(f"{Colors.BLUE}[2] Authentication Tests{Colors.END}")
    token = test_auth_login()
    if not token:
        token = test_auth_signup()
    
    if not token:
        print(f"\n{Colors.RED}Authentication failed. Cannot proceed with other tests.{Colors.END}\n")
        return
    
    print()
    
    # Test core features
    print(f"{Colors.BLUE}[3] Core Feature Tests{Colors.END}")
    test_profile_endpoints(token)
    test_universities_endpoint(token)
    test_external_search(token)
    test_shortlist_endpoints(token)
    test_dashboard_endpoint(token)
    test_chat_endpoint(token)
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.GREEN}Testing Complete!{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    # Summary
    print(f"{Colors.YELLOW}Quick Links:{Colors.END}")
    print(f"  Landing Page: {FRONTEND_URL}")
    print(f"  Dashboard: {FRONTEND_URL}/dashboard")
    print(f"  Universities: {FRONTEND_URL}/universities")
    print(f"  API Docs: {BASE_URL}/docs")
    print()

if __name__ == "__main__":
    main()
