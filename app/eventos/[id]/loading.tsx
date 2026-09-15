import { Skeleton } from '@/components/ui/skeleton'

export default function EventoDetalleLoading() {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
    </main>
  )
}
