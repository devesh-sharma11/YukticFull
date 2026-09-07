from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI")
)

db = client[
    os.getenv("DATABASE_NAME")
]

case_studies = db["case_studies"]

feedbacks = db["feedbacks"] 

feedback_requests = db["feedback_requests"]

contact_enquiries = db["contact_enquiries"] 

notifications = db["notifications"]

users = db["users"]

image_library = db.image_library

password_resets = db["password_resets"]

testimonials = db["testimonials"]

jobs = db["jobs"]



