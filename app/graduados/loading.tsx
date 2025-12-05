import { SkeletonTable } from "@/components/ui/skeleton-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GraduadosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>

        <SkeletonTable />
      </div>
    </div>
  )
}
