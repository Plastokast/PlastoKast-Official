import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import os
import sys
from datetime import datetime

# Load environment & MongoDB
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

import db

PORT = int(os.getenv("PORT", 8000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def forward_to_email_service(recipient, subject, body, inquiry_data):
    try:
        # Construct form submit payload
        payload = {
            "name": inquiry_data.get("name", "Customer Inquiry"),
            "email": inquiry_data.get("email", "customer@plastokast.com"),
            "phone": inquiry_data.get("phone", "N/A"),
            "_subject": subject,
            "facility": inquiry_data.get("facility", "N/A"),
            "country": inquiry_data.get("country", "N/A"),
            "customerType": inquiry_data.get("customerType", "General"),
            "trackingId": inquiry_data.get("trackingId", "PK-INQ"),
            "message": inquiry_data.get("message", "N/A"),
            "_template": "table",
            "_captcha": "false",
            "formatted_inquiry_details": body
        }
        
        encoded_data = urllib.parse.urlencode(payload).encode('utf-8')
        target_url = f"https://formsubmit.co/{recipient}"
        
        req = urllib.request.Request(
            target_url,
            data=encoded_data,
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlastoKast/1.0'
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            sys.stdout.buffer.write(f"\n[FormSubmit Auto-Dispatch SUCCESS] Sent to {recipient} - Status {resp.status}\n".encode('utf-8'))
            sys.stdout.flush()
            return True
    except Exception as e:
        sys.stdout.buffer.write(f"\n[FormSubmit Auto-Dispatch Warning] {e}\n".encode('utf-8'))
        sys.stdout.flush()
        return False

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/db-status':
            status_data = db.check_db_status()
            self._send_json(200, status_data)
            return

        elif path == '/api/inquiries':
            inquiries = db.get_all_inquiries(limit=50)
            self._send_json(200, {"status": "success", "count": len(inquiries), "inquiries": inquiries})
            return

        elif path == '/api/products':
            products = db.get_all_products()
            self._send_json(200, {"status": "success", "count": len(products), "products": products})
            return

        else:
            return super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ['/api/send-inquiry', '/api/inquiries']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                recipient = data.get('recipientEmail', 'plastokast.sales@gmail.com')
                subject = data.get('subject', 'New Product Inquiry')
                body = data.get('body', '')

                # 1. Save directly into MongoDB
                saved_record = db.save_inquiry(data)
                mongo_id = saved_record.get("_id")

                sys.stdout.buffer.write(b"\n====================================================\n")
                sys.stdout.buffer.write(b"   INCOMING PLASTOKAST INQUIRY (SAVED IN MONGODB)\n")
                sys.stdout.buffer.write(b"====================================================\n")
                sys.stdout.buffer.write(f"TRACKING ID : {data.get('trackingId', 'N/A')}\n".encode('utf-8'))
                sys.stdout.buffer.write(f"MONGODB ID  : {mongo_id}\n".encode('utf-8'))
                sys.stdout.buffer.write(f"CUSTOMER    : {data.get('name', 'N/A')} ({data.get('email', 'N/A')})\n".encode('utf-8'))
                sys.stdout.buffer.write(f"FACILITY    : {data.get('facility', 'N/A')} ({data.get('country', 'N/A')})\n".encode('utf-8'))
                sys.stdout.buffer.write(f"SUBJECT     : {subject}\n".encode('utf-8'))
                sys.stdout.buffer.write(b"----------------------------------------------------\n")
                sys.stdout.buffer.write(f"{body}\n".encode('utf-8'))
                sys.stdout.buffer.write(b"====================================================\n\n")
                sys.stdout.flush()

                # 2. Dispatch real email via FormSubmit auto-forwarder
                email_sent = forward_to_email_service(recipient, subject, body, data)

                res = {
                    "status": "success",
                    "trackingId": data.get("trackingId"),
                    "mongoId": str(mongo_id) if mongo_id else None,
                    "recipient": recipient,
                    "emailSent": email_sent,
                    "dbStored": mongo_id is not None,
                    "message": f"Inquiry recorded in database and dispatched to {recipient}"
                }
                self._send_json(200, res)
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/seed-products':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                products = data.get("products", [])
                count = db.seed_products_collection(products)
                self._send_json(200, {"status": "success", "seededCount": count})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/upload-image':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                import cloudinary_service
                data = json.loads(post_data.decode('utf-8'))
                image_data = data.get("image")
                folder = data.get("folder", "plastokast/products")
                public_id = data.get("publicId")

                if not image_data:
                    self._send_json(400, {"status": "error", "error": "No image data provided"})
                    return

                cdn_url = cloudinary_service.upload_image_file(image_data, folder=folder, public_id=public_id)
                if cdn_url:
                    self._send_json(200, {"status": "success", "url": cdn_url})
                else:
                    self._send_json(500, {"status": "error", "error": "Cloudinary upload returned null"})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/inquiries/update-status':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                inquiry_id = data.get("id")
                new_status = data.get("status")
                updated = db.update_inquiry_status(inquiry_id, new_status)
                self._send_json(200, {"status": "success", "updated": updated})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/inquiries/delete':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                ids = data.get("ids", [])
                if isinstance(ids, str):
                    ids = [ids]
                deleted_count = db.delete_inquiries(ids)
                self._send_json(200, {"status": "success", "deletedCount": deleted_count})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/products/save':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                saved = db.save_or_update_product(data)
                self._send_json(200, {"status": "success", "product": saved})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return

        elif path == '/api/products/delete':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                pid = data.get("id")
                deleted = db.delete_product(pid)
                self._send_json(200, {"status": "success", "deleted": deleted})
                return
            except Exception as e:
                self._send_json(500, {"status": "error", "error": str(e)})
                return
        else:
            return super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), CustomHandler)
    print(f"==================================================", flush=True)
    print(f"  PlastoKast Server Live: http://127.0.0.1:{PORT}", flush=True)
    print(f"  MongoDB Status API   : http://127.0.0.1:{PORT}/api/db-status", flush=True)
    print(f"  Inquiries API (Leads): http://127.0.0.1:{PORT}/api/inquiries", flush=True)
    print(f"  Products API Catalog : http://127.0.0.1:{PORT}/api/products", flush=True)
    print(f"==================================================", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
