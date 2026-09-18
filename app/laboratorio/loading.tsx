import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioLoading() {
  return (
    <main className="min-h-screen">

      {/* Hero dark skeleton */}
      <div className="bg-slate-900 pt-32 pb-20 flex flex-col items-center text-center px-4 gap-5">
        <Skeleton className="h-7 w-64 rounded-full bg-white/10" />
        <Skeleton className="h-14 w-full max-w-2xl rounded-xl bg-white/10" />
        <Skeleton className="h-14 w-3/4 max-w-xl rounded-xl bg-white/10" />
        <Skeleton className="h-5 w-full max-w-lg rounded bg-white/8" />
        <Skeleton className="h-5 w-4/5 max-w-md rounded bg-white/8" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-11 w-40 rounded-xl bg-white/10" />
          <Skeleton className="h-11 w-36 rounded-xl bg-white/8" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40">

        {/* Proceso */}
        <div className="container mx-auto px-4 py-20 max-w-5xl">
          <div className="flex flex-col items-center gap-3 mb-12">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-56" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Áreas */}
        <div className="container mx-auto px-4 pb-20 max-w-5xl space-y-5">
          <div className="flex flex-col items-center gap-3 mb-12">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-96" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-2xl" />
          ))}
        </div>

        {/* CTA */}
        <div className="container mx-auto px-4 pb-24 max-w-3xl">
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>

      </div>
    </main>
  )
}
