import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE") or os.getenv("DB_DATABASE") or "medicard"

if not MONGODB_URI:
	raise RuntimeError("MONGODB_URI or MONGODB_URL must be set")

client = MongoClient(MONGODB_URI)
database = client[MONGODB_DATABASE]

patient_faces_collection = database["patient_faces"]
