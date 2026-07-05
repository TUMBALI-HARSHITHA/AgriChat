from pymongo import MongoClient
from app.config import settings

db_name = "agrichat"
mongo_uri = settings.MONGO_URI if settings.MONGO_URI else settings.DATABASE_URL

# Establish MongoClient connection
client = MongoClient(mongo_uri)

# Retrieve the database
# If database name is specified in the connection string path, default to it, otherwise use 'agrichat'
try:
    db = client.get_default_database(default_database=db_name)
except Exception:
    db = client[db_name]

# Auto-increment sequence generator function for MongoDB
def get_next_sequence_value(sequence_name: str) -> int:
    result = db.counters.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=True
    )
    return result["sequence_value"]

# DB Dependency injection helper
def get_db():
    yield db
