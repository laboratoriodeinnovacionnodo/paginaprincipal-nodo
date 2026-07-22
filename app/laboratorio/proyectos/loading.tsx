import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioProyectosLoading() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Skeleton className="h-5 w-28 mb-6" />
        <Skeleton className="h-9 w-72 mb-6" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </main>
  )
}
