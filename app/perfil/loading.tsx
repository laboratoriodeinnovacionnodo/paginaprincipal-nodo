import { Skeleton } from "@/components/ui/skeleton"

export default function PerfilLoading() {
  return (
    <main className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-center gap-4 mb-10">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </main>
  )
}
