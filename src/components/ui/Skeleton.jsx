export default function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`animate-pulse rounded-xl bg-lavender-light/70 ${className}`} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3 p-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}
