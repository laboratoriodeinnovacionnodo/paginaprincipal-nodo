import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioProyectoDetailLoading() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-2xl space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-4 gap-2">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="aspect-square rounded-lg" />
        </div>
      </div>
    </main>
  )
}
