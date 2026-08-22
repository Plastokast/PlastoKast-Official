"""
db.py - PlastoKast MongoDB Client & Data Layer
Handles connection pooling, inquiries recording, catalog management, and status checks.
"""

import os
import sys
from datetime import datetime
import json

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/plastokast_db")
DB_NAME = os.getenv("DB_NAME", "plastokast_db")

_client = None
_db = None

def get_db():
    """Returns the MongoDB database instance with lazy connection."""
    global _client, _db
    if not PYMONGO_AVAILABLE:
        return None
    
    if _db is not None:
        return _db

    try:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2500)
        # Verify connection
        _client.admin.command('ping')
        _db = _client[DB_NAME]
        print(f"[MongoDB SUCCESS] Connected to database: '{DB_NAME}' via {MONGODB_URI.split('@')[-1] if '@' in MONGODB_URI else MONGODB_URI}")
        return _db
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        print(f"[MongoDB NOTICE] Could not connect to MongoDB ({e}). Running in offline/fallback mode.")
        _client = None
        _db = None
        return None

def check_db_status():
    """Returns database connection diagnostics."""
    db = get_db()
    if db is not None:
        try:
            db.command('ping')
            inq_count = db.inquiries.count_documents({})
            prod_count = db.products.count_documents({})
            return {
                "connected": True,
                "database": DB_NAME,
                "uri_target": MONGODB_URI.split('@')[-1] if '@' in MONGODB_URI else MONGODB_URI,
                "inquiries_count": inq_count,
                "products_count": prod_count,
                "message": "MongoDB is active and responding."
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "message": "MongoDB connection verification failed."
            }
    return {
        "connected": False,
        "database": DB_NAME,
        "message": "MongoDB is currently disconnected or in offline fallback mode."
    }

def save_inquiry(inquiry_dict):
    """
    Saves an inquiry / quote request document to the 'inquiries' collection in MongoDB.
    """
    db = get_db()
    
    # Enrich with metadata
    record = dict(inquiry_dict)
    if "createdAt" not in record:
        record["createdAt"] = datetime.utcnow().isoformat() + "Z"
    if "status" not in record:
        record["status"] = "new"  # new | reviewed | contacted | closed
        
    if db is not None:
        try:
            result = db.inquiries.insert_one(record)
            record["_id"] = str(result.inserted_id)
            print(f"[MongoDB SUCCESS] Saved inquiry with ID: {result.inserted_id} (Tracking: {record.get('trackingId', 'N/A')})")
            return record
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to save inquiry: {e}")
            
    return record

def get_all_inquiries(limit=100, status_filter=None):
    """Retrieves all inquiries from MongoDB."""
    db = get_db()
    if db is not None:
        try:
            query = {}
            if status_filter:
                query["status"] = status_filter
            cursor = db.inquiries.find(query).sort("createdAt", -1).limit(limit)
            items = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                items.append(doc)
            return items
        except Exception as e:
            print(f"[MongoDB ERROR] Error fetching inquiries: {e}")
    return []

def get_all_products():
    """Retrieves all products from MongoDB."""
    db = get_db()
    if db is not None:
        try:
            cursor = db.products.find({})
            items = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                items.append(doc)
            if len(items) > 0:
                return items
        except Exception as e:
            print(f"[MongoDB ERROR] Error fetching products: {e}")
    return []

def seed_products_collection(products_list):
    """Bulk inserts or updates products into the 'products' collection."""
    db = get_db()
    if db is not None and products_list:
        try:
            for p in products_list:
                db.products.update_one(
                    {"id": p.get("id")},
                    {"$set": p},
                    upsert=True
                )
            count = db.products.count_documents({})
            print(f"[MongoDB SUCCESS] Seeded/Updated {len(products_list)} products. Total in DB: {count}")
            return count
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to seed products: {e}")
            return 0
    return 0

def update_inquiry_status(inquiry_id, new_status):
    """Updates the status of an inquiry in MongoDB."""
    db = get_db()
    if db is not None:
        try:
            from bson.objectid import ObjectId
            query = {"$or": [{"id": inquiry_id}, {"trackingId": inquiry_id}]}
            try:
                query["$or"].append({"_id": ObjectId(inquiry_id)})
            except Exception:
                pass
            res = db.inquiries.update_one(query, {"$set": {"status": new_status, "updatedAt": datetime.utcnow().isoformat() + "Z"}})
            return res.modified_count > 0
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to update inquiry status: {e}")
    return False

def delete_inquiries(inquiry_ids):
    """Deletes one or multiple inquiries from MongoDB."""
    db = get_db()
    if db is not None:
        try:
            from bson.objectid import ObjectId
            id_list = []
            for iid in inquiry_ids:
                id_list.append({"id": iid})
                id_list.append({"trackingId": iid})
                try:
                    id_list.append({"_id": ObjectId(iid)})
                except Exception:
                    pass
            res = db.inquiries.delete_many({"$or": id_list})
            return res.deleted_count
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to delete inquiries: {e}")
    return 0

def save_or_update_product(product_dict):
    """Saves or updates a product in MongoDB Atlas."""
    db = get_db()
    if db is not None and product_dict:
        try:
            pid = product_dict.get("id")
            if not pid:
                import uuid
                pid = f"pk-{uuid.uuid4().hex[:8]}"
                product_dict["id"] = pid
            
            db.products.update_one(
                {"id": pid},
                {"$set": product_dict},
                upsert=True
            )
            return product_dict
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to save product: {e}")
    return None

def delete_product(product_id):
    """Deletes a product from MongoDB Atlas."""
    db = get_db()
    if db is not None and product_id:
        try:
            res = db.products.delete_one({"id": product_id})
            return res.deleted_count > 0
        except Exception as e:
            print(f"[MongoDB ERROR] Failed to delete product: {e}")
    return False
