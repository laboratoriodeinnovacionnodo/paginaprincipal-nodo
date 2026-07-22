import { Skeleton } from "@/components/ui/skeleton"

export default function CatamarcaOpenLandingLoading() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Skeleton className="h-7 w-56 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-12 w-72 mx-auto mb-5" />
        <Skeleton className="h-6 w-full max-w-xl mx-auto mb-2" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-10" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-44 rounded-lg" />
          <Skeleton className="h-12 w-52 rounded-lg" />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </main>
  )
}
