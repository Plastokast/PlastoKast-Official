"""
audit_exact_live_photos.py - Detailed audit of every single photo in active use on the site.
"""

import os
import json
import re

def audit():
    # 1. Products in products-data.js
    with open("assets/js/products-data.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Extract all products
    prod_matches = re.findall(r'id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?images:\s*\[([\s\S]*?)\]', content)
    
    print(f"Total Products in Catalog: {len(prod_matches)}\n")
    product_images = []

    for pid, title, cat, imgs_str in prod_matches:
        imgs = re.findall(r'["\']([^"\']+)["\']', imgs_str)
        print(f"Product [{pid}]: {title} ({cat})")
        for img in imgs:
            # find local counterpart
            bname = os.path.basename(img.split("?")[0])
            local_path = f"media/{bname}"
            if not os.path.exists(local_path):
                local_path = f"assets/images/{bname}"
            
            exists = os.path.exists(local_path)
            size_kb = os.path.getsize(local_path) / 1024 if exists else 0
            print(f"   -> Image: {bname:<35} | Exists: {exists} ({size_kb:.1f} KB)")
            if exists:
                product_images.append(local_path)

    # 2. Certificates
    certs = [
        "assets/images/iso-13485-certificate.jpg",
        "assets/images/cdsco-certificate.jpg",
        "assets/images/who-gmp-certificate.jpg"
    ]
    print("\nCertificates:")
    cert_images = []
    for c in certs:
        exists = os.path.exists(c)
        size_kb = os.path.getsize(c) / 1024 if exists else 0
        print(f"   -> {c:<40} | Exists: {exists} ({size_kb:.1f} KB)")
        if exists:
            cert_images.append(c)

    # 3. Branding & Site Assets
    brand = [
        "assets/images/Logo.png",
        "assets/images/favicon.png",
        "assets/images/about-illustration.jpg"
    ]
    print("\nBranding & Core Site Assets:")
    brand_images = []
    for b in brand:
        exists = os.path.exists(b)
        size_kb = os.path.getsize(b) / 1024 if exists else 0
        print(f"   -> {b:<40} | Exists: {exists} ({size_kb:.1f} KB)")
        if exists:
            brand_images.append(b)

    all_active = list(dict.fromkeys(product_images + cert_images + brand_images))
    print(f"\n==================================================")
    print(f" TOTAL DISTINCT IMAGES IN ACTIVE USE: {len(all_active)}")
    print(f"==================================================")

    return all_active

if __name__ == "__main__":
    audit()
