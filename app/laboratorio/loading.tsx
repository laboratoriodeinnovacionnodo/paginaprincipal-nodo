import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioLoading() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* Hero */}
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Skeleton className="h-7 w-52 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto mb-3" />
        <Skeleton className="h-12 w-2/3 mx-auto mb-5" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto mb-2" />
        <Skeleton className="h-5 w-4/5 mx-auto mb-10" />
        <div className="flex justify-center gap-3">
          <Skeleton className="h-11 w-48 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* Proceso */}
      <div className="container mx-auto px-4 mt-20 max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Áreas */}
      <div className="container mx-auto px-4 mt-20 max-w-5xl space-y-5">
        <Skeleton className="h-8 w-64 mx-auto mb-3" />
        <Skeleton className="h-4 w-80 mx-auto mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>

      {/* Proyectos destacados */}
      <div className="container mx-auto px-4 mt-20 max-w-5xl">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>

    </main>
  )
}
