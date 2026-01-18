import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id;

        const podData = await prisma.pod.findMany({
            where: { userId }
        });


        return NextResponse.json({ podData });

    } catch (error) {
        console.error("Error in fetching pod data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}