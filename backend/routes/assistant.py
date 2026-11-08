import random
import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from config import GEMINI_API_KEY

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

# ---------------------------------------------------------------------------
# Predefined safety knowledge base (demo / no API key required)
# ---------------------------------------------------------------------------
SAFETY_KNOWLEDGE: dict[str, list[str]] = {
    "rain": [
        "🌧️ **Rain Safety Tips:**\n- Reduce speed by at least 30% on wet roads.\n- Increase following distance – braking takes longer on wet surfaces.\n- Avoid waterlogged underpasses; water depth is deceptive.\n- Keep your phone in a waterproof pouch.\n- Wear a bright, reflective rain jacket for visibility.\n- If lightning is present, avoid open elevated areas.",
        "🌧️ During heavy rain, delivery partners should:\n- Check the SafeRoute hazard map for flood-reported zones.\n- Use alternative routes if your usual path has known waterlogging.\n- Notify dispatch if conditions feel unsafe – your safety comes first.\n- Keep the delivery bag sealed to protect food quality.",
    ],
    "flood": [
        "🚨 **Flood & Waterlogging Advisory:**\n- Never attempt to cross flooded roads – 15 cm of fast-moving water can knock you over.\n- If your vehicle stalls in water, do not restart it – exit calmly.\n- Report flooded spots on the SafeRoute hazard map to protect other partners.\n- Contact Swiggy support if you need to cancel a delivery due to flooding.",
        "🚨 Waterlogging hazard detected in your area:\n- Use elevated parallel roads wherever possible.\n- Watch for open manholes hidden under floodwater.\n- Keep emergency contacts ready (see the Emergency tab).",
    ],
    "night": [
        "🌙 **Night Delivery Safety:**\n- Wear a reflective vest – it dramatically increases your visibility to drivers.\n- Keep your headlight clean and fully functional.\n- Stay on well-lit main roads; avoid shortcuts through unlit lanes.\n- Share your live location with a trusted contact.\n- Charge your phone fully before a night shift.",
        "🌙 Night-time precautions:\n- Trust your instincts – if a delivery location feels unsafe, contact Swiggy support.\n- Park in well-lit areas when picking up or delivering.\n- Keep your helmet on at all times.\n- Avoid using headphones so you can hear surrounding traffic.",
    ],
    "road": [
        "🚧 **Road Hazard Guidance:**\n- Report potholes and roadblocks using the Hazard Report tab.\n- For serious road blockages, check Google Maps or Waze for alternate routes.\n- If a route is completely blocked, contact Swiggy support to reroute the order.\n- Never overtake on blind curves even when in a hurry.",
    ],
    "emergency": [
        "🆘 **Emergency Protocol:**\n- Call 112 (India's unified emergency number) for police, fire, or ambulance.\n- Swiggy Emergency Helpline: 1800-208-9999 (demo number).\n- Use the SOS button in the Emergency tab to send your location to contacts.\n- If you are in an accident, stay calm, move to safety, and call for help.\n- Do not move an injured person unless they are in immediate danger.",
    ],
    "helmet": [
        "⛑️ **Helmet & Gear Reminders:**\n- Wearing a helmet reduces fatal head injury risk by 69%.\n- Replace your helmet after any significant impact, even if it looks fine.\n- Check your two-wheeler's tyre pressure daily – low pressure increases braking distance.\n- Brakes, lights and indicators should be checked weekly.",
    ],
    "weather": [
        "🌤️ **General Weather Safety:**\n- Check the Dashboard weather widget before starting your shift.\n- During extreme heat (above 40°C), hydrate every 20–30 minutes.\n- In fog or mist, use low-beam headlights and reduce speed.\n- Strong winds above 50 km/h make two-wheelers difficult to control – consider pausing.\n- Lightning: seek shelter in a low-lying area away from trees and open fields.",
    ],
    "default": [
        "👋 Hi! I'm the **SafeRoute AI Assistant** (demo mode).\n\nI can help you with:\n- 🌧️ **Rain & flood** safety tips\n- 🌙 **Night delivery** precautions\n- 🚧 **Road hazard** guidance\n- 🆘 **Emergency** protocols\n- ⛑️ **Helmet & gear** reminders\n- 🌤️ **Weather** advice\n\nJust type a question or pick a topic above!",
        "I'm here to keep you safe on every delivery! Ask me about:\n- Rain/flood safety\n- Night riding tips\n- What to do in an emergency\n- Road hazards and reporting\n\n*Note: Responses are pre-programmed safety knowledge – not live AI. Gemini AI integration can be enabled with an API key.*",
    ],
}


def _match_topic(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["rain", "drizzle", "wet", "monsoon", "shower"]):
        return "rain"
    if any(w in msg for w in ["flood", "water", "waterlog", "submerge", "drown"]):
        return "flood"
    if any(w in msg for w in ["night", "dark", "evening", "late", "midnight"]):
        return "night"
    if any(w in msg for w in ["road", "pothole", "block", "construction", "accident", "crash"]):
        return "road"
    if any(w in msg for w in ["emergency", "sos", "help", "danger", "hurt", "injur", "112"]):
        return "emergency"
    if any(w in msg for w in ["helmet", "gear", "tyre", "brake", "bike", "vehicle"]):
        return "helmet"
    if any(w in msg for w in ["weather", "temperature", "wind", "fog", "storm", "thunder"]):
        return "weather"
    return "default"


class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    reply: str
    topic: str
    is_demo: bool = True
    disclaimer: str = "⚠️ Demo mode: responses are pre-programmed safety knowledge, not live AI."


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    # If GEMINI_API_KEY is configured, try live Gemini API first
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = (
                "You are SafeRoute AI, a safety assistant for delivery partners (two-wheeler delivery riders). "
                "Provide concise, actionable, and empathetic delivery safety advice. "
                "Prioritize rider safety, defensive driving, route hazards, and weather precautions. "
                "Keep answers within 3-4 bullet points or short paragraphs.\n\n"
                f"User: {payload.message}"
            )
            body = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=body)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return ChatResponse(
                                reply=text,
                                topic=_match_topic(payload.message),
                                is_demo=False,
                                disclaimer="⚡ Powered by Google Gemini AI."
                            )
        except Exception:
            pass  # Seamlessly fallback to curated safety knowledge base

    # Fallback / Default: Curated delivery safety knowledge base (₹0, no key needed)
    topic = _match_topic(payload.message)
    responses = SAFETY_KNOWLEDGE.get(topic, SAFETY_KNOWLEDGE["default"])
    reply = random.choice(responses)
    return ChatResponse(reply=reply, topic=topic, is_demo=True)

