"use client";

import FloorPlan from "./FloorPlan";

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

type GeneratedPlanProps = {
    floorGroup: FloorGroup;
};

function getLayoutNotes(floorGroup: FloorGroup) {
    const hasGarage = floorGroup.rooms.some((room) => room.type === "Garage");
    const hasKitchen = floorGroup.rooms.some((room) => room.type === "Kitchen");
    const bedroomCount = floorGroup.rooms.filter(
        (room) => room.type === "Bedroom"
    ).length;
    const bathCount = floorGroup.rooms.filter((room) => room.type === "Bath").length;

    if (floorGroup.floor === 1) {
        return [
            hasKitchen
                ? "Main living space stays close to the kitchen for easier daily flow."
                : "Main living area is kept open and centered on the first floor.",
            hasGarage
                ? "Garage access connects directly into the first-floor layout."
                : "The first floor prioritizes shared living space without attached garage access.",
            `This floor currently includes ${floorGroup.rooms.length} room${floorGroup.rooms.length === 1 ? "" : "s"
            }.`,
        ];
    }

    return [
        `${bedroomCount} bedroom${bedroomCount === 1 ? "" : "s"} arranged on the upper level.`,
        `${bathCount} bathroom${bathCount === 1 ? "" : "s"} positioned near the sleeping spaces.`,
        "Upper circulation is organized to keep the private floor more compact.",
    ];
}

function getRoomBadgeTone(type: string) {
    switch (type) {
        case "Living":
            return "bg-blue-50 border-blue-200 text-blue-700";
        case "Kitchen":
            return "bg-amber-50 border-amber-200 text-amber-700";
        case "Dining":
            return "bg-orange-50 border-orange-200 text-orange-700";
        case "Storage":
            return "bg-slate-50 border-slate-200 text-slate-700";
        case "Bath":
            return "bg-cyan-50 border-cyan-200 text-cyan-700";
        case "Garage":
            return "bg-zinc-50 border-zinc-200 text-zinc-700";
        case "Bedroom":
            return "bg-violet-50 border-violet-200 text-violet-700";
        case "Hall":
            return "bg-emerald-50 border-emerald-200 text-emerald-700";
        default:
            return "bg-slate-50 border-slate-200 text-slate-700";
    }
}

export default function GeneratedPlan({ floorGroup }: GeneratedPlanProps) {
    const notes = getLayoutNotes(floorGroup);

    return (
        <div className="rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-4 md:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_190px] 2xl:grid-cols-[minmax(0,2.1fr)_190px]">
                <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {floorGroup.label} · Layout Render
                        </p>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                            {floorGroup.rooms.length} room{floorGroup.rooms.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="rounded-[18px] border border-slate-200 bg-[#f3f4f6] p-2 md:p-3">
                        <div className="min-h-[320px] md:min-h-[380px] xl:min-h-[430px]">
                            <FloorPlan floorGroup={floorGroup} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Layout Notes
                        </p>

                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div key={note} className="flex items-start gap-2.5">
                                    <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                                    <p className="text-[12px] leading-5 text-slate-600">{note}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Included Rooms
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {floorGroup.rooms.map((room) => (
                                <span
                                    key={`${room.id}-${room.name}`}
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${getRoomBadgeTone(
                                        room.type
                                    )}`}
                                >
                                    {room.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Plan Snapshot
                        </p>

                        <div className="space-y-2 text-[12px] text-slate-600">
                            <div className="flex items-center justify-between gap-3">
                                <span>Active Floor</span>
                                <span className="font-medium text-slate-800">{floorGroup.label}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Room Count</span>
                                <span className="font-medium text-slate-800">
                                    {floorGroup.rooms.length}
                                </span>
                            </div>
                            <div className="border-t border-slate-100 pt-2">
                                <p className="text-[11px] leading-5 text-slate-500">
                                    {floorGroup.floor === 1
                                        ? "This floor emphasizes shared living, kitchen access, service flow, and any attached garage."
                                        : "This floor emphasizes private rooms, bathrooms, and quieter upper-level circulation."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
