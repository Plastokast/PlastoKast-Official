"""
upload_clean_local_images_to_cloudinary.py - Uploads the clean set of local site images to Cloudinary and synchronizes MongoDB Atlas.
"""

import os
import sys
import json
import cloudinary_service
import db

def main():
    print("==================================================", flush=True)
    print("   UPLOADING CLEAN CURRENT PHOTOS TO CLOUDINARY", flush=True)
    print("==================================================", flush=True)

    status = cloudinary_service.check_cloudinary_status()
    print(f"Cloudinary Connection: {status.get('message')}", flush=True)
    if not status.get("connected"):
        print("[!] Cloudinary is not connected. Check .env", flush=True)
        return

    # Find all remaining image files in media/ and assets/images/
    target_dirs = ["media", os.path.join("assets", "images")]
    local_images = []
    for tdir in target_dirs:
        if not os.path.exists(tdir):
            continue
        for root, _, files in os.walk(tdir):
            for file in sorted(files):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
                    rel_path = os.path.join(root, file).replace("\\", "/")
                    local_images.append(rel_path)

    print(f"Total Clean Local Images to Upload: {len(local_images)}\n", flush=True)

    cdn_map_file = "cloudinary_official_map.json"
    cdn_map = {}

    count = 0
    for idx, img_path in enumerate(local_images, 1):
        filename = os.path.basename(img_path)
        name_no_ext = os.path.splitext(filename)[0]
        folder = "plastokast/products" if "media" in img_path else "plastokast/branding"

        print(f"[{idx:02d}/{len(local_images)}] Uploading {img_path}...", flush=True)
        cdn_url = cloudinary_service.upload_image_file(
            img_path,
            folder=folder,
            public_id=name_no_ext
        )
        if cdn_url:
            cdn_map[img_path] = cdn_url
            count += 1
            with open(cdn_map_file, "w", encoding="utf-8") as f:
                json.dump(cdn_map, f, indent=2)
            print(f"       -> {cdn_url}", flush=True)

    print(f"\n[SUCCESS] Uploaded {count} clean photos to Cloudinary CDN!", flush=True)

    # 1. Update assets/js/products-data.js
    pdata_path = "assets/js/products-data.js"
    if os.path.exists(pdata_path):
        with open(pdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in cdn_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(pdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized products-data.js with new Cloudinary CDN URLs.", flush=True)

    # 2. Update assets/js/certificates-data.js
    cdata_path = "assets/js/certificates-data.js"
    if os.path.exists(cdata_path):
        with open(cdata_path, "r", encoding="utf-8") as f:
            content = f.read()

        for local_path, cdn_url in cdn_map.items():
            bname = os.path.basename(local_path)
            import re
            pattern = re.compile(r'["\'](?:https://res\.cloudinary\.com/[^"\']+/|media/|assets/images/)' + re.escape(bname) + r'(?:\?[^"\']*)?["\']')
            content = pattern.sub(f'"{cdn_url}"', content)

        with open(cdata_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("[SUCCESS] Synchronized certificates-data.js with new Cloudinary CDN URLs.", flush=True)

    # 3. Update MongoDB Atlas database
    import seed_db
    products = seed_db.get_products_data()
    if products:
        seeded_count = db.seed_products_collection(products)
        print(f"[SUCCESS] Seeded {seeded_count} products into MongoDB Atlas with new Cloudinary CDN URLs.", flush=True)

    print("\n==================================================", flush=True)
    print(" CLOUDINARY CDN & MONGODB ATLAS 100% SYNCHRONIZED", flush=True)
    print("==================================================\n", flush=True)

if __name__ == "__main__":
    main()
