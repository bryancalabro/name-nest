import { useState, useEffect, useCallback } from 'react'
import NameForm from './components/NameForm'
import NameCard from './components/NameCard'
import Favorites from './components/Favorites'
import { generateNames } from './utils/api'

const FAVORITES_KEY = 'namenest-favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

function NestIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className} fill="none">
      {/* Nest */}
      <ellipse cx="32" cy="44" rx="22" ry="10" fill="#e8d5b7" stroke="#c9a96e" strokeWidth="2" />
      <ellipse cx="32" cy="42" rx="18" ry="7" fill="#f5e6cc" />
      {/* Egg left */}
      <ellipse cx="24" cy="38" rx="6" ry="8" fill="#fecdd3" stroke="#fda4af" strokeWidth="1.5" transform="rotate(-8 24 38)" />
      {/* Egg center */}
      <ellipse cx="33" cy="36" rx="6.5" ry="9" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="1.5" />
      {/* Egg right */}
      <ellipse cx="41" cy="38" rx="6" ry="8" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.5" transform="rotate(8 41 38)" />
      {/* Small heart */}
      <path d="M32 22c-1.5-2.5-4.5-3-6-1.5s-1 4.5 1 6.5l5 4.5 5-4.5c2-2 2.5-5 1-6.5s-4.5-1-6 1.5z" fill="#f43f5e" />
    </svg>
  )
}

export default function App() {
  const [names, setNames] = useState([])
  const [favorites, setFavorites] = useState(loadFavorites)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [lastParams, setLastParams] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [showNativeScript, setShowNativeScript] = useState(false)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const handleGenerate = useCallback(async (params) => {
    setIsLoading(true)
    setError(null)
    setNames([])
    setLastParams(params)
    setShowFavorites(false)

    try {
      const results = await generateNames(params.gender, params.style, params.origin, params.count)
      setNames(results)
      setHasGenerated(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleGenerateMore = useCallback(async () => {
    if (!lastParams) return
    setIsLoading(true)
    setError(null)
    setNames([])

    try {
      const results = await generateNames(lastParams.gender, lastParams.style, lastParams.origin, lastParams.count)
      setNames(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [lastParams])

  function toggleFavorite(nameObj) {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === nameObj.name)
      if (exists) return prev.filter((f) => f.name !== nameObj.name)
      return [...prev, nameObj]
    })
  }

  function removeFavorite(name) {
    setFavorites((prev) => prev.filter((f) => f.name !== name))
  }

  function isFavorite(name) {
    return favorites.some((f) => f.name === name)
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="pt-8 pb-4 px-5 text-center">
        <NestIcon className="w-16 h-16 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-1">
          NameNest
        </h1>
        <p className="text-sm text-gray-500">
          AI-powered baby name suggestions
        </p>
      </header>

      {/* Nav */}
      <div className="px-5 mb-4 flex justify-center gap-2">
        <button
          onClick={() => setShowFavorites(false)}
          className={`min-h-11 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            !showFavorites
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setShowFavorites(true)}
          className={`min-h-11 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
            showFavorites
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          Favorites
          {favorites.length > 0 && (
            <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
              showFavorites ? 'bg-white/30 text-white' : 'bg-rose-100 text-rose-600'
            }`}>
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="px-5 max-w-lg mx-auto">
        {showFavorites ? (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Favorites
              favorites={favorites}
              onRemove={removeFavorite}
              onClose={() => setShowFavorites(false)}
              showNativeScript={showNativeScript}
              onToggleNativeScript={() => setShowNativeScript((prev) => !prev)}
            />
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
              <NameForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Error */}
            {error && (
              <div className="animate-fade-in-up bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={handleGenerateMore}
                  className="mt-2 text-sm font-medium text-red-500 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-rose-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-400">Finding the perfect names...</p>
              </div>
            )}

            {/* Results */}
            {names.length > 0 && !isLoading && (
              <div className="space-y-3 mb-6">
                <h2 className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Name Suggestions
                </h2>

                {names.some((n) => n.nativeName) && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`text-xs font-medium ${!showNativeScript ? 'text-gray-700' : 'text-gray-400'}`}>
                      English
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNativeScript((prev) => !prev)}
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

                {names.map((nameObj, i) => (
                  <NameCard
                    key={`${nameObj.name}-${i}`}
                    name={nameObj.name}
                    nativeName={nameObj.nativeName}
                    meaning={nameObj.meaning}
                    origin={nameObj.origin}
                    showNativeScript={showNativeScript}
                    isFavorite={isFavorite(nameObj.name)}
                    onToggleFavorite={() => toggleFavorite(nameObj)}
                    index={i}
                  />
                ))}

                <div className="pt-4 text-center">
                  <button
                    onClick={handleGenerateMore}
                    disabled={isLoading}
                    className="min-h-11 px-6 py-2.5 rounded-xl bg-white text-gray-700 font-medium border border-gray-200 hover:border-rose-300 hover:bg-rose-50 active:scale-95 transition-all duration-150 inline-flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-9.624-2.849a5.5 5.5 0 019.201-2.466l.312.311H12.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.536a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 003.63 8.396a.75.75 0 001.449.39z" clipRule="evenodd" />
                    </svg>
                    Generate More
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!hasGenerated && !isLoading && names.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">
                  Choose your preferences and tap Generate!
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-5 mt-8">
        <p className="text-xs text-gray-400">
          NameNest &middot; Powered by AI
        </p>
      </footer>
    </div>
  )
}
