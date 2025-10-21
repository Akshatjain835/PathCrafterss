export default function Input({ label, id, error, description, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div>
        <input
          id={id}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          {...props}
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
