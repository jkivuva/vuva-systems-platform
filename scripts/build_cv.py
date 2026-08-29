"""
Builds BLINK_FORWARD_DEPLOYED_ENGINEER_CV.pdf.

Honest, recruiter-friendly CV for the Blink Forward Deployed Engineer application.
Only verifiable project work and skills; no invented employers, dates or degrees.

Usage:  python scripts/build_cv.py
Output: cv/BLINK_FORWARD_DEPLOYED_ENGINEER_CV.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable
)

INK = HexColor("#16253c")
SOFT = HexColor("#45536b")
ACCENT = HexColor("#1d4ed8")
LINE = HexColor("#d8dee9")

NAME = "Joshua Kivuva"
ROLE = "Software Engineer — Full-Stack · AI Systems"
CONTACT = "Nairobi, Kenya  ·  hello@vuvasystems.com  ·  +254 739 694 759  ·  vuvasystems.com"

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=INK),
    "role": ParagraphStyle("role", fontName="Helvetica", fontSize=11, leading=14, textColor=SOFT),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.5, leading=12, textColor=SOFT),
    "h": ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=10, leading=13,
                        textColor=ACCENT, spaceBefore=10, spaceAfter=4),
    "item_t": ParagraphStyle("item_t", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=INK),
    "item_m": ParagraphStyle("item_m", fontName="Helvetica-Oblique", fontSize=8.5, leading=11, textColor=SOFT),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9, leading=12.6, textColor=HexColor("#2a3547")),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9, leading=12.4,
                             textColor=HexColor("#2a3547"), leftIndent=9, bulletIndent=0),
}

def heading(text):
    return [Paragraph(text.upper(), styles["h"]),
            HRFlowable(width="100%", thickness=0.8, color=LINE, spaceAfter=6)]

def bullets(items):
    return [Paragraph(f"• {i}", styles["bullet"]) for i in items]

doc = SimpleDocTemplate(
    "cv/BLINK_FORWARD_DEPLOYED_ENGINEER_CV.pdf",
    pagesize=A4,
    topMargin=16*mm, bottomMargin=14*mm, leftMargin=17*mm, rightMargin=17*mm,
    title="Joshua Kivuva — Forward Deployed Engineer CV",
    author=NAME,
)

story = []
story += [Paragraph(NAME, styles["name"]),
          Spacer(1, 2),
          Paragraph(ROLE, styles["role"]),
          Spacer(1, 3),
          Paragraph(CONTACT, styles["contact"]),
          Spacer(1, 6),
          HRFlowable(width="100%", thickness=1.4, color=INK)]

story += heading("Profile")
story += [Paragraph(
    "I design and build complete software systems: React/Next.js front ends, typed APIs, "
    "databases, payments and practical AI features deployed to real users. My recent work centres "
    "on AI engineering — LLM integration, retrieval-augmented generation with source attribution, "
    "human-in-the-loop review and AI governance — applied to content platforms and operations "
    "systems. I ship working products end to end and document them honestly.", styles["body"])]

story += heading("Selected Projects")
story += [Paragraph("AI Content Experience Platform — Next.js · TypeScript · RAG · Cloudflare Workers", styles["item_t"])]
story += [Paragraph("Technical demonstration built for a Forward Deployed Engineer application · live at vuva-ai-content-platform.vuva-systems.workers.dev", styles["item_m"])]
story += bullets([
    "Built a complete content platform: headless CMS abstraction, AI drafting assistant (nine editorial operations), BM25/RAG search that cites its sources and refuses when coverage is thin, evaluation harness, and an approval-gated publishing workflow with an append-only audit log.",
    "Enforced governance in code: publication requires prior human approval, the automation identity is barred from publishing, illegal workflow transitions are rejected server-side — all covered by tests.",
    "Designed provider-agnostic LLM integration over the OpenAI-compatible protocol (DeepSeek-ready) with a circuit breaker; demo mode runs a deterministic heuristic engine so the product works with zero credentials.",
    "Shipped as static export on Cloudflare Workers with edge APIs; 38 automated tests across retrieval relevance, RAG guardrails, workflow rules and API contracts.",
])

story += [Spacer(1, 4), Paragraph("Limitless Logistics — Logistics Platform for a Freight Company", styles["item_t"])]
story += [Paragraph("Customer site · AI assistant · Operations dashboard", styles["item_m"])]
story += bullets([
    "Delivered shipment tracking for customers, an assistant answering status questions from live records, quote requests and one dashboard for the dispatch team.",
])

story += [Spacer(1, 4), Paragraph("Blitz Restaurant — Restaurant & Delivery Platform", styles["item_t"])]
story += [Paragraph("Orders · M-Pesa payments · Kitchen & rider operations · Multi-branch", styles["item_m"])]
story += bullets([
    "Connected ordering, M-Pesa payment confirmation, kitchen screens and rider dispatch so every order flows automatically from payment to delivery; managers get per-branch reporting.",
])

story += heading("Engineering Capabilities")
two_col = [
    ("Front end", "React 19, Next.js 15 (App Router, RSC, static export), Tailwind CSS, WCAG-conscious accessibility (semantic HTML, keyboard flows, focus management)."),
    ("Back end & APIs", "TypeScript services, Node.js, REST API design with consistent envelopes and validation at boundaries; webhooks with signature verification."),
    ("AI / LLM engineering", "OpenAI-compatible provider abstraction, RAG pipelines (BM25 → vector-ready), prompt-injection defences, source attribution, evaluation harnesses, human-in-the-loop workflows."),
    ("Data & infrastructure", "SQL databases (SQLite/D1/Postgres-shaped schemas), Cloudflare Workers/Pages deployment, edge delivery, structured health endpoints."),
    ("Quality", "Vitest unit/API suites, typecheck-clean strict TypeScript, CI-shaped verification before deploy; honest labelling of simulated data."),
    ("Ways of working", "Direct client communication, scoping from business problems to system designs, documentation written for humans (architecture, security, governance notes)."),
]
for title, desc in two_col:
    story += [Paragraph(f"<b>{title}:</b> {desc}", styles["body"]), Spacer(1, 3)]

story += heading("Contact & Links")
story += bullets([
    "Portfolio: vuvasystems.com",
    "Platform demo: vuva-ai-content-platform.vuva-systems.workers.dev",
    "Case study: vuvasystems.com/work/ai-content-platform/",
])

doc.build(story)
print("CV written to cv/BLINK_FORWARD_DEPLOYED_ENGINEER_CV.pdf")
