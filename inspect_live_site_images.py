"""
inspect_live_site_images.py - Lists the exact active images currently used in products, certificates, and pages.
"""

import os
import json
import re

def get_live_images():
    live_images = {}

    # 1. Read products-data.js
    with open("assets/js/products-data.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Find products and their images
    prod_blocks = re.findall(r'\{\s*id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?images:\s*\[([^\]]+)\]', content)
    for pid, title, imgs_str in prod_blocks:
        imgs = re.findall(r'["\']([^"\']+)["\']', imgs_str)
        clean_imgs = []
        for img in imgs:
            # If it's a Cloudinary URL, extract local basename
            if "cloudinary.com" in img:
                bname = img.split("/")[-1]
                local_candidate = f"media/{bname}"
                if os.path.exists(local_candidate):
                    clean_imgs.append(local_candidate)
                else:
                    clean_imgs.append(img)
            else:
                clean = img.split("?")[0]
                if os.path.exists(clean):
                    clean_imgs.append(clean)
        live_images[f"Product: {title} ({pid})"] = clean_imgs

    # 2. Certificates
    cert_images = [
        "assets/images/iso-13485-certificate.jpg",
        "assets/images/cdsco-certificate.jpg",
        "assets/images/who-gmp-certificate.jpg"
    ]
    live_images["Certificates"] = [c for c in cert_images if os.path.exists(c)]

    # 3. Branding & Site Assets
    brand_images = [
        "assets/images/Logo.png",
        "assets/images/favicon.png",
        "assets/images/about-illustration.jpg"
    ]
    live_images["Branding"] = [b for b in brand_images if os.path.exists(b)]

    all_unique = set()
    for category, img_list in live_images.items():
        for i in img_list:
            if os.path.exists(i):
                all_unique.add(i)

    print(f"==================================================")
    print(f" EXACT ACTIVE APPROVED IMAGES: {len(all_unique)} files")
    print(f"==================================================")
    for cat, img_list in live_images.items():
        print(f"\n{cat}:")
        for img in img_list:
            print(f"  - {img}")

    return sorted(list(all_unique))

if __name__ == "__main__":
    get_live_images()
