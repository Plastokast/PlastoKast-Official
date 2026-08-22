"""
find_active_site_images.py - Accurately extracts ONLY currently used images across products, certificates, and site pages.
"""

import os
import re
import json

def get_clean_active_images():
    active_images = set()

    # 1. Scan products-data.js
    pdata_file = "assets/js/products-data.js"
    if os.path.exists(pdata_file):
        with open(pdata_file, "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r'["\']((?:media|assets/images)/[^"\']+)["\']', content)
            for m in matches:
                clean = m.split("?")[0].strip()
                if os.path.exists(clean):
                    active_images.add(clean)

    # 2. Scan certificates-data.js
    cdata_file = "assets/js/certificates-data.js"
    if os.path.exists(cdata_file):
        with open(cdata_file, "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r'["\']((?:media|assets/images)/[^"\']+)["\']', content)
            for m in matches:
                clean = m.split("?")[0].strip()
                if os.path.exists(clean):
                    active_images.add(clean)

    # 3. Scan all HTML files
    for root, _, files in os.walk("."):
        if ".git" in root or ".gemini" in root or "brain" in root:
            continue
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    matches = re.findall(r'(?:src|href|data-cert-image)=["\']((?:media|assets/images)/[^"\'?#]+)', content)
                    for m in matches:
                        clean = m.strip()
                        if os.path.exists(clean):
                            active_images.add(clean)

    # 4. Scan CSS
    css_file = "assets/css/styles.css"
    if os.path.exists(css_file):
        with open(css_file, "r", encoding="utf-8") as f:
            content = f.read()
            matches = re.findall(r'url\(["\']?(?:\.\./\.\./|\.\./images/|assets/images/|media/)([^"\'?#\)]+)["\']?\)', content)
            for m in matches:
                for prefix in ["assets/images/", "media/"]:
                    candidate = f"{prefix}{m}"
                    if os.path.exists(candidate):
                        active_images.add(candidate)

    sorted_active = sorted(list(active_images))
    print(f"\n==================================================")
    print(f" TOTAL ACTIVE IMAGES CURRENTLY IN USE: {len(sorted_active)}")
    print(f"==================================================")
    for i, img in enumerate(sorted_active, 1):
        size_kb = os.path.getsize(img) / 1024
        print(f"[{i:02d}] {img:<45} ({size_kb:.1f} KB)")

    with open("active_site_images.json", "w", encoding="utf-8") as f:
        json.dump(sorted_active, f, indent=2)

    return sorted_active

if __name__ == "__main__":
    get_clean_active_images()
