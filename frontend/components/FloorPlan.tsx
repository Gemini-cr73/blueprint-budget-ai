"use client";

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

type FloorPlanProps = {
    floorGroup: FloorGroup;
};

type RoomCardLayout = {
    id: number;
    name: string;
    type: string;
    size: string;
    x: number;
    y: number;
    w: number;
    h: number;
};

function getRoomFill(type: string) {
    switch (type) {
        case "Living":
            return "#f7ead7";
        case "Kitchen":
            return "#efe9dd";
        case "Dining":
            return "#f3e7d4";
        case "Bedroom":
            return "#efe6d4";
        case "Bath":
            return "#eef2f7";
        case "Hall":
            return "#f3f4f6";
        case "Storage":
            return "#ede7d8";
        case "Garage":
            return "#e5e7eb";
        default:
            return "#f5f2eb";
    }
}

function getBlueprintTitle(floorGroup: FloorGroup) {
    return floorGroup.floor === 1 ? "FIRST FLOOR" : "SECOND FLOOR";
}

function buildFloorOneLayout(rooms: RoomItem[]): RoomCardLayout[] {
    const living = rooms.find((room) => room.type === "Living");
    const dining = rooms.find((room) => room.type === "Dining");
    const kitchen = rooms.find((room) => room.type === "Kitchen");
    const storageRooms = rooms.filter((room) => room.type === "Storage");
    const bathRooms = rooms.filter((room) => room.type === "Bath");
    const bedroomRooms = rooms.filter((room) => room.type === "Bedroom");
    const garage = rooms.find((room) => room.type === "Garage");

    const layouts: RoomCardLayout[] = [];

    if (living) {
        layouts.push({
            id: living.id,
            name: living.name,
            type: living.type,
            size: living.size,
            x: 26,
            y: 104,
            w: 214,
            h: 156,
        });
    }

    if (dining) {
        layouts.push({
            id: dining.id,
            name: dining.name,
            type: dining.type,
            size: dining.size,
            x: 26,
            y: 26,
            w: 114,
            h: 78,
        });
    }

    if (kitchen) {
        layouts.push({
            id: kitchen.id,
            name: kitchen.name,
            type: kitchen.type,
            size: kitchen.size,
            x: 240,
            y: 26,
            w: 176,
            h: 112,
        });
    }

    storageRooms.forEach((room, index) => {
        layouts.push({
            id: room.id,
            name: room.name,
            type: room.type,
            size: room.size,
            x: 248 + index * 62,
            y: 164,
            w: 58,
            h: 46,
        });
    });

    bathRooms.forEach((room, index) => {
        layouts.push({
            id: room.id,
            name: room.name,
            type: room.type,
            size: room.size,
            x: 312 + index * 56,
            y: 146,
            w: 52,
            h: 44,
        });
    });

    bedroomRooms.forEach((room, index) => {
        const positions = [
            { x: 26, y: 262, w: 106, h: 56 },
            { x: 134, y: 262, w: 106, h: 56 },
        ];

        const pos = positions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    if (garage) {
        layouts.push({
            id: garage.id,
            name: garage.name,
            type: garage.type,
            size: garage.size,
            x: garage.name.includes("2-Car") ? 418 : 442,
            y: 116,
            w: garage.name.includes("2-Car") ? 138 : 102,
            h: 198,
        });
    }

    return layouts;
}

function buildFloorTwoLayout(rooms: RoomItem[]): RoomCardLayout[] {
    const bedrooms = rooms.filter((room) => room.type === "Bedroom");
    const baths = rooms.filter((room) => room.type === "Bath");
    const halls = rooms.filter(
        (room) => room.type === "Hall" || room.type === "Living"
    );

    const layouts: RoomCardLayout[] = [];

    const bedroomPositions = [
        { x: 28, y: 28, w: 134, h: 92 },
        { x: 164, y: 28, w: 134, h: 92 },
        { x: 28, y: 214, w: 160, h: 100 },
        { x: 190, y: 214, w: 160, h: 100 },
    ];

    bedrooms.forEach((room, index) => {
        const pos = bedroomPositions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    baths.forEach((room, index) => {
        const positions = [
            { x: 28, y: 124, w: 94, h: 56 },
            { x: 356, y: 124, w: 94, h: 56 },
            { x: 126, y: 124, w: 94, h: 56 },
        ];

        const pos = positions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    halls.forEach((room, index) => {
        const positions = [
            { x: 224, y: 124, w: 128, h: 84 },
            { x: 302, y: 28, w: 148, h: 92 },
        ];

        const pos = positions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    return layouts;
}

function buildSingleFloorLayout(rooms: RoomItem[]): RoomCardLayout[] {
    const layouts: RoomCardLayout[] = [];

    const living = rooms.find((room) => room.type === "Living");
    const kitchen = rooms.find((room) => room.type === "Kitchen");
    const dining = rooms.find((room) => room.type === "Dining");
    const bedrooms = rooms.filter((room) => room.type === "Bedroom");
    const baths = rooms.filter((room) => room.type === "Bath");
    const garage = rooms.find((room) => room.type === "Garage");
    const storage = rooms.filter((room) => room.type === "Storage");

    if (living) {
        layouts.push({
            id: living.id,
            name: living.name,
            type: living.type,
            size: living.size,
            x: 26,
            y: 26,
            w: 194,
            h: dining ? 134 : 156,
        });
    }

    if (dining) {
        layouts.push({
            id: dining.id,
            name: dining.name,
            type: dining.type,
            size: dining.size,
            x: 26,
            y: 164,
            w: 194,
            h: 72,
        });
    }

    if (kitchen) {
        layouts.push({
            id: kitchen.id,
            name: kitchen.name,
            type: kitchen.type,
            size: kitchen.size,
            x: 224,
            y: 26,
            w: 150,
            h: 106,
        });
    }

    storage.forEach((room, index) => {
        layouts.push({
            id: room.id,
            name: room.name,
            type: room.type,
            size: room.size,
            x: 224 + index * 62,
            y: 136,
            w: 58,
            h: 44,
        });
    });

    bedrooms.forEach((room, index) => {
        const positions = [
            { x: 26, y: 240, w: 118, h: 74 },
            { x: 146, y: 240, w: 118, h: 74 },
            { x: 270, y: 188, w: 94, h: 60 },
            { x: 366, y: 188, w: 94, h: 60 },
        ];

        const pos = positions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    baths.forEach((room, index) => {
        const positions = [
            { x: 270, y: 252, w: 68, h: 50 },
            { x: 342, y: 252, w: 68, h: 50 },
            { x: 378, y: 26, w: 70, h: 52 },
        ];

        const pos = positions[index];
        if (pos) {
            layouts.push({
                id: room.id,
                name: room.name,
                type: room.type,
                size: room.size,
                ...pos,
            });
        }
    });

    if (garage) {
        layouts.push({
            id: garage.id,
            name: garage.name,
            type: garage.type,
            size: garage.size,
            x: garage.name.includes("2-Car") ? 414 : 440,
            y: 94,
            w: garage.name.includes("2-Car") ? 106 : 80,
            h: 178,
        });
    }

    return layouts;
}

function getLayouts(floorGroup: FloorGroup): RoomCardLayout[] {
    const hasBedroomsOnFloorOne =
        floorGroup.floor === 1 &&
        floorGroup.rooms.some((room) => room.type === "Bedroom");

    if (floorGroup.floor === 1 && hasBedroomsOnFloorOne) {
        return buildSingleFloorLayout(floorGroup.rooms);
    }

    if (floorGroup.floor === 1) {
        return buildFloorOneLayout(floorGroup.rooms);
    }

    return buildFloorTwoLayout(floorGroup.rooms);
}

function CarIllustration({
    x,
    y,
    scale = 1,
}: {
    x: number;
    y: number;
    scale?: number;
}) {
    return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            <rect x="0" y="8" width="36" height="74" rx="8" fill="#20242a" />
            <rect x="4" y="16" width="28" height="22" rx="4" fill="#57606f" />
            <rect x="5" y="46" width="26" height="20" rx="3" fill="#1f2937" />
            <circle cx="6" cy="78" r="4" fill="#111827" />
            <circle cx="30" cy="78" r="4" fill="#111827" />
        </g>
    );
}

function BlueprintSvg({ floorGroup }: { floorGroup: FloorGroup }) {
    const layouts = getLayouts(floorGroup);
    const garage = layouts.find((room) => room.type === "Garage");

    return (
        <svg
            viewBox="0 0 540 340"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`${floorGroup.label} floor plan`}
        >
            <defs>
                <linearGradient
                    id={`paper-${floorGroup.floor}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#f7f5ef" />
                    <stop offset="100%" stopColor="#efede6" />
                </linearGradient>
                <pattern
                    id={`grid-${floorGroup.floor}`}
                    width="18"
                    height="18"
                    patternUnits="userSpaceOnUse"
                >
                    <rect width="18" height="18" fill="#f4f1ea" />
                    <path
                        d="M18 0H0V18"
                        fill="none"
                        stroke="#ddd6c9"
                        strokeWidth="0.8"
                    />
                </pattern>
            </defs>

            <rect width="540" height="340" fill="#f4f4f2" />

            <rect x="82" y="10" width="220" height="3" fill="#111827" />
            <line x1="82" y1="12" x2="82" y2="28" stroke="#111827" strokeWidth="1.2" />
            <line x1="302" y1="12" x2="302" y2="28" stroke="#111827" strokeWidth="1.2" />
            <text
                x="192"
                y="28"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="#111827"
            >
                {getBlueprintTitle(floorGroup)}
            </text>

            <rect
                x="10"
                y="22"
                width="520"
                height="300"
                fill={`url(#grid-${floorGroup.floor})`}
                stroke="#111827"
                strokeWidth="4.5"
            />

            {layouts.map((room) => (
                <g key={room.id}>
                    <rect
                        x={room.x}
                        y={room.y}
                        width={room.w}
                        height={room.h}
                        rx="1.5"
                        fill={getRoomFill(room.type)}
                        stroke="#111827"
                        strokeWidth="1.8"
                    />
                    <text
                        x={room.x + room.w / 2}
                        y={room.y + room.h / 2 - 6}
                        textAnchor="middle"
                        fontSize="7"
                        fontWeight="700"
                        fill="#111827"
                    >
                        {room.name.toUpperCase()}
                    </text>
                    <text
                        x={room.x + room.w / 2}
                        y={room.y + room.h / 2 + 9}
                        textAnchor="middle"
                        fontSize="5.4"
                        fill="#374151"
                    >
                        {room.size}
                    </text>
                </g>
            ))}

            {garage?.name.includes("2-Car") ? (
                <>
                    <CarIllustration x={garage.x + 14} y={garage.y + 74} scale={0.95} />
                    <CarIllustration x={garage.x + 62} y={garage.y + 74} scale={0.95} />
                </>
            ) : garage?.name.includes("1-Car") ? (
                <CarIllustration x={garage.x + 20} y={garage.y + 74} scale={0.95} />
            ) : null}

            <circle cx="26" cy="326" r="6" fill="#8ba26b" />
            <circle cx="44" cy="326" r="6" fill="#8ba26b" />
            <circle cx="494" cy="326" r="6" fill="#8ba26b" />
            <circle cx="512" cy="326" r="6" fill="#8ba26b" />
        </svg>
    );
}

export default function FloorPlan({ floorGroup }: FloorPlanProps) {
    return (
        <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-[#f2f2f0] p-2">
            <div className="mx-auto w-full">
                <div className="aspect-[1.62/1] w-full">
                    <BlueprintSvg floorGroup={floorGroup} />
                </div>
            </div>
        </div>
    );
}
