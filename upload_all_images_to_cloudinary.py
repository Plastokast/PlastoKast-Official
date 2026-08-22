"""
upload_all_images_to_cloudinary.py - Batch upload all local PlastoKast images to Cloudinary CDN
"""

import os
import sys
import json
import cloudinary_service

def scan_and_upload_images():
    print("==================================================", flush=True)
    print("   PLASTOKAST CLOUDINARY BATCH UPLOADER", flush=True)
    print("==================================================", flush=True)

    status = cloudinary_service.check_cloudinary_status()
    print(f"Cloudinary Status: {status.get('message')}", flush=True)
    if not status.get("connected"):
        print("\n[!] Please check that CLOUDINARY_CLOUD_NAME is set in .env", flush=True)
        return

    # Distinct primary images for products and site assets
    base_dirs = ["media", os.path.join("assets", "images")]
    uploaded_map = {}
    
    map_file = "cloudinary_images_map.json"
    if os.path.exists(map_file):
        try:
            with open(map_file, "r", encoding="utf-8") as f:
                uploaded_map = json.load(f)
        except Exception:
            uploaded_map = {}

    count = 0
    for bdir in base_dirs:
        if not os.path.exists(bdir):
            continue
        for root, _, files in os.walk(bdir):
            for file in sorted(files):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
                    local_path = os.path.join(root, file).replace("\\", "/")
                    if local_path in uploaded_map:
                        continue
                    
                    folder_name = "plastokast/products" if "media" in local_path else "plastokast/branding"
                    name_without_ext = os.path.splitext(file)[0]
                    
                    print(f"Uploading [{count+1}] {local_path}...", flush=True)
                    cdn_url = cloudinary_service.upload_image_file(
                        local_path,
                        folder=folder_name,
                        public_id=name_without_ext
                    )
                    if cdn_url:
                        uploaded_map[local_path] = cdn_url
                        count += 1
                        # Save mapping on every upload for durability
                        with open(map_file, "w", encoding="utf-8") as f:
                            json.dump(uploaded_map, f, indent=2)
                        print(f" -> CDN URL: {cdn_url}", flush=True)

    print(f"\n[SUCCESS] Uploaded {count} new images to Cloudinary CDN. Total mapped: {len(uploaded_map)}", flush=True)
    print(f"Saved mapping table to: {map_file}\n", flush=True)

if __name__ == "__main__":
    scan_and_upload_images()
