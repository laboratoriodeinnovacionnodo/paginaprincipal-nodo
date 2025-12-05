import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function SobreNosotrosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12 text-center">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center space-y-3">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <Skeleton className="h-8 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
