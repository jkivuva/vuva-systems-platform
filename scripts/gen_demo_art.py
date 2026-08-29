# -*- coding: utf-8 -*-
"""Industry demo imagery for the Vuva portfolio demos.
Photo-styled SVG scenes: layered gradients, silhouettes, vignettes.
Distinct palette per industry. Self-hosted, CSP-safe, license-clean.
"""
import os, math

OUT = os.path.join(os.path.dirname(__file__), "..", "site", "assets", "img", "demo")
os.makedirs(OUT, exist_ok=True)
W, H = 800, 500

def svg(label, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{label}">\n'
            f"<defs>{defs}</defs>\n{body}\n</svg>\n")

def lin(id, c0, c1, x1=0, y1=0, x2=0, y2=1):
    return (f'<linearGradient id="{id}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'<stop offset="0" stop-color="{c0}"/><stop offset="1" stop-color="{c1}"/></linearGradient>')

def rad(id, c0, c1, op0=".55", op1="0"):
    return (f'<radialGradient id="{id}" cx=".5" cy=".42" r=".75">'
            f'<stop offset="0" stop-color="{c0}" stop-opacity="{op0}"/>'
            f'<stop offset="1" stop-color="{c1}" stop-opacity="{op1}"/></radialGradient>')

def vignette(op=".38"):
    return f'<rect width="{W}" height="{H}" fill="url(#vig)" opacity="{op}"/>'

def vig_def():
    return rad("vig", "#000", "#000", ".0", ".55")

def cap(x, y, t, anchor="start", color="#e8efe9", size=15, weight="normal", family="ui-monospace, monospace", spacing="0"):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{color}" font-family="{family}" '
            f'font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}">{t}</text>\n')

def person(x, y, s, skin, shirt, hair="#2a2320"):
    """Simple stylised person: head + shoulders."""
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-34 46 Q0 18 34 46 L34 60 L-34 60 Z" fill="{shirt}"/>'
            f'<circle cx="0" cy="-2" r="20" fill="{skin}"/>'
            f'<path d="M-20 -6 Q-20 -26 0 -26 Q20 -26 20 -6 L20 -12 Q20 -30 0 -30 Q-20 -30 -20 -12 Z" fill="{hair}"/>'
            f'</g>')

def window_light(x, y, w, h, tint="#fff8e7", op=".16"):
    return (f'<g opacity="{op}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{tint}"/>'
            f'<rect x="{x + w/2 - 2}" y="{y}" width="4" height="{h}" fill="#00000022"/></g>')

def floor_reflect(y, color="#ffffff", op=".05"):
    return f'<rect x="0" y="{y}" width="{W}" height="{H-y}" fill="{color}" opacity="{op}"/>'

files = {}

# ============================================================ HEALTHCARE
d = lin("bg", "#eef4f2", "#d5e5df") + lin("wall", "#f7faf9", "#e3eeea") + vig_def() + rad("glow", "#ffffff", "#ffffff", ".5", "0")
b = f'<rect width="{W}" height="{H}" fill="url(#wall)"/>'
b += f'<rect x="0" y="360" width="{W}" height="140" fill="#c9dcd4"/>'
b += floor_reflect(360, "#ffffff", ".25")
# examination bed
b += '<rect x="70" y="300" width="250" height="26" rx="10" fill="#ffffff"/>\n<rect x="86" y="326" width="14" height="60" fill="#9fbcb2"/>\n<rect x="290" y="326" width="14" height="60" fill="#9fbcb2"/>\n<rect x="70" y="292" width="70" height="16" rx="8" fill="#e2efea"/>\n'
# window
b += '<rect x="420" y="70" width="300" height="200" rx="10" fill="#bfe0f2"/>\n<path d="M420 70h300v90q-150 40-300 0z" fill="#d8eefb" opacity=".8"/>\n<rect x="565" y="70" width="8" height="200" fill="#ffffff" opacity=".7"/>\n<rect x="420" y="165" width="300" height="8" fill="#ffffff" opacity=".7"/>\n'
b += window_light(420, 70, 300, 200)
# doctor + patient
b += person(600, 330, 1.7, "#8a5a3b", "#3ba183", "#1d1a17")
b += '<rect x="560" y="352" width="80" height="12" rx="6" fill="#ffffff" opacity=".85"/>\n'
b += person(430, 342, 1.45, "#c68958", "#7d8ea0", "#33261d")
# monitor
b += '<rect x="120" y="150" width="150" height="100" rx="8" fill="#10201b"/>\n<path d="M135 220h34v-34l20 22 18-40 16 52 14-28h28" stroke="#43e0a6" stroke-width="4" fill="none"/>\n<rect x="180" y="250" width="30" height="26" fill="#7fa295"/>\n'
b += cap(60, 60, "VUVA CARE · EXAM ROOM 2", color="#3c7a64", size="16", weight="bold", spacing="2")
b += vignette()
files["clinic-room"] = svg("Clinic examination room", b, d)

# doctor avatars (3 variants, square-ish crop 400x400 viewBox trick: reuse 800x500 with bust)
def doctor(name, skin, coat, hair, bg1, bg2, steth="#274238"):
    dd = lin("bg", bg1, bg2) + vig_def()
    bb = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
    bb += person(400, 430, 4.4, skin, coat, hair)
    bb += f'<path d="M352 300 q-20 60 10 96 M448 300 q20 60 -10 96" stroke="{steth}" stroke-width="9" fill="none"/>'
    bb += f'<circle cx="362" cy="404" r="16" fill="{steth}"/>'
    bb += cap(400, 470, name, "middle", "#ffffff", "26", "bold", "Space Grotesk, sans-serif", "1")
    bb += vignette(".25")
    return svg(f"Portrait of {name}", bb, dd)

files["doctor-amina"]  = doctor("DR. AMINA", "#8a5a3b", "#f4f8f7", "#141110", "#2f6b58", "#1b4033")
files["doctor-juma"]   = doctor("DR. JUMA", "#6e4526", "#eef3f2", "#201a16", "#31576b", "#1c333f")
files["doctor-preeti"] = doctor("DR. PREETI", "#c68958", "#f4f8f7", "#2b1c12", "#5b4a7a", "#322848")

# ============================================================ LOGISTICS
d = lin("bg", "#2a1c10", "#120b06") + lin("sky", "#e78a3e", "#7a3d16") + vig_def() + rad("sun", "#ffd9a0", "#ffd9a0", ".8", "0")
b = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
b += '<circle cx="620" cy="150" r="58" fill="url(#sun)"/>\n'
# distant hills
b += '<path d="M0 300 Q200 250 420 292 T800 280 V500 H0 Z" fill="#3a2413" opacity=".85"/>\n'
# road
b += '<path d="M0 500 L340 320 L800 320 L800 500 Z" fill="#241a12"/>\n<path d="M0 500 L340 320 h460 v180z" fill="#2c2015"/>\n'
for i in range(6):
    xx = 40 + i * 130
    yy = 470 - i * 22
    b += f'<rect x="{xx}" y="{yy}" width="52" height="7" rx="3" fill="#e8b56b" opacity="{.85 - i*.1}" transform="skewX(-18)"/>\n'
# truck silhouette
b += ('<g transform="translate(180,208)">\n'
      '<rect x="0" y="26" width="270" height="86" rx="10" fill="#e8e4de"/>\n'
      '<rect x="0" y="26" width="270" height="18" rx="8" fill="#c94434"/>\n'
      '<path d="M270 52h58l34 34v26h-92z" fill="#b8b2aa"/>\n'
      '<rect x="292" y="60" width="34" height="24" rx="4" fill="#20303c"/>\n'
      '<circle cx="66" cy="118" r="24" fill="#171310"/>\n<circle cx="66" cy="118" r="9" fill="#5d564d"/>\n'
      '<circle cx="150" cy="118" r="24" fill="#171310"/>\n<circle cx="150" cy="118" r="9" fill="#5d564d"/>\n'
      '<circle cx="316" cy="118" r="24" fill="#171310"/>\n<circle cx="316" cy="118" r="9" fill="#5d564d"/>\n'
      '<rect x="24" y="52" width="90" height="34" rx="4" fill="#f0ede8" opacity=".5"/>\n'
      '<text x="135" y="80" text-anchor="middle" font-family="ui-monospace, monospace" font-size="20" fill="#8c857b">VUVA-20481</text>\n'
      '</g>\n')
b += cap(40, 60, "NAIROBI → KISUMU · NIGHT RUN", color="#f3d9b8", size="16", weight="bold", spacing="2")
b += vignette(".5")
files["truck-highway"] = svg("Freight truck on the highway at dusk", b, d)

d = lin("bg", "#1a2320", "#0d1210") + lin("bay", "#2c3a34", "#1a2420") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bay)"/>'
# racks with boxes
for rack in range(2):
    rx = 60 + rack * 380
    for lvl in range(3):
        yy = 120 + lvl * 90
        b += f'<rect x="{rx}" y="{yy}" width="300" height="10" fill="#4a5a52"/>\n'
        for bx in range(5):
            shade = ["#c98a3e", "#8a9a5b", "#b8b2aa", "#c98a3e", "#7a8a92"][(bx + lvl) % 5]
            b += f'<rect x="{rx + 8 + bx*58}" y="{yy-52}" width="50" height="52" fill="{shade}"/>\n'
            b += f'<path d="M{rx + 8 + bx*58 + 25} {yy-52}v52" stroke="#00000033"/>\n'
# forklift silhouette
b += ('<g transform="translate(560,300)">\n<rect x="0" y="20" width="130" height="60" rx="10" fill="#e8b23e"/>\n'
      '<rect x="96" y="-40" width="10" height="120" fill="#6b6257"/>\n<rect x="96" y="-40" width="70" height="10" fill="#6b6257"/>\n'
      '<rect x="120" y="-16" width="44" height="34" fill="#8a9a5b"/>\n'
      '<circle cx="30" cy="86" r="18" fill="#17130f"/><circle cx="110" cy="86" r="18" fill="#17130f"/>\n</g>\n')
b += cap(40, 60, "WAREHOUSE BAY 4 · PICKING", color="#cfe3d8", size="16", weight="bold", spacing="2")
b += vignette(".5")
files["warehouse-bay"] = svg("Warehouse racking and forklift", b, d)

d = lin("bg", "#0f1c26", "#081018") + lin("sea", "#12303e", "#0a1a24") + vig_def() + rad("moon", "#cfe3f5", "#cfe3f5", ".7", "0")
b = f'<rect width="{W}" height="{H}" fill="url(#sea)"/>'
b += '<circle cx="150" cy="90" r="34" fill="url(#moon)"/>\n'
# cranes
for i, cx in enumerate((300, 470, 640)):
    hh = 190 + i * 18
    b += (f'<g stroke="#0d1a22" stroke-width="10" fill="none">'
          f'<path d="M{cx} 420V{420-hh}l90-40M{cx} {420-hh}h-70"/></g>\n')
    b += f'<path d="M{cx+52} {420-hh+34}v54" stroke="#c98a3e" stroke-width="6"/>\n'
    b += f'<rect x="{cx+34}" y="{420-hh+88}" width="40" height="26" fill="#31576b"/>\n'
# containers
for i, (cx, col) in enumerate(((240, "#8a3a2e"), (310, "#316b8a"), (380, "#8a9a5b"), (450, "#c98a3e"))):
    b += f'<rect x="{cx}" y="392" width="62" height="28" fill="{col}"/>\n<path d="M{cx} 406h62" stroke="#00000044"/>\n'
# water reflection
b += '<path d="M0 430h800" stroke="#0d2836" stroke-width="40"/>\n'
for i in range(8):
    b += f'<rect x="{40+i*95}" y="446" width="60" height="4" rx="2" fill="#3e6b82" opacity=".5"/>\n'
b += cap(40, 60, "PORT RELEASALS · 03:40", color="#bcd8ea", size="16", weight="bold", spacing="2")
b += vignette(".45")
files["port-cranes"] = svg("Container port at night", b, d)

d = lin("bg", "#22303c", "#101a22") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# city grid streets
for i in range(6):
    b += f'<rect x="{60+i*130}" y="90" width="8" height="330" fill="#2c3e4c"/>\n'
for i in range(4):
    b += f'<rect x="40" y="{130+i*90}" width="720" height="8" fill="#2c3e4c"/>\n'
# rider path
b += '<path d="M100 420 Q260 300 420 340 T740 200" stroke="#43e0a6" stroke-width="5" fill="none" stroke-dasharray="2 14" stroke-linecap="round"/>\n'
# rider
b += ('<g transform="translate(420,340)">\n<circle cx="-26" cy="26" r="16" fill="none" stroke="#e8e4de" stroke-width="5"/>\n'
      '<circle cx="26" cy="26" r="16" fill="none" stroke="#e8e4de" stroke-width="5"/>\n'
      '<path d="M-26 26 L0 -6 L26 26 M0 -6 L-10 26" stroke="#e8e4de" stroke-width="5" fill="none"/>\n'
      '<circle cx="0" cy="-22" r="12" fill="#c98a3e"/>\n'
      f'<rect x="14" y="-30" width="34" height="24" rx="4" fill="#43e0a6"/>\n</g>\n')
b += cap(40, 60, "LAST MILE · RIDER K-04 · 6 STOPS LEFT", color="#bfe8d6", size="16", weight="bold", spacing="2")
b += vignette(".5")
files["delivery-moto"] = svg("Delivery rider navigating city streets", b, d)

# ============================================================ HOSPITALITY
def hotel_room(palette, label, bedcol, accent):
    dd = lin("bg", palette[0], palette[1]) + lin("wall", palette[2], palette[3]) + vig_def()
    b = f'<rect width="{W}" height="{H}" fill="url(#wall)"/>'
    b += f'<rect x="0" y="380" width="{W}" height="120" fill="{palette[4]}"/>'
    # window with dusk view
    b += '<rect x="470" y="60" width="270" height="240" rx="8" fill="#1d2b3a"/>\n'
    b += '<circle cx="640" cy="130" r="30" fill="#f3d9a0" opacity=".9"/>\n'
    b += '<path d="M470 240q70-40 140-10t130-6v76h-270z" fill="#16222e"/>\n'
    b += '<rect x="600" y="60" width="6" height="240" fill="#ffffff" opacity=".35"/>\n'
    b += window_light(470, 60, 270, 240, "#f3d9a0", ".08")
    # bed
    b += f'<rect x="80" y="270" width="320" height="110" rx="14" fill="{bedcol}"/>\n'
    b += f'<rect x="80" y="240" width="320" height="46" rx="12" fill="{accent}"/>\n'
    b += '<rect x="100" y="222" width="120" height="34" rx="10" fill="#ffffff"/>\n<rect x="240" y="222" width="120" height="34" rx="10" fill="#ffffff"/>\n'
    b += '<rect x="96" y="380" width="16" height="60" fill="#00000033"/>\n<rect x="368" y="380" width="16" height="60" fill="#00000033"/>\n'
    # lamps
    b += '<circle cx="440" cy="240" r="26" fill="#f3d9a0" opacity=".85"/>\n<rect x="434" y="262" width="12" height="60" fill="#4a3a28"/>\n'
    b += cap(40, 60, label, color="#f3e8d0", size="16", weight="bold", spacing="2")
    b += vignette(".4")
    return svg(label.title(), b, dd)

files["hotel-room-deluxe"] = hotel_room(("#2c2016",), None, "#5a4632", "#8a6a44") if False else hotel_room(
    ("#2c2016", "#1a130c", "#4a3826", "#332619", "#241a10"), "DELUXE ROOM · CITY VIEW", "#6b5138", "#8a6a44")
files["hotel-room-suite"] = hotel_room(
    ("#26202c", "#16121a", "#3c3244", "#2a2233", "#1e1826"), "PANORAMIC SUITE · KING BED", "#544a66", "#7a6a94")

d = lin("bg", "#241c14", "#14100a") + lin("wall", "#3c3022", "#2a2016") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#wall)"/>'
b += '<rect x="0" y="400" width="800" height="100" fill="#1c150e"/>\n'
# reception desk
b += '<rect x="240" y="280" width="330" height="120" rx="10" fill="#5a4632"/>\n<rect x="240" y="280" width="330" height="18" rx="8" fill="#7a5f42"/>\n'
# back wall panels + logo
b += '<rect x="180" y="80" width="450" height="170" rx="10" fill="#332619"/>\n'
b += '<path d="M405 120l-30 84h60z" fill="none" stroke="#d9a441" stroke-width="5"/>\n'
b += cap(405, 236, "THE SERENA ANNEX", "middle", "#d9a441", "22", "bold", "Space Grotesk, sans-serif")
# staff
b += person(300, 262, 1.15, "#8a5a3b", "#d9a441", "#141110")
b += person(500, 262, 1.15, "#6e4526", "#d9a441", "#201a16")
# plants
b += '<path d="M120 400q-20-60 10-90 M130 400q10-50 40-64 M112 400q-30-30 -52-30" stroke="#4a6b3a" stroke-width="7" fill="none"/>\n<rect x="96" y="398" width="56" height="34" fill="#332619"/>\n'
b += cap(40, 60, "RECEPTION · CHECK-IN OPEN", color="#f3e8d0", size="16", weight="bold", spacing="2")
b += vignette(".45")
files["hotel-lobby"] = svg("Hotel reception lobby", b, d)

d = lin("bg", "#1c2620", "#0e1410") + lin("table", "#3c342a", "#241f18") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#table)"/>'
# pendant lights
for lx in (250, 400, 550):
    b += f'<path d="M{lx} 0v90" stroke="#4a4238" stroke-width="4"/>\n<circle cx="{lx}" cy="112" r="26" fill="#f3d9a0" opacity=".28"/>\n<circle cx="{lx}" cy="106" r="10" fill="#ffd9a0"/>\n'
# table
b += '<ellipse cx="400" cy="380" rx="290" height="70" ry="52" fill="#5a4632"/>\n<ellipse cx="400" cy="368" rx="290" ry="52" fill="#6b5138"/>\n'
# plates
for px in (300, 400, 500):
    b += f'<ellipse cx="{px}" cy="356" rx="44" ry="18" fill="#f4f5f1"/>\n<ellipse cx="{px}" cy="354" rx="30" ry="11" fill="#c98a3e"/>\n'
b += '<rect x="386" y="300" width="28" height="44" rx="6" fill="#4a6b5a"/>\n'
b += cap(40, 60, "THE TERRACE · DINNER SERVICE", color="#f3e8d0", size="16", weight="bold", spacing="2")
b += vignette(".5")
files["restaurant-table"] = svg("Restaurant table setting at night", b, d)

# ============================================================ RETAIL
d = lin("bg", "#f4f1ea", "#e2ddd2") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
b += '<rect x="0" y="420" width="800" height="80" fill="#cfc8ba"/>\n'
# shelf rows with products (colored bags/boxes/bottles)
for row, yy in enumerate((120, 220, 320)):
    b += f'<rect x="40" y="{yy+70}" width="720" height="10" fill="#b8b0a0"/>\n'
    for i in range(8):
        px = 60 + i * 88
        col = ["#c94f3d", "#316b8a", "#8a9a5b", "#d9a441", "#5b4a7a", "#c94f3d", "#316b8a", "#8a9a5b"][(i + row) % 8]
        shape = (i + row) % 3
        if shape == 0:
            b += f'<rect x="{px}" y="{yy+14}" width="52" height="56" rx="6" fill="{col}"/>\n<rect x="{px+8}" y="{yy+4}" width="36" height="14" rx="4" fill="{col}"/>\n'
        elif shape == 1:
            b += f'<rect x="{px}" y="{yy+10}" width="56" height="60" rx="26" fill="{col}"/>\n<rect x="{px+22}" y="{yy}" width="12" height="16" fill="{col}"/>\n'
        else:
            b += f'<path d="M{px} {yy+70}l10-58h36l10 58z" fill="{col}"/>\n'
b += cap(40, 60, "SHELF B · BEVERAGE & PANTRY", color="#6b6152", size="16", weight="bold", spacing="2")
b += vignette(".22")
files["storefront"] = svg("Retail shelves stocked with products", b, d)

def product_shot(name, bg1, bg2, draw):
    dd = lin("bg", bg1, bg2) + rad("hal", "#ffffff", "#ffffff", ".16", "0") + vig_def()
    b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#hal)"/>'
    b += '<ellipse cx="400" cy="420" rx="220" ry="30" fill="#00000033"/>\n'
    b += draw
    b += vignette(".2")
    return svg(name, b, dd)

files["product-headphones"] = product_shot("Wireless headphones product shot", "#1c222a", "#10151b",
    '<g transform="translate(400,240)">\n<path d="M-120 30a120 120 0 0 1 240 0" stroke="#e8e4de" stroke-width="22" fill="none"/>\n'
    '<rect x="-152" y="10" width="58" height="96" rx="26" fill="#c94f3d"/>\n<rect x="94" y="10" width="58" height="96" rx="26" fill="#c94f3d"/>\n'
    '<rect x="-140" y="24" width="34" height="68" rx="16" fill="#8a3328"/>\n<rect x="106" y="24" width="34" height="68" rx="16" fill="#8a3328"/>\n</g>\n'
    + cap(400, 452, "AURA PODS · KSH 6,500", "middle", "#e8e4de", "17", "bold", "ui-monospace, monospace", "2"))

files["product-sneakers"] = product_shot("Running sneaker product shot", "#22291f", "#131811",
    '<g transform="translate(400,260) rotate(-8)">\n<path d="M-170 40q-10-44 30-52l60-10q30-40 70-30l90 22q40 10 46 44l4 26h-300z" fill="#d9a441"/>\n'
    '<path d="M-170 40h300q14 0 14 16t-16 16h-298z" fill="#f4f1ea"/>\n'
    '<path d="M-80 -22q40-26 90-6" stroke="#22291f" stroke-width="8" fill="none"/>\n'
    '<path d="M-150 30h280" stroke="#c98a3e" stroke-width="6"/>\n</g>\n'
    + cap(400, 452, "TRAIL RUNNER X · KSH 8,900", "middle", "#e8e4de", "17", "bold", "ui-monospace, monospace", "2"))

files["product-coffee"] = product_shot("Specialty coffee bag product shot", "#2a2018", "#171009",
    '<g transform="translate(400,250)">\n<path d="M-90-70h180l14 210h-208z" fill="#8a5a3b"/>\n<path d="M-90-70h180l6 92h-192z" fill="#6b4530"/>\n'
    '<rect x="-90" y="-86" width="180" height="22" rx="8" fill="#d9a441"/>\n'
    '<circle cx="0" cy="60" r="52" fill="#f4f1ea"/>\n<circle cx="0" cy="60" r="20" fill="#3c2a1c"/>\n'
    '<path d="M-30 60q30-24 60 0" stroke="#8a5a3b" stroke-width="5" fill="none"/>\n</g>\n'
    + cap(400, 462, "RUAI AA · 250G · KSH 950", "middle", "#e8e4de", "17", "bold", "ui-monospace, monospace", "2"))

files["product-watch"] = product_shot("Minimal watch product shot", "#20242c", "#12151a",
    '<g transform="translate(400,240)">\n<rect x="-26" y="-150" width="52" height="90" rx="10" fill="#3c4148"/>\n<rect x="-26" y="66" width="52" height="90" rx="10" fill="#3c4148"/>\n'
    '<rect x="-84" y="-84" width="168" height="168" rx="42" fill="#e8e4de"/>\n<rect x="-70" y="-70" width="140" height="140" rx="34" fill="#14171c"/>\n'
    '<path d="M0 0L-30 -34M0 0L36 20" stroke="#e8e4de" stroke-width="7" stroke-linecap="round"/>\n<circle cx="0" cy="0" r="7" fill="#c94f3d"/>\n</g>\n'
    + cap(400, 458, "MERIDIAN 40 · KSH 24,500", "middle", "#e8e4de", "17", "bold", "ui-monospace, monospace", "2"))

files["product-backpack"] = product_shot("Canvas backpack product shot", "#26221c", "#15120d",
    '<g transform="translate(400,250)">\n<path d="M-100-60q0-60 100-60t100 60l16 190h-232z" fill="#8a6a44"/>\n'
    '<path d="M-100-60q0-60 100-60t100 60l6 70h-212z" fill="#6b5138"/>\n'
    '<rect x="-60" y="30" width="120" height="80" rx="12" fill="#5a4632"/>\n<rect x="-16" y="52" width="32" height="36" rx="6" fill="#d9a441"/>\n'
    '<path d="M-70 -84q70-44 140 0" stroke="#3c2f1e" stroke-width="14" fill="none"/>\n</g>\n'
    + cap(400, 466, "FIELD PACK 24L · KSH 4,200", "middle", "#e8e4de", "17", "bold", "ui-monospace, monospace", "2"))

# ============================================================ REAL ESTATE
def apartment(name, wall1, wall2, bodycol, winlit, label):
    dd = lin("bg", wall1, wall2) + lin("dusk", "#e78a3e", "#7a4a8a") + vig_def()
    b = f'<rect width="{W}" height="{H}" fill="url(#dusk)"/>\n<rect width="{W}" height="{H}" fill="url(#bg)" opacity=".35"/>'
    b += f'<rect x="120" y="120" width="240" height="300" fill="{bodycol}"/>\n<rect x="440" y="80" width="240" height="340" fill="{bodycol}" opacity=".85"/>\n'
    for bx in range(3):
        for by in range(4):
            lit = (bx + by) % 3 != 0
            b += f'<rect x="{140+bx*74}" y="{140+by*70}" width="46" height="46" fill="{winlit if lit else "#1c2430"}"/>\n'
    for bx in range(3):
        for by in range(4):
            lit = (bx * 2 + by) % 4 != 0
            b += f'<rect x="{460+bx*74}" y="{100+by*74}" width="46" height="48" fill="{winlit if lit else "#1c2430"}"/>\n'
    b += '<rect x="0" y="420" width="800" height="80" fill="#141a14"/>\n'
    b += '<path d="M60 420q40-30 90-6 M700 420q30-40 70-20" stroke="#1e2a1c" stroke-width="16" fill="none"/>\n'
    b += cap(40, 60, label, color="#f3e2c8", size="16", weight="bold", spacing="2")
    b += vignette(".42")
    return svg(name, b, dd)

files["apartment-kilimani"] = apartment("Kilimani apartment block at dusk", "#241c2c", "#141018", "#3c3444", "#f3d98a", "KILIMANI · 2-BED · KSH 58,000")
files["apartment-westlands"] = apartment("Westlands apartments evening", "#1c242c", "#10161c", "#2c3a44", "#f3c98a", "WESTLANDS · 2-BED · KSH 62,000")
files["apartment-lavington"] = apartment("Lavington garden homes", "#222c1e", "#12180e", "#3c4a34", "#f3e0a0", "LAVINGTON · GARDEN UNIT · KSH 85,000")

d = lin("bg", "#e8e2d4", "#cfc6b2") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
b += '<path d="M0 330l220-120 220 120z" fill="#8a5a3b"/>\n<path d="M0 330h440v130H0z" fill="#a9773f"/>\n<path d="M40 330l180-96 180 96z" fill="#6b4530"/>\n'
b += '<rect x="180" y="360" width="80" height="100" fill="#5a3a24"/>\n<rect x="60" y="360" width="70" height="60" fill="#e8d9b8"/>\n<rect x="310" y="360" width="70" height="60" fill="#e8d9b8"/>\n'
b += '<path d="M480 460V240l60-40 60 40v220z" fill="#7a8a92"/>\n<rect x="500" y="300" width="80" height="70" fill="#bfe0f2"/>\n'
b += '<path d="M540 240v-60" stroke="#4a4238" stroke-width="8"/>\n<circle cx="540" cy="170" r="20" fill="#8a9a5b"/>\n'
b += '<rect x="0" y="460" width="800" height="40" fill="#8a9a5b"/>\n'
b += cap(40, 60, "NGONG ROAD · 4-BED TOWNHOUSE · KSH 18.5M", color="#5a4a34", size="16", weight="bold", spacing="2")
b += vignette(".25")
files["house-townhouse"] = svg("Townhouse with garden", b, d)

# ============================================================ EDUCATION
d = lin("bg", "#eef2e4", "#d8e2c8") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
b += '<rect x="0" y="400" width="800" height="100" fill="#b8c49a"/>\n'
# blackboard
b += '<rect x="90" y="80" width="380" height="220" rx="8" fill="#2c3a30"/>\n<rect x="102" y="92" width="356" height="196" rx="6" fill="#33443a"/>\n'
b += '<path d="M130 150q40-30 80 0t80 0" stroke="#e8f0dc" stroke-width="5" fill="none"/>\n<path d="M130 200h240M130 236h160" stroke="#e8f0dc" stroke-width="4" opacity=".6"/>\n'
b += '<rect x="70" y="300" width="420" height="16" fill="#8a6a44"/>\n'
# teacher
b += person(600, 300, 1.6, "#8a5a3b", "#316b8a", "#141110")
# desks
for i in range(3):
    b += f'<rect x="{90+i*140}" y="380" width="110" height="14" rx="4" fill="#a9773f"/>\n'
    b += person(145 + i*140, 372, 0.72, ["#c68958", "#8a5a3b", "#6e4526"][i], ["#c94f3d", "#8a9a5b", "#d9a441"][i], "#1d1a17")
b += cap(40, 60, "FORM 2 · MATHEMATICS · 08:40", color="#4a5a3a", size="16", weight="bold", spacing="2")
b += vignette(".22")
files["classroom"] = svg("Classroom lesson in progress", b, d)

d = lin("bg", "#2c2438", "#181222") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# laptops on desks (e-learning lab)
for i in range(3):
    lx = 120 + i * 220
    b += f'<rect x="{lx}" y="300" width="170" height="12" rx="4" fill="#4a4258"/>\n'
    b += f'<g transform="translate({lx+20},220)"><rect width="130" height="84" rx="6" fill="#1a1622" stroke="#5a5270" stroke-width="3"/>\n'
    b += f'<path d="M12 62l24-26 18 14 26-32 24 30" stroke="#43e0a6" stroke-width="4" fill="none"/>\n<circle cx="98" cy="20" r="8" fill="#d9a441"/></g>\n'
    b += person(lx + 85, 296, 0.8, "#c68958", "#5b4a7a", "#20160e")
b += cap(40, 60, "COMPUTER LAB · SELF-PACED MODULE", color="#d8cce8", size="16", weight="bold", spacing="2")
b += vignette(".45")
files["elearning-lab"] = svg("Students in a computer learning lab", b, d)

# ============================================================ AGRICULTURE
d = lin("bg", "#8ab4d8", "#4a7a9a") + lin("field", "#5b8a3c", "#2c5a1e") + vig_def() + rad("sun", "#fff3c8", "#fff3c8", ".9", "0")
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
b += '<circle cx="640" cy="110" r="46" fill="url(#sun)"/>\n'
b += '<path d="M0 260h800v240H0z" fill="url(#field)"/>\n'
for i in range(7):
    b += f'<path d="M{40+i*30} 500 Q{200+i*60} 340 {420+i*50} 262" stroke="#3c6b28" stroke-width="10" fill="none" opacity=".7"/>\n'
# greenhouse
b += '<path d="M520 262v-70q80-50 160 0v70z" fill="#cfe3d8" opacity=".55"/>\n<path d="M520 192q80-50 160 0" stroke="#8ab0a0" stroke-width="5" fill="none"/>\n'
# farmer
b += person(200, 330, 1.3, "#6e4526", "#c98a3e", "#141110")
b += '<path d="M186 300l-40-40M214 300l40-40" stroke="#8a6a44" stroke-width="8"/>\n'
b += cap(40, 60, "WARD 3 · HASS AVOCADO · HARVEST DAY", color="#f0f7e8", size="16", weight="bold", spacing="2")
b += vignette(".35")
files["farm-field"] = svg("Farm field with farmer at harvest", b, d)

# ============================================================ CREATIVE
d = lin("bg", "#14161b", "#0a0c10") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# brand board: logo tile, type specimen, color chips, texture swatch
b += '<rect x="70" y="90" width="300" height="300" rx="12" fill="#1c1f26" stroke="#2c2f38"/>\n'
b += '<path d="M220 150l-52 150h104z" fill="none" stroke="url(#gold)" stroke-width="7"/>\n<circle cx="220" cy="150" r="8" fill="#faf7f2"/>\n'
b += cap(220, 350, "MARK", "middle", "#b9ac93", "15", "bold", "Space Grotesk, sans-serif", "3")
b += '<rect x="410" y="90" width="320" height="140" rx="12" fill="#1c1f26" stroke="#2c2f38"/>\n'
b += '<text x="436" y="160" font-family="Space Grotesk, sans-serif" font-size="52" font-weight="700" fill="#faf7f2">Aa</text>\n'
b += '<text x="530" y="160" font-family="Georgia, serif" font-size="52" fill="#b9ac93">Aa</text>\n'
b += cap(436, 200, "DISPLAY / TEXT PAIRING", color="#8a8272", size="13")
b += '<rect x="410" y="250" width="320" height="140" rx="12" fill="#1c1f26" stroke="#2c2f38"/>\n'
for i, c in enumerate(("#d9a441", "#8a5a3b", "#faf7f2", "#14161b", "#4a4238")):
    b += f'<rect x="{434+i*58}" y="286" width="48" height="48" rx="8" fill="{c}" stroke="#3a3d46"/>\n'
b += cap(434, 366, "PALETTE · 5 TOKENS", color="#8a8272", size="13")
b += cap(70, 440, "BRAND FOUNDATION · V.02", color="#d9a441", size="15", weight="bold", spacing="3")
b += vignette(".3")
files["brand-board"] = svg("Brand identity board with logo, type and palette", b, d)

d = lin("bg", "#101018", "#08080e") + lin("gold", "#ecc06a", "#a97c2f") + rad("hal", "#d9a441", "#d9a441", ".3", "0") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#hal)"/>'
# product hero pedestal
b += '<ellipse cx="400" cy="420" rx="200" ry="26" fill="#00000055"/>\n<rect x="300" y="330" width="200" height="70" rx="10" fill="#1c1f26" stroke="#3a3d46"/>\n'
# bottle hero
b += ('<g transform="translate(400,240)">\n<path d="M-46-40q-14 90 0 150t92 0q14-60 0-150l-16-30h-60z" fill="#c94f3d"/>\n'
      '<rect x="-20" y="-92" width="40" height="56" rx="8" fill="#2c2018"/>\n'
      '<rect x="-34" y="-6" width="68" height="86" rx="6" fill="#f4f1ea"/>\n'
      '<circle cx="0" cy="36" r="20" fill="#c94f3d"/>\n</g>\n')
b += cap(400, 452, "KICKOFF · 08.08 · NAIROBI", "middle", "#ecc06a", "18", "bold", "Space Grotesk, sans-serif", "4")
b += vignette(".35")
files["launch-hero"] = svg("Product launch hero with spotlight", b, d)

d = lin("bg", "#101018", "#08080e") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# three poster frames
for i, (px, tilt) in enumerate(((90, -4), (320, 2), (550, -2))):
    b += f'<g transform="translate({px},100) rotate({tilt})">\n<rect width="170" height="240" rx="8" fill="#1c1f26" stroke="#3a3d46"/>\n'
    if i == 0:
        b += '<circle cx="85" cy="90" r="46" fill="none" stroke="#d9a441" stroke-width="6"/>\n<circle cx="85" cy="90" r="18" fill="#d9a441"/>\n'
        b += cap(85, 190, "TEASER", "middle", "#b9ac93", "15", "bold", "Space Grotesk, sans-serif", "2")
    elif i == 1:
        b += '<path d="M30 60h110M30 96h110M30 132h70" stroke="#faf7f2" stroke-width="10"/>\n<rect x="30" y="160" width="70" height="26" fill="#d9a441"/>\n'
        b += cap(85, 218, "REVEAL", "middle", "#b9ac93", "15", "bold", "Space Grotesk, sans-serif", "2")
    else:
        b += '<path d="M40 200L85 60l45 140" fill="none" stroke="#d9a441" stroke-width="6"/>\n<circle cx="85" cy="60" r="10" fill="#faf7f2"/>\n'
        b += cap(85, 226, "WAITLIST", "middle", "#b9ac93", "15", "bold", "Space Grotesk, sans-serif", "2")
    b += '</g>\n'
b += cap(70, 420, "ONE STORY · THREE BEATS", color="#d9a441", size="15", weight="bold", spacing="3")
b += vignette(".3")
files["campaign-posters"] = svg("Campaign poster series", b, d)

d = lin("bg", "#0e1210", "#070a08") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# stage with beams
b += '<path d="M120 460l90-300 30 0-60 300z" fill="#d9a441" opacity=".16"/>\n<path d="M680 460l-90-300-30 0 60 300z" fill="#d9a441" opacity=".16"/>\n'
b += '<rect x="200" y="330" width="400" height="90" rx="8" fill="#1c1f26" stroke="#3a3d46"/>\n'
b += '<path d="M240 400l40-50 30 22 40-44 34 30 40-40 36 34" stroke="#d9a441" stroke-width="5" fill="none"/>\n'
for i in range(8):
    b += f'<circle cx="{230+i*48}" cy="446" r="10" fill="#2c2f38" stroke="#4a4d56"/>\n'
b += '<path d="M160 460h480" stroke="#d9a441" stroke-width="4"/>\n'
b += cap(400, 80, "SUMMIT · 12 SEATS LEFT", "middle", "#ecc06a", "17", "bold", "Space Grotesk, sans-serif", "3")
b += cap(70, 430, "LIVE OVERLAY + SECOND SCREEN", color="#8a8272", size="13")
b += vignette(".4")
files["event-stage"] = svg("Event stage with audience silhouettes", b, d)

d = lin("bg", "#f0ece2", "#ddd6c6") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# editorial spreads
b += '<rect x="80" y="90" width="300" height="320" fill="#ffffff" stroke="#c9c2b2"/>\n'
b += '<rect x="100" y="112" width="260" height="130" fill="#d9a441" opacity=".85"/>\n'
for i in range(6):
    b += f'<rect x="100" y="{266+i*20}" width="{240 - (i%3)*40}" height="9" fill="#b8b0a0"/>\n'
b += '<rect x="420" y="90" width="300" height="320" fill="#ffffff" stroke="#c9c2b2"/>\n'
b += '<text x="446" y="150" font-family="Space Grotesk, sans-serif" font-size="40" font-weight="700" fill="#14161b">The</text>\n'
b += '<text x="446" y="196" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#8a5a3b">System</text>\n'
b += '<text x="446" y="242" font-family="Space Grotesk, sans-serif" font-size="40" font-weight="700" fill="none" stroke="#14161b" stroke-width="1">Issue</text>\n'
for i in range(7):
    b += f'<rect x="446" y="{266+i*18}" width="{220 - (i%4)*30}" height="8" fill="#b8b0a0"/>\n'
b += cap(80, 452, "GRID · 12 COL · BASELINE 8", color="#6b6152", size="14", weight="bold", spacing="2")
b += vignette(".2")
files["editorial-spread"] = svg("Editorial magazine spreads", b, d)

d = lin("bg", "#181420", "#0d0a12") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# packaging: box + tube + pouch on plinth
b += '<ellipse cx="400" cy="430" rx="280" ry="30" fill="#00000044"/>\n'
b += '<g transform="translate(180,220)">\n<path d="M0 40l70-30 70 30-70 30z" fill="#2c2438"/>\n<path d="M0 40v90l70 30v-90z" fill="#1c1826"/>\n<path d="M140 40v90l-70 30v-90z" fill="#241e30"/>\n<circle cx="70" cy="85" r="20" fill="none" stroke="#d9a441" stroke-width="3"/>\n</g>\n'
b += '<g transform="translate(420,240)">\n<rect x="0" y="0" width="90" height="170" rx="18" fill="#c94f3d"/>\n<rect x="0" y="0" width="90" height="44" rx="18" fill="#a03a2c"/>\n<rect x="24" y="70" width="42" height="60" rx="6" fill="#f4f1ea"/>\n</g>\n'
b += '<g transform="translate(580,230)">\n<path d="M0 30q50-26 100 0l10 140h-120z" fill="#316b8a"/>\n<path d="M0 30q50-26 100 0l4 50h-108z" fill="#27566e"/>\n<circle cx="50" cy="110" r="24" fill="#f4f1ea"/>\n</g>\n'
b += cap(70, 452, "DIELINE -> PROOF -> SHELF", color="#b9ac93", size="14", weight="bold", spacing="3")
b += vignette(".35")
files["packaging-set"] = svg("Packaging family on display", b, d)

d = lin("bg", "#101018", "#08080e") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# 3 product turns of same bottle (small, medium large) on plinths
for i, (px, s) in enumerate(((180, .7), (400, 1.0), (620, .8))):
    b += f'<g transform="translate({px},250) scale({s})">\n<path d="M-40-30q-12 80 0 130t80 0q12-50 0-130l-14-26h-52z" fill="#c94f3d"/>\n'
    b += f'<rect x="-17" y="-76" width="34" height="48" rx="7" fill="#2c2018"/>\n<rect x="-28" y="0" width="56" height="70" rx="5" fill="#f4f1ea"/>\n</g>\n'
    b += f'<ellipse cx="{px}" cy="392" rx="{int(90*s)}" ry="14" fill="#00000044"/>\n'
b += cap(400, 452, "ONE MODEL · EVERY ANGLE · EVERY VARIANT", "middle", "#b9ac93", "14", "bold", "ui-monospace, monospace", "2")
b += vignette(".3")
files["product-turns"] = svg("3D product variants on turntables", b, d)

d = lin("bg", "#0c0e12", "#060709") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# phyllotaxis data art
for i in range(140):
    a = i * 137.5
    r = 4.6 * math.sqrt(i)
    x = 400 + r * math.cos(math.radians(a))
    y = 240 + r * math.sin(math.radians(a)) * .82
    sz = max(1.4, 6.5 - i * .035)
    col = "#d9a441" if i % 9 == 0 else ("#7a8a92" if i % 5 == 0 else "#faf7f2")
    op = min(.9, .18 + i * .008)
    b += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{sz:.1f}" fill="{col}" fill-opacity="{op:.2f}"/>\n'
b += cap(400, 452, "FY REVENUE · 1 DOT = KSH 100K", "middle", "#8a8272", "14", "bold", "ui-monospace, monospace", "2")
b += vignette(".25")
files["dataart-lobby"] = svg("Generative data artwork installation", b, d)

d = lin("bg", "#1c2620", "#0e1410") + lin("gold", "#ecc06a", "#a97c2f") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# retail space with scan tags
b += '<rect x="80" y="140" width="280" height="240" fill="#243028" stroke="#3a463c"/>\n'
b += '<rect x="120" y="180" width="200" height="120" fill="#31402f"/>\n<rect x="180" y="300" width="80" height="80" fill="#1a221c"/>\n'
b += '<rect x="470" y="120" width="240" height="300" rx="14" fill="#101216" stroke="#d9a441" stroke-width="4"/>\n'
b += '<rect x="494" y="144" width="192" height="180" fill="#d9a441" opacity=".35"/>\n'
b += cap(590, 360, "SCAN FOR STORY", "middle", "#f4f1ea", "13", "bold", "ui-monospace, monospace", "1")
b += '<path d="M360 260q50-24 110-14" stroke="#d9a441" stroke-width="3" stroke-dasharray="2 8" fill="none"/>\n'
b += cap(70, 460, "SHELF -> PHONE -> BASKET", color="#b9ac93", size="14", weight="bold", spacing="3")
b += vignette(".35")
files["retail-connected"] = svg("Connected retail shelf with smart tags", b, d)

# ============================================================ BUSINESS / OFFICE
d = lin("bg", "#20262c", "#101418") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# control room: big dashboard wall
b += '<rect x="90" y="80" width="620" height="240" rx="12" fill="#0c1210" stroke="#2c3e38"/>\n'
b += '<rect x="110" y="100" width="180" height="90" rx="6" fill="#12201a"/>\n<path d="M122 172l36-30 26 12 34-34 30 22 30-26" stroke="#43e0a6" stroke-width="4" fill="none"/>\n'
b += '<rect x="306" y="100" width="180" height="90" rx="6" fill="#12201a"/>\n<circle cx="396" cy="145" r="30" fill="none" stroke="#43e0a6" stroke-width="9"/>\n<path d="M396 145l20-14" stroke="#d9a441" stroke-width="4"/>\n'
b += '<rect x="502" y="100" width="188" height="90" rx="6" fill="#12201a"/>\n'
for i in range(4):
    b += f'<rect x="{516+i*42}" y="{172-[40,64,28,52][i]}" width="26" height="{[40,64,28,52][i]}" fill="#3e8a6b"/>\n'
b += '<rect x="110" y="204" width="580" height="96" rx="6" fill="#12201a"/>\n'
for i in range(4):
    b += f'<rect x="{124}" y="{216+i*22}" width="{[420,300,480,220][i]}" height="8" rx="3" fill="#3e8a6b" opacity="{.9-.15*i}"/>\n'
# operator
b += person(400, 420, 1.5, "#8a5a3b", "#2c3e38", "#141110")
b += cap(40, 60, "OPERATIONS · ALL SYSTEMS NOMINAL", color="#bfe8d6", size="16", weight="bold", spacing="2")
b += vignette(".5")
files["control-room"] = svg("Operations control room with dashboard wall", b, d)

d = lin("bg", "#e8e4dc", "#d2ccc0") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# meeting table
b += '<ellipse cx="400" cy="330" rx="260" ry="80" fill="#8a6a44"/>\n<ellipse cx="400" cy="318" rx="260" ry="80" fill="#a9773f"/>\n'
for px, py, sh, hr in ((240, 260, "#c68958", "#316b8a"), (400, 240, "#8a5a3b", "#c94f3d"), (560, 260, "#6e4526", "#8a9a5b")):
    b += person(px, py, 1.0, sh, hr, "#1d1a17")
b += '<rect x="360" y="290" width="80" height="46" rx="6" fill="#14161b"/>\n<path d="M372 322l16-14 12 8 20-18" stroke="#43e0a6" stroke-width="3" fill="none"/>\n'
b += cap(40, 60, "Q3 REVIEW · SALES & OPERATIONS", color="#5a5244", size="16", weight="bold", spacing="2")
b += vignette(".2")
files["boardroom"] = svg("Team meeting in a boardroom", b, d)

# ============================================================ FINTECH / MONEY
d = lin("bg", "#122018", "#08110c") + lin("acc", "#43e0a6", "#0a8a63") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# phone with money confirmation
b += '<rect x="300" y="90" width="200" height="320" rx="26" fill="#0c1611" stroke="#2c4a3a" stroke-width="3"/>\n'
b += '<rect x="316" y="130" width="168" height="120" rx="10" fill="#10241c"/>\n<circle cx="400" cy="190" r="30" fill="none" stroke="#43e0a6" stroke-width="5"/>\n<path d="M386 190l10 10 20-22" stroke="#43e0a6" stroke-width="5" fill="none"/>\n'
b += cap(400, 286, "KSH 12,500", "middle", "#43e0a6", "26", "bold", "Space Grotesk, sans-serif")
b += cap(400, 314, "RECEIVED · TILL 884210", "middle", "#7aa890", "12")
b += '<rect x="330" y="340" width="140" height="36" rx="18" fill="#43e0a6"/>\n' + cap(400, 364, "DONE", "middle", "#06110c", "14", "bold")
# coins / notes
for i, (cx, cy) in enumerate(((150, 180), (190, 240), (640, 170), (610, 250))):
    b += f'<circle cx="{cx}" cy="{cy}" r="34" fill="#d9a441"/>\n<circle cx="{cx}" cy="{cy}" r="24" fill="none" stroke="#a97c2f" stroke-width="4"/>\n'
b += cap(40, 60, "PAYMENT CONFIRMED · LEDGER SYNCED", color="#9fd8bf", size="16", weight="bold", spacing="2")
b += vignette(".45")
files["payment-phone"] = svg("Mobile payment confirmation", b, d)

# ============================================================ TELEMETRY / IoT
d = lin("bg", "#101c26", "#081018") + vig_def()
b = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
# tanks and pipes
b += '<rect x="110" y="150" width="120" height="200" rx="20" fill="#1c2c38" stroke="#3e5a6b" stroke-width="4"/>\n'
b += '<rect x="118" y="220" width="104" height="122" rx="14" fill="#2c4a5c"/>\n'
b += '<rect x="300" y="190" width="100" height="160" rx="16" fill="#1c2c38" stroke="#3e5a6b" stroke-width="4"/>\n<rect x="307" y="260" width="86" height="82" rx="12" fill="#2c4a5c"/>\n'
b += '<path d="M230 250h70M400 270h60" stroke="#3e5a6b" stroke-width="8"/>\n'
# sensors with signals
for sx, sy in ((170, 140), (350, 180), (520, 210)):
    b += f'<circle cx="{sx}" cy="{sy}" r="9" fill="#43e0a6"/>\n<path d="M{sx} {sy-14}a22 22 0 0 1 16 0M{sx} {sy-26}a34 34 0 0 1 24 0" stroke="#43e0a6" stroke-width="3" fill="none"/>\n'
# gateway
b += '<rect x="480" y="240" width="180" height="90" rx="12" fill="#10241c" stroke="#43e0a6" stroke-width="3"/>\n'
b += cap(570, 280, "GATEWAY", "middle", "#43e0a6", "15", "bold")
b += cap(570, 306, "UPLINK LIVE", "middle", "#7aa890", "11")
b += cap(40, 60, "COLD ROOM B · 3.4°C · NOMINAL", color="#9fd8bf", size="16", weight="bold", spacing="2")
b += vignette(".45")
files["iot-tanks"] = svg("Industrial tanks with IoT sensors", b, d)

print("writing", len(files), "scenes")
for name, content in files.items():
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as fh:
        fh.write(content)
print("done ->", OUT)
