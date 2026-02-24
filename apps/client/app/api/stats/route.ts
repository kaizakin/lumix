import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const [createdPods, joinedPods] = await Promise.all([
            prisma.pod.findMany({
                where: { userId },
                include: {
                    members: { select: { id: true } },
                    files: { select: { id: true } },
                },
            }),
            prisma.pod.findMany({
                where: {
                    members: { some: { id: userId } },
                    NOT: { userId },
                },
                include: {
                    members: { select: { id: true } },
                    files: { select: { id: true } },
                },
            }),
        ]);

        // Deduplicate members across all pods the user is part of
        const allPods = [...createdPods, ...joinedPods];
        const uniqueMemberIds = new Set(
            allPods.flatMap((pod) => pod.members.map((m) => m.id))
        );
        // Exclude the user themselves
        uniqueMemberIds.delete(userId);

        const totalFiles = allPods.reduce((sum, pod) => sum + pod.files.length, 0);

        return NextResponse.json({
            podsCreated: createdPods.length,
            podsJoined: joinedPods.length,
            collaborators: uniqueMemberIds.size,
            filesShared: totalFiles,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
