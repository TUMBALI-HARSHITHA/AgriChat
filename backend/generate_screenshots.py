import os
import sys
import time
from PIL import Image

# Ensure app is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from playwright.sync_api import sync_playwright

def generate_screenshots():
    print("Starting screenshots generation using Playwright...")
    from app.database import db
    db.users.delete_many({"email": "harshitha.test.supervisor@agri.uk.gov.in"})
    db.users.delete_many({"email": "harshitha.google@agri.uk.gov.in"})
    db.users.delete_many({"email": "harshitha.github@agri.uk.gov.in"})
    
    screenshots = []
    
    with sync_playwright() as p:
        browser = None
        # Launch using msedge to guarantee it works on Windows without chromium download
        # Fallback to chrome if msedge fails
        for channel in ["msedge", "chrome"]:
            try:
                print(f"Attempting to launch browser with channel: {channel}...")
                browser = p.chromium.launch(headless=True, channel=channel)
                break
            except Exception as e:
                print(f"Failed to launch with {channel}: {e}")
                
        if not browser:
            print("Could not launch system browser. Attempting standard chromium launch...")
            try:
                browser = p.chromium.launch(headless=True)
            except Exception as e:
                print(f"Standard chromium launch failed: {e}")
                print("Please make sure a browser is available.")
                return
                
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        
        # Keep track of JWT token from network responses
        jwt_token = {"value": ""}
        def handle_response(response):
            if "/api/auth/login" in response.url and response.status == 200:
                try:
                    data = response.json()
                    if "token" in data:
                        jwt_token["value"] = data["token"]
                        print("Intercepted JWT token!")
                except Exception:
                    pass
                    
        page.on("response", handle_response)
        
        # --- STEP 1: Attempt to access a protected route without login (redirected to /login) ---
        print("Step 1: Attempting to access protected route /chat...")
        page.goto("http://localhost:5173/chat")
        page.wait_for_timeout(2000) # wait for redirect
        print(f"Current URL: {page.url}")
        
        # Take screenshot of the redirect landing back at login
        step1_path = os.path.join(backend_dir, "1_protected_route_redirect.png")
        page.screenshot(path=step1_path)
        screenshots.append(step1_path)
        print("Step 1 screenshot captured.")
        
        # --- STEP 2: Registration form and success response ---
        print("Step 2: Navigating to registration form...")
        page.click("text=Request access")
        page.wait_for_timeout(1000)
        
        # Fill out registration
        page.fill("#login-name", "Harshitha Supervisor")
        page.fill("#login-email", "harshitha.test.supervisor@agri.uk.gov.in")
        page.fill("#login-password", "supersecurepassword123")
        
        # Screenshot of filled registration form
        step2a_path = os.path.join(backend_dir, "2a_registration_form.png")
        page.screenshot(path=step2a_path)
        screenshots.append(step2a_path)
        print("Step 2a screenshot captured.")
        
        # Submit registration
        page.click("#login-submit-btn")
        page.wait_for_timeout(3000) # wait for registration, auto-login and redirect to /chat
        print(f"Current URL after registration: {page.url}")
        
        # Screenshot of successful registration (showing the logged-in chat screen)
        step2b_path = os.path.join(backend_dir, "2b_registration_success.png")
        page.screenshot(path=step2b_path)
        screenshots.append(step2b_path)
        print("Step 2b screenshot captured.")
        
        # --- STEP 3: Login form and success (JWT returned in Network tab) ---
        print("Step 3: Logging out and demonstrating login with JWT...")
        # Clear storage to log out
        page.evaluate("localStorage.clear()")
        page.goto("http://localhost:5173/login")
        page.wait_for_timeout(1500)
        
        # Fill out login
        page.fill("#login-email", "harshitha.test.supervisor@agri.uk.gov.in")
        page.fill("#login-password", "supersecurepassword123")
        
        # Screenshot of filled login form
        step3a_path = os.path.join(backend_dir, "3a_login_form.png")
        page.screenshot(path=step3a_path)
        screenshots.append(step3a_path)
        print("Step 3a screenshot captured.")
        
        # Intercept response to login
        page.click("#login-submit-btn")
        page.wait_for_timeout(3000)
        print(f"Current URL after login: {page.url}")
        
        # Inject JWT debugger element on page to show the JWT returned in response
        if jwt_token["value"]:
            page.evaluate("""(token) => {
                const div = document.createElement('div');
                div.id = 'jwt-debugger';
                div.style.position = 'fixed';
                div.style.top = '80px';
                div.style.left = '50%';
                div.style.transform = 'translateX(-50%)';
                div.style.background = 'rgba(10, 15, 10, 0.95)';
                div.style.border = '2px solid #22c55e';
                div.style.color = '#e2e8f0';
                div.style.padding = '16px';
                div.style.borderRadius = '16px';
                div.style.zIndex = '99999';
                div.style.fontFamily = 'monospace';
                div.style.fontSize = '12px';
                div.style.width = '80%';
                div.style.wordBreak = 'break-all';
                div.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.4)';
                div.innerHTML = '<strong style="color: #22c55e; font-size: 14px;">[JWT DEBUGGER] JWT Token Received (HTTP 200 SUCCESS):</strong><br/><br/>' + token;
                document.body.appendChild(div);
            }""", jwt_token["value"])
            page.wait_for_timeout(1000)
            
        step3b_path = os.path.join(backend_dir, "3b_login_success_jwt.png")
        page.screenshot(path=step3b_path)
        screenshots.append(step3b_path)
        print("Step 3b screenshot captured.")
        
        # Remove debugger element
        page.evaluate("const el = document.getElementById('jwt-debugger'); if(el) el.remove();")
        
        # --- STEP 4: Successful OAuth login flow ---
        print("Step 4: Logging out and testing OAuth flow...")
        page.evaluate("localStorage.clear()")
        page.goto("http://localhost:5173/login")
        page.wait_for_timeout(1500)
        
        # Click Google Sign In button
        page.click("text=Google")
        page.wait_for_timeout(2000) # wait for redirect to consent screen
        print(f"Current URL at consent: {page.url}")
        
        # Screenshot of consent screen
        step4a_path = os.path.join(backend_dir, "4a_oauth_consent.png")
        page.screenshot(path=step4a_path)
        screenshots.append(step4a_path)
        print("Step 4a screenshot captured.")
        
        # Click Authorize
        page.click("text=Authorize & Sign In")
        page.wait_for_timeout(3000) # wait for callback and redirect back to /chat
        print(f"Current URL after OAuth: {page.url}")
        
        # Screenshot of logged-in state after OAuth
        step4b_path = os.path.join(backend_dir, "4b_oauth_logged_in.png")
        page.screenshot(path=step4b_path)
        screenshots.append(step4b_path)
        print("Step 4b screenshot captured.")
        
        # --- STEP 5: Rate limit error when hitting login repeatedly (429 response) ---
        print("Step 5: Testing rate limiter on login...")
        page.evaluate("localStorage.clear()")
        page.goto("http://localhost:5173/login")
        page.wait_for_timeout(1500)
        
        # Fill out login
        page.fill("#login-email", "harshitha.test.supervisor@agri.uk.gov.in")
        page.fill("#login-password", "wrongpassword123")
        
        # Click submit button repeatedly to trigger rate limiting (limit is 5 requests per min)
        for i in range(7):
            print(f"Clicking submit {i+1}...")
            page.click("#login-submit-btn")
            page.wait_for_timeout(500)
            
        page.wait_for_timeout(1000)
        # Screenshot showing the rate limit error in the UI
        step5_path = os.path.join(backend_dir, "5_rate_limit_429.png")
        page.screenshot(path=step5_path)
        screenshots.append(step5_path)
        print("Step 5 screenshot captured.")
        
        browser.close()
        
    # Compile screenshots to PDF
    pdf_path = "c:\\Users\\abc\\OneDrive\\Desktop\\AgriChat\\auth_flow_test_screenshots.pdf"
    print(f"Compiling screenshots to PDF: {pdf_path}...")
    pil_images = [Image.open(f).convert("RGB") for f in screenshots]
    pil_images[0].save(pdf_path, save_all=True, append_images=pil_images[1:])
    print("PDF compilation completed.")
    
    # Also save to artifacts folder
    artifacts_pdf_path = "C:\\Users\\abc\\.gemini\\antigravity\\brain\\34f0d21b-6844-4501-a70f-ab9e0c303f12\\auth_flow_test_screenshots.pdf"
    pil_images[0].save(artifacts_pdf_path, save_all=True, append_images=pil_images[1:])
    print(f"PDF copied to artifacts path: {artifacts_pdf_path}")

if __name__ == "__main__":
    generate_screenshots()
