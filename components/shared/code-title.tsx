"use client"

/**
 * <CodeTitle>
 *
 * Animación premium: cada palabra sube suavemente desde abajo
 * con fade-in + blur dissolve, en cascada de izquierda a derecha.
 *
 * - Sin dependencias externas
 * - Respeta prefers-reduced-motion
 * - Compatible con <span> de accent color (text-primary, etc.)
 * - IntersectionObserver para páginas con scroll
 * - `immediate` para heroes above-the-fold
 */

import { useEffect, useRef, type ReactNode } from "react"

type Tag = "h1" | "h2" | "h3"

interface Props {
  as?: Tag
  className?: string
  children: ReactNode
  /** Disparar sin esperar scroll (hero above-the-fold) */
  immediate?: boolean
  /** ms entre palabras. Default: 80 */
  stagger?: number
  /** ms que dura el reveal de cada palabra. Default: 600 */
  duration?: number
}

export function CodeTitle({
  as: Tag = "h1",
  className = "",
  children,
  immediate = false,
  stagger = 80,
  duration = 600,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // ── Reconstruir el heading como lista de word-spans ────────
    // Preserva los <span class="text-primary"> y similares como
    // wrappers de color — solo fragmentamos su contenido en palabras.

    const originalHTML = el.innerHTML

    type WordSlot = {
      span: HTMLSpanElement
      accentClass: string   // clase CSS del wrapper accent, si existe
      isAccent: boolean
    }

    const wordSlots: WordSlot[] = []

    // Procesa un fragmento de texto, dividiendo en palabras + espacios.
    // Cada "token" (palabra o espacio) se convierte en un span animable.
    function createWordSpan(word: string, accentClass: string, isAccent: boolean): HTMLSpanElement {
      const sp = document.createElement("span")
      // inline-block para poder transformar verticalmente
      // overflow hidden contiene el movimiento dentro del bounding box
      sp.style.cssText = [
        "display:inline-block",
        "overflow:hidden",
        "vertical-align:bottom",
        // El padding-bottom compensa el overflow:hidden que recorta descenders
        "padding-bottom:0.1em",
        "margin-bottom:-0.1em",
      ].join(";")

      // Span interno — este es el que se anima
      const inner = document.createElement("span")
      inner.style.cssText = [
        "display:inline-block",
        "opacity:0",
        "transform:translateY(60%) skewY(3deg)",
        "filter:blur(4px)",
        `transition:opacity ${duration}ms cubic-bezier(0.16,1,0.3,1), transform ${duration}ms cubic-bezier(0.16,1,0.3,1), filter ${duration}ms cubic-bezier(0.16,1,0.3,1)`,
        "will-change:transform,opacity,filter",
      ].join(";")

      if (isAccent && accentClass) {
        inner.className = accentClass
      }

      inner.textContent = word
      sp.appendChild(inner)

      wordSlots.push({ span: inner, accentClass, isAccent })
      return sp
    }

    // Tokenizar texto en palabras y espacios
    function tokenize(text: string): string[] {
      // Dividir manteniendo espacios como tokens separados
      return text.split(/(\s+)/)
    }

    // Recorrer el DOM real y reemplazar TextNodes con word-spans
    function processText(node: Text, accentClass: string) {
      const text = node.textContent ?? ""
      if (!text.trim() && text.length === 0) return

      const tokens = tokenize(text)
      const frag = document.createDocumentFragment()

      for (const token of tokens) {
        if (!token) continue
        if (/^\s+$/.test(token)) {
          // Espacio: texto plano, no se anima
          frag.appendChild(document.createTextNode(token))
        } else {
          const ws = createWordSpan(token, accentClass, accentClass.length > 0)
          frag.appendChild(ws)
        }
      }

      node.parentNode?.replaceChild(frag, node)
    }

    function walk(node: Node, accentClass: string) {
      if (node.nodeType === Node.TEXT_NODE) {
        processText(node as Text, accentClass)
        return
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        // Si es un span, capturar su clase para propagarla a los inners
        const cls = el.tagName === "SPAN" ? el.className : accentClass
        // Snapshot antes de mutar
        const kids = Array.from(el.childNodes)
        for (const k of kids) walk(k, cls)
      }
    }

    walk(el, "")

    // ── Trigger ────────────────────────────────────────────────
    let timeouts: ReturnType<typeof setTimeout>[] = []

    function reveal() {
      wordSlots.forEach(({ span }, i) => {
        const id = setTimeout(() => {
          span.style.opacity = "1"
          span.style.transform = "translateY(0%) skewY(0deg)"
          span.style.filter = "blur(0px)"
        }, i * stagger)
        timeouts.push(id)
      })
    }

    if (immediate) {
      // Pequeño delay para que el DOM esté pintado
      const id = setTimeout(reveal, 50)
      timeouts.push(id)
    } else {
      const obs = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            obs.disconnect()
            reveal()
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)

      return () => {
        timeouts.forEach(clearTimeout)
        obs.disconnect()
        el.innerHTML = originalHTML
      }
    }

    return () => {
      timeouts.forEach(clearTimeout)
      el.innerHTML = originalHTML
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
    >
      {children}
    </Tag>
  )
}
