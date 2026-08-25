import os

def check_files():
    files = [
        "assets/js/faq-data.js",
        "assets/js/site-settings.js",
        "assets/js/admin-faq.js",
        "assets/js/admin-contact.js",
        "assets/js/admin-core.js",
        "admin.html",
        "about.html",
        "index.html",
        "products.html",
        "product-detail.html",
        "contact.html"
    ]
    for f in files:
        if os.path.exists(f):
            print(f"[OK] {f} exists (size: {os.path.getsize(f)} bytes)")
        else:
            print(f"[ERROR] {f} MISSING!")

if __name__ == "__main__":
    check_files()
