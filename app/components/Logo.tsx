export default function Logo({ size = 36, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="feastiq-badge" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7A1A" />
            <stop offset="1" stopColor="#E8332B" />
          </linearGradient>
          <linearGradient id="feastiq-flame" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD23F" />
            <stop offset="1" stopColor="#FFF7E6" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#feastiq-badge)" />
        <path
          d="M20 9c1.5 2.6 4.6 4.7 4.6 8.8 0 3.6-2.6 6.4-4.6 6.4s-4.6-2.8-4.6-6.4c0-1.4.6-2.3 1.3-3.2-.1 1.4.6 2.3 1.5 2.3.9 0 1.2-.9 1-1.8-.3-1.4-.4-3.4 1.4-6.1z"
          fill="url(#feastiq-flame)"
        />
        <circle cx="30.5" cy="9.5" r="2.5" fill="#FFF7E6" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl leading-none">
          <span className="text-ink dark:text-white font-bold">Feast</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent font-bold">IQ</span>
        </span>
      )}
    </div>
  )
}