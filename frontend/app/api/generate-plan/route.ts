import { NextRequest, NextResponse } from "next/server";

// ✅ UPDATED: use your working backend (the one that has /docs and /health working)
const BACKEND_URL = "https://blueprint-backend-v2-ctg2fwbgb2g9cja4.eastus-01.azurewebsites.net";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/generate-plan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        // ✅ Handle backend response safely
        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });

    } catch (error) {
        console.error("Frontend proxy error:", error);

        return NextResponse.json(
            { error: "Proxy request to backend failed." },
            { status: 500 }
        );
    }
}
