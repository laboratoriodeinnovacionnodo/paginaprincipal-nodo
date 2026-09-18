import { Skeleton } from '@/components/ui/skeleton'

export default function EventosLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-3">
            <Skeleton className="h-7 w-44 rounded-full" />
            <Skeleton className="h-14 w-80" />
            <Skeleton className="h-14 w-56" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-32 w-72 rounded-2xl shrink-0" />
        </div>

        {/* Separador */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-slate-200" />
          <Skeleton className="h-3 w-36" />
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  )
}
