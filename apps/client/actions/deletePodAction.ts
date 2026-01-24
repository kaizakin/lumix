"use server";

import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

export async function deletePodAction(podId: string) {
    if (!podId) return;

    try {
        await prisma.pod.delete({
            where: {
                id: podId
            }
        });
    } catch (error) {
        console.error("Failed to delete pod:", error);
        throw new Error("Failed to delete pod");
    }

    redirect("/dashboard");
}
