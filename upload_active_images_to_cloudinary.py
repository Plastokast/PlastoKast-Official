"""
upload_active_images_to_cloudinary.py - Uploads ONLY currently active site images to Cloudinary.
"""

import os
import sys
import json
import cloudinary_service

def upload_active_images():
    print("==================================================", flush=True)
    print("   PLASTOKAST ACTIVE IMAGES CLOUDINARY UPLOADER", flush=True)
    print("==================================================", flush=True)

    status = cloudinary_service.check_cloudinary_status()
    print(f"Cloudinary Status: {status.get('message')}", flush=True)
    if not status.get("connected"):
        print("\n[!] Please verify Cloudinary credentials in .env", flush=True)
        return

    active_file = "active_site_images.json"
    if not os.path.exists(active_file):
        import find_active_site_images
        active_list = find_active_site_images.get_clean_active_images()
    else:
        with open(active_file, "r", encoding="utf-8") as f:
            active_list = json.load(f)

    print(f"Total Active Images to Process: {len(active_list)}", flush=True)

    active_map_file = "cloudinary_active_images_map.json"
    active_map = {}
    if os.path.exists(active_map_file):
        try:
            with open(active_map_file, "r", encoding="utf-8") as f:
                active_map = json.load(f)
        except Exception:
            active_map = {}

    count = 0
    for idx, local_path in enumerate(active_list, 1):
        if not os.path.exists(local_path):
            continue
            
        file_name = os.path.basename(local_path)
        name_no_ext = os.path.splitext(file_name)[0]
        folder = "plastokast_live/products" if "media" in local_path else "plastokast_live/branding"

        print(f"[{idx}/{len(active_list)}] Uploading active image: {local_path}...", flush=True)
        cdn_url = cloudinary_service.upload_image_file(
            local_path,
            folder=folder,
            public_id=name_no_ext
        )
        if cdn_url:
            active_map[local_path] = cdn_url
            count += 1
            with open(active_map_file, "w", encoding="utf-8") as f:
                json.dump(active_map, f, indent=2)
            print(f"   -> URL: {cdn_url}", flush=True)

    print(f"\n[SUCCESS] Uploaded and verified {count} active images on Cloudinary CDN!", flush=True)
    print(f"Saved active mapping registry to: {active_map_file}\n", flush=True)

if __name__ == "__main__":
    upload_active_images()
