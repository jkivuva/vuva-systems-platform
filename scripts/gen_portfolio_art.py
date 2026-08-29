# -*- coding: utf-8 -*-
"""Generate the Vuva portfolio expansion illustration set.
Tech illustrations follow assets/img/*.svg conventions (dark green-black,
#35e0a1/#40dca9 accent, mono captions). Creative set uses the gold/cream
editorial palette already present on apex.svg (#d9a441 / #faf7f2).
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "site", "assets", "img")

W, H = 800, 500
ACCENT = "#40dca9"
ACCENT_HI = "#7dfcc9"
ACCENT_DIM = "#0a8a63"
MUTED = "#aeb9b4"
LINE = "#33413b"
GOLD = "#d9a441"
CREAM = "#faf7f2"

def head(label):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" aria-label="%s">\n'
        "  <defs>\n"
        '    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">\n'
        '      <stop offset="0" stop-color="#121916"/>\n'
        '      <stop offset="1" stop-color="#0b0f0e"/>\n'
        "    </linearGradient>\n"
        '    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">\n'
        '      <path d="M40 0H0V40" fill="none" stroke="%s" stroke-opacity=".06"/>\n'
        "    </pattern>\n"
        '    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">\n'
        '      <stop offset="0" stop-color="%s"/>\n'
        '      <stop offset="1" stop-color="%s"/>\n'
        "    </linearGradient>\n"
        "  </defs>\n"
        '  <rect width="%d" height="%d" fill="url(#bg)"/>\n'
        '  <rect width="%d" height="%d" fill="url(#grid)"/>\n'
        % (W, H, label, ACCENT, ACCENT, ACCENT_DIM, W, H, W, H)
    )

def creative_head(label):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" aria-label="%s">\n'
        "  <defs>\n"
        '    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">\n'
        '      <stop offset="0" stop-color="#14161b"/>\n'
        '      <stop offset="1" stop-color="#0a0c10"/>\n'
        "    </linearGradient>\n"
        '    <linearGradient id="goldgrad" x1="0" y1="0" x2="0" y2="1">\n'
        '      <stop offset="0" stop-color="#ecc06a"/>\n'
        '      <stop offset="1" stop-color="#a97c2f"/>\n'
        "    </linearGradient>\n"
        '    <radialGradient id="halo" cx=".5" cy=".45" r=".65">\n'
        '      <stop offset="0" stop-color="%s" stop-opacity=".14"/>\n'
        '      <stop offset="1" stop-color="%s" stop-opacity="0"/>\n'
        "    </radialGradient>\n"
        "  </defs>\n"
        '  <rect width="%d" height="%d" fill="url(#cbg)"/>\n'
        '  <rect width="%d" height="%d" fill="url(#halo)"/>\n'
        % (W, H, label, GOLD, GOLD, W, H, W, H)
    )

def cap(x, y, text, anchor="start", color=MUTED, size=15):
    return (
        '<text x="%d" y="%d" text-anchor="%s" fill="%s" font-family="ui-monospace, monospace" font-size="%d">%s</text>\n'
        % (x, y, anchor, color, size, text)
    )

def card(x, y, w, h, stroke=LINE, fill="#101815", sw=1.5, rx=6):
    return '<rect x="%d" y="%d" width="%d" height="%d" rx="%d" fill="%s" stroke="%s" stroke-width="%g"/>\n' % (x, y, w, h, rx, fill, stroke, sw)

def dot(x, y, r=5, color=ACCENT, halo=False):
    out = ""
    if halo:
        out += '<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-opacity=".3"/>\n' % (x, y, r * 2, color)
    return out + '<circle cx="%d" cy="%d" r="%d" fill="%s"/>\n' % (x, y, r, color)

def write(name, body):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(body)
    print("wrote", name, len(body))

TECH = {}

# ---------------------------------------------------------------- fintech
s = head("Fintech payments — mobile money confirmation over a payment rail")
s += card(300, 120, 200, 260, LINE, "#0e1513", 1.5, 14)
s += '<rect x="330" y="150" width="140" height="86" rx="8" fill="#101815" stroke="%s"/>\n' % LINE
s += cap(400, 196, "STK PUSH", "middle")
s += '<path d="M340 262h120M340 286h84" stroke="%s" stroke-width="6" stroke-linecap="round" opacity=".55"/>\n' % ACCENT_DIM
s += '<circle cx="400" cy="330" r="22" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M389 330l8 8 15-16" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="square"/>\n' % ACCENT
s += '<path d="M80 250h130q14 0 24 10l52 52" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>\n' % MUTED
s += '<path d="M590 188h96q14 0 14 14v36" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>\n' % MUTED
for i, y in enumerate((160, 210, 260)):
    s += card(60, y - 22, 110, 44)
    s += cap(115, y + 5, ["PAYBILL", "WALLET", "BANK"][i], "middle", MUTED, 13)
for i, y in enumerate((170, 230)):
    s += card(600, y - 20, 150, 46)
    s += cap(675, y + 5, ["LEDGER ENTRY", "RECONCILED"][i], "middle", MUTED, 13)
s += '<path d="M212 250h56v-62h320" fill="none" stroke="%s" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="70 700"/>\n' % ACCENT
s += dot(588, 188, 6, ACCENT, True)
s += cap(60, 420, "MPESA / CARD / LEDGER · ONE RAIL")
s += "</svg>"
TECH["fintech"] = s

# ---------------------------------------------------------------- education
s = head("Education platform — school portal with classes, fees and results")
s += card(90, 100, 240, 300, LINE, "#0e1513", 1.5, 12)
s += cap(120, 138, "TERM 2 · TIMETABLE")
for i in range(5):
    yy = 158 + i * 44
    s += card(112, yy, 196, 32, LINE, "#111a16", 1, 4)
    s += '<rect x="112" y="%d" width="%d" height="32" rx="4" fill="%s" opacity="%s"/>\n' % (yy, [196, 150, 176, 120, 164][i], ACCENT, ".18")
    s += cap(124, yy + 21, ["MATH 8A", "ENG 7B", "SCI 8A", "KIS 7B", "SST 8A"][i], "start", MUTED, 12)
s += card(430, 130, 290, 180, LINE, "#0e1513", 1.5, 12)
s += cap(460, 162, "FEES · LIVE")
s += '<polyline points="450,270 495,252 540,262 585,232 630,244 675,214" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<polyline points="450,292 495,280 540,286 585,272 630,280 675,262" fill="none" stroke="%s" stroke-width="2" opacity=".55"/>\n' % ACCENT_DIM
s += dot(675, 214, 5, ACCENT, True)
s += card(430, 340, 290, 60, LINE, "#111a16", 1, 8)
s += cap(452, 377, "RESULTS SMS + PORTAL")
s += '<path d="M330 250h72" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += "</svg>"
TECH["education"] = s

# ---------------------------------------------------------------- manufacturing
s = head("Manufacturing production monitoring — conveyor line with station sensors")
s += '<path d="M60 320h680" stroke="%s" stroke-width="3"/>\n' % LINE
s += '<circle cx="120" cy="344" r="16" fill="none" stroke="%s" stroke-width="3"/>\n<circle cx="120" cy="344" r="4" fill="%s"/>\n' % (ACCENT, ACCENT)
s += '<circle cx="680" cy="344" r="16" fill="none" stroke="%s" stroke-width="3"/>\n<circle cx="680" cy="344" r="4" fill="%s"/>\n' % (ACCENT, ACCENT)
for i in range(6):
    xx = 170 + i * 92
    s += '<rect x="%d" y="282" width="54" height="38" fill="url(#acc)" opacity=".85"/>\n' % xx
    s += '<path d="M%d 282h54" stroke="%s" stroke-width="2"/>\n' % (xx, ACCENT_HI)
    if i < 5:
        s += '<path d="M%d 301h38" stroke="%s" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round"/>\n' % (xx + 54, MUTED)
for i, xx in enumerate((196, 380, 564)):
    s += '<path d="M%d 190v64" stroke="%s" stroke-width="2.5"/>\n<circle cx="%d" cy="184" r="7" fill="none" stroke="%s" stroke-width="2.5"/>\n' % (xx, MUTED, xx, ACCENT)
    s += cap(xx + 14, 178, ["STN A", "STN B", "QC"][i], "start", MUTED, 13)
s += card(520, 90, 220, 66, LINE, "#0e1513")
s += cap(540, 118, "OUTPUT TODAY", MUTED, 13)
s += cap(540, 144, "1,842 UNITS", ACCENT, 19)
s += '<path d="M120 430h560" stroke="%s" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>\n' % LINE
s += cap(60, 464, "DOWNTIME ALERTS -> SHIFT SUPERVISOR")
s += "</svg>"
TECH["manufacturing"] = s

# ---------------------------------------------------------------- construction
s = head("Construction project system — site progress, milestones and materials")
s += '<path d="M120 400V150h14v250M134 170l150 40M134 210l150 40" stroke="%s" stroke-width="4" fill="none"/>\n' % ACCENT
s += '<path d="M284 210v-60h44" stroke="%s" stroke-width="4" fill="none"/>\n' % ACCENT
s += '<path d="M284 152l-20 18" stroke="%s" stroke-width="3"/>\n' % CREAM
s += '<rect x="296" y="146" width="40" height="26" fill="none" stroke="%s" stroke-width="3"/>\n' % CREAM
s += '<path d="M104 400h48v-24h-48z" fill="%s" opacity=".85"/>\n' % ACCENT
for i in range(4):
    xx = 400 + i * 84
    hh = [70, 120, 95, 150][i]
    s += '<rect x="%d" y="%d" width="56" height="%d" fill="none" stroke="%s" stroke-width="3"/>\n' % (xx, 400 - hh, hh, LINE)
    s += '<rect x="%d" y="%d" width="56" height="%d" fill="url(#acc)" opacity=".35"/>\n' % (xx, 400 - hh, int(hh * .7))
s += card(480, 90, 260, 74, LINE, "#0e1513")
s += cap(502, 118, "PHASE 3 · STRUCTURE", MUTED, 13)
s += '<rect x="502" y="132" width="216" height="8" fill="none" stroke="%s"/>\n' % LINE
s += '<rect x="502" y="132" width="142" height="8" fill="%s"/>\n' % ACCENT
s += cap(60, 464, "MATERIALS · SUBCONTRACTORS · SNAG LISTS")
s += "</svg>"
TECH["construction"] = s

# ---------------------------------------------------------------- agriculture
s = head("Agri supply system — farm field rows with sensors and collection routes")
for i in range(5):
    off = i * 34
    s += '<path d="M%d 420 C %d 330 %d 250 %d 120" fill="none" stroke="%s" stroke-width="3" opacity="%s"/>\n' % (140 + off, 240 + off, 300 + off, 420 + off, ACCENT_DIM if i % 2 else ACCENT, ".9" if i % 2 else "1")
for i, (xx, yy) in enumerate(((210, 300), (310, 220), (410, 300))):
    s += '<rect x="%d" y="%d" width="8" height="26" fill="%s"/>\n<path d="M%d %dh26M%d %dv-16" stroke="%s" stroke-width="2.5"/>\n' % (xx, yy, MUTED, xx - 5, yy + 4, xx + 4, yy - 4, ACCENT)
    s += dot(xx + 8, yy - 20, 4, ACCENT)
s += '<path d="M470 150 q60 -40 130 -10 t150 30" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round"/>\n' % MUTED
s += card(470, 220, 250, 120, LINE, "#0e1513")
s += cap(494, 252, "COOP INTAKE · TODAY", MUTED, 13)
s += cap(494, 286, "4.2 TONNES", ACCENT, 22)
s += cap(494, 314, "GRADE A 68% · GRADE B 32%", MUTED, 13)
s += cap(60, 464, "FIELD -> STORE -> BUYER · ONE RECORD")
s += "</svg>"
TECH["agriculture"] = s

# ---------------------------------------------------------------- energy
s = head("Energy and utilities monitoring — solar generation feeding the grid")
s += '<path d="M120 360l70-110 70 110z" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M155 305h70M190 250v110" stroke="%s" stroke-width="2" opacity=".6"/>\n' % LINE
s += '<path d="M190 360v60" stroke="%s" stroke-width="4"/>\n' % MUTED
s += '<path d="M420 420v-180m-46 40h92m-92 40h92m-46-140v60" stroke="%s" stroke-width="4" fill="none"/>\n' % MUTED
s += '<path d="M374 280l-46-46m138 46l46-46M420 240l-60-60m120 60l60-60" stroke="%s" stroke-width="2" opacity=".7"/>\n' % MUTED
s += '<path d="M260 350q80 -60 160 -40" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="60 500" stroke-linecap="round"/>\n' % ACCENT
s += dot(420, 306, 6, ACCENT, True)
s += card(560, 120, 200, 150, LINE, "#0e1513")
s += cap(582, 152, "GRID LOAD", MUTED, 13)
s += '<polyline points="580,240 610,222 640,230 670,204 700,214 730,186" fill="none" stroke="%s" stroke-width="3"/>\n' % GOLD
s += cap(582, 264, "82% RENEWABLE NOW", ACCENT, 15)
s += cap(60, 464, "METERING · OUTAGES · PREPAID TOKENS")
s += "</svg>"
TECH["energy"] = s

# ---------------------------------------------------------------- ecommerce
s = head("E-commerce storefront and fulfilment — catalogue to checkout to dispatch")
for i, (xx, yy) in enumerate(((90, 120), (90, 210), (90, 300))):
    s += card(xx, yy, 150, 66)
    s += '<rect x="%d" y="%d" width="46" height="46" rx="4" fill="url(#acc)" opacity=".8"/>\n' % (xx + 10, yy + 10)
    s += '<path d="M%d %dh70M%d %dh34" stroke="%s" stroke-width="6" stroke-linecap="round" opacity=".5"/>\n' % (xx + 68, yy + 24, xx + 68, yy + 38, ACCENT_DIM)
s += card(330, 120, 190, 246, LINE, "#0e1513", 1.5, 10)
s += cap(352, 152, "CHECKOUT")
for i, y in enumerate((172, 208, 244)):
    s += '<rect x="352" y="%d" width="146" height="20" rx="4" fill="#111a16" stroke="%s"/>\n' % (y, LINE)
s += '<rect x="352" y="286" width="146" height="40" rx="6" fill="%s"/>\n' % ACCENT
s += cap(425, 311, "PAY WITH MPESA", "middle", "#06110c", 14)
s += '<path d="M520 243h44" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(570, 150, 180, 200, LINE, "#0e1513", 1.5, 10)
for i, (xx, yy) in enumerate(((592, 176), (652, 176), (592, 240))):
    s += '<rect x="%d" y="%d" width="44" height="44" rx="4" fill="none" stroke="%s" stroke-width="2.5"/>\n<path d="M%d %dl%d 44M%d %dl-%d 44" stroke="%s" stroke-width="1.5"/>\n' % (xx, yy, ACCENT, xx, yy, 44, xx, yy, 44, ACCENT_DIM)
s += cap(592, 322, "DISPATCH BOARD", MUTED, 13)
s += cap(60, 464, "CATALOGUE -> CART -> MPESA -> RIDER")
s += "</svg>"
TECH["ecommerce"] = s

# ---------------------------------------------------------------- crm
s = head("Customer CRM pipeline — leads moving through deal stages")
stages = [("NEW", 90), ("CONTACTED", 250), ("QUOTE", 410), ("WON", 570)]
for name, xx in stages:
    s += '<rect x="%d" y="120" width="130" height="26" rx="6" fill="#101815" stroke="%s"/>\n' % (xx, LINE)
    s += cap(xx + 65, 138, name, "middle", MUTED, 12)
deals = [(100, 190), (170, 240), (255, 205), (330, 260), (425, 195), (500, 250), (585, 215)]
for i, (xx, yy) in enumerate(deals):
    s += card(xx, yy, 106, 54)
    s += dot(xx + 18, yy + 27, 5, ACCENT if i % 2 else ACCENT_DIM)
    s += '<path d="M%d %dh52" stroke="%s" stroke-width="5" stroke-linecap="round" opacity=".45"/>\n' % (xx + 34, yy + 22, ACCENT)
s += '<path d="M220 133h30M380 133h30M540 133h30" stroke="%s" stroke-width="2.5" marker-end="none"/>\n' % MUTED
s += '<path d="M700 133l-12 -8v16z" fill="%s"/>\n' % MUTED
s += card(90, 360, 300, 70, LINE, "#0e1513")
s += cap(112, 388, "PIPELINE VALUE", MUTED, 13)
s += cap(112, 416, "KSh 4.8M", ACCENT, 22)
s += card(430, 360, 280, 70, LINE, "#0e1513")
s += cap(452, 388, "FOLLOW-UPS DUE TODAY", MUTED, 13)
s += cap(452, 416, "9 TASKS QUEUED", ACCENT, 18)
s += "</svg>"
TECH["crm"] = s

# ---------------------------------------------------------------- hris
s = head("HR and payroll system — team roster, leave and payslips")
s += '<path d="M400 130v40m0 0H250v50m150-50h150v50" stroke="%s" stroke-width="2.5" fill="none"/>\n' % LINE
s += card(340, 80, 120, 50, ACCENT, "#10241c", 1.5, 8)
s += cap(400, 110, "HR CORE", "middle", ACCENT_HI, 13)
for xx in (185, 340, 495):
    s += card(xx, 220, 130, 54, LINE, "#0e1513")
    s += dot(xx + 22, 247, 6, ACCENT)
    s += '<path d="M%d 238h70" stroke="%s" stroke-width="5" opacity=".4" stroke-linecap="round"/>\n' % (xx + 40, ACCENT)
    s += '<path d="M%d 256h46" stroke="%s" stroke-width="4" opacity=".25" stroke-linecap="round"/>\n' % (xx + 40, ACCENT)
for i, (name) in enumerate(("LEAVE 6", "ON DUTY 41", "PAYROLL RUN")):
    s += cap(250 + i * 155 - 65, 296 + (0 if i != 1 else 0) + (0 if True else 0), "", "middle", MUTED, 12)
labels = [("LEAVE · 6", 185), ("ON DUTY · 41", 340), ("PAYROLL · RUN", 495)]
for txt, xx in labels:
    s += cap(xx + 65, 300, txt, "middle", MUTED, 12)
s += card(150, 350, 220, 90, LINE, "#0e1513")
s += '<rect x="170" y="370" width="180" height="10" rx="3" fill="%s" opacity=".7"/>\n' % ACCENT_DIM
s += '<rect x="170" y="390" width="130" height="10" rx="3" fill="%s" opacity=".45"/>\n' % ACCENT_DIM
s += '<rect x="170" y="410" width="160" height="10" rx="3" fill="%s" opacity=".3"/>\n' % ACCENT_DIM
s += card(430, 350, 220, 90, LINE, "#0e1513")
s += cap(452, 380, "PAYSLIPS SENT", MUTED, 13)
s += cap(452, 412, "47 / 47 ✓", ACCENT, 20)
s += "</svg>"
TECH["hris"] = s

# ---------------------------------------------------------------- legaltech
s = head("Legal document workspace — contracts with clause review tracking")
s += card(140, 90, 240, 320, LINE, "#0e1513", 1.5, 8)
s += '<path d="M330 90l50 50v270h-240v-320z" fill="#0e1513" stroke="%s" stroke-width="1.5"/>\n' % LINE
s += '<path d="M330 90v50h50" fill="none" stroke="%s" stroke-width="1.5"/>\n' % LINE
for i, (w, hl) in enumerate(((150, False), (170, True), (140, False), (165, True), (120, False), (150, True))):
    yy = 130 + i * 42
    col = GOLD if hl else ACCENT_DIM
    s += '<rect x="165" y="%d" width="%d" height="9" rx="3" fill="%s" opacity="%s"/>\n' % (yy, w, col, ".85" if hl else ".5")
s += '<circle cx="330" cy="356" r="26" fill="none" stroke="%s" stroke-width="2.5"/>\n' % ACCENT
s += '<path d="M318 356l9 9 16-17" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M420 200h60" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(490, 120, 240, 260, LINE, "#0e1513")
s += cap(512, 152, "CLAUSE CHECKS", MUTED, 13)
rows = [("LIABILITY CAP", "OK"), ("TERMINATION", "EDIT"), ("JURISDICTION", "OK"), ("PAYMENT TERMS", "FLAG")]
for i, (nm, st) in enumerate(rows):
    yy = 176 + i * 48
    s += cap(512, yy, nm, "start", MUTED, 13)
    colr = {"OK": ACCENT, "EDIT": GOLD, "FLAG": "#e05a5a"}[st]
    s += '<rect x="666" y="%d" width="44" height="20" rx="10" fill="none" stroke="%s"/>\n' % (yy - 15, colr)
    s += cap(688, yy, st, "middle", colr, 11)
s += cap(60, 464, "DRAFT -> REVIEW -> SIGN · VERSIONED")
s += "</svg>"
TECH["legaltech"] = s

# ---------------------------------------------------------------- booking
s = head("Booking engine — service calendar with confirmed slots and reminders")
s += card(90, 100, 380, 300, LINE, "#0e1513", 1.5, 12)
s += cap(114, 132, "WEEK 34 · BOOKINGS")
days = ["MON", "TUE", "WED", "THU", "FRI"]
for c, d in enumerate(days):
    s += cap(126 + c * 68, 158, d, "middle", MUTED, 11)
booked = {(0, 0): 1, (0, 2): 1, (1, 1): 1, (2, 0): 1, (2, 3): 1, (3, 2): 1, (4, 1): 1, (4, 3): 1}
for r in range(4):
    for c in range(5):
        xx, yy = 108 + c * 68, 174 + r * 52
        key = (r, c)
        if key in booked:
            s += '<rect x="%d" y="%d" width="56" height="40" rx="6" fill="%s" opacity=".85"/>\n' % (xx, yy, ACCENT)
            s += '<path d="M%d %dl8 8l14-14" stroke="#06110c" stroke-width="3" fill="none"/>\n' % (xx + 18, yy + 22)
        else:
            s += '<rect x="%d" y="%d" width="56" height="40" rx="6" fill="none" stroke="%s" stroke-dasharray="3 5"/>\n' % (xx, yy, LINE)
s += card(520, 100, 210, 130, LINE, "#0e1513")
s += cap(542, 130, "FRIDAY 14:30", MUTED, 13)
s += cap(542, 166, "CONFIRMED", ACCENT, 24)
s += cap(542, 198, "SMS + WHATSAPP REMINDER", MUTED, 11)
s += card(520, 260, 210, 140, LINE, "#0e1513")
s += cap(542, 290, "NO-SHOW RATE", MUTED, 13)
s += '<polyline points="540,370 570,352 600,360 630,334 660,344 700,318" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += cap(542, 392, "-31% AFTER REMINDERS", ACCENT, 13)
s += "</svg>"
TECH["booking"] = s

# ---------------------------------------------------------------- queue
s = head("Queue management — live ticket flow from reception to counters")
s += card(90, 140, 170, 220, LINE, "#0e1513", 1.5, 12)
s += cap(175, 172, "TAKE A TICKET", "middle", MUTED, 13)
tickets = ["A-041", "A-042", "A-043"]
for i, t in enumerate(tickets):
    s += '<rect x="118" y="%d" width="114" height="44" rx="6" fill="#111a16" stroke="%s"/>\n' % (192 + i * 52, LINE)
    s += cap(175, 220 + i * 52, t, "middle", ACCENT if i == 0 else MUTED, 17)
for i, (cx, nm) in enumerate(((400, "COUNTER 1"), (550, "COUNTER 2"), (700, "COUNTER 3"))):
    s += card(cx - 55, 150, 110, 120, LINE, "#0e1513")
    s += cap(cx, 182, nm, "middle", MUTED, 12)
    s += cap(cx, 236, ["A-038", "A-039", "A-040"][i], "middle", ACCENT, 22)
    s += '<path d="M260 210h%s" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % ("80" if i == 0 else "", MUTED) if i == 0 else ""
s += '<path d="M262 250q60 40 83 -14" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8"/>\n' % MUTED
s += card(345, 320, 380, 110, LINE, "#0e1513")
s += cap(367, 352, "NOW SERving".upper(), MUTED, 13)
s += '<text x="367" y="400" fill="%s" font-family="ui-monospace, monospace" font-size="30">A-041 · DESK 1</text>\n' % ACCENT
s += cap(60, 464, "TICKETS · WAIT TIMES · STAFF VIEW")
s += "</svg>"
TECH["queue"] = s

# ---------------------------------------------------------------- fleet
s = head("Fleet operations — vehicles, duty status and maintenance alerts")
s += '<rect x="110" y="150" width="220" height="110" rx="14" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M150 150v-24h90l30 24" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<circle cx="160" cy="266" r="18" fill="none" stroke="%s" stroke-width="3"/>\n<circle cx="300" cy="266" r="18" fill="none" stroke="%s" stroke-width="3"/>\n' % (MUTED, MUTED)
s += dot(220, 205, 6, ACCENT, True)
s += cap(220, 130, "KDF 812L · IN TRANSIT", "middle", MUTED, 13)
statuses = [("ON ROUTE", 12, ACCENT), ("LOADED", 7, ACCENT), ("AT DEPOT", 5, GOLD), ("SERVICE", 2, "#e05a5a")]
for i, (nm, n, colr) in enumerate(statuses):
    yy = 150 + i * 56
    s += dot(430, yy - 5, 5, colr)
    s += cap(448, yy, nm, "start", MUTED, 14)
    s += cap(740, yy, str(n).rjust(2), "end", CREAM, 18)
    s += '<path d="M560 %dh150" stroke="%s" stroke-width="8" opacity=".25"/>\n' % (yy - 5, colr)
    s += '<path d="M560 %dh%d" stroke="%s" stroke-width="8"/>\n' % (yy - 5, n * 9, colr)
s += card(110, 330, 300, 100, LINE, "#0e1513")
s += cap(132, 362, "NEXT SERVICE", MUTED, 13)
s += cap(132, 398, "KDF 214X · BRAKE PADS · 14 DAYS", GOLD, 15)
s += cap(60, 464, "GPS · FUEL · DRIVER HOURS · SERVICE")
s += "</svg>"
TECH["fleet"] = s

# ---------------------------------------------------------------- warehouse
s = head("Warehouse management — racked bins, pick paths and stock counts")
for r in range(3):
    xx = 100 + r * 110
    s += '<rect x="%d" y="110" width="14" height="290" fill="%s" opacity=".8"/>\n' % (xx, ACCENT_DIM)
    for lvl in range(4):
        yy = 130 + lvl * 68
        for b in range(2):
            s += '<rect x="%d" y="%d" width="40" height="30" fill="none" stroke="%s" stroke-width="2"/>\n' % (xx + 18, yy, LINE)
            if (r + lvl + b) % 3 != 0:
                s += '<rect x="%d" y="%d" width="40" height="30" fill="%s" opacity=".35"/>\n' % (xx + 18, yy, ACCENT)
s += '<path d="M90 430h330q20 0 20-20v-40q0-20 20-20h250" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="6 7" stroke-linecap="round"/>\n' % ACCENT
dot_seq = [(90, 430), (420, 410), (440, 350), (700, 350)]
for i, (xx, yy) in enumerate(dot_seq):
    s += dot(xx, yy, 6 if i else 5, ACCENT, i == len(dot_seq) - 1)
s += card(520, 110, 220, 160, LINE, "#0e1513")
s += cap(542, 142, "PICK LIST #8841", MUTED, 13)
for i, (nm, q) in enumerate((("SKU 4412 ×6", "A2"), ("SKU 1180 ×12", "C1"), ("SKU 9051 ×2", "D4"))):
    yy = 168 + i * 32
    s += cap(542, yy, nm, "start", MUTED, 13)
    s += cap(720, yy, q, "end", ACCENT, 13)
s += cap(60, 464, "BIN LOCATIONS · CYCLE COUNTS · PICK PATHS")
s += "</svg>"
TECH["warehouse"] = s

# ---------------------------------------------------------------- clearing
s = head("Clearing and forwarding — container port flow with customs release")
for i, (xx, yy) in enumerate(((90, 300), (150, 300), (210, 300), (150, 240), (210, 240), (210, 180))):
    colr = [ACCENT_DIM, ACCENT, GOLD, ACCENT_DIM, ACCENT, ACCENT_DIM][i]
    s += '<rect x="%d" y="%d" width="52" height="24" fill="none" stroke="%s" stroke-width="2.5"/>\n<path d="M%d %dh52" stroke="%s" stroke-width="1.5" opacity=".6"/>\n' % (xx, yy, colr, xx, yy + 12, colr)
s += '<path d="M300 330h140" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += '<path d="M470 250v160h120" fill="none" stroke="%s" stroke-width="3"/>\n' % CREAM
s += '<path d="M470 250h120" fill="none" stroke="%s" stroke-width="3"/>\n' % CREAM
s += cap(530, 236, "CUSTOMS", "middle", MUTED, 12)
s += '<circle cx="530" cy="330" r="26" fill="none" stroke="%s" stroke-width="2.5" transform="rotate(-12 530 330)"/>\n' % ACCENT
s += cap(530, 336, "CLEARED", "middle", ACCENT, 11)
s += '<path d="M640 330h100" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(560, 110, 200, 110, LINE, "#0e1513")
s += cap(582, 140, "SHIPMENT KRA-2214", MUTED, 12)
s += cap(582, 172, "STATUS: RELEASED", ACCENT, 15)
s += cap(582, 198, "DELIVERY THU AM", MUTED, 12)
s += cap(60, 464, "ENTRY -> CUSTOMS -> RELEASE -> DELIVERY")
s += "</svg>"
TECH["clearing"] = s

# ---------------------------------------------------------------- pharmacy
s = head("Pharmacy inventory and dispensing — prescriptions against live stock")
for i in range(5):
    xx = 100 + i * 62
    hh = [70, 96, 60, 110, 84][i]
    s += '<rect x="%d" y="%d" width="34" height="%d" rx="8" fill="none" stroke="%s" stroke-width="2.5"/>\n' % (xx, 330 - hh, hh, ACCENT if i % 2 else ACCENT_DIM)
    s += '<rect x="%d" y="%d" width="34" height="12" rx="4" fill="%s"/>\n' % (xx, 330 - hh - 12, CREAM)
s += '<path d="M80 330h340" stroke="%s" stroke-width="3"/>\n' % LINE
s += card(480, 100, 250, 150, LINE, "#0e1513")
s += cap(502, 132, "PRESCRIPTION RX-88", MUTED, 13)
items = [("AMOXICILLIN 500G", "OK"), ("PARACETAMOL", "LOW"), ("INSULIN", "IN STOCK")]
for i, (nm, st) in enumerate(items):
    yy = 162 + i * 30
    s += cap(502, yy, nm, "start", MUTED, 12)
    colr = ACCENT if st != "LOW" else GOLD
    s += cap(708, yy, st, "end", colr, 12)
s += card(480, 280, 250, 90, LINE, "#0e1513")
s += cap(502, 312, "REORDER SUGGESTED", MUTED, 12)
s += cap(502, 344, "SUPPLIER ORDER DRAFTED", ACCENT, 14)
s += '<path d="M420 200h40" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += cap(60, 464, "PRESCRIBE -> VERIFY -> DISPENSE -> REORDER")
s += "</svg>"
TECH["pharmacy"] = s

# ---------------------------------------------------------------- labdiag
s = head("Laboratory diagnostics — samples tracked from collection to results")
s += '<path d="M90 380h300" stroke="%s" stroke-width="3"/>\n' % LINE
for i in range(5):
    xx = 110 + i * 58
    s += '<path d="M%d 250v100a12 12 0 0 0 24 0v-100z" fill="none" stroke="%s" stroke-width="2.5"/>\n' % (xx, MUTED)
    fill_h = [60, 90, 40, 105, 75][i]
    s += '<path d="M%d %da12 12 0 0 0 24 0v-%dz" fill="%s" opacity=".7"/>\n' % (xx, 350, fill_h, ACCENT if i != 3 else GOLD)
    s += '<rect x="%d" y="238" width="24" height="12" fill="%s"/>\n' % (xx, CREAM)
s += card(470, 110, 250, 160, LINE, "#0e1513")
s += cap(492, 142, "SAMPLE #L-2291", MUTED, 13)
bars = [(.85, ACCENT), (.55, ACCENT_DIM), (.72, ACCENT), (.3, GOLD)]
for i, (v, colr) in enumerate(bars):
    yy = 164 + i * 26
    s += '<rect x="492" y="%d" width="%d" height="10" rx="3" fill="%s"/>\n<rect x="492" y="%d" width="206" height="10" rx="3" fill="none" stroke="%s" opacity=".4"/>\n' % (yy, int(206 * v), colr, yy, LINE)
s += cap(492, 262, "RESULT RANGE WITHIN LIMITS", ACCENT, 12)
s += card(470, 300, 250, 70, LINE, "#0e1513")
s += cap(492, 330, "DOCTOR NOTIFIED · PATIENT SMS", MUTED, 12)
s += cap(492, 354, "READY IN 26 MIN AVG", ACCENT, 14)
s += "</svg>"
TECH["labdiag"] = s

# ---------------------------------------------------------------- clinicops
s = head("Clinic operations — treatment chairs, day sheet and sterilisation loop")
s += '<path d="M120 300q0-60 60-60h80q40 0 40 40v20" fill="none" stroke="%s" stroke-width="3.5"/>\n' % ACCENT
s += '<path d="M160 240l-30-40M260 300h60l30-40" fill="none" stroke="%s" stroke-width="3.5"/>\n' % ACCENT
s += '<circle cx="150" cy="330" r="14" fill="none" stroke="%s" stroke-width="3"/>\n' % MUTED
s += '<circle cx="300" cy="330" r="14" fill="none" stroke="%s" stroke-width="3"/>\n' % MUTED
s += '<path d="M120 360h260" stroke="%s" stroke-width="2.5" opacity=".6"/>\n' % LINE
s += cap(250, 410, "CHAIR 2 · SCALING · 45 MIN", "middle", MUTED, 13)
s += card(470, 100, 250, 300, LINE, "#0e1513")
s += cap(492, 132, "DAY SHEET")
rows = [("09:00 CLEANING", "DONE"), ("09:45 FILLING", "DONE"), ("10:30 IMPLANT", "NOW"), ("11:15 CONSULT", "NEXT")]
for i, (t, st) in enumerate(rows):
    yy = 164 + i * 56
    active = st == "NOW"
    s += card(492, yy - 18, 206, 42, ACCENT if active else LINE, "#111a16" if not active else "#12301f", 1.5 if active else 1, 6)
    s += cap(504, yy + 7, t, "start", MUTED, 12)
    s += cap(686, yy + 7, st, "end", ACCENT if active else MUTED, 12)
s += "</svg>"
TECH["clinicops"] = s

# ---------------------------------------------------------------- telemed
s = head("Telehealth consultation — video visit with vitals stream and e-prescription")
s += card(90, 110, 330, 240, LINE, "#0e1513", 1.5, 12)
s += '<circle cx="200" cy="200" r="42" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M158 268q42-38 84 0" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<rect x="330" y="126" width="76" height="58" rx="6" fill="#111a16" stroke="%s"/>\n' % LINE
s += dot(368, 155, 8, ACCENT_DIM)
s += '<rect x="110" y="292" width="290" height="34" rx="6" fill="#101815" stroke="%s"/>\n' % LINE
s += cap(126, 314, "DR. MWANGI · CARDIOLOGY · LIVE", MUTED, 12)
s += card(470, 110, 250, 150, LINE, "#0e1513")
s += cap(492, 142, "PATIENT VITALS", MUTED, 13)
s += '<polyline points="492,210 512,196 528,224 544,188 560,218 576,192 592,214 608,190 624,220 640,196 660,210 690,204" fill="none" stroke="%s" stroke-width="2.5"/>\n' % ACCENT
s += cap(492, 246, "BP 122/78 · SPO2 98%", ACCENT, 14)
s += card(470, 290, 250, 90, LINE, "#0e1513")
s += cap(492, 320, "E-PRESCRIPTION SENT", MUTED, 13)
s += cap(492, 352, "PHARMACY: WESTLANDS BRANCH", ACCENT, 13)
s += '<path d="M420 230h30" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += "</svg>"
TECH["telemed"] = s

# ---------------------------------------------------------------- insurance
s = head("Insurance claims automation — intake through assessment to settlement")
steps = [("INTAKE", 90), ("ASSESS", 270), ("APPROVE", 450), ("SETTLE", 630)]
for i, (nm, xx) in enumerate(steps):
    s += card(xx, 150, 120, 110, ACCENT if i == 0 else LINE, "#0e1513", 1.5 if i == 0 else 1.2, 10)
    s += cap(xx + 60, 200, str(i + 1).zfill(2), "middle", ACCENT if i == 0 else MUTED, 18)
    s += cap(xx + 60, 228, nm, "middle", MUTED, 12)
    if i < 3:
        s += '<path d="M%d 205h%d" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % (xx + 124, steps[i + 1][1] - xx - 128, MUTED)
s += card(90, 320, 300, 110, LINE, "#0e1513")
s += cap(112, 352, "CLAIM CLM-4471", MUTED, 13)
s += cap(112, 384, "PHOTOS + POLICY CHECK AUTOMATED", MUTED, 12)
s += cap(112, 412, "PAYOUT IN 48H WINDOW", ACCENT, 15)
s += card(430, 320, 320, 110, LINE, "#0e1513")
s += '<path d="M590 342l-38 12v26q0 26 38 40 38-14 38-40v-26z" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += cap(470, 412, "FRAUD FLAGS REVIEWED BY STAFF", MUTED, 12)
s += cap(60, 464, "POLICYHOLDER -> ASSESSOR -> FINANCE")
s += "</svg>"
TECH["insurance"] = s

# ---------------------------------------------------------------- bi
s = head("Business intelligence dashboard — revenue, cohorts and alerts in one view")
s += card(80, 90, 400, 180, LINE, "#0e1513", 1.5, 12)
s += cap(102, 120, "REVENUE VS TARGET", MUTED, 13)
s += '<rect x="102" y="150" width="34" height="90" fill="%s" opacity=".85"/>\n<rect x="148" y="130" width="34" height="110" fill="%s" opacity=".85"/>\n<rect x="194" y="166" width="34" height="74" fill="%s" opacity=".5"/>\n<rect x="240" y="118" width="34" height="122" fill="%s"/>\n<rect x="286" y="142" width="34" height="98" fill="%s" opacity=".85"/>\n<rect x="332" y="126" width="34" height="114" fill="%s" opacity=".85"/>\n' % ((ACCENT_DIM,) * 3 + (ACCENT,) + (ACCENT_DIM,) * 2)
s += '<path d="M119 140l51-16 46 34 46-44 46 20 46-12" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="4 5"/>\n' % GOLD
s += card(520, 90, 200, 180, LINE, "#0e1513", 1.5, 12)
s += cap(542, 120, "SEGMENTS", MUTED, 13)
seg = [(.42, ACCENT), (.31, GOLD), (.27, ACCENT_DIM)]
ang = [-90, 61, 172]
import math
cx, cy, rr = 620, 200, 52
for (frac, colr), a0 in zip(seg, ang):
    a1 = a0 + frac * 360 - 4
    x0, y0 = cx + rr * math.cos(math.radians(a0)), cy + rr * math.sin(math.radians(a0))
    x1, y1 = cx + rr * math.cos(math.radians(a1)), cy + rr * math.sin(math.radians(a1))
    large = 1 if frac > .5 else 0
    s += '<path d="M%d %d A%d %d 0 %d 1 %.1f %.1f" fill="none" stroke="%s" stroke-width="20"/>\n' % (x0, y0, rr, rr, large, x1, y1, colr)
s += card(80, 300, 640, 130, LINE, "#0e1513", 1.5, 12)
alerts = [("WEST REGION HIT QUARTERLY TARGET", ACCENT), ("CHURN RISK: 3 ACCOUNTS IDLE 30 DAYS", GOLD), ("STOCKOUT FORECAST: SKU 4412 FRIDAY", "#e05a5a")]
for i, (txt, colr) in enumerate(alerts):
    yy = 334 + i * 30
    s += dot(106, yy - 5, 4, colr)
    s += cap(124, yy, txt, "start", MUTED, 14)
s += "</svg>"
TECH["bi"] = s

# ---------------------------------------------------------------- dataops
s = head("Data pipelines — source systems flowing into one analytics warehouse")
srcs = [("POS", 110), ("ERP", 190), ("WEB", 270)]
for nm, yy in srcs:
    s += card(80, yy - 24, 110, 48)
    s += cap(135, yy + 5, nm, "middle", MUTED, 14)
    s += '<path d="M190 %dq40 0 60 -30t60 -30" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="1 8" stroke-linecap="round"/>\n' % (yy, ACCENT_DIM)
s += '<ellipse cx="420" cy="220" rx="90" ry="26" fill="none" stroke="%s" stroke-width="2.5"/>\n' % ACCENT
s += '<path d="M330 220v90q0 26 90 26t90-26v-90" fill="none" stroke="%s" stroke-width="2.5"/>\n' % ACCENT
s += '<path d="M330 262q0 26 90 26t90-26" fill="none" stroke="%s" stroke-width="1.5" opacity=".5"/>\n' % ACCENT
s += cap(420, 226, "WAREHOUSE", "middle", MUTED, 13)
s += '<path d="M510 220h60" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8"/>\n' % MUTED
s += card(570, 150, 160, 140, LINE, "#0e1513")
s += cap(650, 186, "REPORTS", "middle", MUTED, 14)
s += cap(650, 216, "+ AI ANSWERS", "middle", ACCENT, 15)
s += cap(650, 248, "DAILY 05:00 SYNC", "middle", MUTED, 11)
s += cap(60, 464, "EXTRACT -> MODEL -> SERVE · ONE TRUTH")
s += "</svg>"
TECH["dataops"] = s

# ---------------------------------------------------------------- iot
s = head("IoT telemetry — field sensors reporting to one gateway")
gw_x, gw_y = 400, 200
for i, (xx, yy) in enumerate(((120, 140), (150, 330), (660, 150), (640, 340))):
    s += '<rect x="%d" y="%d" width="26" height="34" rx="4" fill="none" stroke="%s" stroke-width="2.5"/>\n' % (xx, yy, MUTED)
    s += dot(xx + 13, yy - 8, 4, ACCENT)
    dx, dy = gw_x - xx, gw_y - yy
    s += '<path d="M%d %dQ%d %d %d %d" fill="none" stroke="%s" stroke-width="1.8" stroke-dasharray="1 7"/>\n' % (xx + 13, yy - 12, xx + 13 + dx * .3, yy - 12 + dy * .7, gw_x, gw_y - 40, ACCENT_DIM)
s += card(gw_x - 70, gw_y - 40, 140, 80, ACCENT, "#10241c", 2, 10)
s += cap(gw_x, gw_y - 8, "GATEWAY", "middle", ACCENT_HI, 13)
s += cap(gw_x, gw_y + 16, "UPLINK LIVE", "middle", MUTED, 11)
s += card(560, 400 - 60, 180, 90, LINE, "#0e1513")
s += cap(582, 372, "READINGS TODAY", MUTED, 12)
s += cap(582, 404, "184,220 OK · 3 RETRY", ACCENT, 13)
s += cap(60, 464, "SENSORS -> GATEWAY -> DASHBOARD -> ALERTS")
s += "</svg>"
TECH["iot"] = s

# ---------------------------------------------------------------- aidocs
s = head("Document intelligence — unstructured documents extracted into records")
s += card(80, 110, 190, 260, LINE, "#0e1513", 1.5, 8)
for i, wdt in enumerate((140, 120, 150, 100, 130, 90, 145)):
    yy = 136 + i * 32
    colr = GOLD if i in (1, 4) else ACCENT_DIM
    s += '<rect x="100" y="%d" width="%d" height="8" rx="3" fill="%s" opacity=".6"/>\n' % (yy, wdt, colr)
s += '<path d="M270 240h44" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(314, 170, 150, 140, ACCENT, "#10241c", 2, 10)
s += cap(389, 232, "AI EXTRACT", "middle", ACCENT_HI, 15)
s += cap(389, 258, "FIELDS + TOTALS", "middle", MUTED, 11)
s += '<path d="M464 240h44" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(508, 120, 210, 240, LINE, "#0e1513", 1.5, 8)
s += cap(528, 150, "STRUCTURED RECORD")
for i in range(5):
    yy = 172 + i * 36
    s += '<rect x="528" y="%d" width="64" height="16" rx="3" fill="#111a16" stroke="%s"/>\n' % (yy, LINE)
    s += '<rect x="606" y="%d" width="92" height="16" rx="3" fill="%s" opacity=".5"/>\n' % (yy, ACCENT_DIM)
s += cap(60, 464, "PDF / SCAN / EMAIL -> DATABASE · HUMAN CHECK ON VALUES")
s += "</svg>"
TECH["aidocs"] = s

# ---------------------------------------------------------------- agents
s = head("Agent mesh — specialised AI agents orchestrated around one core")
core_x, core_y = 400, 240
agents = (("CUSTOMER", 400, 90), ("SALES", 620, 170), ("OPS", 620, 320), ("SUPPORT", 400, 396), ("ANALYTICS", 180, 320), ("DOCS", 180, 170))
for nm, xx, yy in agents:
    s += '<path d="M%d %dL%d %d" stroke="%s" stroke-width="1.5" stroke-dasharray="1 7" opacity=".8"/>\n' % (xx, yy, core_x, core_y, ACCENT_DIM)
    bx = xx - 62
    by = yy - 22
    s += card(bx, by, 124, 44, LINE, "#0e1513", 1.2, 8)
    s += cap(xx, yy + 5, nm, "middle", MUTED, 12)
s += '<circle cx="%d" cy="%d" r="46" fill="#10241c" stroke="%s" stroke-width="2.5"/>\n' % (core_x, core_y, ACCENT)
s += '<circle cx="%d" cy="%d" r="20" fill="none" stroke="%s" stroke-width="2.5"/>\n' % (core_x, core_y, ACCENT)
s += '<circle cx="%d" cy="%d" r="6" fill="%s"/>\n' % (core_x, core_y, ACCENT)
s += cap(60, 464, "ONE CORE · SIX SPECIALISTS · AUDITED ACTIONS")
s += "</svg>"
TECH["agentmesh"] = s

# ---------------------------------------------------------------- voiceai
s = head("Voice AI receptionist — calls answered, transcribed and booked")
s += card(90, 130, 220, 240, LINE, "#0e1513", 1.5, 12)
s += cap(200, 162, "INCOMING CALL", "middle", MUTED, 13)
mid = 250
import math as _m
pts = []
for i in range(48):
    xx = 116 + i * 3.6
    amp = (18 if i < 8 else 34 if i < 20 else 26 if i < 34 else 12) * (0.6 + 0.4 * _m.sin(i * 1.7))
    pts.append("%d,%d" % (xx, mid - amp))
    pts.append("%d,%d" % (xx + 3.6, mid + amp))
s += '<polyline points="%s" fill="none" stroke="%s" stroke-width="2"/>\n' % (" ".join(pts), ACCENT)
s += cap(200, 330, "00:42 · EN · SW", "middle", MUTED, 12)
s += '<path d="M310 250h40" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(350, 150, 190, 200, ACCENT, "#10241c", 2, 10)
s += cap(445, 190, "VOICE AGENT", "middle", ACCENT_HI, 14)
s += cap(445, 218, "TRANSCRIBE", "middle", MUTED, 12)
s += cap(445, 244, "UNDERSTAND", "middle", MUTED, 12)
s += cap(445, 270, "BOOK + REPLY", "middle", MUTED, 12)
s += cap(445, 310, "ESCALATE IF UNSURE", "middle", GOLD, 11)
s += '<path d="M540 250h40" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(580, 170, 150, 160, LINE, "#0e1513")
s += cap(655, 202, "CALENDAR", "middle", MUTED, 13)
s += '<rect x="600" y="220" width="110" height="22" rx="5" fill="%s" opacity=".8"/>\n' % ACCENT
s += cap(655, 236, "BOOKED 11:30", "middle", "#06110c", 11)
s += '<rect x="600" y="252" width="110" height="22" rx="5" fill="none" stroke="%s" stroke-dasharray="3 4"/>\n' % LINE
s += '<rect x="600" y="284" width="110" height="22" rx="5" fill="none" stroke="%s" stroke-dasharray="3 4"/>\n' % LINE
s += cap(60, 464, "CALLER NEVER WAITS ON HOLD · LOGS TO CRM")
s += "</svg>"
TECH["voiceai"] = s

# ---------------------------------------------------------------- workflow
s = head("Workflow automation — a business rule routing work automatically")
nodes = {("START", (90, 240)), ("RULE", (250, 240)), ("PATH A", (430, 140)), ("PATH B", (430, 340)), ("DONE", (640, 240))}
for nm, (xx, yy) in nodes:
    active = nm in ("START", "RULE", "PATH A")
    s += card(xx - 45, yy - 32, 110 if nm != "RULE" else 130, 64, ACCENT if active else LINE, "#12301f" if active else "#0e1513", 2 if active else 1.2, 10)
    s += cap(xx + (10 if nm == "RULE" else 0), yy + 5, nm, "middle", ACCENT if active else MUTED, 13)
s += '<path d="M135 240h70" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M315 226q60-6 70-52" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M315 254q60 6 70 52" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="4 6" opacity=".5"/>\n' % MUTED
s += '<path d="M500 140q80 10 86 74" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M500 340q80-10 86-74" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="4 6" opacity=".4"/>\n' % MUTED
s += cap(250, 190, "VALUE > 50K?", "middle", MUTED, 12)
s += cap(345, 176, "YES", "middle", ACCENT, 12)
s += cap(345, 312, "NO", "middle", MUTED, 12)
s += cap(640, 190, "AUTO-APPROVED", "middle", ACCENT, 12)
s += cap(640, 372, "SENIOR REVIEW", "middle", MUTED, 12)
s += cap(60, 464, "ROUTING RULES YOUR TEAM CAN READ AND CHANGE")
s += "</svg>"
TECH["workflow"] = s

# ---------------------------------------------------------------- apis
s = head("API integration — systems exchanging signed events in real time")
s += card(80, 140, 180, 220, LINE, "#0e1513", 1.5, 12)
s += cap(170, 172, "YOUR SYSTEM", "middle", MUTED, 13)
for i, ev in enumerate(("order.paid", "stock.low", "customer.new")):
    yy = 200 + i * 44
    s += '<rect x="100" y="%d" width="140" height="28" rx="6" fill="#111a16" stroke="%s"/>\n' % (yy, LINE)
    s += cap(170, yy + 19, ev, "middle", ACCENT, 12)
s += '<path d="M260 250h60" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M320 250l-14-9v18z" fill="%s"/>\n' % ACCENT
s += card(340, 190, 120, 120, ACCENT, "#10241c", 2, 10)
s += cap(400, 242, "EVENT BUS", "middle", ACCENT_HI, 14)
s += cap(400, 268, "SIGNED · RETRIED", "middle", MUTED, 10)
s += '<path d="M460 250h60" stroke="%s" stroke-width="3"/>\n' % ACCENT
partners = ("MPESA", "CRM", "SMS")
for i, p in enumerate(partners):
    yy = 130 + i * 100
    s += '<path d="M520 %dq30 0 40 %d" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="1 7"/>\n' % (250, yy + 20 - 250, ACCENT_DIM)
    s += card(560, yy, 150, 50, LINE, "#0e1513", 1.2, 8)
    s += cap(635, yy + 30, p, "middle", MUTED, 14)
s += cap(60, 464, "EVERY EVENT ACKNOWLEDGED · FAILURES QUEUE AND RETRY")
s += "</svg>"
TECH["apis"] = s

# ---------------------------------------------------------------- security
s = head("Platform security — verified webhooks, encrypted secrets, audit trail")
s += '<rect x="150" y="200" width="150" height="120" rx="12" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M185 200v-30a40 40 0 0 1 80 0v30" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<circle cx="225" cy="252" r="12" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M225 264v22" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M330 260h60" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(390, 150, 160, 200, LINE, "#0e1513", 1.5, 10)
s += cap(470, 182, "AUDIT LOG", "middle", MUTED, 13)
entries = ("09:14 KEY ROTATED", "09:22 LOGIN OK", "09:31 EXPORT BLOCKED", "09:40 ROLE CHANGED")
for i, e in enumerate(entries):
    s += cap(408, 214 + i * 32, e, "start", ACCENT if i == 2 else MUTED, 12)
s += '<path d="M550 250h50" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(600, 170, 130, 160, LINE, "#0e1513", 1.5, 10)
s += cap(665, 202, "SHIELDS", "middle", MUTED, 12)
s += cap(665, 240, "TLS", "middle", ACCENT, 16)
s += cap(665, 268, "SHA-256", "middle", ACCENT, 16)
s += cap(665, 296, "RBAC", "middle", ACCENT, 16)
s += cap(60, 464, "SECURITY IS THE DEFAULT, NOT AN ADD-ON")
s += "</svg>"
TECH["security"] = s

# ---------------------------------------------------------------- pos
s = head("Point of sale and receipts — counter sales synced to head office")
s += card(100, 130, 200, 150, LINE, "#0e1513", 1.5, 12)
s += '<rect x="122" y="152" width="156" height="70" rx="6" fill="#111a16" stroke="%s"/>\n' % LINE
s += cap(200, 194, "TOTAL 1,850", "middle", ACCENT, 17)
for i in range(4):
    s += '<rect x="%d" y="%d" width="34" height="24" rx="4" fill="none" stroke="%s"/>\n' % (122 + i * 40, 234, LINE)
s += '<rect x="122" y="268" width="76" height="26" rx="6" fill="none" stroke="%s" stroke-width="1.5"/>\n' % MUTED
s += '<rect x="330" y="150" width="90" height="130" fill="none" stroke="%s" stroke-width="2.5"/>\n' % CREAM
s += '<path d="M375 150v-24" stroke="%s" stroke-width="2.5"/>\n' % MUTED
for i in range(7):
    s += '<path d="M342 %dh66" stroke="%s" stroke-width="3" opacity=".7"/>\n' % (170 + i * 14, ACCENT_DIM if i % 2 else ACCENT)
s += '<path d="M420 215h40" stroke="%s" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>\n' % MUTED
s += card(460, 130, 270, 170, LINE, "#0e1513", 1.5, 12)
s += cap(482, 162, "HEAD OFFICE · LIVE", MUTED, 13)
s += '<polyline points="482,270 516,252 550,260 584,232 618,242 652,214 686,224" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += cap(482, 200, "TILLS REPORTING: 8/8", MUTED, 12)
s += cap(60, 464, "OFFLINE-SAFE · SYNC WHEN NETWORK RETURNS")
s += "</svg>"
TECH["pos"] = s

# ---------------------------------------------------------------- hospitality-x (events venue mgmt to broaden hospitality beyond restaurant)
s = head("Venue and events management — halls, bookings and function sheets")
s += '<path d="M100 300l150-90 150 90z" fill="none" stroke="%s" stroke-width="3"/>\n' % ACCENT
s += '<path d="M130 300v70h240v-70" fill="none" stroke="%s" stroke-width="2.5"/>\n' % LINE
s += '<rect x="220" y="330" width="60" height="40" fill="none" stroke="%s" stroke-width="2.5"/>\n' % LINE
for lx in (150, 400):
    pass
s += '<path d="M430 140l30 60m60-60l-30 60" stroke="%s" stroke-width="3" opacity=".7"/>\n' % GOLD
s += '<path d="M460 200l-20 90h60z" fill="none" stroke="%s" stroke-width="2.5"/>\n' % GOLD
s += card(520, 110, 210, 140, LINE, "#0e1513")
s += cap(542, 142, "HALL A · SATURDAY", MUTED, 13)
s += cap(542, 176, "WEDDING · 180 PAX", ACCENT, 16)
s += cap(542, 206, "DEPOSIT PAID ✓", MUTED, 13)
s += cap(542, 232, "FUNCTION SHEET ISSUED", MUTED, 12)
s += card(520, 280, 210, 90, LINE, "#0e1513")
s += cap(542, 310, "VENUE UTILISATION", MUTED, 12)
s += '<rect x="542" y="326" width="166" height="10" fill="none" stroke="%s"/>\n' % LINE
s += '<rect x="542" y="326" width="124" height="10" fill="%s"/>\n' % ACCENT
s += cap(60, 464, "ENQUIRY -> QUOTE -> DEPOSIT -> FUNCTION SHEET")
s += "</svg>"
TECH["venue"] = s

CREATIVE = {}

# ------------------------------------------------------------- brand experience
s = creative_head("Brand experience concept — identity system brought to life digitally")
s += '<path d="M400 90l120 300h-70L400 190 350 390h-70z" fill="none" stroke="url(#goldgrad)" stroke-width="6"/>\n'
for ang in (-40, 0, 40):
    import math
    rad = math.radians(ang)
    ox = 400 + 210 * math.sin(rad)
    oy = 250 - 210 * math.cos(rad) * .55
    s += '<circle cx="%.0f" cy="%.0f" r="6" fill="%s"/>\n' % (ox, oy, CREAM)
s += '<ellipse cx="400" cy="250" rx="240" ry="130" fill="none" stroke="%s" stroke-opacity=".25" stroke-dasharray="2 10"/>\n' % CREAM
s += cap(400, 452, "IDENTITY · MOTION · INTERACTION", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-brand"] = s

# ------------------------------------------------------------- product launch
s = creative_head("Product launch campaign concept — countdown, reveal and share moments")
s += '<path d="M120 400Q400 380 560 220T680 90" fill="none" stroke="%s" stroke-width="3" stroke-dasharray="2 10"/>\n' % GOLD
s += '<path d="M560 220q40-60 120-130" fill="none" stroke="%s" stroke-width="4"/>\n' % GOLD
s += '<circle cx="680" cy="90" r="14" fill="url(#goldgrad)"/>\n'
for i, (xx, yy) in enumerate(((520, 250), (470, 290), (415, 330))):
    s += '<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-opacity="%s"/>\n' % (xx, yy, 8 + i * 5, CREAM, .5 - i * .12)
s += card(90, 110, 180, 90, "#2a2c34", "#101216", 1.5, 10)
s += cap(180, 148, "LAUNCH DAY", "middle", "#b9ac93", 12)
s += cap(180, 182, "T-07 : 12 : 44", "middle", GOLD, 18)
s += cap(90, 452, "TEASER -> REVEAL -> WAITLIST -> FIRST ORDER", "start", "#b9ac93", 12)
s += "</svg>"
CREATIVE["creative-launch"] = s

# ------------------------------------------------------------- digital campaign
s = creative_head("Digital campaign concept — one story told across every surface")
surfaces = (("WEB", 120, 150), ("PRINT", 320, 110), ("WHATSAPP", 540, 150), ("STORE", 660, 260), ("OOH", 200, 320))
for nm, xx, yy in surfaces:
    s += '<circle cx="%d" cy="%d" r="34" fill="#101216" stroke="%s" stroke-width="2"/>\n' % (xx, yy, CREAM)
    s += cap(xx, yy + 5, nm, "middle", "#d9d4c8", 10)
paths = ((120, 150, 320, 110), (320, 110, 540, 150), (540, 150, 660, 260), (120, 150, 200, 320), (200, 320, 320, 110))
for x0, y0, x1, y1 in paths:
    mx, my = (x0 + x1) // 2, (y0 + y1) // 2
    s += '<path d="M%d %dQ%d %d %d %d" fill="none" stroke="%s" stroke-opacity=".35" stroke-dasharray="2 8"/>\n' % (x0, y0, mx, my - 24, x1, y1, GOLD)
s += cap(400, 452, "ONE STORY · EVERY SURFACE · ONE MEASUREMENT", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-campaign"] = s

# ------------------------------------------------------------- immersive web
s = creative_head("Immersive web experience concept — scroll-driven depth and motion")
for i in range(4):
    yy = 180 + i * 62
    op = .25 + i * .2
    s += '<path d="M0 %d Q200 %d 400 %d T800 %d V500 H0 Z" fill="%s" fill-opacity="%s"/>\n' % (yy + 40, yy, yy + 20, yy + 30, "#1a1d24" if i % 2 else "#15171d", op * .5)
    s += '<path d="M0 %d Q200 %d 400 %d T800 %d" fill="none" stroke="%s" stroke-opacity="%s" stroke-width="2"/>\n' % (yy, yy - 40, yy - 20, yy - 10, GOLD, op)
s += '<circle cx="620" cy="120" r="34" fill="url(#goldgrad)" opacity=".9"/>\n'
s += cap(80, 90, "SCROLL IS THE STORYBOARD", "start", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-immersive"] = s

# ------------------------------------------------------------- installation
s = creative_head("Interactive installation concept — screens reacting to people nearby")
frames = ((110, 130, 150, 200), (330, 100, 170, 240), (570, 150, 150, 190))
for i, (xx, yy, fw, fh) in enumerate(frames):
    s += '<rect x="%d" y="%d" width="%d" height="%d" fill="#101216" stroke="%s" stroke-width="2.5"/>\n' % (xx, yy, fw, fh, CREAM)
    for k in range(3):
        s += '<rect x="%d" y="%d" width="%d" height="%d" fill="%s" opacity="%s"/>\n' % (xx + 14, yy + fh - 40 - k * 26, (fw - 28) * (0.4 + 0.3 * ((i + k) % 3)), 14, GOLD, .8 - k * .22)
s += '<path d="M185 330q60 40 120 0" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="1 8"/>\n' % GOLD
s += '<path d="M415 340q70 46 140 0" fill="none" stroke="%s" stroke-width="2.5" stroke-dasharray="1 8"/>\n' % GOLD
s += cap(400, 452, "PRESENCE IN -> LIGHT AND SOUND OUT", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-installation"] = s

# ------------------------------------------------------------- motion
s = creative_head("Motion and title design concept — kinetic type and transitions")
s += '<text x="90" y="230" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700" fill="none" stroke="%s" stroke-width="2">MOTION</text>\n' % CREAM
s += '<text x="150" y="330" font-family="Space Grotesk, sans-serif" font-size="92" font-weight="700" fill="%s" opacity=".9">IS MESSAGE</text>\n' % GOLD
s += '<rect x="90" y="90" width="620" height="300" fill="none" stroke="%s" stroke-opacity=".3" stroke-dasharray="6 8"/>\n' % CREAM
marks = (150, 260, 370, 480, 590)
for m in marks:
    s += '<path d="M%d 90v14M%d 376v14" stroke="%s" stroke-opacity=".4"/>\n' % (m, m, CREAM)
s += cap(90, 440, "TYPE · RHYTHM · TIMING", "start", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-motion"] = s

# ------------------------------------------------------------- 3d product visual
s = creative_head("3D product visualisation concept — one render, every angle")
import math
def cube(cx, cy, sz, front, top, side):
    h = sz * 0.5
    return (
        '<g>\n<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="%s"/>\n<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="%s"/>\n<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="%s" stroke="%s" stroke-opacity=".4"/>\n</g>\n'
        % (cx, cy, cx + sz, cy, cx + sz + h, cy - h, cx + h, cy - h, top,
           cx, cy, cx + h, cy - h, cx + h, cy - h + sz * .8, cx, cy + sz * .8, side,
           cx, cy, cx + sz, cy, cx + sz, cy + sz * .8, cx, cy + sz * .8, front, CREAM)
    )
s += cube(300, 220, 120, "#1c1f26", "#2a2e38", "#14161c")
s += cube(480, 260, 80, "#26202c", "#332b3a", "#181420")
s += '<ellipse cx="400" cy="380" rx="220" ry="30" fill="none" stroke="%s" stroke-opacity=".25" stroke-dasharray="2 10"/>\n' % CREAM
s += '<path d="M620 140a60 60 0 0 1 40 56" fill="none" stroke="%s" stroke-width="2.5"/>\n' % GOLD
s += '<path d="M660 196l8-12m-8 12l-14-4" stroke="%s" stroke-width="2.5" fill="none"/>\n' % GOLD
s += cap(400, 452, "MODELLING · LIGHTING · WEB GL TURNAROUND", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-3d"] = s

# ------------------------------------------------------------- editorial
s = creative_head("Editorial and content design concept — long-form reading online")
s += '<rect x="140" y="90" width="240" height="320" fill="#101216" stroke="%s" stroke-opacity=".5"/>\n' % CREAM
s += '<rect x="420" y="90" width="240" height="320" fill="#101216" stroke="%s" stroke-opacity=".5"/>\n' % CREAM
s += '<rect x="164" y="114" width="192" height="120" fill="url(#goldgrad)" opacity=".55"/>\n'
for i, wd in enumerate((180, 160, 190, 120, 170, 150)):
    s += '<rect x="164" y="%d" width="%d" height="8" rx="3" fill="%s" opacity=".4"/>\n' % (260 + i * 22, wd, CREAM)
s += '<text x="444" y="150" font-family="Space Grotesk, sans-serif" font-size="30" font-weight="700" fill="%s">THE</text>\n' % GOLD
s += '<text x="444" y="184" font-family="Space Grotesk, sans-serif" font-size="30" font-weight="700" fill="%s">SYSTEM</text>\n' % GOLD
s += '<text x="444" y="218" font-family="Space Grotesk, sans-serif" font-size="30" font-weight="700" fill="none" stroke="%s">ISSUE</text>\n' % CREAM
for i in range(6):
    s += '<rect x="444" y="%d" width="%d" height="7" rx="3" fill="%s" opacity=".35"/>\n' % (250 + i * 20, 190 - (i % 3) * 30, CREAM)
s += cap(400, 452, "GRIDS · TYPE SCALE · READING RHYTHM", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-editorial"] = s

# ------------------------------------------------------------- packaging
s = creative_head("Packaging and unboxing concept — dielines to shelf presence")
s += '<path d="M280 160l120-40 120 40-120 40z" fill="#1a1d24" stroke="%s"/>\n' % GOLD
s += '<path d="M280 160v120l120 44v-124z" fill="#14161c" stroke="%s"/>\n' % GOLD
s += '<path d="M520 160v120l-120 44v-124z" fill="#1e2129" stroke="%s"/>\n' % GOLD
s += '<path d="M340 200l120-38m-120 70l120-38" stroke="%s" stroke-opacity=".5"/>\n' % CREAM
s += '<circle cx="400" cy="235" r="26" fill="none" stroke="%s" stroke-width="2"/>\n' % GOLD
s += '<text x="400" y="243" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="22" fill="%s">V</text>\n' % CREAM
s += '<path d="M640 120l40 20-40 20-40-20z" fill="none" stroke="%s" stroke-opacity=".6"/>\n' % CREAM
s += '<path d="M640 160v40" stroke="%s" stroke-opacity=".6" stroke-dasharray="3 5"/>\n' % CREAM
s += cap(400, 452, "DIELINE -> PRINT PROOF -> UNBOXING FILM", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-packaging"] = s

# ------------------------------------------------------------- data art
s = creative_head("Generative data art concept — business numbers made visual")
import math as _mm
for i in range(90):
    a = i * 137.5
    rad = _mm.radians(a)
    rr = 4.2 * _mm.sqrt(i) * 2.1
    xx = 400 + rr * _mm.cos(rad)
    yy = 240 + rr * _mm.sin(rad) * .8
    szz = max(1.2, 5 - i * .04)
    colr = GOLD if i % 7 == 0 else CREAM
    op = min(.85, .15 + i * .01)
    s += '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" fill-opacity="%.2f"/>\n' % (xx, yy, szz, colr, op)
s += '<ellipse cx="400" cy="240" rx="180" ry="145" fill="none" stroke="%s" stroke-opacity=".2" stroke-dasharray="2 9"/>\n' % CREAM
s += cap(400, 452, "REAL NUMBERS, RENDERED — SALES BECOMES SHAPE", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-dataart"] = s

# ------------------------------------------------------------- retail experience
s = creative_head("Retail experience concept — physical store meets digital layer")
s += '<path d="M120 220h280v160H120z" fill="none" stroke="%s" stroke-width="3"/>\n' % CREAM
s += '<path d="M100 220l160-70 160 70" fill="none" stroke="%s" stroke-width="3"/>\n' % GOLD
s += '<rect x="230" y="300" width="60" height="80" fill="#101216" stroke="%s"/>\n' % CREAM
for i in range(2):
    s += '<rect x="%d" y="%d" width="60" height="44" fill="none" stroke="%s" stroke-opacity=".6"/>\n' % (150 + i * 90, 250, CREAM)
s += '<rect x="470" y="180" width="130" height="200" rx="10" fill="#101216" stroke="%s" stroke-width="2.5"/>\n' % GOLD
s += '<rect x="486" y="196" width="98" height="120" fill="url(#goldgrad)" opacity=".4"/>\n'
s += cap(535, 348, "SCAN -> STORY", "middle", "#b9ac93", 11)
s += '<path d="M400 280q35-20 70-10" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="1 7"/>\n' % GOLD
s += cap(400, 452, "SHELF TAGS · AR TRY-ON · ONE BASKET ONLINE AND OFFLINE", "middle", "#b9ac93", 12)
s += "</svg>"
CREATIVE["creative-retail"] = s

# ------------------------------------------------------------- event experience
s = creative_head("Event and activation concept — stages, streams and second screens")
s += '<path d="M140 320h320l-40-120H180z" fill="#101216" stroke="%s" stroke-width="2.5"/>\n' % CREAM
for i, lx in enumerate((220, 300, 380)):
    s += '<path d="M%d 200l-30 120m30-120l0 120m0-120l30 120" stroke="%s" stroke-opacity="%s" stroke-width="2"/>\n' % (lx, GOLD, .8 - i * .2)
s += '<path d="M120 320h360" stroke="%s" stroke-width="4"/>\n' % GOLD
for i in range(6):
    xx = 150 + i * 52
    s += '<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-opacity="%s"/>\n' % (xx, 372 + (i % 2) * 10, 9, CREAM, .5)
s += '<rect x="560" y="150" width="150" height="260" rx="14" fill="#101216" stroke="%s" stroke-width="2.5"/>\n' % GOLD
s += '<rect x="574" y="170" width="122" height="150" fill="url(#goldgrad)" opacity=".35"/>\n'
s += '<circle cx="635" cy="360" r="14" fill="none" stroke="%s"/>\n' % CREAM
s += cap(400, 452, "IN THE ROOM AND IN THE FEED AT THE SAME TIME", "middle", "#b9ac93", 12)
s += "</svg>"
CREATIVE["creative-event"] = s

# ------------------------------------------------------------- hospitality experience (hotel digital journey)
s = creative_head("Hotel guest journey concept — booking to checkout in one flow")
stops = (("BOOK", 130, 160), ("CHECK-IN", 320, 120), ("ROOM KEY", 520, 160), ("CONCIERGE", 620, 300), ("CHECKOUT", 380, 360), ("REVIEW", 160, 300))
for nm, xx, yy in stops:
    s += '<circle cx="%d" cy="%d" r="36" fill="#101216" stroke="%s" stroke-width="2"/>\n' % (xx, yy, GOLD)
    s += cap(xx, yy + 5, nm, "middle", "#d9d4c8", 10)
flow = ((130, 160, 320, 120), (320, 120, 520, 160), (520, 160, 620, 300), (620, 300, 380, 360), (380, 360, 160, 300))
for x0, y0, x1, y1 in flow:
    mx, my = (x0 + x1) // 2, (y0 + y1) // 2
    s += '<path d="M%d %dQ%d %d %d %d" fill="none" stroke="%s" stroke-opacity=".4" stroke-dasharray="2 8"/>\n' % (x0, y0, mx + 18, my - 26, x1, y1, GOLD)
s += '<path d="M320 120q90-60 200 40" fill="none" stroke="%s" stroke-opacity=".2" stroke-width="30" stroke-linecap="round"/>\n' % CREAM
s += cap(400, 452, "ONE NUMBER FOR THE GUEST · WHATSAPP NATIVE", "middle", "#b9ac93", 13)
s += "</svg>"
CREATIVE["creative-hotel"] = s

for name, body in TECH.items():
    write(name + ".svg", body)
for name, body in CREATIVE.items():
    write(name + ".svg", body)

print("done:", len(TECH), "tech +", len(CREATIVE), "creative")
