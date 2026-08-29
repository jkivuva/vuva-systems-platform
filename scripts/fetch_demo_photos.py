# -*- coding: utf-8 -*-
"""Download curated Pexels photos for the Vuva portfolio demos (self-hosted, CSP-safe).
Each entry: (filename, pexels photo id, category). h=350 keeps files ~15-40KB.
"""
import json
import os
import urllib.request

OUT = os.path.join(os.path.dirname(__file__), "..", "site", "assets", "img", "photos")
os.makedirs(OUT, exist_ok=True)

PHOTOS = [
    # logistics
    ("truck-highway.jpg", 2199293, "logistics"),
    ("truck-fleet.jpg", 93398, "logistics"),
    ("warehouse-shelves.jpg", 4481259, "logistics"),
    ("warehouse-worker.jpg", 4483610, "logistics"),
    ("cargo-containers.jpg", 906494, "logistics"),
    ("delivery-rider.jpg", 4425793, "logistics"),
    ("delivery-van.jpg", 4391479, "logistics"),
    ("port-crane.jpg", 1117210, "logistics"),
    ("forklift.jpg", 1267338, "logistics"),
    ("driver-cab.jpg", 2199293, "logistics"),
    # healthcare
    ("clinic-doctor.jpg", 5215024, "healthcare"),
    ("doctor-patient.jpg", 7578803, "healthcare"),
    ("medical-team.jpg", 5327585, "healthcare"),
    ("lab-samples.jpg", 9545851, "healthcare"),
    ("pharmacy-shelves.jpg", 4173239, "healthcare"),
    ("telehealth.jpg", 4386466, "healthcare"),
    ("dental-chair.jpg", 3845810, "healthcare"),
    ("nurse-tablet.jpg", 5407206, "healthcare"),
    # hospitality
    ("hotel-lobby.jpg", 2034335, "hospitality"),
    ("hotel-room.jpg", 164595, "hospitality"),
    ("hotel-suite.jpg", 271624, "hospitality"),
    ("hotel-pool.jpg", 189296, "hospitality"),
    ("restaurant-dining.jpg", 67468, "hospitality"),
    ("chef-kitchen.jpg", 887827, "hospitality"),
    ("breakfast-tray.jpg", 2456435, "hospitality"),
    ("reception-desk.jpg", 943967, "hospitality"),
    ("event-hall.jpg", 2263436, "hospitality"),
    ("food-pizza.jpg", 315755, "hospitality"),
    # retail
    ("retail-store.jpg", 264636, "retail"),
    ("supermarket-aisle.jpg", 1005638, "retail"),
    ("product-shoes.jpg", 19090, "retail"),
    ("product-watch.jpg", 190819, "retail"),
    ("product-headphones.jpg", 3394650, "retail"),
    ("product-backpack.jpg", 2905238, "retail"),
    ("product-sneaker.jpg", 2529148, "retail"),
    ("product-water.jpg", 1000084, "retail"),
    ("checkout-counter.jpg", 2292919, "retail"),
    ("clothing-rack.jpg", 462410, "retail"),
    ("market-stall.jpg", 264537, "retail"),
    # realestate
    ("apartment-building.jpg", 323780, "realestate"),
    ("house-exterior.jpg", 106399, "realestate"),
    ("living-room.jpg", 1571460, "realestate"),
    ("modern-kitchen.jpg", 1080721, "realestate"),
    ("bedroom-interior.jpg", 1648776, "realestate"),
    ("house-pool.jpg", 32870, "realestate"),
    ("keys-handover.jpg", 2102587, "realestate"),
    ("city-skyline.jpg", 466685, "realestate"),
    # education
    ("classroom-students.jpg", 8471835, "education"),
    ("teacher-board.jpg", 5212345, "education"),
    ("students-laptops.jpg", 1595391, "education"),
    ("library-study.jpg", 256541, "education"),
    ("graduation.jpg", 267885, "education"),
    ("kids-classroom.jpg", 8617942, "education"),
    ("online-learning.jpg", 4145153, "education"),
    # business / finance
    ("meeting-room.jpg", 1181406, "business"),
    ("handshake-deal.jpg", 3184292, "business"),
    ("finance-charts.jpg", 590022, "business"),
    ("cards-payment.jpg", 259200, "business"),
    ("phone-payment.jpg", 6863183, "business"),
    ("office-work.jpg", 373076, "business"),
    ("team-whiteboard.jpg", 3184291, "business"),
    ("documents-signing.jpg", 5904929, "business"),
    ("accountant-desk.jpg", 4386366, "business"),
    ("call-center.jpg", 8867482, "business"),
    ("server-room.jpg", 325229, "business"),
    ("network-cables.jpg", 1148820, "business"),
    ("solar-panels.jpg", 356036, "business"),
    ("farm-field.jpg", 2589457, "business"),
    ("construction-site.jpg", 585418, "business"),
    ("factory-line.jpg", 1267338, "business"),
    ("security-lock.jpg", 5386754, "business"),
    ("data-center.jpg", 1181354, "business"),
    ("voice-headset.jpg", 845451, "business"),
    ("microphone-studio.jpg", 164829, "business"),
    ("documents-pile.jpg", 590016, "business"),
    ("analytics-screen.jpg", 590020, "business"),
    # creative
    ("creative-studio.jpg", 1194420, "creative"),
    ("design-workspace.jpg", 196644, "creative"),
    ("camera-gear.jpg", 122400, "creative"),
    ("art-gallery.jpg", 1674049, "creative"),
    ("stage-lights.jpg", 1105666, "creative"),
    ("neon-installation.jpg", 1938348, "creative"),
    ("print-shop.jpg", 4467739, "creative"),
    ("packaging-boxes.jpg", 4464482, "creative"),
    ("motion-blur-city.jpg", 315938, "creative"),
    ("typography-print.jpg", 1616403, "creative"),
]

manifest = []
for fname, pid, cat in PHOTOS:
    if not isinstance(pid, int):
        print("SKIP bad id:", fname, pid)
        continue
    url = f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&h=350"
    dest = os.path.join(OUT, fname)
    if os.path.exists(dest) and os.path.getsize(dest) > 3000:
        print("cached", fname)
    else:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as resp, open(dest, "wb") as fh:
                fh.write(resp.read())
            print("ok", fname)
        except Exception as e:
            print("FAIL", fname, e)
            continue
    manifest.append({"file": "photos/" + fname, "category": cat, "pexels": pid})

with open(os.path.join(OUT, "manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=1)
print("manifest entries:", len(manifest))
