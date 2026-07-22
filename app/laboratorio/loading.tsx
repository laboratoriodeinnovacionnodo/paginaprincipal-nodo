import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioLoading() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Skeleton className="h-7 w-56 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-12 w-80 mx-auto mb-5" />
        <Skeleton className="h-6 w-full max-w-xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-10" />
        <Skeleton className="h-12 w-44 mx-auto rounded-lg" />
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </main>
  )
}
