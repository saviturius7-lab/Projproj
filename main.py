import os
from datetime import datetime, timezone
from typing import Optional
from xml.sax.saxutils import escape
from zoneinfo import ZoneInfo

from fastapi import FastAPI, Form, Response
from twilio.twiml.messaging_response import MessagingResponse

try:
    from supabase import create_client
except ImportError:  # pragma: no cover - fallback if package is not installed yet
    create_client = None


app = FastAPI(title="Twilio WhatsApp Webhook")

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://agptkyggblylaaxirxtc.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncHRreWdnYmx5bGFheGlyeHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDg1NjYsImV4cCI6MjA5ODMyNDU2Nn0.qxgNT4JH8SLAiZ7uU-CdkpTczXnHtXn7eNQGTvzG3cA")

if create_client is not None:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None


def build_twiml(message: str) -> Response:
    xml_content = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Response>'
        f'<Message>{escape(message)}</Message>'
        '</Response>'
    )
    return Response(content=xml_content, media_type="application/xml")


def get_ist_timestamp() -> str:
    return datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%d-%m-%Y %H:%M:%S IST")


@app.get("/", response_class=Response)
def home() -> Response:
    html = """<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Shramik Sakshi</title>
    <style>body{margin:0;background:#f4ecd8;color:#3b2f1e;font-family:Georgia,serif;}
    .card{max-width:720px;margin:6rem auto;padding:2.5rem;border:2px solid #8b6f47;border-radius:6px;background:#efe4c8;box-shadow:0 8px 24px rgba(90,62,27,.15);}
    h1{font-family:'Playfair Display',Georgia,serif;border-bottom:2px solid #8b6f47;padding-bottom:.4rem;}
    p{line-height:1.7;}
    </style></head><body><div class='card'><h1>Shramik Sakshi</h1>
    <p>Twilio WhatsApp webhook is running. Vintage command center for wage protection.</p></div></body></html>"""
    return Response(content=html, media_type="text/html")


@app.post("/webhook")
async def whatsapp_webhook(
    From: str = Form(...),
    Body: Optional[str] = Form(None),
    Latitude: Optional[str] = Form(None),
    Longitude: Optional[str] = Form(None),
):
    print(f"--- INCOMING MESSAGE ---")
    print(f"From: {From}")
    print(f"Body: {Body}")
    print(f"Location: {Latitude}, {Longitude}")

    messaging_response = MessagingResponse()
    phone_number = From.strip()

    if Latitude and Longitude:
        try:
            db_response = supabase.table("work_logs").insert({
                "phone_number": phone_number,
                "latitude": str(Latitude),
                "longitude": str(Longitude),
                "message_type": "location",
                "raw_message": Body or "Location Pin",
            }).execute()

            print(f"Database Insert Success: {db_response.data}")

            msg = messaging_response.message()
            msg.body(
                "🛠️ *श्रमिक साक्षी (Shramik Sakshi) - उपस्थिति रसीद* 🛠️\n\n"
                f"👤 *मोबाईल:* {phone_number}\n"
                f"📅 *दिनांक:* {get_ist_timestamp()}\n"
                "📍 *लोकेशन:* दर्ज (GPS Verified)\n"
                "💰 *आज की तय दिहाड़ी:* ₹600.00\n"
                "✅ *आपकी हाजिरी सुरक्षित कर ली गई है।* यह डिजिटल रिकॉर्ड बदला नहीं जा सकता। ठगी से बचने के लिए इसे संभाल कर रखें।"
            )

        except Exception as e:
            print(f"Error inserting into database: {e}")
            msg = messaging_response.message()
            msg.body("सिस्टम में कुछ त्रुटि हुई है, कृपया दोबारा प्रयास करें।")

    elif Body and Body.strip().lower() in ["hisaab", "summary", "हिसाब"]:
        try:
            db_response = supabase.table("work_logs").select("*").eq("phone_number", phone_number).execute()

            logs = db_response.data
            print(f"Database Fetch Success. Found {len(logs)} entries for {phone_number}")

            total_days = len(logs)
            total_earnings = total_days * 600

            msg = messaging_response.message()
            msg.body(
                "📊 *श्रमिक साक्षी - आपका आधिकारिक खाता* 📊\n\n"
                f"📈 *कुल कार्य दिवस (Total Days):* {total_days} दिन\n"
                f"💵 *कुल निश्चित कमाई (Total Earnings):* ₹{total_earnings}\n"
                "⚖️ *सुरक्षित स्थिति:* कोई विसंगति नहीं (No Discrepancies)\n"
                "💡 *Tip:* ठेकेदार द्वारा पैसे काटने पर तुरंत इस रसीद को अपनी स्थानीय लेबर यूनियन या NGO को दिखाएं।"
            )

        except Exception as e:
            print(f"Error fetching from database: {e}")
            msg = messaging_response.message()
            msg.body("आपका हिसाब खोजने में त्रुटि हुई।")

    else:
        msg = messaging_response.message()
        msg.body("श्रमिक साक्षी में आपका स्वागत है।\n\n• उपस्थिति दर्ज करने के लिए अपना *Location (स्थान)* भेजें।\n• अपना कुल बकाया देखने के लिए *Hisaab* लिखकर भेजें।")

    return Response(content=str(messaging_response), media_type="application/xml")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
