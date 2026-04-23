"use client";

import { useMemo, useRef, useState } from "react";
import GeneratedPlan from "../components/GeneratedPlan";
import PlanPreview from "../components/PlanPreview";

type MaterialItem = {
  name: string;
  category: string;
  quantity: string;
  estimated_cost: number;
};

type MaterialCategoryItem = {
  category: string;
  estimated_cost: number;
};

type RoomItem = {
  id: number;
  name: string;
  type: string;
  floor: number;
  size: string;
};

type FloorGroup = {
  floor: number;
  label: string;
  rooms: RoomItem[];
};

type StyleOption =
  | "Modern"
  | "Contemporary"
  | "Farmhouse"
  | "Minimalist"
  | "Traditional";

type StyleMatch = {
  selected_style: StyleOption;
  reference_image_used: boolean;
  reference_image_name?: string | null;
  headline: string;
  description: string;
  layout_note: string;
  material_note: string;
  reference_note: string;
};

type Breakdown = {
  base: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garage: number;
  style: number;
  materials: number;
};

type GeneratedPlanType = {
  sqft: number;
  total_cost: number;
  within_budget: boolean;
  materials: MaterialItem[];
  material_categories: MaterialCategoryItem[];
  materials_total: number;
  suggestions: string[];
  plan_summary: string;
  floors_data: FloorGroup[];
  style_match: StyleMatch;
  breakdown: Breakdown;
  generated_at?: string;
};

const styleDescriptions: Record<StyleOption, string> = {
  Modern:
    "Clean lines, larger windows, simplified forms, and a sleek overall appearance.",
  Contemporary:
    "Balanced layouts, updated finishes, open spaces, and flexible design elements.",
  Farmhouse:
    "Warm finishes, practical layouts, welcoming living spaces, and classic exterior charm.",
  Minimalist:
    "Efficient space planning, reduced visual clutter, and highly simplified design choices.",
  Traditional:
    "Defined rooms, familiar proportions, timeless materials, and classic architectural details.",
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 shadow-sm backdrop-blur-sm">
        <svg
          viewBox="0 0 64 64"
          className="h-7 w-7 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 50V16h18l18 18v16H14Z" />
          <path d="M32 16v18h18" />
          <path d="M22 30h7" />
          <path d="M22 38h12" />
          <path d="M38 50V40h8v10" />
        </svg>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[22px] font-semibold tracking-tight text-white">
          Blueprint Budget AI
        </span>
        <span className="hidden h-7 w-px bg-white/25 md:block" />
      </div>
    </div>
  );
}

function AvatarIcon() {
  return (
    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/60 bg-white shadow-sm">
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      </div>
    </div>
  );
}

function buildSqft(params: {
  bedrooms: number;
  bathrooms: number;
  floors: number;
  selectedStyle: StyleOption;
}) {
  const { bedrooms, bathrooms, floors, selectedStyle } = params;
  let baseSqft = 1200;

  if (selectedStyle === "Minimalist") baseSqft -= 60;
  if (selectedStyle === "Traditional" || selectedStyle === "Farmhouse") {
    baseSqft += 80;
  }

  return (
    baseSqft +
    bedrooms * 150 +
    bathrooms * 80 +
    Math.max(0, floors - 1) * 250
  );
}

function buildFloorsData(params: {
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garage: string;
}): FloorGroup[] {
  const { bedrooms, bathrooms, floors, garage } = params;

  let roomId = 1;

  if (floors === 1) {
    const singleFloorRooms: RoomItem[] = [
      {
        id: roomId++,
        name: "Living / Dining",
        type: "Living",
        floor: 1,
        size: "18 × 16",
      },
      {
        id: roomId++,
        name: "Kitchen",
        type: "Kitchen",
        floor: 1,
        size: "12 × 12",
      },
    ];

    for (let i = 0; i < bedrooms; i += 1) {
      singleFloorRooms.push({
        id: roomId++,
        name: `Bedroom ${i + 1}`,
        type: "Bedroom",
        floor: 1,
        size: i === 0 ? "13 × 12" : "12 × 11",
      });
    }

    for (let i = 0; i < bathrooms; i += 1) {
      singleFloorRooms.push({
        id: roomId++,
        name: `Bathroom ${i + 1}`,
        type: "Bath",
        floor: 1,
        size: "8 × 6",
      });
    }

    if (garage !== "None") {
      singleFloorRooms.push({
        id: roomId++,
        name: garage === "2-Car" ? "2-Car Garage" : "1-Car Garage",
        type: "Garage",
        floor: 1,
        size: garage === "2-Car" ? "20 × 22" : "12 × 20",
      });
    }

    return [
      {
        floor: 1,
        label: "Floor 1",
        rooms: singleFloorRooms,
      },
    ];
  }

  const floorOneRooms: RoomItem[] = [
    {
      id: roomId++,
      name: "Living / Dining",
      type: "Living",
      floor: 1,
      size: "18 × 16",
    },
    {
      id: roomId++,
      name: "Kitchen",
      type: "Kitchen",
      floor: 1,
      size: "12 × 12",
    },
  ];

  if (garage !== "None") {
    floorOneRooms.push({
      id: roomId++,
      name: garage === "2-Car" ? "2-Car Garage" : "1-Car Garage",
      type: "Garage",
      floor: 1,
      size: garage === "2-Car" ? "20 × 22" : "12 × 20",
    });
  }

  const floorTwoRooms: RoomItem[] = [];

  for (let i = 0; i < bedrooms; i += 1) {
    floorTwoRooms.push({
      id: roomId++,
      name: `Bedroom ${i + 1}`,
      type: "Bedroom",
      floor: 2,
      size: i === 0 ? "13 × 12" : "12 × 11",
    });
  }

  for (let i = 0; i < bathrooms; i += 1) {
    floorTwoRooms.push({
      id: roomId++,
      name: `Bathroom ${i + 1}`,
      type: "Bath",
      floor: 2,
      size: "8 × 6",
    });
  }

  if (bedrooms + bathrooms >= 3) {
    floorTwoRooms.push({
      id: roomId++,
      name: "Hall / Loft",
      type: "Hall",
      floor: 2,
      size: "10 × 8",
    });
  }

  return [
    {
      floor: 1,
      label: "Floor 1",
      rooms: floorOneRooms,
    },
    {
      floor: 2,
      label: "Floor 2",
      rooms: floorTwoRooms,
    },
  ];
}

function buildMaterials(params: {
  sqft: number;
  garage: string;
  selectedStyle: StyleOption;
}): MaterialItem[] {
  const { sqft, garage, selectedStyle } = params;

  const concreteQty = Math.max(12, Math.round(sqft / 125));
  let lumber2x4Qty = Math.max(320, Math.round(sqft * 0.26));
  const lumber2x6Qty = Math.max(180, Math.round(sqft * 0.14));
  const drywallQty = Math.max(240, Math.round(sqft * 0.18));
  const roofingQty = Math.max(18, Math.round(sqft / 100));
  const flooringQty = Math.max(1000, Math.round(sqft * 0.92));

  if (selectedStyle === "Farmhouse") lumber2x4Qty += 20;

  const garageAdjustments =
    garage !== "None"
      ? { concrete: 3, lumber2x4: 25, drywall: 18 }
      : { concrete: 0, lumber2x4: 0, drywall: 0 };

  return [
    {
      name: "Concrete",
      category: "Foundation",
      quantity: `${concreteQty + garageAdjustments.concrete} cu yd`,
      estimated_cost: (concreteQty + garageAdjustments.concrete) * 165,
    },
    {
      name: "2x4 Lumber",
      category: "Framing",
      quantity: `${lumber2x4Qty + garageAdjustments.lumber2x4}`,
      estimated_cost: (lumber2x4Qty + garageAdjustments.lumber2x4) * 5,
    },
    {
      name: "2x6 Lumber",
      category: "Framing",
      quantity: `${lumber2x6Qty}`,
      estimated_cost: lumber2x6Qty * 8,
    },
    {
      name: "Drywall Sheets",
      category: "Interior",
      quantity: `${drywallQty + garageAdjustments.drywall}`,
      estimated_cost: (drywallQty + garageAdjustments.drywall) * 16,
    },
    {
      name: "Roofing",
      category: "Roof",
      quantity: `${roofingQty} sq`,
      estimated_cost: roofingQty * 140,
    },
    {
      name: "Flooring",
      category: "Interior",
      quantity: `${flooringQty} sq ft`,
      estimated_cost: flooringQty * 6,
    },
  ];
}

function buildMaterialCategories(
  materials: MaterialItem[]
): MaterialCategoryItem[] {
  const totals: Record<string, number> = {};

  materials.forEach((item) => {
    totals[item.category] = (totals[item.category] ?? 0) + item.estimated_cost;
  });

  return Object.entries(totals).map(([category, estimated_cost]) => ({
    category,
    estimated_cost,
  }));
}

function buildPlan(params: {
  budget: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garage: string;
  selectedStyle: StyleOption;
  uploadedImage: string | null;
  uploadedImageName: string;
}): GeneratedPlanType {
  const {
    budget,
    bedrooms,
    bathrooms,
    floors,
    garage,
    selectedStyle,
    uploadedImage,
    uploadedImageName,
  } = params;

  const sqft = buildSqft({ bedrooms, bathrooms, floors, selectedStyle });

  const floors_data = buildFloorsData({
    bedrooms,
    bathrooms,
    floors,
    garage,
  });

  const materials = buildMaterials({
    sqft,
    garage,
    selectedStyle,
  });

  const material_categories = buildMaterialCategories(materials);
  const materials_total = materials.reduce(
    (sum, item) => sum + item.estimated_cost,
    0
  );

  const style =
    selectedStyle === "Modern"
      ? 8000
      : selectedStyle === "Contemporary"
        ? 6000
        : selectedStyle === "Farmhouse"
          ? 7000
          : selectedStyle === "Traditional"
            ? 5000
            : 0;

  const breakdown: Breakdown = {
    base: 220000,
    bedrooms: bedrooms * 18000,
    bathrooms: bathrooms * 12000,
    floors: Math.max(0, floors - 1) * 25000,
    garage: garage === "2-Car" ? 40000 : garage === "1-Car" ? 20000 : 0,
    style,
    materials: materials_total,
  };

  const total_cost =
    breakdown.base +
    breakdown.bedrooms +
    breakdown.bathrooms +
    breakdown.floors +
    breakdown.garage +
    breakdown.style +
    breakdown.materials;

  const within_budget = total_cost <= budget;

  const suggestions = [
    within_budget
      ? "Your current home configuration fits within your selected budget."
      : "This configuration is currently above your selected budget.",
    within_budget
      ? "You can explore finish upgrades or moderate enhancements."
      : "Consider reducing garage size, floor count, bedrooms, or bathrooms to improve affordability.",
    selectedStyle === "Modern"
      ? "Use larger windows, simple exterior lines, and open common spaces to strengthen the modern look."
      : selectedStyle === "Contemporary"
        ? "Focus on flexible living areas, updated finishes, and balanced indoor-outdoor flow."
        : selectedStyle === "Farmhouse"
          ? "Consider warm materials, welcoming living spaces, and practical room placement for a farmhouse feel."
          : selectedStyle === "Minimalist"
            ? "Prioritize simpler forms, fewer visual elements, and highly efficient room layouts."
            : "Use timeless room organization, classic finishes, and more defined spaces for a traditional design.",
  ];

  const style_match: StyleMatch = {
    selected_style: selectedStyle,
    reference_image_used: Boolean(uploadedImage),
    reference_image_name: uploadedImageName || null,
    headline: selectedStyle,
    description: styleDescriptions[selectedStyle],
    layout_note:
      floors === 2
        ? `Main living spaces stay on Floor 1, while ${bedrooms} bedroom${bedrooms === 1 ? "" : "s"
        } and ${bathrooms} bathroom${bathrooms === 1 ? "" : "s"
        } shift to Floor 2.`
        : `The layout keeps shared living, ${bedrooms} bedroom${bedrooms === 1 ? "" : "s"
        }, and ${bathrooms} bathroom${bathrooms === 1 ? "" : "s"
        } on one level.`,
    material_note:
      selectedStyle === "Modern"
        ? "This layout supports simplified exterior lines, larger windows, and cleaner detailing."
        : selectedStyle === "Farmhouse"
          ? "This layout supports warm finishes, practical circulation, and welcoming common spaces."
          : "This layout supports balanced room placement and consistent finishes.",
    reference_note: uploadedImage
      ? "A reference image was provided, so the visual concept leans toward the uploaded exterior style."
      : "No reference image was provided, so the concept is based on the selected style only.",
  };

  return {
    sqft,
    total_cost,
    within_budget,
    materials,
    material_categories,
    materials_total,
    suggestions,
    plan_summary:
      floors === 1
        ? `${selectedStyle} single-floor home with ${bedrooms} bedroom${bedrooms === 1 ? "" : "s"
        }, ${bathrooms} bathroom${bathrooms === 1 ? "" : "s"
        }, living / dining, kitchen${garage !== "None" ? `, and a ${garage.toLowerCase()} garage` : ""
        }.`
        : `${selectedStyle} two-floor home with Floor 1 for living / dining and kitchen, and Floor 2 for ${bedrooms} bedroom${bedrooms === 1 ? "" : "s"
        } and ${bathrooms} bathroom${bathrooms === 1 ? "" : "s"
        }${garage !== "None" ? `, plus a ${garage.toLowerCase()} garage` : ""
        }.`,
    floors_data,
    style_match,
    breakdown,
    generated_at: new Date().toISOString(),
  };
}

function normalizeApiPlan(
  data: Partial<GeneratedPlanType>,
  fallbackPlan: GeneratedPlanType
): GeneratedPlanType {
  return {
    sqft: data.sqft ?? fallbackPlan.sqft,
    total_cost: data.total_cost ?? fallbackPlan.total_cost,
    within_budget: data.within_budget ?? fallbackPlan.within_budget,
    materials: data.materials ?? fallbackPlan.materials,
    material_categories:
      data.material_categories ?? fallbackPlan.material_categories,
    materials_total: data.materials_total ?? fallbackPlan.materials_total,
    suggestions: data.suggestions ?? fallbackPlan.suggestions,
    plan_summary: data.plan_summary ?? fallbackPlan.plan_summary,
    floors_data:
      data.floors_data && data.floors_data.length > 0
        ? data.floors_data
        : fallbackPlan.floors_data,
    style_match: data.style_match ?? fallbackPlan.style_match,
    breakdown: data.breakdown ?? fallbackPlan.breakdown,
    generated_at: data.generated_at ?? new Date().toISOString(),
  };
}

function PlanStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "red";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:p-5">
      <p className="text-[13px] text-slate-500">{label}</p>
      <p
        className={`mt-2 text-[20px] font-semibold ${tone === "green"
          ? "text-emerald-700"
          : tone === "red"
            ? "text-red-600"
            : "text-slate-800"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function Home() {
  const [budget, setBudget] = useState<number>(350000);
  const [bedrooms, setBedrooms] = useState<string>("2");
  const [bathrooms, setBathrooms] = useState<string>("1");
  const [floors, setFloors] = useState<string>("1");
  const [garage, setGarage] = useState<string>("2-Car");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>("Modern");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlanType | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [selectedFloorTab, setSelectedFloorTab] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const livePlan = useMemo(
    () =>
      buildPlan({
        budget,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        floors: Number(floors),
        garage,
        selectedStyle,
        uploadedImage,
        uploadedImageName,
      }),
    [
      budget,
      bedrooms,
      bathrooms,
      floors,
      garage,
      selectedStyle,
      uploadedImage,
      uploadedImageName,
    ]
  );

  const displayedPlan = generatedPlan ?? livePlan;

  const activeFloor =
    displayedPlan?.floors_data?.find((f) => f.floor === selectedFloorTab) ??
    displayedPlan?.floors_data?.[0];

  const resetGeneratedResult = () => {
    setGeneratedPlan(null);
    setSuccessMessage("");
    setLastGeneratedAt("");
    setSelectedFloorTab(1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    setUploadedImageName(file.name);
    resetGeneratedResult();
  };

  const removeUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    setUploadedImage(null);
    setUploadedImageName("");
    resetGeneratedResult();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePlan = async () => {
    setLoading(true);

    const fallbackPlan = buildPlan({
      budget,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      floors: Number(floors),
      garage,
      selectedStyle,
      uploadedImage,
      uploadedImageName,
    });

    try {
      const payload = {
        budget,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        floors: Number(floors),
        garage,
        selectedStyle,
      };

      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

      const response = await fetch(
        apiBase ? `${apiBase}/generate-plan` : `/api/generate-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const normalizedPlan = normalizeApiPlan(data, fallbackPlan);

      setGeneratedPlan(normalizedPlan);
      setSelectedFloorTab(1);
      setSuccessMessage(
        uploadedImage
          ? `Plan generated successfully from AI backend using your uploaded reference image for ${normalizedPlan.floors_data.length
          } floor${normalizedPlan.floors_data.length > 1 ? "s" : ""}.`
          : `Plan generated successfully from AI backend for ${normalizedPlan.floors_data.length
          } floor${normalizedPlan.floors_data.length > 1 ? "s" : ""}.`
      );
      setLastGeneratedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("API failed, falling back to local plan generation:", error);

      setGeneratedPlan(fallbackPlan);
      setSelectedFloorTab(1);
      setSuccessMessage(
        uploadedImage
          ? `API unavailable. Fallback plan generated locally from your uploaded reference image for ${fallbackPlan.floors_data.length
          } floor${fallbackPlan.floors_data.length > 1 ? "s" : ""}.`
          : `API unavailable. Fallback plan generated locally for ${fallbackPlan.floors_data.length
          } floor${fallbackPlan.floors_data.length > 1 ? "s" : ""}.`
      );
      setLastGeneratedAt(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  const hasGenerated = generatedPlan !== null;

  return (
    <div className="min-h-screen bg-[#edf1f6] text-slate-900">
      <header className="border-b border-blue-500/30 bg-gradient-to-r from-[#3766d5] to-[#4b72d8] text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-[1820px] items-center justify-between px-4 py-5 sm:px-5 lg:px-6">
          <div className="flex items-center gap-8">
            <BrandLogo />
            <nav className="hidden items-center gap-10 text-[17px] text-white/90 md:flex">
              <span className="cursor-pointer hover:text-white">Projects</span>
              <span className="cursor-pointer hover:text-white">Plans</span>
              <span className="cursor-pointer hover:text-white">Materials</span>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={generatePlan}
              disabled={loading}
              className="rounded-2xl border border-white/70 bg-white/10 px-7 py-3 text-lg font-medium text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              {loading ? "Generating..." : "AI Generate Plan"}
            </button>
            <AvatarIcon />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1820px] px-4 py-7 sm:px-5 lg:px-6">
        {successMessage && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700">
            <span>{successMessage}</span>
            <span className="text-green-500">{lastGeneratedAt}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1.9fr)_255px] 2xl:grid-cols-[290px_minmax(0,2fr)_265px]">
          <aside>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:p-6">
              <h2 className="mb-6 text-[22px] font-semibold tracking-tight text-slate-800">
                Define Your Home
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => {
                      setBudget(Number(e.target.value || 0));
                      resetGeneratedResult();
                    }}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[17px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {(
                  [
                    {
                      label: "Bedrooms",
                      value: bedrooms,
                      set: setBedrooms,
                      options: ["1", "2", "3", "4", "5"],
                    },
                    {
                      label: "Bathrooms",
                      value: bathrooms,
                      set: setBathrooms,
                      options: ["1", "2", "3", "4"],
                    },
                    {
                      label: "Floors",
                      value: floors,
                      set: setFloors,
                      options: ["1", "2"],
                    },
                    {
                      label: "Garage",
                      value: garage,
                      set: setGarage,
                      options: ["None", "1-Car", "2-Car"],
                    },
                    {
                      label: "Preferred Style",
                      value: selectedStyle,
                      set: (v: string) => setSelectedStyle(v as StyleOption),
                      options: [
                        "Modern",
                        "Contemporary",
                        "Farmhouse",
                        "Minimalist",
                        "Traditional",
                      ],
                    },
                  ] as const
                ).map(({ label, value, set, options }) => (
                  <div key={label}>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      {label}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => {
                        (set as (v: string) => void)(e.target.value);
                        resetGeneratedResult();
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[15px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Optional Reference Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="reference-image-upload"
                  />

                  {!uploadedImage ? (
                    <label
                      htmlFor="reference-image-upload"
                      className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-2xl text-slate-400">
                        +
                      </div>
                      <p className="text-[15px] font-medium text-slate-500">
                        Upload Reference Image
                      </p>
                    </label>
                  ) : (
                    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50">
                      <div className="h-44 w-full bg-slate-100 p-3">
                        <img
                          src={uploadedImage}
                          alt="Reference preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {uploadedImageName}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <label
                            htmlFor="reference-image-upload"
                            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Replace
                          </label>
                          <button
                            type="button"
                            onClick={removeUploadedImage}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:p-6">
              <h1 className="text-[32px] font-semibold tracking-tight text-slate-800 xl:text-[40px]">
                AI-Generated Home Plan
              </h1>
              <p className="mt-2 text-[16px] leading-7 text-slate-500">
                AI-powered SmartBuild Planner for budget-aware new design.
              </p>

              <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-4 xl:p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {displayedPlan.floors_data.map((floor) => (
                    <button
                      key={floor.floor}
                      type="button"
                      onClick={() => setSelectedFloorTab(floor.floor)}
                      className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${activeFloor?.floor === floor.floor
                        ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                        : "bg-transparent text-slate-400 hover:bg-white/70 hover:text-slate-600"
                        }`}
                    >
                      {floor.label}
                    </button>
                  ))}
                </div>

                {hasGenerated && activeFloor ? (
                  <GeneratedPlan floorGroup={activeFloor} />
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto max-w-xl">
                      <p className="text-lg font-semibold text-slate-700">
                        Your floor plan will appear here
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        Upload an optional house photo, choose your home
                        settings, and click{" "}
                        <span className="font-semibold text-slate-700">
                          AI Generate Plan
                        </span>{" "}
                        to render the selected layout.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <PlanStat
                    label="Dimensions"
                    value={`${displayedPlan.sqft.toLocaleString()} sqft`}
                  />
                  <PlanStat
                    label="Estimated Cost"
                    value={formatCurrency(displayedPlan.total_cost)}
                  />
                  <PlanStat
                    label="Budget Fit"
                    value={
                      displayedPlan.within_budget ? "Within Budget" : "Over Budget"
                    }
                    tone={displayedPlan.within_budget ? "green" : "red"}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 xl:p-6">
                <h3 className="text-[22px] font-semibold tracking-tight text-slate-800">
                  Refinement Suggestions
                </h3>
                <div className="mt-4 space-y-3">
                  {displayedPlan.suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion}-${index}`}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[13px] leading-6 ${displayedPlan.within_budget
                        ? "border-slate-200 bg-slate-50 text-slate-700"
                        : index === 0
                          ? "border-red-200 bg-red-50 text-slate-700"
                          : "border-amber-200 bg-amber-50 text-slate-700"
                        }`}
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${displayedPlan.within_budget
                          ? "bg-slate-400"
                          : index === 0
                            ? "bg-red-400"
                            : "bg-amber-400"
                          }`}
                      />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside>
            <div className="space-y-5">
              <PlanPreview
                uploadedImage={uploadedImage}
                uploadedImageName={uploadedImageName}
              />

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-[20px] font-semibold tracking-tight text-slate-800">
                  Materials List
                </h2>
                <div className="space-y-3">
                  {displayedPlan.materials.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-[14px] font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.quantity}
                        </p>
                      </div>
                      <p className="text-[14px] font-semibold text-slate-700">
                        {formatCurrency(item.estimated_cost)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-[20px] font-semibold tracking-tight text-slate-800">
                  Cost Breakdown
                </h2>
                <div className="space-y-2.5">
                  {displayedPlan.material_categories.map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[13px] text-slate-600">
                        {item.category}
                      </span>
                      <span className="text-[13px] font-medium text-slate-800">
                        {formatCurrency(item.estimated_cost)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <div className="space-y-2">
                    {[
                      ["Base House", displayedPlan.breakdown.base],
                      ["Bedrooms", displayedPlan.breakdown.bedrooms],
                      ["Bathrooms", displayedPlan.breakdown.bathrooms],
                      ["Floors", displayedPlan.breakdown.floors],
                      ["Garage", displayedPlan.breakdown.garage],
                      ["Style", displayedPlan.breakdown.style],
                    ].map(([label, val]) => (
                      <div
                        key={label as string}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[12px] text-slate-500">
                          {label}
                        </span>
                        <span className="text-[12px] font-medium text-slate-600">
                          {formatCurrency(val as number)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-white/70">
                        Total Estimated Cost
                      </span>
                      <span className="text-[17px] font-semibold">
                        {formatCurrency(displayedPlan.total_cost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-[20px] font-semibold tracking-tight text-slate-800">
                  Plan Summary
                </h2>
                <p className="text-[13px] leading-6 text-slate-600">
                  {displayedPlan.plan_summary}
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Style Match
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-slate-800">
                    {displayedPlan.style_match.headline}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-5 text-slate-600">
                    {displayedPlan.style_match.description}
                  </p>
                  <p className="mt-3 text-[11px] leading-5 text-slate-400">
                    {displayedPlan.style_match.layout_note}
                  </p>
                  {uploadedImageName ? (
                    <p className="mt-3 text-[11px] font-medium text-slate-500">
                      Reference image applied: {uploadedImageName}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
