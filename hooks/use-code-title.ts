"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function randomBit(): string {
  return Math.random() < 0.5 ? "0" : "1"
}

interface UseCodeTitleOptions {
  scrambleCycles?: number
  stagger?: number
  cycleDuration?: number
  triggerStart?: string
  immediate?: boolean
}

export function useCodeTitle(options: UseCodeTitleOptions = {}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const el = ref.current
    if (!el) return

    const {
      scrambleCycles = 8,
      stagger        = 0.042,
      cycleDuration  = 0.038,
      triggerStart   = "top 82%",
      immediate      = false,
    } = options

    const originalHTML = el.innerHTML

    type Slot = {
      char: string
      isSpace: boolean
      isAccent: boolean
      span: HTMLSpanElement
    }

    const slots: Slot[] = []

    function processTextNode(textNode: Text, insideAccent: boolean) {
      const text = textNode.textContent ?? ""
      if (!text) return
      const fragment = document.createDocumentFragment()
      for (const char of text) {
        const isSpace = char === " " || char === "\u00A0"
        const sp = document.createElement("span")
        sp.style.cssText = "display:inline-block;white-space:pre;"
        sp.textContent = isSpace ? "\u00A0" : char
        slots.push({ char: isSpace ? "\u00A0" : char, isSpace, isAccent: insideAccent, span: sp })
        fragment.appendChild(sp)
      }
      textNode.parentNode?.replaceChild(fragment, textNode)
    }

    function walkNode(node: Node, insideAccent: boolean) {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text, insideAccent)
        return
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const isAccent = insideAccent || (node as HTMLElement).tagName === "SPAN"
        const children = Array.from(node.childNodes)
        for (const child of children) walkNode(child, isAccent)
      }
    }

    walkNode(el, false)

    gsap.set(slots.map((s) => s.span), { opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    slots.forEach((slot, i) => {
      const { span, char, isSpace, isAccent } = slot
      const delay = i * stagger

      if (isSpace) {
        tl.to(span, { opacity: 1, duration: 0 }, delay)
        return
      }

      for (let c = 0; c < scrambleCycles; c++) {
        tl.to(span, {
          opacity: 1,
          duration: 0,
          onStart() {
            span.textContent = randomBit()
            span.style.color = isAccent
              ? "rgba(38,167,252,0.75)"
              : "rgba(38,167,252,0.55)"
          },
        }, delay + c * cycleDuration)
      }

      tl.to(span, {
        duration: 0,
        onStart() {
          span.textContent = char
          span.style.color = ""
        },
      }, delay + scrambleCycles * cycleDuration)

      tl.fromTo(
        span,
        { opacity: 0.55 },
        { opacity: 1, duration: 0.1, ease: "power1.out" },
        delay + scrambleCycles * cycleDuration,
      )
    })

    if (immediate) {
      tl.play()
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: triggerStart,
        once: true,
        onEnter: () => tl.play(),
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === el) t.kill()
      })
      el.innerHTML = originalHTML
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
