import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ podId: string }> }
) {
    try {
        const { podId } = await context.params
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const pod = await prisma.pod.findUnique({
            where: { id: podId },
            select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!pod) {
            return NextResponse.json({ error: "pod not found" }, { status: 404 })
        }

        return NextResponse.json({ pod });

    } catch (error) {
        console.error("Error fetching pod!", error);
        return NextResponse.json(
            { error: "Failed to fetch pod details" },
            { status: 500 }
        )
    }
}