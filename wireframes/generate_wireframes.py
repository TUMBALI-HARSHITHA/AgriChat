import os

def create_home_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#f9fafb; font-family:sans-serif;">
  <!-- Header -->
  <rect x="0" y="0" width="1440" height="64" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="60" y="16" width="32" height="32" rx="8" fill="#d1d5db"/>
  <line x1="60" y1="16" x2="92" y2="48" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="92" y1="16" x2="60" y2="48" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="104" y="37" font-size="18" font-weight="bold" fill="#1f2937">AgriChat</text>
  
  <text x="950" y="37" font-size="14" fill="#4b5563" font-weight="bold">Home</text>
  <text x="1030" y="37" font-size="14" fill="#9ca3af">Chat</text>
  <text x="1100" y="37" font-size="14" fill="#9ca3af">Dashboard</text>
  <text x="1200" y="37" font-size="14" fill="#9ca3af">About</text>
  <text x="1280" y="37" font-size="14" fill="#9ca3af">Login</text>
  <circle cx="1360" cy="32" r="16" fill="#e5e7eb"/>
  
  <!-- Hero Section -->
  <text x="720" y="180" font-size="44" font-weight="bold" fill="#1f2937" text-anchor="middle">Smart Farming Advice for Uttarakhand</text>
  <text x="720" y="230" font-size="16" fill="#4b5563" text-anchor="middle">Ask any farming question in plain language. Get instant, practical guidance tailored to mountain crops.</text>
  
  <!-- CTA Buttons -->
  <rect x="540" y="280" width="160" height="44" rx="8" fill="#4b5563"/>
  <text x="620" y="306" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Start Chatting</text>
  
  <rect x="720" y="280" width="160" height="44" rx="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="800" y="306" font-size="14" font-weight="bold" fill="#4b5563" text-anchor="middle">Learn More</text>
  
  <!-- Stats Row -->
  <rect x="420" y="370" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="500" y="405" font-size="24" font-weight="bold" fill="#1f2937" text-anchor="middle">50+</text>
  <text x="500" y="430" font-size="12" fill="#9ca3af" text-anchor="middle">Mountain Crops</text>
  
  <rect x="640" y="370" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="720" y="405" font-size="24" font-weight="bold" fill="#1f2937" text-anchor="middle">100%</text>
  <text x="720" y="430" font-size="12" fill="#9ca3af" text-anchor="middle">Verified Advice</text>
  
  <rect x="860" y="370" width="160" height="80" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="940" y="405" font-size="24" font-weight="bold" fill="#1f2937" text-anchor="middle">Free</text>
  <text x="940" y="430" font-size="12" fill="#9ca3af" text-anchor="middle">Instant AI</text>

  <!-- Features Heading -->
  <text x="720" y="520" font-size="28" font-weight="bold" fill="#1f2937" text-anchor="middle">What AgriChat Offers</text>
  
  <!-- Features Cards -->
  <!-- Card 1 -->
  <rect x="160" y="560" width="260" height="220" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="190" y="590" width="48" height="48" rx="8" fill="#e5e7eb"/>
  <line x1="190" y1="590" x2="238" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="238" y1="590" x2="190" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="190" y="665" font-size="16" font-weight="bold" fill="#1f2937">Crop Health</text>
  <rect x="190" y="690" width="200" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="190" y="705" width="170" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="190" y="720" width="120" height="8" rx="4" fill="#e5e7eb"/>
  
  <!-- Card 2 -->
  <rect x="440" y="560" width="260" height="220" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="470" y="590" width="48" height="48" rx="8" fill="#e5e7eb"/>
  <line x1="470" y1="590" x2="518" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="518" y1="590" x2="470" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="470" y="665" font-size="16" font-weight="bold" fill="#1f2937">Pest Control</text>
  <rect x="470" y="690" width="200" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="470" y="705" width="170" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="470" y="720" width="120" height="8" rx="4" fill="#e5e7eb"/>
  
  <!-- Card 3 -->
  <rect x="720" y="560" width="260" height="220" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="750" y="590" width="48" height="48" rx="8" fill="#e5e7eb"/>
  <line x1="750" y1="590" x2="798" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="798" y1="590" x2="750" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="750" y="665" font-size="16" font-weight="bold" fill="#1f2937">Seasonal Tips</text>
  <rect x="750" y="690" width="200" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="750" y="705" width="170" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="750" y="720" width="120" height="8" rx="4" fill="#e5e7eb"/>
  
  <!-- Card 4 -->
  <rect x="1000" y="560" width="260" height="220" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="1030" y="590" width="48" height="48" rx="8" fill="#e5e7eb"/>
  <line x1="1030" y1="590" x2="1078" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="1078" y1="590" x2="1030" y2="638" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="1030" y="665" font-size="16" font-weight="bold" fill="#1f2937">Knowledge Base</text>
  <rect x="1030" y="690" width="200" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="1030" y="705" width="170" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="1030" y="720" width="120" height="8" rx="4" fill="#e5e7eb"/>
  
  <!-- Footer -->
  <rect x="0" y="820" width="1440" height="80" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="720" y="865" font-size="12" fill="#9ca3af" text-anchor="middle">© 2026 AgriChat. All rights reserved. Designed for Uttarakhand Supervisors.</text>
</svg>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)

def create_dashboard_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#f9fafb; font-family:sans-serif;">
  <!-- Sidebar -->
  <rect x="0" y="0" width="240" height="900" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="30" y="24" width="28" height="28" rx="6" fill="#d1d5db"/>
  <line x1="30" y1="24" x2="58" y2="52" stroke="#9ca3af" stroke-width="1.2"/>
  <line x1="58" y1="24" x2="30" y2="52" stroke="#9ca3af" stroke-width="1.2"/>
  <text x="70" y="43" font-size="16" font-weight="bold" fill="#1f2937">AgriChat</text>
  
  <!-- Sidebar Items -->
  <rect x="20" y="90" width="200" height="40" rx="8" fill="#f3f4f6"/>
  <text x="40" y="115" font-size="14" fill="#1f2937" font-weight="bold">Dashboard</text>
  
  <text x="40" y="175" font-size="14" fill="#9ca3af">Chat Advisory</text>
  <text x="40" y="225" font-size="14" fill="#9ca3af">Crop History</text>
  <text x="40" y="275" font-size="14" fill="#9ca3af">Weather Alerts</text>
  <text x="40" y="325" font-size="14" fill="#9ca3af">User Settings</text>
  
  <!-- Top Header -->
  <rect x="240" y="0" width="1200" height="64" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="280" y="37" font-size="18" font-weight="bold" fill="#1f2937">Dashboard</text>
  <rect x="940" y="14" width="260" height="36" rx="8" fill="#f3f4f6"/>
  <text x="960" y="36" font-size="12" fill="#9ca3af">Search queries...</text>
  <circle cx="1250" cy="32" r="16" fill="#e5e7eb"/>
  <text x="1280" y="37" font-size="14" fill="#4b5563">Supervisor UK</text>

  <!-- Stats Grid -->
  <!-- Stats 1 -->
  <rect x="280" y="100" width="250" height="100" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="310" y="145" font-size="28" font-weight="bold" fill="#1f2937">24</text>
  <text x="310" y="170" font-size="12" fill="#9ca3af">Total Queries</text>
  <circle cx="480" cy="140" r="16" fill="#f3f4f6"/>

  <!-- Stats 2 -->
  <rect x="560" y="100" width="250" height="100" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="590" y="145" font-size="28" font-weight="bold" fill="#1f2937">8</text>
  <text x="590" y="170" font-size="12" fill="#9ca3af">Crops Covered</text>
  <circle cx="760" cy="140" r="16" fill="#f3f4f6"/>

  <!-- Stats 3 -->
  <rect x="840" y="100" width="250" height="100" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="870" y="145" font-size="28" font-weight="bold" fill="#1f2937">7</text>
  <text x="870" y="170" font-size="12" fill="#9ca3af">This Week</text>
  <circle cx="1040" cy="140" r="16" fill="#f3f4f6"/>

  <!-- Stats 4 -->
  <rect x="1120" y="100" width="250" height="100" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="1150" y="145" font-size="28" font-weight="bold" fill="#1f2937">2</text>
  <text x="1150" y="170" font-size="12" fill="#9ca3af">Pending Alerts</text>
  <circle cx="1320" cy="140" r="16" fill="#f3f4f6"/>

  <!-- Chart Area -->
  <rect x="280" y="230" width="1090" height="280" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="310" y="270" font-size="16" font-weight="bold" fill="#1f2937">Weekly Advisory Activity</text>
  <!-- mock chart bars -->
  <rect x="350" y="440" width="30" height="40" fill="#d1d5db" rx="4"/>
  <rect x="420" y="380" width="30" height="100" fill="#9ca3af" rx="4"/>
  <rect x="490" y="320" width="30" height="160" fill="#4b5563" rx="4"/>
  <rect x="560" y="410" width="30" height="70" fill="#d1d5db" rx="4"/>
  <rect x="630" y="350" width="30" height="130" fill="#9ca3af" rx="4"/>
  <rect x="70" y="290" width="30" height="190" fill="#4b5563" rx="4"/> <!-- note: x offset in manual draft, let's fix to 700 -->
  <rect x="700" y="290" width="30" height="190" fill="#4b5563" rx="4"/>
  <rect x="770" y="340" width="30" height="140" fill="#9ca3af" rx="4"/>
  <rect x="840" y="400" width="30" height="80" fill="#d1d5db" rx="4"/>
  <line x1="310" y1="480" x2="1330" y2="480" stroke="#e5e7eb" stroke-width="2"/>

  <!-- Recent Activity List -->
  <rect x="280" y="540" width="1090" height="310" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="310" y="580" font-size="16" font-weight="bold" fill="#1f2937">Recent Advisory Tickets</text>
  
  <!-- Row 1 -->
  <rect x="310" y="610" width="1030" height="60" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
  <circle cx="340" cy="640" r="14" fill="#e5e7eb"/>
  <text x="375" y="645" font-size="14" font-weight="bold" fill="#1f2937">Bean mosaic virus diagnosis - Almora District</text>
  <text x="1200" y="645" font-size="12" fill="#9ca3af">Completed · 2h ago</text>

  <!-- Row 2 -->
  <rect x="310" y="685" width="1030" height="60" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
  <circle cx="340" cy="715" r="14" fill="#e5e7eb"/>
  <text x="375" y="720" font-size="14" font-weight="bold" fill="#1f2937">Late blight treatment advice - Pithoragarh</text>
  <text x="1200" y="720" font-size="12" fill="#9ca3af">In Progress · 5h ago</text>

  <!-- Row 3 -->
  <rect x="310" y="760" width="1030" height="60" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
  <circle cx="340" cy="790" r="14" fill="#e5e7eb"/>
  <text x="375" y="795" font-size="14" font-weight="bold" fill="#1f2937">Wheat sowing calendar details - Nainital region</text>
  <text x="1200" y="795" font-size="12" fill="#9ca3af">Completed · Yesterday</text>
</svg>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)

def create_list_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#f9fafb; font-family:sans-serif;">
  <!-- Header -->
  <rect x="0" y="0" width="1440" height="64" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="60" y="16" width="32" height="32" rx="8" fill="#d1d5db"/>
  <line x1="60" y1="16" x2="92" y2="48" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="92" y1="16" x2="60" y2="48" stroke="#9ca3af" stroke-width="1.5"/>
  <text x="104" y="37" font-size="18" font-weight="bold" fill="#1f2937">AgriChat</text>
  <circle cx="1360" cy="32" r="16" fill="#e5e7eb"/>
  <text x="1200" y="37" font-size="14" fill="#9ca3af">Dashboard</text>

  <!-- Filter Sidebar -->
  <rect x="60" y="100" width="280" height="740" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="90" y="140" font-size="16" font-weight="bold" fill="#1f2937">Filters</text>
  
  <text x="90" y="190" font-size="12" font-weight="bold" fill="#9ca3af" style="text-transform:uppercase;">Crop Type</text>
  <rect x="90" y="210" width="16" height="16" rx="4" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="223" font-size="14" fill="#4b5563">Potato</text>
  <rect x="90" y="240" width="16" height="16" rx="4" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="253" font-size="14" fill="#4b5563">Beans / Rajma</text>
  <rect x="90" y="270" width="16" height="16" rx="4" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="283" font-size="14" fill="#4b5563">Wheat</text>

  <text x="90" y="330" font-size="12" font-weight="bold" fill="#9ca3af" style="text-transform:uppercase;">District</text>
  <rect x="90" y="350" width="16" height="16" rx="4" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="363" font-size="14" fill="#4b5563">Almora</text>
  <rect x="90" y="380" width="16" height="16" rx="4" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="393" font-size="14" fill="#4b5563">Dehradun</text>

  <text x="90" y="440" font-size="12" font-weight="bold" fill="#9ca3af" style="text-transform:uppercase;">Status</text>
  <circle cx="98" cy="470" r="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="475" font-size="14" fill="#4b5563">Solved</text>
  <circle cx="98" cy="500" r="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="120" y="505" font-size="14" fill="#4b5563">Pending</text>

  <!-- Main Content Results -->
  <text x="370" y="130" font-size="20" font-weight="bold" fill="#1f2937">Crop Advisory Catalog</text>
  <text x="370" y="150" font-size="12" fill="#9ca3af">Showing 4 results matching selected filters</text>

  <!-- List Item 1 -->
  <rect x="370" y="180" width="1010" height="130" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="390" y="200" width="90" height="90" rx="8" fill="#e5e7eb"/>
  <line x1="390" y1="200" x2="480" y2="290" stroke="#9ca3af" stroke-width="1.2"/>
  <line x1="480" y1="200" x2="390" y2="290" stroke="#9ca3af" stroke-width="1.2"/>
  <text x="500" y="225" font-size="16" font-weight="bold" fill="#1f2937">Bean Rust Mitigation Strategy</text>
  <text x="500" y="245" font-size="12" fill="#9ca3af">Crop: Rajma · District: Almora · Solved</text>
  <rect x="500" y="260" width="700" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="500" y="275" width="550" height="8" rx="4" fill="#e5e7eb"/>

  <!-- List Item 2 -->
  <rect x="370" y="330" width="1010" height="130" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="390" y="350" width="90" height="90" rx="8" fill="#e5e7eb"/>
  <line x1="390" y1="350" x2="480" y2="440" stroke="#9ca3af" stroke-width="1.2"/>
  <line x1="480" y1="350" x2="390" y2="440" stroke="#9ca3af" stroke-width="1.2"/>
  <text x="500" y="375" font-size="16" font-weight="bold" fill="#1f2937">Potato Late Blight Emergency Measures</text>
  <text x="500" y="395" font-size="12" fill="#9ca3af">Crop: Potato · District: Dehradun · Pending</text>
  <rect x="500" y="410" width="700" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="500" y="425" width="550" height="8" rx="4" fill="#e5e7eb"/>

  <!-- List Item 3 -->
  <rect x="370" y="480" width="1010" height="130" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="390" y="500" width="90" height="90" rx="8" fill="#e5e7eb"/>
  <line x1="390" y1="500" x2="480" y2="590" stroke="#9ca3af" stroke-width="1.2"/>
  <line x1="480" y1="500" x2="390" y2="590" stroke="#9ca3af" stroke-width="1.2"/>
  <text x="500" y="525" font-size="16" font-weight="bold" fill="#1f2937">Wheat Sowing Window Analysis</text>
  <text x="500" y="545" font-size="12" fill="#9ca3af">Crop: Wheat · District: Almora · Solved</text>
  <rect x="500" y="560" width="700" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="500" y="575" width="550" height="8" rx="4" fill="#e5e7eb"/>

  <!-- Paginator -->
  <rect x="800" y="640" width="40" height="40" rx="8" fill="#e5e7eb"/>
  <text x="820" y="665" font-size="14" font-weight="bold" fill="#4b5563" text-anchor="middle">1</text>
  <rect x="850" y="640" width="40" height="40" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="870" y="665" font-size="14" fill="#4b5563" text-anchor="middle">2</text>
  <rect x="900" y="640" width="40" height="40" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="920" y="665" font-size="14" fill="#4b5563" text-anchor="middle">3</text>
</svg>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)

def create_login_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#f3f4f6; font-family:sans-serif;">
  <!-- Centred Card -->
  <rect x="495" y="150" width="450" height="600" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  
  <!-- Logo Sprout Placeholder -->
  <rect x="690" y="200" width="60" height="60" rx="16" fill="#e5e7eb"/>
  <line x1="690" y1="200" x2="750" y2="260" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="750" y1="200" x2="690" y2="260" stroke="#9ca3af" stroke-width="1.5"/>
  
  <text x="720" y="295" font-size="24" font-weight="bold" fill="#1f2937" text-anchor="middle">Welcome back</text>
  <text x="720" y="320" font-size="14" fill="#9ca3af" text-anchor="middle">Sign in to your AgriChat account</text>

  <!-- Forms -->
  <!-- Email -->
  <text x="545" y="375" font-size="12" font-weight="bold" fill="#4b5563" style="text-transform:uppercase; tracking: 0.1em;">Email</text>
  <rect x="545" y="390" width="350" height="48" rx="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="565" y="420" font-size="14" fill="#9ca3af">supervisor@agri.uk.gov.in</text>
  
  <!-- Password -->
  <text x="545" y="475" font-size="12" font-weight="bold" fill="#4b5563" style="text-transform:uppercase; tracking: 0.1em;">Password</text>
  <rect x="545" y="490" width="350" height="48" rx="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="565" y="520" font-size="14" fill="#9ca3af">••••••••</text>
  
  <!-- Forgot Password -->
  <text x="895" y="565" font-size="12" fill="#4b5563" text-anchor="end">Forgot password?</text>

  <!-- Login Button -->
  <rect x="545" y="590" width="350" height="48" rx="8" fill="#4b5563"/>
  <text x="720" y="620" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Sign In</text>

  <!-- Divider -->
  <line x1="545" y1="670" x2="695" y2="670" stroke="#e5e7eb" stroke-width="1"/>
  <text x="720" y="674" font-size="12" fill="#9ca3af" text-anchor="middle">or</text>
  <line x1="745" y1="670" x2="895" y2="670" stroke="#e5e7eb" stroke-width="1"/>

  <!-- Guest Access Button -->
  <rect x="545" y="695" width="350" height="48" rx="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="720" y="725" font-size="14" font-weight="bold" fill="#4b5563" text-anchor="middle">Try without login</text>
</svg>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)

def create_ai_svg(filepath):
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background:#f9fafb; font-family:sans-serif;">
  <!-- Sidebar -->
  <rect x="0" y="0" width="240" height="900" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <rect x="30" y="24" width="28" height="28" rx="6" fill="#d1d5db"/>
  <line x1="30" y1="24" x2="58" y2="52" stroke="#9ca3af" stroke-width="1.2"/>
  <line x1="58" y1="24" x2="30" y2="52" stroke="#9ca3af" stroke-width="1.2"/>
  <text x="70" y="43" font-size="16" font-weight="bold" fill="#1f2937">AgriChat</text>
  
  <!-- Sidebar Chat Items -->
  <text x="30" y="100" font-size="12" font-weight="bold" fill="#9ca3af" style="text-transform:uppercase;">Recent Conversations</text>
  <rect x="15" y="120" width="210" height="40" rx="8" fill="#f3f4f6"/>
  <text x="30" y="145" font-size="13" font-weight="bold" fill="#1f2937">Bean spots treatment</text>
  <text x="30" y="195" font-size="13" fill="#4b5563">Late blight advice</text>
  <text x="30" y="245" font-size="13" fill="#4b5563">Wheat sowing window</text>

  <!-- Header -->
  <rect x="240" y="0" width="1200" height="64" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="280" y="37" font-size="18" font-weight="bold" fill="#1f2937">Advisory Chat</text>
  <rect x="1220" y="14" width="160" height="36" rx="8" fill="none" stroke="#d1d5db" stroke-width="1.5"/>
  <text x="1300" y="36" font-size="13" font-weight="bold" fill="#4b5563" text-anchor="middle">Clear History</text>

  <!-- Disclaimer Banner -->
  <rect x="280" y="80" width="1100" height="44" rx="8" fill="#fffbeb" stroke="#fef3c7" stroke-width="1"/>
  <text x="310" y="106" font-size="12" fill="#d97706">⚠️ Disclaimer: AI answers are for informational purposes only. Consult a licensed extension officer.</text>

  <!-- Chat Area Container -->
  <rect x="280" y="140" width="1100" height="600" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  
  <!-- Messages Feed -->
  <!-- User message -->
  <rect x="910" y="170" width="440" height="60" rx="16" fill="#f3f4f6"/>
  <text x="940" y="205" font-size="14" fill="#1f2937">My potato crop leaves have dark brown spots. Advice?</text>
  
  <!-- AI message -->
  <rect x="310" y="250" width="550" height="130" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="340" y="285" font-size="14" font-weight="bold" fill="#1f2937">AgriChat Assistant</text>
  <rect x="340" y="305" width="490" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="340" y="320" width="490" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="340" y="335" width="410" height="8" rx="4" fill="#e5e7eb"/>
  <text x="340" y="360" font-size="11" fill="#9ca3af">⚠️ Verify with an extension officer before applying fungicide.</text>

  <!-- User message 2 -->
  <rect x="910" y="400" width="440" height="60" rx="16" fill="#f3f4f6"/>
  <text x="940" y="435" font-size="14" fill="#1f2937">Is Bordeaux mixture safe for potato late blight?</text>

  <!-- AI message 2 -->
  <rect x="310" y="480" width="550" height="140" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="340" y="515" font-size="14" font-weight="bold" fill="#1f2937">AgriChat Assistant</text>
  <rect x="340" y="535" width="490" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="340" y="550" width="490" height="8" rx="4" fill="#e5e7eb"/>
  <rect x="340" y="565" width="490" height="8" rx="4" fill="#e5e7eb"/>
  <text x="340" y="595" font-size="11" fill="#9ca3af">⚠️ Verify with an extension officer before applying fungicide.</text>

  <!-- Input Field Container -->
  <rect x="280" y="760" width="1100" height="80" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
  <text x="310" y="805" font-size="14" fill="#9ca3af">Type your agricultural query here... (Press Enter to send)</text>
  <!-- Send Button Box -->
  <rect x="1310" y="780" width="48" height="40" rx="8" fill="#4b5563"/>
  <line x1="1325" y1="800" x2="1343" y2="800" stroke="#ffffff" stroke-width="2"/>
  <line x1="1335" y1="790" x2="1343" y2="800" stroke="#ffffff" stroke-width="2"/>
  <line x1="1335" y1="810" x2="1343" y2="800" stroke="#ffffff" stroke-width="2"/>
</svg>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_content)

def main():
    wireframe_dir = 'wireframes'
    os.makedirs(wireframe_dir, exist_ok=True)
    
    create_home_svg(os.path.join(wireframe_dir, '01_home.svg'))
    create_dashboard_svg(os.path.join(wireframe_dir, '02_dashboard.svg'))
    create_list_svg(os.path.join(wireframe_dir, '03_list_detail.svg'))
    create_login_svg(os.path.join(wireframe_dir, '04_login_signup.svg'))
    create_ai_svg(os.path.join(wireframe_dir, '05_ai_feature.svg'))
    
    print("5 Lo-fi wireframe SVGs generated successfully in the 'wireframes/' directory!")

if __name__ == '__main__':
    main()
