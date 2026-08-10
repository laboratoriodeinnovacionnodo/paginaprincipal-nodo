import type { AreaBackendResponse } from "./types"

const BASE = (
  process.env.NEXT_PUBLIC_COWORKING_URL ?? "http://localhost:3550"
).replace(/\/$/, "")

export async function getAreas(): Promise<AreaBackendResponse[]> {
  const res = await fetch(`${BASE}/area`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error(`[coworking-api] GET /area → ${res.status}`)
  return res.json()
}
