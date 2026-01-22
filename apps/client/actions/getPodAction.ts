"use server"

import { prisma } from "@repo/db";

export async function getPodAction(podId: string) {
    const pod = await prisma.pod.findUnique({
        where: {
            id: podId
        },
        select: {
            members: true,
            id: true,
            title: true,
            description: true
        }
    })

    if (!pod) return null;


    const { title, id, description, members } = pod;
    const membercount = members.length;

    return { title, id, description, members, membercount }
}