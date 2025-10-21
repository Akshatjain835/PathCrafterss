export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white shadow-sm rounded-lg p-8 sm:p-10 ${className}`}>
      {children}
    </div>
  )
}
