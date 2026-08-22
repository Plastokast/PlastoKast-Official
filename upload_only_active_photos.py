"""
upload_only_active_photos.py - Uploads ONLY the 47 active, approved images to Cloudinary and synchronizes MongoDB Atlas.
"""

import os
import sys
import json
import audit_exact_live_photos
import cloudinary_service
import db

def upload():
    print("==================================================", flush=True)
    print("   UPLOADING 47 ACTIVE LIVE SITE PHOTOS ONLY", flush=True)
    print("==================================================", flush=True)

    status = cloudinary_service.check_cloudinary_status()
    print(f"Cloudinary Status: {status.get('message')}", flush=True)
    if not status.get("connected"):
        print("[!] Cloudinary not connected. Check .env", flush=True)
        return

    # List of 47 approved files
    active_files = audit_exact_live_photos.audit()
    print(f"\nTotal Files to Upload to Cloudinary: {len(active_files)}\n", flush=True)

    mapping = {}
    for idx, path in enumerate(active_files, 1):
        if not os.path.exists(path):
            print(f"[!] Warning: File {path} not found on disk", flush=True)
            continue

        filename = os.path.basename(path)
        name_no_ext = os.path.splitext(filename)[0]
        folder = "plastokast_live/products" if "media" in path else "plastokast_live/branding"

        print(f"[{idx:02d}/{len(active_files)}] Uploading: {path}...", flush=True)
        cdn_url = cloudinary_service.upload_image_file(
            path,
            folder=folder,
            public_id=name_no_ext
        )
        if cdn_url:
            mapping[path] = cdn_url
            print(f"       -> {cdn_url}", flush=True)

    print(f"\n[SUCCESS] Uploaded {len(mapping)} active photos to Cloudinary CDN!", flush=True)

    # 1. Update products-data.js
    pdata_path = "assets/js/products-data.js"
    if os.path.exists(pdata_path):
        with open(pdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in mapping.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(pdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized products-data.js with Cloudinary CDN URLs.", flush=True)

    # 2. Update certificates-data.js
    cdata_path = "assets/js/certificates-data.js"
    if os.path.exists(cdata_path):
        with open(cdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in mapping.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(cdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized certificates-data.js with Cloudinary CDN URLs.", flush=True)

    # 3. Save mapping file
    with open("cloudinary_active_map.json", "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)

    # 4. Update MongoDB Atlas
    import seed_db
    products = seed_db.get_products_data()
    if products:
        seeded_count = db.seed_products_collection(products)
        print(f"[SUCCESS] Seeded {seeded_count} products into MongoDB Atlas with Cloudinary CDN URLs.", flush=True)

    print("\n==================================================", flush=True)
    print(" ONLY ACTIVE 47 PHOTOS UPLOADED AND SYNCHRONIZED", flush=True)
    print("==================================================\n", flush=True)

if __name__ == "__main__":
    upload()
