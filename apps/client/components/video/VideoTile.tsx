import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming utils exists, otherwise I'll remove it or check

interface VideoTileProps {
    stream: MediaStream;
    isLocal?: boolean;
    className?: string;
    muted?: boolean;
}

export const VideoTile = ({ stream, isLocal, className, muted }: VideoTileProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(muted || isLocal);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .catch(e => {
                        console.error(`[VideoTile] Autoplay failed for ${stream.id}`, e);
                        // Fallback: Mute and try again (Browser Autoplay Policy)
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                            setIsMuted(true);
                            videoRef.current.play().catch(console.error);
                        }
                    });
            }
        }
    }, [stream]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div className={cn("relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-md group", className)}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-2 right-2 z-10 w-fit h-fit">
                {!isLocal && (
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? (
                            // Muted Icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                            </svg>
                        ) : (
                            // Unmuted Icon
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {isLocal ? (
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                    You
                </div>
            ) : <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">Remote</div>}
        </div>
    );
};
