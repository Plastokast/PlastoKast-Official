"""
sync_cloudinary_urls.py - Synchronizes official Cloudinary CDN URLs into MongoDB Atlas and site JS data
"""

import os
import sys
import json
import db

def sync():
    map_file = "cloudinary_official_map.json"
    if not os.path.exists(map_file):
        print(f"[Sync Warning] {map_file} does not exist.")
        return

    with open(map_file, "r", encoding="utf-8") as f:
        img_map = json.load(f)

    print(f"Loaded {len(img_map)} Official Cloudinary CDN mappings.")

    # 1. Update assets/js/products-data.js
    js_path = os.path.join("assets", "js", "products-data.js")
    if os.path.exists(js_path):
        with open(js_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in img_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized products-data.js with official Cloudinary CDN URLs.")

    # 2. Update assets/js/certificates-data.js
    cert_js_path = os.path.join("assets", "js", "certificates-data.js")
    if os.path.exists(cert_js_path):
        with open(cert_js_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in img_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(cert_js_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized certificates-data.js with official Cloudinary CDN URLs.")

    # 3. Update MongoDB Atlas
    import seed_db
    products = seed_db.get_products_data()
    if products:
        count = db.seed_products_collection(products)
        print(f"[SUCCESS] Seeded {count} products with official Cloudinary CDN URLs in MongoDB Atlas.")

if __name__ == "__main__":
    sync()
