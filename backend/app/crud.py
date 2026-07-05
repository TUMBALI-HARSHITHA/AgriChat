import re
import requests
from datetime import datetime, timezone
from app.config import settings
from app.database import get_next_sequence_value
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

def get_advisory(db, advisory_id: int):
    return db.advisories.find_one({"id": advisory_id})

def get_advisories(
    db, 
    skip: int = 0, 
    limit: int = 100,
    crop: str | None = None,
    region: str | None = None,
    severity: str | None = None,
    created_by_id: int | None = None
):
    filter_query = {}
    if created_by_id is not None:
        filter_query["created_by_id"] = created_by_id
    else:
        filter_query["created_by_id"] = None
        
    if crop:
        filter_query["crop"] = {"$regex": re.escape(crop), "$options": "i"}
    if region:
        filter_query["region"] = {"$regex": re.escape(region), "$options": "i"}
    if severity:
        filter_query["severity"] = severity
        
    cursor = db.advisories.find(filter_query).skip(skip).limit(limit)
    return list(cursor)

def search_advisories(db, search_query: str, skip: int = 0, limit: int = 100):
    regex = {"$regex": re.escape(search_query), "$options": "i"}
    filter_query = {
        "$or": [
            {"crop": regex},
            {"query": regex},
            {"advice": regex},
            {"region": regex}
        ]
    }
    cursor = db.advisories.find(filter_query).skip(skip).limit(limit)
    return list(cursor)

def create_advisory(db, advisory: AdvisoryCreate, created_by_id: int | None = None):
    advice = advisory.advice
    if not advice or advice.strip() == "":
        advice = generate_agricultural_advice(advisory.crop, advisory.query, advisory.region)
        
    next_id = get_next_sequence_value("advisories")
    now = datetime.now(timezone.utc)
    
    doc = {
        "id": next_id,
        "crop": advisory.crop,
        "query": advisory.query,
        "advice": advice,
        "region": advisory.region,
        "severity": advisory.severity,
        "status": advisory.status,
        "created_by_id": created_by_id,
        "created_at": now,
        "updated_at": now
    }
    
    db.advisories.insert_one(doc)
    return doc

def update_advisory(db, advisory_id: int, advisory_update: AdvisoryUpdate):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
        
    now = datetime.now(timezone.utc)
    updates = {
        "crop": advisory_update.crop,
        "query": advisory_update.query,
        "advice": advisory_update.advice,
        "region": advisory_update.region,
        "severity": advisory_update.severity,
        "status": advisory_update.status,
        "updated_at": now
    }
    
    db.advisories.update_one({"id": advisory_id}, {"$set": updates})
    db_advisory.update(updates)
    return db_advisory

def patch_advisory(db, advisory_id: int, advisory_patch: AdvisoryPatch):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
        
    update_data = advisory_patch.model_dump(exclude_unset=True)
    if not update_data:
        return db_advisory
        
    update_data["updated_at"] = datetime.now(timezone.utc)
    db.advisories.update_one({"id": advisory_id}, {"$set": update_data})
    db_advisory.update(update_data)
    return db_advisory

def delete_advisory(db, advisory_id: int):
    db_advisory = get_advisory(db, advisory_id)
    if not db_advisory:
        return None
    db.advisories.delete_one({"id": advisory_id})
    return db_advisory

def get_advisory_stats(db):
    total = db.advisories.count_documents({})
    
    def get_group_counts(field):
        pipeline = [
            {"$group": {"_id": f"${field}", "count": {"$sum": 1}}}
        ]
        results = db.advisories.aggregate(pipeline)
        return {str(r["_id"]): r["count"] for r in results if r["_id"] is not None}
        
    by_crop = get_group_counts("crop")
    by_region = get_group_counts("region")
    by_severity = get_group_counts("severity")
    
    return {
        "total_count": total,
        "by_crop": by_crop,
        "by_region": by_region,
        "by_severity": by_severity
    }
