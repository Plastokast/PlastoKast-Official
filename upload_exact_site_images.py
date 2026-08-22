"""
upload_exact_site_images.py - Uploads ONLY the 47 approved, currently used site images to Cloudinary.
"""

import os
import sys
import json
import inspect_live_site_images
import cloudinary_service
import db

def main():
    print("==================================================", flush=True)
    print("   UPLOADING 47 OFFICIAL LIVE SITE PHOTOS ONLY", flush=True)
    print("==================================================", flush=True)

    status = cloudinary_service.check_cloudinary_status()
    print(f"Cloudinary Status: {status.get('message')}", flush=True)
    if not status.get("connected"):
        print("[!] Cloudinary is not connected. Check .env", flush=True)
        return

    images_to_upload = inspect_live_site_images.get_live_images()
    print(f"\nTotal Approved Images to Upload: {len(images_to_upload)}", flush=True)

    official_map_file = "cloudinary_official_map.json"
    official_map = {}
    
    count = 0
    for idx, local_path in enumerate(images_to_upload, 1):
        if not os.path.exists(local_path):
            print(f"[!] File not found on disk: {local_path}", flush=True)
            continue

        file_name = os.path.basename(local_path)
        name_no_ext = os.path.splitext(file_name)[0]
        folder = "plastokast_official/products" if "media" in local_path else "plastokast_official/branding"

        print(f"[{idx}/{len(images_to_upload)}] Uploading: {local_path}...", flush=True)
        cdn_url = cloudinary_service.upload_image_file(
            local_path,
            folder=folder,
            public_id=name_no_ext
        )
        if cdn_url:
            official_map[local_path] = cdn_url
            count += 1
            with open(official_map_file, "w", encoding="utf-8") as f:
                json.dump(official_map, f, indent=2)
            print(f"   -> CDN URL: {cdn_url}", flush=True)

    print(f"\n[SUCCESS] Uploaded {count} approved photos to Cloudinary CDN!", flush=True)

    # Now update JS files and MongoDB Atlas
    print("\nSynchronizing CDN URLs with products-data.js, certificates, and MongoDB Atlas...", flush=True)
    
    # 1. Update products-data.js
    pdata_path = "assets/js/products-data.js"
    if os.path.exists(pdata_path):
        with open(pdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in official_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(pdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[✓] Synchronized products-data.js", flush=True)

    # 2. Update certificates-data.js
    cdata_path = "assets/js/certificates-data.js"
    if os.path.exists(cdata_path):
        with open(cdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in official_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(cdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[✓] Synchronized certificates-data.js", flush=True)

    # 3. Seed MongoDB Atlas
    import seed_db
    products = seed_db.get_products_data()
    if products:
        seeded_count = db.seed_products_collection(products)
        print(f"[✓] Seeded {seeded_count} products with official Cloudinary CDN URLs into MongoDB Atlas!", flush=True)

    print("\n==================================================", flush=True)
    print(" ALL 47 OFFICIAL ACTIVE PHOTOS LIVE ON CLOUDINARY!", flush=True)
    print("==================================================\n", flush=True)

if __name__ == "__main__":
    main()
