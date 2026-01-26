"use server"

import { prisma } from "@repo/db"

export async function getFilesAction(podId: string) {
    try {
        const files = await prisma.podFile.findMany({
            where: {
                podId: podId
            }
        })

        return { success: true, data: files }
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to fetch files" }
    }
}
