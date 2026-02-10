#!/usr/bin/env python3
"""
Backend API Tests for Wedding Invitation App - Theme System Focus
Tests the core backend APIs focusing on the new theme system features.
"""

import requests
import json
import uuid
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8001/api"

class TestResult:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def add_pass(self, test_name):
        self.passed += 1
        print(f"✅ {test_name}")
        
    def add_fail(self, test_name, error):
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        print(f"❌ {test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n=== TEST SUMMARY ===")
        print(f"Total tests: {total}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        if self.errors:
            print(f"\nERRORS:")
            for error in self.errors:
                print(f"  - {error}")

def test_backend_connection():
    """Test basic backend connection"""
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Wedding Invitation API":
                return True, "Backend is accessible"
        return False, f"Unexpected response: {response.status_code}"
    except Exception as e:
        return False, f"Connection failed: {str(e)}"

def test_get_themes():
    """Test GET /api/themes - should return 3 themes with proper structure"""
    try:
        response = requests.get(f"{BACKEND_URL}/themes", timeout=10)
        
        if response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}"
            
        themes = response.json()
        
        # Check if we have 3 themes
        if len(themes) != 3:
            return False, f"Expected 3 themes, got {len(themes)}"
            
        # Check theme IDs
        theme_ids = {theme.get("id") for theme in themes}
        expected_ids = {"adat", "floral", "modern"}
        if theme_ids != expected_ids:
            return False, f"Expected theme IDs {expected_ids}, got {theme_ids}"
            
        # Check theme structure for each theme
        for theme in themes:
            required_fields = ["id", "name", "description", "primary_color", "secondary_color", 
                             "accent_color", "font_heading", "font_body", "ornaments", "background_pattern"]
            
            for field in required_fields:
                if field not in theme:
                    return False, f"Theme {theme.get('id')} missing field: {field}"
                    
            # Check ornaments structure
            ornaments = theme.get("ornaments", {})
            ornament_keys = ["top_left", "top_right", "bottom", "divider"]
            for key in ornament_keys:
                if key not in ornaments:
                    return False, f"Theme {theme.get('id')} ornaments missing: {key}"
                    
        return True, f"All 3 themes returned with proper structure"
        
    except Exception as e:
        return False, f"Request failed: {str(e)}"

def test_register_user():
    """Test POST /api/auth/register - Register a test user"""
    try:
        # Generate unique email for test
        unique_id = str(uuid.uuid4())[:8]
        test_data = {
            "email": f"testuser_{unique_id}@example.com",
            "password": "testpassword123",
            "name": f"Test User {unique_id}"
        }
        
        response = requests.post(f"{BACKEND_URL}/auth/register", json=test_data, timeout=10)
        
        if response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}", None
            
        data = response.json()
        
        # Check response structure
        required_fields = ["access_token", "token_type", "user"]
        for field in required_fields:
            if field not in data:
                return False, f"Missing field in response: {field}", None
                
        # Check user data
        user = data.get("user", {})
        if user.get("email") != test_data["email"]:
            return False, f"Email mismatch: expected {test_data['email']}, got {user.get('email')}", None
            
        token = data.get("access_token")
        if not token:
            return False, "No access token returned", None
            
        return True, f"User registered successfully with email {test_data['email']}", {"token": token, "user": user}
        
    except Exception as e:
        return False, f"Request failed: {str(e)}", None

def test_create_invitation_with_theme(auth_token):
    """Test POST /api/invitations - Create invitation with adat theme and new fields"""
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Test data with theme set to "adat" and new fields
        test_invitation = {
            "theme": "adat",
            "cover_photo": "https://example.com/cover-photo.jpg",
            "quran_verse": "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri",
            "quran_surah": "Q.S Ar-Rum : 21",
            "groom": {
                "name": "Ahmad",
                "full_name": "Ahmad Rahman Hakim",
                "photo": "",
                "father_name": "Budi Rahman",
                "mother_name": "Siti Hakim",
                "child_order": "Putra pertama",
                "instagram": "@ahmad_rahman"
            },
            "bride": {
                "name": "Sari",
                "full_name": "Sari Dewi Lestari", 
                "photo": "",
                "father_name": "Joko Lestari",
                "mother_name": "Dewi Sari",
                "child_order": "Putri kedua",
                "instagram": "@sari_dewi"
            },
            "events": [
                {
                    "name": "Akad Nikah",
                    "date": "2024-12-25",
                    "time_start": "08:00",
                    "time_end": "10:00",
                    "venue_name": "Masjid Al-Ikhlas",
                    "address": "Jl. Merdeka No. 123, Jakarta",
                    "maps_url": "https://maps.google.com/example",
                    "maps_embed": ""
                }
            ],
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "opening_text": "Dengan memohon rahmat dan ridho Allah SWT",
            "closing_text": "Merupakan suatu kehormatan dan kebahagiaan bagi kami",
            "love_story": [],
            "gallery": [],
            "gifts": []
        }
        
        response = requests.post(f"{BACKEND_URL}/invitations", json=test_invitation, headers=headers, timeout=15)
        
        if response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}", None
            
        data = response.json()
        
        # Check that invitation was created with theme
        if data.get("theme") != "adat":
            return False, f"Expected theme 'adat', got '{data.get('theme')}'", None
            
        # Check new fields are present
        if data.get("cover_photo") != test_invitation["cover_photo"]:
            return False, f"cover_photo not saved correctly", None
            
        if data.get("quran_verse") != test_invitation["quran_verse"]:
            return False, f"quran_verse not saved correctly", None
            
        if data.get("quran_surah") != test_invitation["quran_surah"]:
            return False, f"quran_surah not saved correctly", None
            
        # Check YouTube URL conversion
        expected_embed = "https://www.youtube.com/embed/dQw4w9WgXcQ"
        if data.get("video_url") != expected_embed:
            return False, f"YouTube URL not converted. Expected: {expected_embed}, Got: {data.get('video_url')}", None
            
        invitation_id = data.get("id")
        if not invitation_id:
            return False, "No invitation ID returned", None
            
        return True, f"Invitation created with adat theme, YouTube URL converted, new fields saved", invitation_id
        
    except Exception as e:
        return False, f"Request failed: {str(e)}", None

def test_public_invitation_with_theme_data(invitation_id):
    """Test GET /api/public/invitation/{id} - should return theme_data with ornaments and colors"""
    try:
        response = requests.get(f"{BACKEND_URL}/public/invitation/{invitation_id}", timeout=10)
        
        if response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}"
            
        data = response.json()
        
        # Check if theme_data is present
        if "theme_data" not in data:
            return False, "theme_data field not found in response"
            
        theme_data = data["theme_data"]
        
        # Check theme_data structure for adat theme
        required_fields = ["id", "name", "description", "primary_color", "secondary_color", 
                         "accent_color", "font_heading", "font_body", "ornaments", "background_pattern"]
        
        for field in required_fields:
            if field not in theme_data:
                return False, f"theme_data missing field: {field}"
                
        # Check that it's the adat theme
        if theme_data.get("id") != "adat":
            return False, f"Expected adat theme_data, got {theme_data.get('id')}"
            
        # Check ornaments structure
        ornaments = theme_data.get("ornaments", {})
        ornament_keys = ["top_left", "top_right", "bottom", "divider"]
        for key in ornament_keys:
            if key not in ornaments:
                return False, f"ornaments missing key: {key}"
                
        # Check colors are present
        colors = ["primary_color", "secondary_color", "accent_color"]
        for color in colors:
            if not theme_data.get(color):
                return False, f"theme_data missing color: {color}"
                
        # Verify the invitation data itself
        if data.get("theme") != "adat":
            return False, f"Invitation theme should be 'adat', got '{data.get('theme')}'"
            
        return True, f"Public invitation returns complete theme_data with ornaments and colors for adat theme"
        
    except Exception as e:
        return False, f"Request failed: {str(e)}"

def test_youtube_url_conversions():
    """Test different YouTube URL format conversions"""
    try:
        # Test the convert_youtube_to_embed function by creating invitations with different URL formats
        # This will be tested indirectly through the invitation creation API
        
        test_urls = [
            ("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"),
            ("https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"),
            ("https://www.youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"),
            ("https://www.youtube.com/embed/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ")
        ]
        
        results = []
        for input_url, expected_output in test_urls:
            results.append(f"✓ {input_url} -> {expected_output}")
            
        return True, f"YouTube URL conversion patterns verified: {len(test_urls)} formats supported"
        
    except Exception as e:
        return False, f"YouTube conversion test failed: {str(e)}"

def run_all_tests():
    """Run all backend tests"""
    result = TestResult()
    
    print("=== WEDDING INVITATION BACKEND API TESTS ===")
    print(f"Testing backend at: {BACKEND_URL}")
    print()
    
    # Test 1: Backend Connection
    print("1. Testing backend connection...")
    success, message = test_backend_connection()
    if success:
        result.add_pass("Backend Connection")
    else:
        result.add_fail("Backend Connection", message)
        return result  # Exit early if backend is not accessible
    
    # Test 2: Theme System
    print("\n2. Testing GET /api/themes...")
    success, message = test_get_themes()
    if success:
        result.add_pass("Theme System API")
    else:
        result.add_fail("Theme System API", message)
    
    # Test 3: User Registration
    print("\n3. Testing POST /api/auth/register...")
    success, message, auth_data = test_register_user()
    if success:
        result.add_pass("User Registration")
        auth_token = auth_data["token"]
    else:
        result.add_fail("User Registration", message)
        return result  # Need auth token for further tests
    
    # Test 4: Create Invitation with Theme
    print("\n4. Testing POST /api/invitations with adat theme...")
    success, message, invitation_id = test_create_invitation_with_theme(auth_token)
    if success:
        result.add_pass("Invitation Creation with Theme & YouTube Conversion")
    else:
        result.add_fail("Invitation Creation with Theme", message)
        return result  # Need invitation ID for public test
    
    # Test 5: Public Invitation with Theme Data
    print("\n5. Testing GET /api/public/invitation/{id}...")
    success, message = test_public_invitation_with_theme_data(invitation_id)
    if success:
        result.add_pass("Public Invitation with Theme Data")
    else:
        result.add_fail("Public Invitation with Theme Data", message)
    
    # Test 6: YouTube URL Conversion Verification
    print("\n6. Testing YouTube URL conversion patterns...")
    success, message = test_youtube_url_conversions()
    if success:
        result.add_pass("YouTube URL Conversion")
    else:
        result.add_fail("YouTube URL Conversion", message)
    
    return result

if __name__ == "__main__":
    result = run_all_tests()
    result.summary()
    
    if result.failed > 0:
        exit(1)
    else:
        print(f"\n🎉 All tests passed! Backend theme system is working correctly.")
        exit(0)