"use client";
import { useState } from "react";
import type { Video } from "@/lib/videos";

export function VideoEmbed({ video, moreQuery, moreHref }: { video: Video; moreQuery?: string; moreHref?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <section className="my-8">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Video zur Lektion</div>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-night-3">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Video abspielen: ${video.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-signal shadow-lg shadow-black/40 transition group-active:scale-95">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{video.title}</p>
      <p className="text-xs text-muted">Kanal: {video.channel} · Englisch</p>
      {moreQuery && moreHref && (
        <a href={moreHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-signal">
          Mehr zu „{moreQuery}“ auf Hormozis Kanal ↗
        </a>
      )}
    </section>
  );
}
