"""
fix_logo_case.py - Fixes case-sensitivity of logo.png across all HTML/JS files.
"""

import os

def fix():
    count = 0
    for root, _, files in os.walk("."):
        if any(skip in root for skip in [".git", ".gemini", "brain"]):
            continue
        for file in files:
            if file.endswith((".html", ".js", ".css")):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                if "assets/images/Logo.png" in content:
                    content = content.replace("assets/images/Logo.png", "assets/images/logo.png")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Fixed logo.png casing in: {path}")
                    count += 1
    print(f"Updated {count} files with lowercase logo.png.")

if __name__ == "__main__":
    fix()
