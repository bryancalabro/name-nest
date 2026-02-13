import { useState } from 'react'

const GENDERS = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'surprise', label: 'Surprise Me' },
]

const STYLES = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'unique', label: 'Unique' },
  { value: 'nature-inspired', label: 'Nature' },
  { value: 'vintage', label: 'Vintage' },
]

const ORIGINS = [
  { value: 'any', label: 'Any Origin' },
  { value: 'Irish', label: 'Irish' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Scandinavian', label: 'Scandinavian' },
  { value: 'Greek', label: 'Greek' },
  { value: 'French', label: 'French' },
  { value: 'Indian', label: 'Indian' },
  { value: 'African', label: 'African' },
  { value: 'Hebrew', label: 'Hebrew' },
  { value: 'English', label: 'English' },
]

export default function NameForm({ onSubmit, isLoading }) {
  const [gender, setGender] = useState('girl')
  const [style, setStyle] = useState('classic')
  const [origin, setOrigin] = useState('any')
  const [count, setCount] = useState(6)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ gender, style, origin, count })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Gender */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGender(g.value)}
              className={`min-h-11 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                gender === g.value
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Style
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`min-h-11 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                style === s.value
                  ? 'bg-violet-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Origin */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Cultural Origin
        </label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full min-h-11 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%239ca3af'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
        >
          {ORIGINS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          Number of Names: <span className="text-rose-500">{count}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-rose-500"
          style={{
            background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${((count - 1) / 9) * 100}%, #e5e7eb ${((count - 1) / 9) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full min-h-[52px] rounded-xl text-base font-bold transition-all duration-150 ${
          isLoading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] shadow-sm'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Finding names...
          </span>
        ) : (
          'Generate Names'
        )}
      </button>
    </form>
  )
}
