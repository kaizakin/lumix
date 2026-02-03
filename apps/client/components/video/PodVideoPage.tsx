"use client"

import { usePodSocket } from "@/components/providers/PodSocketProvider";
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { VideoTile } from "./VideoTile";

export const PodVideoPage = () => {
    const { data: session } = useSession()
    const { podId } = usePodSocket();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

    const clientRef = useRef<any>(null);

    useEffect(() => {
        if (!podId || !session?.user?.id) return;

        let mounted = true;

        (async () => {
            if (typeof window === 'undefined') return;

            // Dynamically import Ion SDK
            const { Client, LocalStream } = await import("ion-sdk-js");
            const { IonSFUJSONRPCSignal } = await import("ion-sdk-js/lib/signal/json-rpc-impl");

            if (!mounted) return;

            // If we already have a client, don't create another (double-safety, though cleanup should handle it)
            if (clientRef.current) {
                console.log("[PodVideoPage] Client already exists, skipping initialization");
                return;
            }

            console.log("[PodVideoPage] Initializing Ion Client...");
            const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
            const client = new Client(signal);
            clientRef.current = client;

            client.ontrack = (track: MediaStreamTrack, stream: MediaStream) => {
                const streamId = stream.id;
                console.log(`[PodVideoPage] client.ontrack: kind=${track.kind} streamId=${streamId} trackId=${track.id} muted=${track.muted}`);

                const handleTrack = () => {
                    if (!mounted) return;
                    console.log(`[PodVideoPage] Handling track setup for stream ${streamId}`);

                    setRemoteStreams(prev => {
                        const index = prev.findIndex(s => s.id === streamId);
                        if (index !== -1) {
                            console.log(`[PodVideoPage] Updating existing stream ${streamId} in state`);
                            const newStreams = [...prev];
                            newStreams[index] = stream;
                            return newStreams;
                        }
                        console.log(`[PodVideoPage] Adding NEW stream ${streamId} to state`);
                        return [...prev, stream];
                    });

                    stream.onremovetrack = () => {
                        console.log(`[PodVideoPage] Track removed from ${streamId}. Remaining tracks: ${stream.getTracks().length}`);
                        if (stream.getTracks().length === 0) {
                            console.log(`[PodVideoPage] Removing empty stream ${streamId}`);
                            setRemoteStreams(prev => prev.filter(s => s.id !== streamId));
                        }
                    };
                };

                track.onunmute = () => {
                    console.log(`[PodVideoPage] Track unmuted: ${track.kind} ${streamId}`);
                    handleTrack();
                };

                if (!track.muted) {
                    console.log(`[PodVideoPage] Track already unmuted: ${track.kind} ${streamId}`);
                    handleTrack();
                } else {
                    console.log(`[PodVideoPage] Track is muted, waiting: ${track.kind} ${streamId}`);
                }
            };

            const uid = `${session?.user?.id}-${Math.random().toString(36).substr(2, 9)}`;
            client.join(podId, uid);

            // Publish Local Stream
            try {
                // @ts-ignore
                const stream = await LocalStream.getUserMedia({
                    resolution: "vga",
                    audio: true,
                    video: true,
                    codec: "vp8"
                });

                if (!mounted) {
                    console.log("[PodVideoPage] Component unmounted after getUserMedia, stopping stream.");
                    stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
                    return;
                }

                setLocalStream(stream);

                // IMPORTANT: Check if client is still OPEN before publishing
                // But Ion SDK client doesn't expose readyState easily. 
                // We rely on 'mounted' check + assuming join() doesn't fail fast.
                console.log("[PodVideoPage] Publishing local stream...");
                client.publish(stream);
            } catch (e: any) {
                if (mounted) console.error("Failed to get/publish local stream:", e);
            }

        })();

        return () => {
            console.log("[PodVideoPage] Cleaning up effect. Closing client.");
            mounted = false;
            // Immediate cleanup
            if (clientRef.current) {
                // Use close() if available
                clientRef.current.close?.();
                clientRef.current = null;
            }
            // Also clear remote streams? Usually good practice on unmount
            setRemoteStreams([]);
            setLocalStream(null);
        };

    }, [podId, session]);

    // calculate grid columns based on total participants
    const totalParticipants = (localStream ? 1 : 0) + remoteStreams.length;

    // Simple dynamic grid class calculation
    const getGridClass = (count: number) => {
        if (count <= 1) return "grid-cols-1";
        if (count === 2) return "grid-cols-2";
        if (count <= 4) return "grid-cols-2 md:grid-cols-2";
        if (count <= 6) return "grid-cols-2 md:grid-cols-3";
        return "grid-cols-2 md:grid-cols-4";
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-black p-4">
            <div className={`grid gap-4 w-full h-full content-center ${getGridClass(totalParticipants)}`}>

                {localStream && (
                    <VideoTile
                        stream={localStream}
                        isLocal={true}
                        className={totalParticipants === 1 ? "max-h-[80vh] aspect-video mx-auto" : ""}
                    />
                )}

                {remoteStreams.map(stream => (
                    <VideoTile
                        key={stream.id}
                        stream={stream}
                        isLocal={false}
                        className={totalParticipants === 1 ? "max-h-[80vh] aspect-video mx-auto" : ""}
                    />
                ))}

                {totalParticipants === 0 && (
                    <div className="flex items-center justify-center text-gray-500 h-full w-full col-span-full">
                        Waiting for camera...
                    </div>
                )}
            </div>
        </div>
    );
}