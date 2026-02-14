import { useState } from 'react'

const COLORS = [
  { bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-600' },
  { bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-600' },
  { bg: 'bg-sky-50', badge: 'bg-sky-100 text-sky-600' },
  { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-600' },
  { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-600' },
  { bg: 'bg-pink-50', badge: 'bg-pink-100 text-pink-600' },
]

export default function NameCard({ name, nativeName, meaning, origin, showNativeScript, isFavorite, onToggleFavorite, index }) {
  const [heartAnimating, setHeartAnimating] = useState(false)
  const color = COLORS[index % COLORS.length]
  const displayName = showNativeScript && nativeName ? nativeName : name

  function handleFavorite() {
    setHeartAnimating(true)
    onToggleFavorite()
    setTimeout(() => setHeartAnimating(false), 350)
  }

  return (
    <div className={`animate-fade-in-up stagger-${index + 1} ${color.bg} rounded-2xl p-5 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {displayName}
          </h3>
          {showNativeScript && nativeName && (
            <p className="text-xs text-gray-400 mb-1">{name}</p>
          )}
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            {meaning}
          </p>
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${color.badge}`}>
            {origin}
          </span>
        </div>

        <button
          onClick={handleFavorite}
          className="min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors ml-2 -mr-1 -mt-1"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-6 h-6 transition-transform duration-200 ${heartAnimating ? 'animate-heart-pop' : ''}`}
            fill={isFavorite ? '#f43f5e' : 'none'}
            stroke={isFavorite ? '#f43f5e' : '#d1d5db'}
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
