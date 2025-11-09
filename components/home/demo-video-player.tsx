"use client";

import { useCallback, useRef, useState } from "react";

interface DemoVideoPlayerProps {
  videoSrc: string;
  tiktokVideoId: string;
  thumbnailSrc: string;
  alt: string;
}

type PlaybackStatus = "idle" | "loading" | "playing" | "error";

export function DemoVideoPlayer({
  videoSrc,
  tiktokVideoId,
  thumbnailSrc,
  alt,
}: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");

  const tiktokUrl = `https://www.tiktok.com/@snappchart/video/${tiktokVideoId}`;

  const handleTogglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (status === "loading") {
      return;
    }

    if (status === "playing") {
      video.pause();
      return;
    }

    setStatus("loading");

    const playPromise = video.play();
    if (playPromise === undefined) {
      setStatus("playing");
      return;
    }

    playPromise
      .then(() => {
        setStatus("playing");
      })
      .catch((error) => {
        console.error("DemoVideoPlayer: unable to start playback.", error);
        video.pause();
        setStatus("error");
      });
  }, [status]);

  const overlayVisible = status !== "playing";
  const overlayLabel =
    status === "error"
      ? "Retry playing demo video"
      : status === "loading"
      ? "Demo video is loading"
      : "Play demo video preview";

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-purple-200/50 bg-black shadow-2xl dark:border-purple-700/50">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={thumbnailSrc}
            aria-label={alt}
            playsInline
            preload="metadata"
            controls={status === "playing"}
            className="h-full w-full object-cover"
            onPlaying={() => setStatus("playing")}
            onPause={() => setStatus("idle")}
            onWaiting={() => setStatus("loading")}
            onEnded={() => setStatus("idle")}
            onLoadedData={() =>
              setStatus((prev) => (prev === "loading" ? "idle" : prev))
            }
            onError={() => setStatus("error")}
          >
            <track kind="captions" />
          </video>

          <button
            type="button"
            aria-label={overlayLabel}
            onClick={handleTogglePlayback}
            disabled={status === "loading"}
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 px-6 text-center transition-opacity duration-200 ease-out ${
              overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            } disabled:cursor-progress`}
          >
            {status === "loading" ? (
              <>
                <div className="h-12 w-12 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <p className="text-sm font-semibold text-white">Loading...</p>
              </>
            ) : status === "error" ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-12 w-12 text-red-300 drop-shadow-lg"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 14h-2v-2h2v2Zm0-4h-2V6h2v6Z"
                  />
                </svg>
                <p className="text-sm font-semibold text-white">
                  Unable to play. Tap to retry.
                </p>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-14 w-14 text-white drop-shadow-lg"
                >
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
                <p className="text-sm font-semibold text-white">
                  {status === "idle" ? "Play demo" : "Resume demo"}
                </p>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TikTok Button */}
      <div className="flex justify-center">
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-105 transition-transform shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
          Watch on TikTok
        </a>
      </div>
    </div>
  );
}
