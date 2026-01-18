"use server";

import { auth } from "@/auth";
import { prisma } from "@repo/db";

export async function podJoinAction(code: string) {

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        console.error("User unAuthorized!");
        return { success: false, podId: null, message: "User unauthorized!" };
    }

    const userId = session.user.id;
    let response;

    try {
        response = await prisma.$transaction(async (tx) => {
            const invite = await tx.invite.findUnique({
                where: { code: code },
                include: { pod: true }
            });

            if (!invite) {
                return ({ success: false, podId: null, message: "Invalid Invite! please check your invite and try again." })
            }

            const existing = await tx.pod.findFirst({
                where: {
                    id: invite.podID,
                    members: { some: { id: userId } }
                }
            })

            if (existing) {
                return ({ success: true, podId: existing.id, message: "Welcome back!" });
            }

            if (invite.useCount > invite.maxUses) {
                return ({ success: false, podId: null, message: "Max no.of users Reached", pod: invite.pod })
            }

            const updatedPod = await tx.pod.update({
                where: {
                    id: invite.podID
                },
                data: {
                    members: {
                        connect: { id: userId }
                    }
                }
            });

            await tx.invite.update({
                where: { id: invite.id },
                data: {
                    useCount: { increment: 1 }
                }
            });

            return ({ success: true, podId: updatedPod.id, message: "Pod Successfully joined!" })

        })

    } catch (error) {
        return ({ success: false, podId: null, message: String(error) })
    }

    return response;
}