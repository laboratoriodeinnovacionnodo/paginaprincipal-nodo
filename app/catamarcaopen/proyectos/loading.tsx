import { Skeleton } from "@/components/ui/skeleton"

export default function CatamarcaOpenProyectosLoading() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="space-y-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-11 w-44 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    </main>
  )
}
