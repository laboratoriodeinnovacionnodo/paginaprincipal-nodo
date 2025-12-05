import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { BookOpen, Clock, Users } from "lucide-react"

interface CourseCardProps {
  icon: React.ReactNode
  title: string
  description: string
  duration: string
  level: string
  format: string
  link?: string
}

export function CourseCard({ icon, title, description, duration, level, format, link = "#" }: CourseCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
      <CardHeader>
        <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary w-fit">{icon}</div>
        <h3 className="text-xl font-bold text-balance leading-tight">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{format}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href={link}>Más Información</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
