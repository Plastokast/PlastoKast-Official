"""
seed_db.py - Seeds PlastoKast MongoDB Atlas database with products and certificates.
"""

import os
import sys
import json
import subprocess
import db

def get_products_data():
    """Extracts STATIC_PRODUCTS_DATA from products-data.js using Node.js."""
    js_path = os.path.join(os.path.dirname(__file__), "assets", "js", "products-data.js")
    node_cmd = [
        "node",
        "-e",
        f"""
        global.window = global;
        global.localStorage = {{ getItem: () => null, setItem: () => {{}} }};
        const fs = require('fs');
        let code = fs.readFileSync({json.dumps(js_path)}, 'utf8');
        code = code.replace('const STATIC_PRODUCTS_DATA', 'global.STATIC_PRODUCTS_DATA');
        eval(code);
        console.log(JSON.stringify(global.STATIC_PRODUCTS_DATA));
        """
    ]
    try:
        proc = subprocess.run(node_cmd, capture_output=True, text=True, check=True)
        products = json.loads(proc.stdout)
        return products
    except Exception as e:
        print(f"[Seeder Error] Failed to extract products via Node: {e}")
        return []

def main():
    print("==================================================")
    print("   PLASTOKAST MONGODB ATLAS DATABASE SEEDER")
    print("==================================================")
    
    status = db.check_db_status()
    print(f"Connection Status: {status.get('message')}")
    
    if not status.get("connected"):
        print("\n[!] MongoDB is currently unreachable at configured MONGODB_URI.")
        print(f"    URI: {db.MONGODB_URI}\n")
        return

    products = get_products_data()
    if products:
        count = db.seed_products_collection(products)
        print(f"\n[SUCCESS] Successfully seeded {count} products into MongoDB 'products' collection on Atlas!")
    else:
        print("[!] No products found to seed.")

    print("\nDatabase initialization complete.\n")

if __name__ == "__main__":
    main()
