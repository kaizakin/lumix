"use server";

import { auth } from "@/auth";
import { generateString } from "@/lib/generate-random-string";
import { prisma } from "@repo/db"

export async function createJoinCode(podID = "3e6127ac-a7d0-4e1d-87d7-e99c71a5f7cb") {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { success: false, code: null, message: "User unauthorized!" };
    }

    const creatorId = session.user.id;

    try {
        const isInviteCodeExist = await prisma.invite.findUnique({
            where: { podID }
        })

        if (isInviteCodeExist) {
            return ({ success: true, code: isInviteCodeExist.code, message: "Invite code already exists for this pod." })
        }
    } catch (error) {
        console.error("Error checking existing invite:", error);
        return { success: false, code: null, message: "Failed to check for existing invite code." };
    }

    for (let i = 0; i < 5; i++) {
        const code = generateString(6);
        console.log(code);

        try {
            const res = await prisma.invite.create({
                data: {
                    code,
                    podID,
                    creatorId
                }
            })

            return ({ success: true, code: res.code, message: "Code generated." });
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === "P2002") {
                continue; // if unique violation keep going for the next iteration
            }
            console.error("Error creating invite code:", error);
            throw error; // real error crash out.
        }
    }

    throw new Error("Could not generate unique code"); // highly rare.
}