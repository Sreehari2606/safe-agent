// Client-side Safety Knowledge Base (Zero-downtime fallback for deployed frontend)
export const CLIENT_SAFETY_KNOWLEDGE = {
  rain: [
    "🌧️ **Rain Safety Tips:**\n- Reduce speed by at least 30% on wet roads.\n- Increase following distance – braking takes longer on wet surfaces.\n- Avoid waterlogged underpasses; water depth is deceptive.\n- Keep your phone in a waterproof pouch.\n- Wear a bright, reflective rain jacket for visibility.\n- If lightning is present, avoid open elevated areas.",
    "🌧️ During heavy rain, delivery partners should:\n- Check the SafeRoute hazard map for flood-reported zones.\n- Use alternative routes if your usual path has known waterlogging.\n- Notify dispatch if conditions feel unsafe – your safety comes first.\n- Keep the delivery bag sealed to protect food quality.",
  ],
  flood: [
    "🚨 **Flood & Waterlogging Advisory:**\n- Never attempt to cross flooded roads – 15 cm of fast-moving water can knock you over.\n- If your vehicle stalls in water, do not restart it – exit calmly.\n- Report flooded spots on the SafeRoute hazard map to protect other partners.\n- Contact Swiggy support if you need to cancel a delivery due to flooding.",
    "🚨 Waterlogging hazard detected in your area:\n- Use elevated parallel roads wherever possible.\n- Watch for open manholes hidden under floodwater.\n- Keep emergency contacts ready (see the Emergency tab).",
  ],
  night: [
    "🌙 **Night Delivery Safety:**\n- Wear a reflective vest – it dramatically increases your visibility to drivers.\n- Keep your headlight clean and fully functional.\n- Stay on well-lit main roads; avoid shortcuts through unlit lanes.\n- Share your live location with a trusted contact.\n- Charge your phone fully before a night shift.",
    "🌙 Night-time precautions:\n- Trust your instincts – if a delivery location feels unsafe, contact Swiggy support.\n- Park in well-lit areas when picking up or delivering.\n- Keep your helmet on at all times.\n- Avoid using headphones so you can hear surrounding traffic.",
  ],
  road: [
    "🚧 **Road Hazard Guidance:**\n- Report potholes and roadblocks using the Hazard Report tab.\n- For serious road blockages, check Google Maps or Waze for alternate routes.\n- If a route is completely blocked, contact Swiggy support to reroute the order.\n- Never overtake on blind curves even when in a hurry.",
  ],
  emergency: [
    "🆘 **Emergency Protocol:**\n- Call 112 (India's unified emergency number) for police, fire, or ambulance.\n- Swiggy Emergency Helpline: 1800-208-9999 (demo number).\n- Use the SOS button in the Emergency tab to send your location to contacts.\n- If you are in an accident, stay calm, move to safety, and call for help.\n- Do not move an injured person unless they are in immediate danger.",
  ],
  helmet: [
    "⛑️ **Helmet & Gear Reminders:**\n- Wearing a helmet reduces fatal head injury risk by 69%.\n- Replace your helmet after any significant impact, even if it looks fine.\n- Check your two-wheeler's tyre pressure daily – low pressure increases braking distance.\n- Brakes, lights and indicators should be checked weekly.",
  ],
  weather: [
    "🌤️ **General Weather Safety:**\n- Check the Dashboard weather widget before starting your shift.\n- During extreme heat (above 40°C), hydrate every 20–30 minutes.\n- In fog or mist, use low-beam headlights and reduce speed.\n- Strong winds above 50 km/h make two-wheelers difficult to control – consider pausing.\n- Lightning: seek shelter in a low-lying area away from trees and open fields.",
  ],
  default: [
    "👋 Hi! I'm the **SafeRoute AI Assistant**.\n\nI can help you with:\n- 🌧️ **Rain & flood** safety tips\n- 🌙 **Night delivery** precautions\n- 🚧 **Road hazard** guidance\n- 🆘 **Emergency** protocols\n- ⛑️ **Helmet & gear** reminders\n- 🌤️ **Weather** advice\n\nJust type a question or pick a topic above!",
  ],
};

export function getClientSafetyResponse(message) {
  const msg = (message || '').toLowerCase();
  let topic = 'default';
  if (['rain', 'drizzle', 'wet', 'monsoon', 'shower'].some(w => msg.includes(w))) topic = 'rain';
  else if (['flood', 'water', 'waterlog', 'submerge', 'drown'].some(w => msg.includes(w))) topic = 'flood';
  else if (['night', 'dark', 'evening', 'late', 'midnight'].some(w => msg.includes(w))) topic = 'night';
  else if (['road', 'pothole', 'block', 'construction', 'accident', 'crash'].some(w => msg.includes(w))) topic = 'road';
  else if (['emergency', 'sos', 'help', 'danger', 'hurt', 'injur', '112'].some(w => msg.includes(w))) topic = 'emergency';
  else if (['helmet', 'gear', 'tyre', 'brake', 'bike', 'vehicle'].some(w => msg.includes(w))) topic = 'helmet';
  else if (['weather', 'temperature', 'wind', 'fog', 'storm', 'thunder'].some(w => msg.includes(w))) topic = 'weather';

  const list = CLIENT_SAFETY_KNOWLEDGE[topic] || CLIENT_SAFETY_KNOWLEDGE.default;
  const reply = list[Math.floor(Math.random() * list.length)];
  return { reply, topic, is_demo: true };
}
