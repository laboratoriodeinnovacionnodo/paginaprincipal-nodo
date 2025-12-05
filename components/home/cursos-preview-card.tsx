// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { LucideIcon } from "lucide-react"

// interface CursoPreviewCardProps {
//   icon: LucideIcon
//   title: string
//   description: string
//   detail?: string
//   link: string
//   gradientFrom?: string
//   gradientTo?: string
//   borderColor?: string
//   glowColor?: string
//   buttonLabel?: string
// }

// export function CursoPreviewCard({
//   icon: Icon,
//   title,
//   description,
//   detail,
//   link,
//   gradientFrom = "#3B82F6", // azul-500
//   gradientTo = "#06B6D4",   // cyan-500
//   borderColor = "border-blue-500/20",
//   glowColor = "shadow-blue-500/30",
//   buttonLabel = "Ver más",
// }: CursoPreviewCardProps) {
//   return (
//     <div
//       className={`
//         group relative overflow-hidden rounded-2xl 
//         bg-gradient-to-br from-[${gradientFrom}]/10 to-[${gradientTo}]/10 
//         p-8 border-2 ${borderColor} 
//         hover:border-blue-500/40 transition-all duration-300 
//         hover:shadow-xl hover:shadow-[${glowColor}]
//       `}
//     >
//       <div
//         className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl transition-colors"
//         style={{
//           backgroundColor: `${gradientFrom}20`,
//         }}
//       />
//       <div className="relative z-10">
//         <div
//           className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-6 shadow-lg transition-transform group-hover:scale-105"
//           style={{
//             backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
//             boxShadow: `0 4px 30px ${glowColor.replace("/30", "40")}`,
//           }}
//         >
//           <Icon className="h-8 w-8" />
//         </div>

//         <h3 className="text-2xl font-bold mb-3">{title}</h3>

//         <p className="text-muted-foreground mb-6">{description}</p>

//         {detail && (
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
//             {detail}
//           </div>
//         )}

//         <Link href={link} className="group">
//           <Button
//             variant="outline"
//             className="
//               w-full 
//               bg-transparent 
//               transition-colors 
//               group-hover:bg-blue-500 
//               group-hover:text-white 
//               group-hover:border-blue-500 
//               hover:bg-blue-500 
//               hover:text-white 
//               hover:border-blue-500 
//               cursor-pointer
//             "
//           >
//             {buttonLabel}
//           </Button>
//         </Link>
//       </div>
//     </div>
//   )
// }
