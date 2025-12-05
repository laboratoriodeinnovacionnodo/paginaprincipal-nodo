import { SkeletonCard } from "@/components/ui/skeleton-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NoticiasLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="mb-8 space-y-4">
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
