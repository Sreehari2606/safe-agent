"""
Seed demo hazard data into the database on first run.
All seeded records are flagged is_demo=1 so the UI can label them clearly.
"""
from sqlalchemy.orm import Session
from models.hazard import Hazard, HazardCategory, HazardSeverity, HazardStatus


DEMO_HAZARDS = [
    # Bengaluru area seeds
    {
        "title": "Severe Waterlogging – Silk Board Junction",
        "description": "Road completely submerged after overnight rain. Water depth ~30 cm. Avoid using this route.",
        "category": HazardCategory.waterlogging,
        "severity": HazardSeverity.critical,
        "status": HazardStatus.active,
        "latitude": 12.9177,
        "longitude": 77.6230,
        "location_name": "Silk Board Junction, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 9,
        "cleared_reports": 0,
        "detour_name": "Detour via Outer Ring Road Elevated & BTM 2nd Stage",
        "detour_est_time": "+6 mins (100% dry)",
        "detour_coords": "[[12.9140,77.6180],[12.9160,77.6150],[12.9210,77.6170],[12.9220,77.6240]]",
    },
    {
        "title": "Road Blocked – Koramangala 5th Block",
        "description": "Utility road repair in progress. Expect 2 km detour. Use 80 Feet Road as alternative.",
        "category": HazardCategory.roadblock,
        "severity": HazardSeverity.medium,
        "status": HazardStatus.active,
        "latitude": 12.9344,
        "longitude": 77.6269,
        "location_name": "Koramangala 5th Block, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 6,
        "cleared_reports": 1,
        "detour_name": "Detour via 80 Feet Road & 100 Feet Ring Road",
        "detour_est_time": "+4 mins (smooth traffic)",
        "detour_coords": "[[12.9310,77.6220],[12.9350,77.6210],[12.9380,77.6250],[12.9360,77.6310]]",
    },
    {
        "title": "Poor Lighting – HSR Layout Sector 2",
        "description": "Streetlights non-functional on this stretch. Exercise caution during night deliveries.",
        "category": HazardCategory.poor_lighting,
        "severity": HazardSeverity.medium,
        "status": HazardStatus.active,
        "latitude": 12.9112,
        "longitude": 77.6450,
        "location_name": "HSR Layout Sector 2, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 4,
        "cleared_reports": 0,
        "detour_name": "Detour via 27th Main Well-Lit Commercial Street",
        "detour_est_time": "+2 mins (fully illuminated)",
        "detour_coords": "[[12.9090,77.6420],[12.9120,77.6410],[12.9140,77.6460]]",
    },
    {
        "title": "Flooding – Bellandur Lake Road",
        "description": "Lake overflow has flooded adjacent road. Do not attempt crossing. Use Sarjapur Road instead.",
        "category": HazardCategory.flooding,
        "severity": HazardSeverity.high,
        "status": HazardStatus.active,
        "latitude": 12.9340,
        "longitude": 77.6700,
        "location_name": "Bellandur Lake Road, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 8,
        "cleared_reports": 0,
        "detour_name": "Detour via Sarjapur Main Road & Doddakannelli",
        "detour_est_time": "+7 mins (elevated high ground)",
        "detour_coords": "[[12.9280,77.6650],[12.9310,77.6780],[12.9370,77.6760]]",
    },
    {
        "title": "Construction Zone – Whitefield Main Road",
        "description": "Metro rail construction narrows road to single lane. High congestion 8 AM – 10 PM.",
        "category": HazardCategory.construction,
        "severity": HazardSeverity.low,
        "status": HazardStatus.active,
        "latitude": 12.9698,
        "longitude": 77.7499,
        "location_name": "Whitefield Main Road, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 3,
        "cleared_reports": 0,
        "detour_name": "Detour via ITPL Back Road",
        "detour_est_time": "+3 mins (less congestion)",
        "detour_coords": "[[12.9670,77.7450],[12.9710,77.7440],[12.9730,77.7510]]",
    },
    {
        "title": "Minor Accident – Indiranagar 100 Feet Road",
        "description": "Vehicle collision cleared but road is slippery with oil spill. Slow down.",
        "category": HazardCategory.accident,
        "severity": HazardSeverity.medium,
        "status": HazardStatus.under_review,
        "latitude": 12.9784,
        "longitude": 77.6408,
        "location_name": "Indiranagar 100 Feet Road, Bengaluru",
        "reported_by": "SafeRoute Demo",
        "is_demo": 1,
        "confirmations": 2,
        "cleared_reports": 1,
        "detour_name": "Detour via 12th Main Road",
        "detour_est_time": "+2 mins (clear surface)",
        "detour_coords": "[[12.9750,77.6380],[12.9800,77.6390]]",
    },
]


def seed_demo_data(db: Session) -> None:
    """Insert demo hazards only if no demo records exist yet."""
    existing = db.query(Hazard).filter(Hazard.is_demo == 1).count()
    if existing == 0:
        for data in DEMO_HAZARDS:
            db.add(Hazard(**data))
        db.commit()
        print(f"[SafeRoute] Seeded {len(DEMO_HAZARDS)} demo hazards.")
    else:
        print(f"[SafeRoute] Demo data already present ({existing} records). Skipping seed.")

