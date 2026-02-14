export default function Favorites({ favorites, onRemove, onClose, showNativeScript, onToggleNativeScript }) {
  if (favorites.length === 0) {
    return (
      <div className="animate-fade-in-up text-center py-12 px-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fecdd3" className="w-12 h-12 mx-auto mb-4">
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites yet</h3>
        <p className="text-sm text-gray-500 mb-6">
          Tap the heart on any name to save it here
        </p>
        <button
          onClick={onClose}
          className="min-h-11 px-6 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 active:scale-95 transition-all"
        >
          Find Names
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f43f5e" className="w-5 h-5">
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          Your Favorites ({favorites.length})
        </h3>
        <button
          onClick={onClose}
          className="min-h-11 min-w-11 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close favorites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {favorites.some((f) => f.nativeName) && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`text-xs font-medium ${!showNativeScript ? 'text-gray-700' : 'text-gray-400'}`}>
            English
          </span>
          <button
            type="button"
            onClick={onToggleNativeScript}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              showNativeScript ? 'bg-violet-500' : 'bg-gray-300'
            }`}
            aria-label={showNativeScript ? 'Show English names' : 'Show native script names'}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                showNativeScript ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${showNativeScript ? 'text-gray-700' : 'text-gray-400'}`}>
            Native Script
          </span>
        </div>
      )}

      {favorites.map((fav, i) => {
        const displayName = showNativeScript && fav.nativeName ? fav.nativeName : fav.name
        return (
        <div
          key={`${fav.name}-${fav.origin}`}
          className={`animate-fade-in-up stagger-${i + 1} flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100`}
        >
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-lg">{displayName}</p>
            {showNativeScript && fav.nativeName && (
              <p className="text-xs text-gray-400">{fav.name}</p>
            )}
            <p className="text-xs text-gray-500 truncate">
              {fav.meaning} &middot; {fav.origin}
            </p>
          </div>
          <button
            onClick={() => onRemove(fav.name)}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors ml-2"
            aria-label={`Remove ${fav.name} from favorites`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f43f5e" className="w-5 h-5">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
        )
      })}
    </div>
  )
}
