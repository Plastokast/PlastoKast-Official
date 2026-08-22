"""
cloudinary_service.py - Cloudinary Image Storage & CDN Integration for PlastoKast
"""

import os
import sys
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

import cloudinary
import cloudinary.uploader
import cloudinary.api

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "975357467874496")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "EdhHOwbHgRbce8kmJ_ijxgvale0")

def init_cloudinary():
    if CLOUDINARY_CLOUD_NAME:
        cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET,
            secure=True
        )
        return True
    return False

def check_cloudinary_status():
    if not init_cloudinary():
        return {
            "configured": False,
            "message": "Cloudinary Cloud Name is missing. Please provide your Cloud Name in .env"
        }
    try:
        res = cloudinary.api.ping()
        return {
            "configured": True,
            "connected": True,
            "cloud_name": CLOUDINARY_CLOUD_NAME,
            "status": res.get("status", "ok"),
            "message": "Cloudinary is active and connected."
        }
    except Exception as e:
        return {
            "configured": True,
            "connected": False,
            "error": str(e),
            "message": f"Cloudinary connection error: {e}"
        }

def upload_image_file(file_path_or_url, folder="plastokast/products", public_id=None):
    """Uploads an image to Cloudinary and returns its secure CDN URL."""
    if not init_cloudinary():
        print("[Cloudinary Warning] Cloudinary not configured with Cloud Name.")
        return None
    try:
        options = {"folder": folder, "resource_type": "image"}
        if public_id:
            options["public_id"] = public_id
        upload_result = cloudinary.uploader.upload(file_path_or_url, **options)
        secure_url = upload_result.get("secure_url")
        print(f"[Cloudinary SUCCESS] Uploaded: {secure_url}")
        return secure_url
    except Exception as e:
        print(f"[Cloudinary ERROR] Upload failed: {e}")
        return None
