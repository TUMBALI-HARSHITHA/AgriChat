import requests
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.config import settings
from app.models import Advisory
from app.schemas import AdvisoryCreate, AdvisoryUpdate, AdvisoryPatch

SYSTEM_PROMPT = """You are AgriChat, an expert agricultural advisor specializing in Uttarakhand's mountain crops and farming practices. 
You ONLY answer questions related to:
- Crop diseases and pest management (rajma, wheat, potato, millet, mustard, ginger, turmeric, etc.)
- Soil health, fertilization, and organic farming practices
- Seasonal planting calendars specific to Uttarakhand
- Irrigation, water management in hilly terrain
- Government schemes for Uttarakhand farmers
- Post-harvest handling and storage

For ANY question outside agriculture (politics, entertainment, general knowledge, coding, etc.), politely decline and redirect.
Always end responses with: "⚠️ Please verify this advice with a licensed agricultural extension officer before acting on it."
Keep responses practical, concise, and easy for a non-expert supervisor to understand.
Use bullet points when listing multiple steps or options."""

def get_mock_advice(crop: str, query: str, region: str) -> str:
    """Helper to return realistic, localized mock advice if the Gemini API key is rate-limited."""
    query_lower = query.lower()
    
    if "potato" in query_lower:
        return (
            "Namaste! Based on your query regarding potato leaf spots and curling in Uttarakhand's Kumaon hills, "
            "this symptom typically indicates Early Blight (caused by the fungus Alternaria solani).\n\n"
            "Recommended Organic & Chemical Actions:\n"
            "- **Soil Health**: Apply well-decomposed farmyard manure or organic compost to strengthen plant immunity.\n"
            "- **Water Management**: Ensure proper drainage in your hillside terrace beds to prevent excess soil moisture.\n"
            "- **Sanitation**: Remove and burn infected lower leaves to stop the fungal spores from spreading.\n"
            "- **Treatment**: Spray copper-based fungicide (like copper oxychloride at 2.5g per liter of water) if spots spread rapidly.\n\n"
            "⚠️ Please verify this advice with a licensed agricultural extension officer before acting on it."
        )
    elif "aphid" in query_lower or "bean" in query_lower:
        return (
            "Namaste! For managing aphids on beans in Uttarakhand's hilly regions, here is a localized, organic control plan:\n\n"
            "Recommended Organic Actions:\n"
            "- **Neem Spray**: Spray a mixture of neem oil (5 ml) and a few drops of mild liquid soap diluted in 1 liter of warm water. Apply thoroughly, especially on the undersides of the leaves.\n"
            "- **Biological Control**: Encourage natural predators like ladybug beetles (ladybirds) which eat aphids.\n"
            "- **Water Jetting**: Use a pressurized spray of water in the early morning to physically knock aphids off the vines.\n\n"
            "⚠️ Please verify this advice with a licensed agricultural extension officer before acting on it."
        )
    else:
        return (
            f"Namaste! Regarding your query about {crop} in the {region} region:\n\n"
            "General Advisory & Best Practices:\n"
            "- Keep your terrace beds clean and free of weeds that host pests.\n"
            "- Maintain optimal soil moisture; avoid overhead watering late in the day to minimize fungal growth.\n"
            "- Work in well-rotted compost to enrich the mountainous soil.\n\n"
            "⚠️ Please verify this advice with a licensed agricultural extension officer before acting on it."
        )

def generate_agricultural_advice(crop: str, query: str, region: str) -> str:
    """Helper to query Gemini API and get agricultural advice, falling back to local database on rate limit."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return get_mock_advice(crop, query, region)
    
    prompt = f"Crop: {crop}\nRegion: {region}\nFarmer Query: {query}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=body, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            print(f"Gemini API returned status code {response.status_code}. Using local mock fallback.")
            return get_mock_advice(crop, query, region)
    except Exception as e:
        print(f"Gemini API connection failed ({str(e)}). Using local mock fallback.")
        return get_mock_advice(crop, query, region)

# Read single
def get_advisory(db: Session, advisory_id: int):
    return db.query(Advisory).filter(Advisory.id == advisory_id).first()

# Read list with pagination and filtering
def get_advisories(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    crop: str | None = None,
    region: str | None = None,
    severity: str | None = None,
    created_by_id: int | None = None
):
    query = db.query(Advisory)
    if created_by_id is not None:
        query = query.filter(Advisory.created_by_id == created_by_id)
    else:
        query = query.filter(Advisory.created_by_id.is_(None))
        
    if crop:
        query = query.filter(Advisory.crop.ilike(f"%{crop}%"))
    if region:
        query = query.filter(Advisory.region.ilike(f"%{region}%"))
    if severity:
        query = query.filter(Advisory.severity == severity)
    
    return query.offset(skip).limit(limit).all()

# Search
def search_advisories(db: Session, search_query: str, skip: int = 0, limit: int = 100):
    search_pattern = f"%{search_query}%"
    return db.query(Advisory).filter(
        or_(
            Advisory.crop.ilike(search_pattern),
            Advisory.query.ilike(search_pattern),
            Advisory.advice.ilike(search_pattern),
            Advisory.region.ilike(search_pattern)
        )
    ).offset(skip).limit(limit).all()

# Create
def create_advisory(db: Session, advisory: AdvisoryCreate, created_by_id: int | None = None):
    advice = advisory.advice
    if not advice or advice.strip() == "":
        advice = generate_agricultural_advice(advisory.crop, advisory.query, advisory.region)
        
    db_advisory = Advisory(
        crop=advisory.crop,
        query=advisory.query,
        advice=advice,
        region=advisory.region,
        severity=advisory.severity,
        status=advisory.status,
        created_by_id=created_by_id
     )
    db.add(db_advisory)
    db.commit()
    db.refresh(db_advisory)
    return db_advisory

# Full update (PUT)
def update_advisory(db: Session, advisory_id: int, advisory_update: AdvisoryUpdate):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
    
    db_advisory.crop = advisory_update.crop
    db_advisory.query = advisory_update.query
    db_advisory.advice = advisory_update.advice
    db_advisory.region = advisory_update.region
    db_advisory.severity = advisory_update.severity
    db_advisory.status = advisory_update.status
    db_advisory.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(db_advisory)
    return db_advisory

# Partial update (PATCH)
def patch_advisory(db: Session, advisory_id: int, advisory_patch: AdvisoryPatch):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
    
    update_data = advisory_patch.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(db_advisory, key, value)
            
    db_advisory.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(db_advisory)
    return db_advisory

# Delete
def delete_advisory(db: Session, advisory_id: int):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
    db.delete(db_advisory)
    db.commit()
    return db_advisory

# Stats aggregation
def get_advisory_stats(db: Session):
    total = db.query(Advisory).count()
    
    def get_group_counts(field):
        results = db.query(field, func.count(field)).group_by(field).all()
        return {str(val): count for val, count in results if val is not None}
        
    by_crop = get_group_counts(Advisory.crop)
    by_region = get_group_counts(Advisory.region)
    by_severity = get_group_counts(Advisory.severity)
    
    return {
        "total_count": total,
        "by_crop": by_crop,
        "by_region": by_region,
        "by_severity": by_severity
    }
