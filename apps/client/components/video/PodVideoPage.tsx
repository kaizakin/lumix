"use client"

import { usePodSocket } from "@/components/providers/PodSocketProvider";
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { VideoTile } from "./VideoTile";
import { useMediaStore } from "@/store/useMediaStore";
import { MicOff, VideoOff } from "lucide-react";

function resolveSfuSignalUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SFU_WS_URL;
    if (configured) return configured;
    if (typeof window === "undefined") return "ws://localhost:7000/ws";
    const host = window.location.hostname;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${host}:7000/ws`;
}

export const PodVideoPage = () => {
    const { data: session } = useSession()
    const { podId } = usePodSocket();
    const isCameraOn = useMediaStore((s) => s.isCameraOn);
    const isMicOn = useMediaStore((s) => s.isMicOn);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

    const clientRef = useRef<any>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamsRef = useRef<MediaStream[]>([]);

    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);

    useEffect(() => {
        remoteStreamsRef.current = remoteStreams;
    }, [remoteStreams]);

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
            const sfuUrl = resolveSfuSignalUrl();
            console.log(`[PodVideoPage] SFU signal URL: ${sfuUrl}`);
            const signal = new IonSFUJSONRPCSignal(sfuUrl);
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
                    codec: "vp8",
                });

                if (!mounted) {
                    console.log("[PodVideoPage] Component unmounted after getUserMedia, stopping stream.");
                    stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
                    return;
                }

                setLocalStream(stream as MediaStream);
                localStreamRef.current = stream as MediaStream;
                stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
                    track.enabled = isMicOn;
                });
                stream.getVideoTracks().forEach((track: MediaStreamTrack) => {
                    track.enabled = isCameraOn;
                });

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
            localStreamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
            remoteStreamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
            localStreamRef.current = null;
            remoteStreamsRef.current = [];
            // Also clear remote streams? Usually good practice on unmount
            setRemoteStreams([]);
            setLocalStream(null);
        };

    }, [podId, session]);

    useEffect(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getAudioTracks().forEach((track) => {
            track.enabled = isMicOn;
        });
    }, [isMicOn]);

    useEffect(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getVideoTracks().forEach((track) => {
            track.enabled = isCameraOn;
        });
    }, [isCameraOn]);

    // calculate grid columns based on total participants
    const showLocalTile = true;
    const totalParticipants = (showLocalTile ? 1 : 0) + remoteStreams.length;

    // Simple dynamic grid class calculation
    const getGridClass = (count: number) => {
        if (count <= 1) return "grid-cols-1";
        if (count === 2) return "grid-cols-1 md:grid-cols-2";
        if (count <= 4) return "grid-cols-1 md:grid-cols-2";
        if (count <= 6) return "grid-cols-2 md:grid-cols-3";
        return "grid-cols-2 md:grid-cols-4";
    };

    const getTileClass = (count: number) =>
        count === 1
            ? "w-full max-w-[980px] aspect-video mx-auto"
            : "w-full aspect-video max-h-[44vh]";

        const initial =
        (session?.user?.name?.trim()?.[0] ||
            session?.user?.email?.trim()?.[0] ||
            "Y").toUpperCase();

    return (
        <div className="flex flex-col h-full bg-black p-4 overflow-auto">
            <div className="flex-1 flex items-center justify-center">
                <div className={`grid gap-4 w-full max-w-[1400px] ${getGridClass(totalParticipants)}`}>

                {showLocalTile && (
                    isCameraOn && localStream ? (
                        <VideoTile
                            stream={localStream}
                            isLocal={true}
                            className={getTileClass(totalParticipants)}
                        />
                    ) : (
                        <div
                            className={`relative overflow-hidden rounded-xl bg-zinc-900 border h-40 w-60 border-zinc-700 shadow-md flex items-center justify-center p-6 ${getTileClass(totalParticipants)}`}
                        >
                            <div className="flex flex-col items-center gap-4 text-zinc-200">
                                <div className="h-10 w-10 rounded-full bg-zinc-700 text-zinc-100 grid place-items-center text-3xl font-semibold select-none">
                                    {initial}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    <VideoOff className="h-4 w-4" />
                                    <span>{isCameraOn ? "Starting camera..." : "Camera is off"}</span>
                                </div>
                            </div>

                            {!isMicOn && (
                                <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-red-600 text-white grid place-items-center shadow-md">
                                    <MicOff className="h-4 w-4" />
                                </div>
                            )}

                            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                                You
                            </div>
                        </div>
                    )
                )}

                {remoteStreams.map(stream => (
                    <VideoTile
                        key={stream.id}
                        stream={stream}
                        isLocal={false}
                        className={getTileClass(totalParticipants)}
                    />
                ))}

                {totalParticipants === 0 && (
                    <div className="flex items-center justify-center text-gray-500 h-full w-full col-span-full">
                        Waiting for camera...
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
