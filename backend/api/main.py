from __future__ import annotations

from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

# -----------------------------
# Environment loading
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR.parent
ENV_PATH = BACKEND_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

# -----------------------------
# App
# -----------------------------
app = FastAPI(title="Blueprint Budget AI")

allowed_origins = [
    "https://blueprint-frontend-fhf8h4bhdeegucv.eastus-01.azurewebsites.net",
    "https://blueprint.ai-coach-lab.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Explicit universal OPTIONS handler for browser preflight
@app.options("/{full_path:path}")
async def options_handler(full_path: str, request: Request):
    origin = request.headers.get("origin", "")
    headers = {}

    if origin in allowed_origins:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Vary"] = "Origin"
        headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )
        headers["Access-Control-Allow-Headers"] = request.headers.get(
            "access-control-request-headers", "*"
        )

    return Response(status_code=204, headers=headers)


# -----------------------------
# Types
# -----------------------------
StyleOption = Literal[
    "Modern",
    "Contemporary",
    "Farmhouse",
    "Minimalist",
    "Traditional",
]


class HomeRequest(BaseModel):
    budget: int
    bedrooms: int
    bathrooms: int
    floors: int
    garage: str

    # Support both backend-style and frontend-style field names
    selected_style: StyleOption | None = None
    selectedStyle: StyleOption | None = None

    reference_image_name: str | None = None
    has_reference_image: bool = False


# -----------------------------
# Helpers
# -----------------------------
def get_selected_style(data: HomeRequest) -> StyleOption:
    return data.selected_style or data.selectedStyle or "Modern"  # type: ignore[return-value]


def get_garage_cost(garage: str) -> int:
    if garage == "2-Car":
        return 40000
    if garage == "1-Car":
        return 20000
    return 0


def get_style_profile(selected_style: str, has_reference_image: bool) -> dict:
    style_map = {
        "Modern": {
            "headline": "Modern",
            "description": "Clean lines, larger windows, simplified forms, and open common spaces.",
            "layout_note": "Main living spaces are kept open and connected with simpler circulation.",
            "material_note": "Supports larger windows and cleaner exterior detailing.",
        },
        "Contemporary": {
            "headline": "Contemporary",
            "description": "Balanced layouts, updated finishes, and flexible living areas.",
            "layout_note": "Flexible common spaces with balanced room placement.",
            "material_note": "Good fit for mixed materials and updated finishes.",
        },
        "Farmhouse": {
            "headline": "Farmhouse",
            "description": "Warm finishes, welcoming gathering spaces, and practical family-oriented flow.",
            "layout_note": "Practical circulation with welcoming shared spaces and efficient support areas.",
            "material_note": "Encourages practical materials and welcoming room proportions.",
        },
        "Minimalist": {
            "headline": "Minimalist",
            "description": "Efficient space planning, reduced clutter, and highly simplified forms.",
            "layout_note": "Compact circulation and efficient room grouping with fewer extra spaces.",
            "material_note": "Encourages simplified finishes and cost-efficient planning.",
        },
        "Traditional": {
            "headline": "Traditional",
            "description": "Defined rooms, classic organization, and timeless architectural character.",
            "layout_note": "Rooms are more clearly separated with a familiar spatial hierarchy.",
            "material_note": "Well suited for classic materials and structured layouts.",
        },
    }

    profile = style_map.get(selected_style, style_map["Modern"]).copy()
    profile["reference_note"] = (
        "A reference image was provided, so this concept leans more strongly toward the selected visual style."
        if has_reference_image
        else "No reference image was provided, so the style recommendation is based on the selected preference only."
    )
    return profile


def build_suggestions(
    budget: int,
    total_cost: int,
    bedrooms: int,
    bathrooms: int,
    floors: int,
    garage: str,
    materials_total: int,
    selected_style: str,
    has_reference_image: bool,
) -> list[str]:
    suggestions: list[str] = []
    difference = budget - total_cost

    if total_cost > budget:
        over_amount = total_cost - budget
        suggestions.append(
            f"This configuration is currently above your selected budget by ${over_amount:,.0f}."
        )

        if garage == "2-Car":
            suggestions.append(
                "Consider reducing the garage from 2-car to 1-car to lower overall cost."
            )
        elif garage == "1-Car":
            suggestions.append(
                "Consider removing the garage if budget efficiency is the top priority."
            )

        if bathrooms > 2:
            suggestions.append(
                "Reducing the number of bathrooms can help lower plumbing and fixture costs."
            )

        if floors > 1:
            suggestions.append(
                "A one-floor design may reduce framing, structure, and labor costs."
            )

        if materials_total > 90000:
            suggestions.append(
                "Material costs are relatively high, so reducing square footage or simplifying the layout may help."
            )

        suggestions.append(
            "You can also reduce square footage or simplify finishes to better fit the selected budget."
        )
    else:
        suggestions.append(
            "Your current home configuration fits within your selected budget."
        )

        if difference >= 50000:
            suggestions.append(
                "You have room in the budget for upgraded finishes, energy-efficient features, or added design refinements."
            )
        elif difference >= 20000:
            suggestions.append(
                "You still have budget flexibility for moderate upgrades and improved materials."
            )
        else:
            suggestions.append(
                "This plan stays close to your budget target, which keeps the layout efficient and cost-conscious."
            )

        if garage == "None":
            suggestions.append(
                "You may still have room in the budget to add a garage depending on other priorities."
            )

        if materials_total < 70000:
            suggestions.append(
                "The current material profile is fairly efficient, which supports a balanced build budget."
            )

    if selected_style == "Modern":
        suggestions.append(
            "Use larger windows, simple exterior lines, and open common spaces to strengthen the modern look."
        )
    elif selected_style == "Contemporary":
        suggestions.append(
            "Focus on flexible living areas, updated finishes, and balanced indoor-outdoor flow."
        )
    elif selected_style == "Farmhouse":
        suggestions.append(
            "Consider warm materials, welcoming living spaces, and practical room placement for a farmhouse feel."
        )
    elif selected_style == "Minimalist":
        suggestions.append(
            "Prioritize simpler forms, fewer visual elements, and highly efficient room layouts."
        )
    else:
        suggestions.append(
            "Use timeless room organization, classic finishes, and more defined spaces for a traditional design."
        )

    if has_reference_image:
        suggestions.append(
            "The uploaded reference image has been noted and is being used as a style-direction signal."
        )

    return suggestions


def build_materials_estimator(
    sqft: int,
    bedrooms: int,
    bathrooms: int,
    floors: int,
    garage: str,
    selected_style: str,
) -> dict:
    concrete_qty = max(12, round(sqft / 125))
    lumber_2x4_qty = max(320, round(sqft * 0.26))
    lumber_2x6_qty = max(180, round(sqft * 0.14))
    drywall_qty = max(240, round(sqft * 0.18))
    roofing_qty = max(18, round(sqft / 100))
    flooring_qty = max(1000, round(sqft * 0.92))
    insulation_qty = max(1200, round(sqft * 1.15))
    windows_qty = max(10, bedrooms + bathrooms + floors + 6)
    doors_qty = max(8, bedrooms + bathrooms + 4)

    if garage != "None":
        concrete_qty += 3
        lumber_2x4_qty += 25
        drywall_qty += 18
        doors_qty += 1

    if selected_style == "Modern":
        windows_qty += 2
    elif selected_style == "Traditional":
        doors_qty += 1
    elif selected_style == "Farmhouse":
        lumber_2x4_qty += 20

    materials = [
        {
            "name": "Concrete",
            "category": "Foundation",
            "quantity": concrete_qty,
            "unit": "cu yd",
            "unit_cost": 165,
        },
        {
            "name": "2x4 Lumber",
            "category": "Framing",
            "quantity": lumber_2x4_qty,
            "unit": "pieces",
            "unit_cost": 5,
        },
        {
            "name": "2x6 Lumber",
            "category": "Framing",
            "quantity": lumber_2x6_qty,
            "unit": "pieces",
            "unit_cost": 8,
        },
        {
            "name": "Drywall Sheets",
            "category": "Interior",
            "quantity": drywall_qty,
            "unit": "sheets",
            "unit_cost": 16,
        },
        {
            "name": "Roofing",
            "category": "Roof",
            "quantity": roofing_qty,
            "unit": "sq",
            "unit_cost": 140,
        },
        {
            "name": "Flooring",
            "category": "Interior",
            "quantity": flooring_qty,
            "unit": "sq ft",
            "unit_cost": 6,
        },
        {
            "name": "Insulation",
            "category": "Envelope",
            "quantity": insulation_qty,
            "unit": "sq ft",
            "unit_cost": 1.75,
        },
        {
            "name": "Windows",
            "category": "Openings",
            "quantity": windows_qty,
            "unit": "units",
            "unit_cost": 320,
        },
        {
            "name": "Doors",
            "category": "Openings",
            "quantity": doors_qty,
            "unit": "units",
            "unit_cost": 240,
        },
    ]

    detailed_materials = []
    category_totals: dict[str, int] = {}

    for item in materials:
        estimated_cost = round(item["quantity"] * item["unit_cost"])
        detailed_materials.append(
            {
                "name": item["name"],
                "category": item["category"],
                "quantity": f"{item['quantity']} {item['unit']}",
                "estimated_cost": estimated_cost,
            }
        )
        category_totals[item["category"]] = (
            category_totals.get(item["category"], 0) + estimated_cost
        )

    materials_total = sum(item["estimated_cost"] for item in detailed_materials)

    material_categories = [
        {"category": category, "estimated_cost": total}
        for category, total in sorted(category_totals.items())
    ]

    return {
        "materials": detailed_materials,
        "material_categories": material_categories,
        "materials_total": materials_total,
    }


def build_floor_plan(
    bedrooms: int,
    bathrooms: int,
    floors: int,
    garage: str,
    selected_style: str,
) -> dict:
    floors_data: list[dict] = []
    room_id = 1

    if floors == 1:
        first_floor_rooms = [
            {
                "id": room_id,
                "name": "Living / Dining",
                "type": "Living",
                "floor": 1,
                "size": "18 x 16",
            },
            {
                "id": room_id + 1,
                "name": "Kitchen",
                "type": "Kitchen",
                "floor": 1,
                "size": "12 x 12",
            },
        ]
        room_id += 2

        for i in range(bedrooms):
            first_floor_rooms.append(
                {
                    "id": room_id,
                    "name": f"Bedroom {i + 1}",
                    "type": "Bedroom",
                    "floor": 1,
                    "size": "13 x 12" if i == 0 else "12 x 11",
                }
            )
            room_id += 1

        for i in range(bathrooms):
            first_floor_rooms.append(
                {
                    "id": room_id,
                    "name": f"Bathroom {i + 1}",
                    "type": "Bath",
                    "floor": 1,
                    "size": "8 x 6",
                }
            )
            room_id += 1

        if garage != "None":
            first_floor_rooms.append(
                {
                    "id": room_id,
                    "name": "2-Car Garage" if garage == "2-Car" else "1-Car Garage",
                    "type": "Garage",
                    "floor": 1,
                    "size": "20 x 22" if garage == "2-Car" else "12 x 20",
                }
            )

        floors_data.append(
            {
                "floor": 1,
                "label": "Floor 1",
                "rooms": first_floor_rooms,
            }
        )
    else:
        first_floor_rooms = [
            {
                "id": room_id,
                "name": "Living / Dining",
                "type": "Living",
                "floor": 1,
                "size": "18 x 16",
            },
            {
                "id": room_id + 1,
                "name": "Kitchen",
                "type": "Kitchen",
                "floor": 1,
                "size": "12 x 12",
            },
        ]
        room_id += 2

        if garage != "None":
            first_floor_rooms.append(
                {
                    "id": room_id,
                    "name": "2-Car Garage" if garage == "2-Car" else "1-Car Garage",
                    "type": "Garage",
                    "floor": 1,
                    "size": "20 x 22" if garage == "2-Car" else "12 x 20",
                }
            )
            room_id += 1

        second_floor_rooms = []

        for i in range(bedrooms):
            second_floor_rooms.append(
                {
                    "id": room_id,
                    "name": f"Bedroom {i + 1}",
                    "type": "Bedroom",
                    "floor": 2,
                    "size": "13 x 12" if i == 0 else "12 x 11",
                }
            )
            room_id += 1

        for i in range(bathrooms):
            second_floor_rooms.append(
                {
                    "id": room_id,
                    "name": f"Bathroom {i + 1}",
                    "type": "Bath",
                    "floor": 2,
                    "size": "8 x 6",
                }
            )
            room_id += 1

        if bedrooms + bathrooms >= 3:
            second_floor_rooms.append(
                {
                    "id": room_id,
                    "name": "Hall / Loft",
                    "type": "Hall",
                    "floor": 2,
                    "size": "10 x 8",
                }
            )

        floors_data.append(
            {
                "floor": 1,
                "label": "Floor 1",
                "rooms": first_floor_rooms,
            }
        )
        floors_data.append(
            {
                "floor": 2,
                "label": "Floor 2",
                "rooms": second_floor_rooms,
            }
        )

    plan_summary = (
        f"{bedrooms}-bedroom, {bathrooms}-bathroom {selected_style.lower()} home with "
        f"{floors} floor{'s' if floors > 1 else ''}"
    )
    if garage != "None":
        plan_summary += f" and a {garage.lower()} garage"

    rooms = [room for floor in floors_data for room in floor["rooms"]]

    return {
        "plan_summary": plan_summary,
        "rooms": rooms,
        "floors_data": floors_data,
    }


# -----------------------------
# Root + Health
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "Blueprint Budget AI backend running"}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": "Blueprint Budget AI",
        "allowed_origins": allowed_origins,
    }


# -----------------------------
# Core Endpoint
# -----------------------------
@app.post("/generate-plan")
def generate_plan(data: HomeRequest):
    selected_style = get_selected_style(data)

    style_profile = get_style_profile(
        selected_style=selected_style,
        has_reference_image=data.has_reference_image,
    )

    base_sqft = 1200
    base_cost = 220000

    if selected_style == "Minimalist":
        base_sqft -= 60
    elif selected_style in {"Traditional", "Farmhouse"}:
        base_sqft += 80

    bedroom_sqft = data.bedrooms * 150
    bathroom_sqft = data.bathrooms * 80
    extra_floor_sqft = max(0, data.floors - 1) * 250

    bedroom_cost = data.bedrooms * 18000
    bathroom_cost = data.bathrooms * 12000
    floor_cost = max(0, data.floors - 1) * 25000
    garage_cost = get_garage_cost(data.garage)

    style_cost = 0
    if selected_style == "Modern":
        style_cost = 8000
    elif selected_style == "Contemporary":
        style_cost = 6000
    elif selected_style == "Farmhouse":
        style_cost = 7000
    elif selected_style == "Traditional":
        style_cost = 5000

    sqft = base_sqft + bedroom_sqft + bathroom_sqft + extra_floor_sqft

    construction_subtotal = (
        base_cost + bedroom_cost + bathroom_cost + floor_cost + garage_cost + style_cost
    )

    materials_data = build_materials_estimator(
        sqft=sqft,
        bedrooms=data.bedrooms,
        bathrooms=data.bathrooms,
        floors=data.floors,
        garage=data.garage,
        selected_style=selected_style,
    )

    materials_total = materials_data["materials_total"]
    total_cost = construction_subtotal + materials_total
    within_budget = total_cost <= data.budget

    suggestions = build_suggestions(
        budget=data.budget,
        total_cost=total_cost,
        bedrooms=data.bedrooms,
        bathrooms=data.bathrooms,
        floors=data.floors,
        garage=data.garage,
        materials_total=materials_total,
        selected_style=selected_style,
        has_reference_image=data.has_reference_image,
    )

    floor_plan = build_floor_plan(
        bedrooms=data.bedrooms,
        bathrooms=data.bathrooms,
        floors=data.floors,
        garage=data.garage,
        selected_style=selected_style,
    )

    return {
        "sqft": sqft,
        "total_cost": total_cost,
        "within_budget": within_budget,
        "materials": materials_data["materials"],
        "material_categories": materials_data["material_categories"],
        "materials_total": materials_total,
        "suggestions": suggestions,
        "plan_summary": floor_plan["plan_summary"],
        "rooms": floor_plan["rooms"],
        "floors_data": floor_plan["floors_data"],
        "style_match": {
            "selected_style": selected_style,
            "reference_image_used": data.has_reference_image,
            "reference_image_name": data.reference_image_name,
            "headline": style_profile["headline"],
            "description": style_profile["description"],
            "layout_note": style_profile["layout_note"],
            "material_note": style_profile["material_note"],
            "reference_note": style_profile["reference_note"],
        },
        "breakdown": {
            "base": base_cost,
            "bedrooms": bedroom_cost,
            "bathrooms": bathroom_cost,
            "floors": floor_cost,
            "garage": garage_cost,
            "style": style_cost,
            "materials": materials_total,
        },
    }
