"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

const resultadosData = [
  { perfil: "Diplomatura Full Stack", cicloCompleto: 56, enFormacion: 150 },
  { perfil: "Diplomatura en IOT", cicloCompleto: 8, enFormacion: 25 },
  { perfil: "Junior en QA", cicloCompleto: 42, enFormacion: 0 },
  { perfil: "Técnico en Base de Datos", cicloCompleto: 36, enFormacion: 80 },
  { perfil: "Desarrollador de Videojuegos", cicloCompleto: 52, enFormacion: 80 },
  { perfil: "Desarrollo WEB", cicloCompleto: 20, enFormacion: 40 },
  { perfil: "Power BI", cicloCompleto: 36, enFormacion: 120 },
  { perfil: "Técnico Audiovisual", cicloCompleto: 48, enFormacion: 80 },
  { perfil: "Diseño e Impresión 3D", cicloCompleto: 75, enFormacion: 100 },
  { perfil: "Experto en Ofimática", cicloCompleto: 185, enFormacion: 350 },
  { perfil: "Administrador Digital", cicloCompleto: 65, enFormacion: 100 },
  { perfil: "IA Productiva", cicloCompleto: 25, enFormacion: 150 },
]

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
  "#6366f1",
]

export function ResultadosCharts() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = resultadosData.filter((item) =>
    item.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCicloCompleto = resultadosData.reduce((sum, item) => sum + item.cicloCompleto, 0)
  const totalEnFormacion = resultadosData.reduce((sum, item) => sum + item.enFormacion, 0)

  const pieData = [
    { name: "Ciclo Completo", value: totalCicloCompleto },
    { name: "En Formación", value: totalEnFormacion },
  ]

  const handleDownloadCSV = () => {
    const headers = ["Perfil", "Ciclo Completo", "En Formación"]
    const csvContent = [
      headers.join(","),
      ...resultadosData.map(
        (row) => `"${row.perfil}",${row.cicloCompleto},${row.enFormacion}`
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "resultados_2024.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          {/* <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleDownloadCSV} variant="outline" className="w-full md:w-auto bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Descargar CSV
          </Button> */}
        </div>

        {/* Summary cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Estudiantes</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {totalCicloCompleto + totalEnFormacion}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Ciclo Completo</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {totalCicloCompleto}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">En Formación</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              {totalEnFormacion}
            </div>
          </Card>
        </div> */}

        {/* Bar Chart */}
        <Card className="p-6 mb-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6">Resultados por Perfil</h3>

          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <defs>
                <linearGradient id="colorCicloCompleto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>

                <linearGradient id="colorEnFormacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis
                dataKey="perfil"
                angle={-45}
                textAnchor="end"
                height={150}
                tick={{ fontSize: 12 }}
                className="fill-foreground"
              />
              <YAxis className="fill-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />

              <Bar
                dataKey="cicloCompleto"
                fill="url(#colorCicloCompleto)"
                name="Ciclo Completo"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="enFormacion"
                fill="url(#colorEnFormacion)"
                name="En Formación"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie + Top5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Distribución Total</h3>

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <defs>
                  <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={1} />
                  </linearGradient>

                  <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                  </linearGradient>
                </defs>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? "url(#pieGradient1)" : "url(#pieGradient2)"}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top 5 */}
          <Card className="p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Top 5 Perfiles por Estudiantes</h3>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={[...resultadosData]
                  .map((item) => ({ ...item, total: item.cicloCompleto + item.enFormacion }))
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorTop5" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis type="number" className="fill-foreground" />
                <YAxis
                  dataKey="perfil"
                  type="category"
                  width={110}
                  tick={{ fontSize: 11 }}
                  className="fill-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" fill="url(#colorTop5)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detail cards */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Detalle por Perfil</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4"
                style={{ borderLeftColor: COLORS[index % COLORS.length] }}
              >
                <h4 className="font-bold text-lg mb-4">{item.perfil}</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ciclo Completo</span>
                    <span className="text-2xl font-bold" style={{ color: "#10b981" }}>
                      {item.cicloCompleto}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">En Formación</span>
                    <span className="text-2xl font-bold" style={{ color: "#8b5cf6" }}>
                      {item.enFormacion > 0 ? item.enFormacion : "-"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                        {item.cicloCompleto + item.enFormacion}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
