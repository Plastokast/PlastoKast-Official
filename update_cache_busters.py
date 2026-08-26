import os
import re

def clean_and_update():
    for root, _, files in os.walk("."):
        if any(skip in root for skip in [".git", ".gemini", "brain"]):
            continue
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Clean and remove email-dispatcher script tags if any
                new_content = re.sub(r'\s*<script src="assets/js/email-dispatcher\.js[^"]*"></script>', '', content)

                # Clean and set uniform version 14300
                new_content = re.sub(r'assets/css/styles\.css(\?[^"]*)?', 'assets/css/styles.css?v=14300', new_content)
                new_content = re.sub(r'assets/css/admin\.css(\?[^"]*)?', 'assets/css/admin.css?v=14300', new_content)
                new_content = re.sub(r'assets/js/main\.js(\?[^"]*)?', 'assets/js/main.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/inquiry-modal\.js(\?[^"]*)?', 'assets/js/inquiry-modal.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/certificates-data\.js(\?[^"]*)?', 'assets/js/certificates-data.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/faq-data\.js(\?[^"]*)?', 'assets/js/faq-data.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/site-settings\.js(\?[^"]*)?', 'assets/js/site-settings.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/email-service\.js(\?[^"]*)?', 'assets/js/email-service.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/firebase-db\.js(\?[^"]*)?', 'assets/js/firebase-db.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-core\.js(\?[^"]*)?', 'assets/js/admin-core.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-faq\.js(\?[^"]*)?', 'assets/js/admin-faq.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-contact\.js(\?[^"]*)?', 'assets/js/admin-contact.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-catalog\.js(\?[^"]*)?', 'assets/js/admin-catalog.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-certificates\.js(\?[^"]*)?', 'assets/js/admin-certificates.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-crm\.js(\?[^"]*)?', 'assets/js/admin-crm.js?v=14300', new_content)
                new_content = re.sub(r'assets/js/admin-auth\.js(\?[^"]*)?', 'assets/js/admin-auth.js?v=14300', new_content)

                if new_content != content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Cleaned and updated tags in {path}")

if __name__ == "__main__":
    clean_and_update()
