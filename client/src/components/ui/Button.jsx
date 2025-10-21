export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
