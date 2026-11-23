export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A3D"/><stop offset="1" stopColor="#FF4D2E"/></linearGradient></defs>
      <path d="M14 6h36a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H30l-12 10v-10h-4A10 10 0 0 1 4 38V16A10 10 0 0 1 14 6z" fill="url(#lg)"/>
      <path d="M19 27l8 8 17-17" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Einwand<span className="text-signal">frei</span>
    </span>
  );
}
