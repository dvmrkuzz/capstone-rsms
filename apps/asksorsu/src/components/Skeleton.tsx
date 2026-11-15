interface SkeletonProps {
  className?: string
}

/**
 * A neutral placeholder block shown while content is being fetched. Skeletons
 * occupy the approximate shape of the content they replace, so the layout does
 * not shift when the real data arrives.
 */
export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} aria-hidden="true" />
}