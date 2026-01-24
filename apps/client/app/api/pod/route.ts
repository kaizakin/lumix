import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Verify if user exists in DB (to handle stale sessions)
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return NextResponse.json({ error: "User not found. Please re-login." }, { status: 401 });
        }

        const body = await req.json();
        const { title, description } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // Use a transaction to ensure both Pod and ChatGroup are created with the same ID
        const result = await prisma.$transaction(async (tx) => {
            const pod = await tx.pod.create({
                data: {
                    userId,
                    title,
                    description,
                    members: {
                        connect: { id: userId },
                    },
                },
            });

            const chatGroup = await tx.chatGroup.create({
                data: {
                    id: pod.id, // FORCE the same ID
                    podId: pod.id,
                    title: pod.title,// title same as well
                },
            });

            return { pod, chatGroup };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating pod:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
