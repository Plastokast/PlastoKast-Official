"""
cleanup_unused_local_images.py - Deletes all old/unused local images, keeping only the 47 approved live site images.
"""

import os
import sys
import json
import inspect_live_site_images

def main():
    print("==================================================")
    print("   PLASTOKAST LOCAL IMAGE CLEANUP (ACTIVE ONLY)")
    print("==================================================")

    # 1. Get the authoritative list of 47 approved live images
    approved_live_images = inspect_live_site_images.get_live_images()
    approved_set = set(os.path.abspath(p).lower() for p in approved_live_images)

    # Also keep essential brand icons if any
    essential_keep = [
        "assets/images/logo.png",
        "assets/images/favicon.png",
        "assets/images/favicon-32.png",
        "assets/images/plastokast-logo-light.png",
        "assets/images/plastokast-logo-main.png",
        "assets/images/plastokast-logo-transparent.png",
        "assets/images/about-illustration.jpg",
        "assets/images/iso-13485-certificate.jpg",
        "assets/images/cdsco-certificate.jpg",
        "assets/images/who-gmp-certificate.jpg",
        "assets/images/who-gmp-certificate.png",
        "assets/images/ce-certificate.jpg"
    ]
    for k in essential_keep:
        if os.path.exists(k):
            approved_set.add(os.path.abspath(k).lower())

    # 2. Find all images on disk
    target_dirs = ["media", os.path.join("assets", "images")]
    all_local_images = []
    for tdir in target_dirs:
        if not os.path.exists(tdir):
            continue
        for root, _, files in os.walk(tdir):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico')):
                    rel_path = os.path.join(root, file).replace("\\", "/")
                    all_local_images.append(rel_path)

    active_to_keep = []
    unused_to_delete = []

    for img_path in all_local_images:
        abs_p = os.path.abspath(img_path).lower()
        if abs_p in approved_set:
            active_to_keep.append(img_path)
        else:
            unused_to_delete.append(img_path)

    print(f"\n==================================================")
    print(f" [ACTIVE - KEEPING ON DISK] Total: {len(active_to_keep)} images")
    print(f"==================================================")
    for img in sorted(active_to_keep):
        size_kb = os.path.getsize(img) / 1024
        print(f"  [KEEP]   {img:<45} ({size_kb:.1f} KB)")

    print(f"\n==================================================")
    print(f" [UNUSED - DELETING FROM DISK] Total: {len(unused_to_delete)} images")
    print(f"==================================================")
    total_freed_bytes = 0
    for img in sorted(unused_to_delete):
        size_kb = os.path.getsize(img) / 1024
        total_freed_bytes += os.path.getsize(img)
        print(f"  [DELETE] {img:<45} ({size_kb:.1f} KB)")

    freed_mb = total_freed_bytes / (1024 * 1024)
    print(f"\nStorage space to free: {freed_mb:.2f} MB")

    # Perform Deletion
    deleted_count = 0
    for img in unused_to_delete:
        try:
            os.remove(img)
            deleted_count += 1
        except Exception as e:
            print(f"Error removing {img}: {e}")

    print(f"\n[SUCCESS] Deleted {deleted_count} unused/old images from local disk!")
    print(f"Remaining active local images: {len(active_to_keep)}")
    print("Clean state established successfully.\n")

if __name__ == "__main__":
    main()
