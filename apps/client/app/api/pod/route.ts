import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();

        console.log(session);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

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
                    userId,
                    title: pod.title,// title same as well
                },
            });

            return { pod, chatGroup };
        });

        return NextResponse.json(result.pod);
    } catch (error) {
        console.error("Error creating pod:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
