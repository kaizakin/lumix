"use client"

import { podJoinAction } from "@/actions/PodJoinAction";
import { PodCapacityReached } from "@/components/PodCapacityReached";
import { Spinner } from "@/components/ui/spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HOME() {
    const params = useParams();
    const joinCode = params.code as string;
    const [res, setRes] = useState<{
        success: boolean; podId: string | null; message: string, pod?: {
            id: string;
            userId: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }
    } | null>(null);

    const router = useRouter();

    useEffect(() => {
        async function joinPod() {
            const result = await podJoinAction(joinCode);
            setRes(result);
        }
        joinPod();
    }, [joinCode]);

    if (!res) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black">
            <Spinner />
        </div>
    }

    if (!res.success && res.message == "Max no.of users Reached") {
        return <div className="h-screen w-screen flex items-center justify-center bg-black">
            <PodCapacityReached podName={res.pod?.title as string} description={"is currently at full strength with all member slots filled. No new members can join at this time."} members={10} maxMembers={10} />
        </div>
    }

    if (!res.success) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black">
            {/* Handle error state */}
            <div>{res.message || "Failed to join pod"}</div>
        </div>
    }

    return router.push(`/pod/${res.podId}`);
}