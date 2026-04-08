const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const coarsePointer = window.matchMedia("(pointer: coarse)").matches

const runWhenReady = (callback: () => void) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true })
    return
  }

  callback()
}

runWhenReady(() => {
  initHeader()
  initReveals()
  initScrollProgress()
  initParallax()
  initStats()
  initTestimonials()
  initGalleryMedia()
  initQuoteForm()
  initSocialProof()
  initButtonSparkles()
  initCursor()
})

function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-site-header]")
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]")
  const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]")
  const navLinks = document.querySelector<HTMLElement>("[data-nav-links]")
  const indicator = document.querySelector<HTMLElement>("[data-nav-indicator]")
  const desktopLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"))
  const mobileLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-mobile-nav-link]"))

  if (!header) {
    return
  }

  const activeLink = () =>
    desktopLinks.find((link) => link.getAttribute("aria-current") === "page") ?? desktopLinks[0] ?? null

  const syncIndicator = (link: HTMLAnchorElement | null) => {
    if (!navLinks || !indicator || !link) {
      return
    }

    const navRect = navLinks.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()

    indicator.style.setProperty("--indicator-width", `${linkRect.width}px`)
    indicator.style.setProperty("--indicator-height", `${linkRect.height}px`)
    indicator.style.setProperty("--indicator-x", `${linkRect.left - navRect.left}px`)
    indicator.style.setProperty("--indicator-y", `${linkRect.top - navRect.top}px`)
    indicator.classList.add("is-ready")
  }

  const syncHeaderState = () => {
    const isMenuOpen = mobileMenu?.classList.contains("is-open") ?? false
    header.classList.toggle("is-menu-open", isMenuOpen)
    header.classList.toggle("is-scrolled", isMenuOpen || window.scrollY > 80)
  }

  toggle?.addEventListener("click", () => {
    if (!mobileMenu) {
      return
    }

    const isOpen = mobileMenu.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", String(isOpen))
    syncHeaderState()
  })

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMenu || !toggle) {
        return
      }

      mobileMenu.classList.remove("is-open")
      toggle.setAttribute("aria-expanded", "false")
      syncHeaderState()
    })
  })

  desktopLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => syncIndicator(link))
    link.addEventListener("focus", () => syncIndicator(link))
  })

  navLinks?.addEventListener("mouseleave", () => syncIndicator(activeLink()))

  window.addEventListener(
    "resize",
    () => {
      if (!mobileMenu || !toggle) {
        syncIndicator(activeLink())
        syncHeaderState()
        return
      }

      if (window.innerWidth > 900 && mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.remove("is-open")
        toggle.setAttribute("aria-expanded", "false")
      }

      syncIndicator(activeLink())
      syncHeaderState()
    },
    { passive: true },
  )

  window.addEventListener("scroll", syncHeaderState, { passive: true })

  syncIndicator(activeLink())
  syncHeaderState()
}

function initReveals() {
  const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))

  if (!revealElements.length) {
    return
  }

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      })
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  )

  revealElements.forEach((element) => observer.observe(element))
}

function initScrollProgress() {
  const progressBar = document.querySelector<HTMLElement>("[data-scroll-progress]")

  if (!progressBar) {
    return
  }

  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    const ratio = scrollableHeight <= 0 ? 0 : Math.min(window.scrollY / scrollableHeight, 1)
    progressBar.style.setProperty("--scroll-progress", ratio.toFixed(4))
  }

  window.addEventListener("scroll", updateProgress, { passive: true })
  window.addEventListener("resize", updateProgress, { passive: true })
  updateProgress()
}

function initParallax() {
  const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-speed]"))

  if (!parallaxItems.length || prefersReducedMotion) {
    return
  }

  const updateParallax = () => {
    const viewportHeight = window.innerHeight

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallaxSpeed ?? "0.2")
      const rect = item.getBoundingClientRect()
      const shift = (viewportHeight - rect.top) * speed * 0.18
      item.style.setProperty("--parallax-shift", `${shift.toFixed(1)}px`)
    })
  }

  window.addEventListener("scroll", updateParallax, { passive: true })
  window.addEventListener("resize", updateParallax, { passive: true })
  updateParallax()
}

function initStats() {
  const statSections = Array.from(document.querySelectorAll<HTMLElement>("[data-stats-section]"))

  if (!statSections.length) {
    return
  }

  const animateSection = (section: HTMLElement) => {
    if (section.dataset.animated === "true") {
      return
    }

    section.dataset.animated = "true"

    section.querySelectorAll<HTMLElement>("[data-count-up]").forEach((element) => animateCounter(element))
    section.querySelectorAll<SVGCircleElement>("[data-progress-ring]").forEach((ring, index) =>
      animateProgressRing(ring, index),
    )
  }

  if (prefersReducedMotion) {
    statSections.forEach(animateSection)
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        animateSection(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.35 },
  )

  statSections.forEach((section) => observer.observe(section))
}

function animateCounter(element: HTMLElement) {
  const target = Number(element.dataset.countUp ?? "0")
  const duration = Number(element.dataset.countDuration ?? "1400")
  const decimals = Number(element.dataset.countDecimals ?? "0")
  const prefix = element.dataset.countPrefix ?? ""
  const suffix = element.dataset.countSuffix ?? ""
  const formatter = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (prefersReducedMotion) {
    element.textContent = `${prefix}${formatter.format(target)}${suffix}`
    return
  }

  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress)
    const rawValue = target * eased
    const value = decimals > 0 ? rawValue : Math.round(rawValue)

    element.textContent = `${prefix}${formatter.format(value)}${suffix}`

    if (progress < 1) {
      window.requestAnimationFrame(tick)
    }
  }

  window.requestAnimationFrame(tick)
}

function animateProgressRing(ring: SVGCircleElement, index: number) {
  const radius = ring.r.baseVal.value
  const circumference = 2 * Math.PI * radius
  const target = Math.min(1, Math.max(0, Number(ring.dataset.progressTarget ?? "0")))

  ring.style.strokeDasharray = `${circumference}`
  ring.style.strokeDashoffset = `${circumference}`
  ring.style.transitionDelay = `${index * 120}ms`

  if (prefersReducedMotion) {
    ring.style.strokeDashoffset = `${circumference * (1 - target)}`
    return
  }

  window.requestAnimationFrame(() => {
    ring.style.strokeDashoffset = `${circumference * (1 - target)}`
  })
}

function initTestimonials() {
  const slider = document.querySelector<HTMLElement>("[data-testimonial-slider]")
  const track = slider?.querySelector<HTMLElement>("[data-testimonial-track]")
  const slides = Array.from(slider?.querySelectorAll<HTMLElement>("[data-testimonial-slide]") ?? [])
  const dots = Array.from(slider?.querySelectorAll<HTMLButtonElement>("[data-testimonial-dot]") ?? [])
  const previousButton = slider?.querySelector<HTMLButtonElement>("[data-testimonial-prev]")
  const nextButton = slider?.querySelector<HTMLButtonElement>("[data-testimonial-next]")

  if (!slider || !track || !slides.length) {
    return
  }

  let currentIndex = 0
  let autoplayId: number | null = null

  const setActiveSlide = (index: number) => {
    currentIndex = (index + slides.length) % slides.length
    track.style.setProperty("--testimonial-index", String(currentIndex))

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex)
    })

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex
      dot.classList.toggle("is-active", isActive)
      dot.setAttribute("aria-pressed", String(isActive))
    })
  }

  const stopAutoplay = () => {
    if (autoplayId === null) {
      return
    }

    window.clearInterval(autoplayId)
    autoplayId = null
  }

  const startAutoplay = () => {
    if (prefersReducedMotion || slides.length < 2) {
      return
    }

    stopAutoplay()
    autoplayId = window.setInterval(() => setActiveSlide(currentIndex + 1), 6500)
  }

  previousButton?.addEventListener("click", () => {
    setActiveSlide(currentIndex - 1)
    startAutoplay()
  })

  nextButton?.addEventListener("click", () => {
    setActiveSlide(currentIndex + 1)
    startAutoplay()
  })

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index)
      startAutoplay()
    })
  })

  slider.addEventListener("mouseenter", stopAutoplay)
  slider.addEventListener("mouseleave", startAutoplay)
  slider.addEventListener("focusin", stopAutoplay)
  slider.addEventListener("focusout", startAutoplay)

  setActiveSlide(0)
  startAutoplay()
}

function initGalleryMedia() {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-gallery-image]"))

  if (!images.length) {
    return
  }

  images.forEach((image) => {
    const media = image.closest<HTMLElement>("[data-gallery-media]")

    if (!media) {
      return
    }

    const markAsLoaded = () => media.classList.add("is-loaded")

    if (image.complete) {
      markAsLoaded()
      return
    }

    image.addEventListener("load", markAsLoaded, { once: true })
  })
}

function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>("[data-quote-form]")
  const feedback = form?.querySelector<HTMLElement>("[data-form-feedback]")
  const submitButton = form?.querySelector<HTMLButtonElement>("[data-submit-button]")
  const submitLabel = submitButton?.querySelector<HTMLElement>(".button-text")
  const initialLabel = submitLabel?.textContent?.trim() ?? "Envoyer ma demande"

  if (!form || !submitButton || !feedback || !submitLabel) {
    return
  }

  const setFeedback = (message: string, state: "info" | "success" | "error") => {
    feedback.textContent = message
    feedback.dataset.state = state
  }

  const setSubmitState = (state: "idle" | "loading" | "success") => {
    submitButton.classList.remove("is-loading", "is-success")

    if (state === "loading") {
      submitButton.classList.add("is-loading")
      submitLabel.textContent = "Envoi en cours"
      return
    }

    if (state === "success") {
      submitButton.classList.add("is-success")
      submitLabel.textContent = "Demande envoyée"
      return
    }

    submitLabel.textContent = initialLabel
  }

  const params = new URLSearchParams(window.location.search)
  if (params.get("sent") === "1") {
    setFeedback("Votre demande a bien été envoyée. ConsultRenov revient vers vous sous 48h.", "success")
    launchConfetti(form)
  }

  const clearFieldError = (target: Element | null) => {
    if (!target) {
      return
    }

    target.closest(".form-field")?.classList.remove("is-invalid")
    target.closest(".consent")?.classList.remove("is-invalid")
  }

  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".form-field input, .form-field textarea, .consent input")
    .forEach((field) => {
      field.addEventListener("input", () => clearFieldError(field))
      field.addEventListener("focus", () => clearFieldError(field))
      field.addEventListener("change", () => clearFieldError(field))
    })

  form.addEventListener("submit", (event) => {
    if (form.dataset.busy === "true") {
      event.preventDefault()
      return
    }

    if (!form.checkValidity()) {
      event.preventDefault()
      setFeedback("Merci de compléter les champs requis avant l'envoi.", "error")
      highlightInvalidFields(form)
      form.reportValidity()
      return
    }

    event.preventDefault()
    form.dataset.busy = "true"
    setSubmitState("loading")
    setFeedback("Nous préparons votre demande pour l'envoi.", "info")

    window.setTimeout(() => {
      setSubmitState("success")
      setFeedback("Votre demande est prête à partir. ConsultRenov revient vers vous sous 48h.", "success")
      launchConfetti(form)

      window.setTimeout(() => {
        form.submit()
      }, 450)
    }, 1100)
  })
}

function highlightInvalidFields(form: HTMLFormElement) {
  const invalidFields = Array.from(form.querySelectorAll<HTMLElement>("input:invalid, textarea:invalid"))

  invalidFields.forEach((field) => {
    const container = field.closest(".form-field, .consent")
    if (!container) {
      return
    }

    container.classList.remove("is-invalid")
    void container.getBoundingClientRect()
    container.classList.add("is-invalid")
  })
}

function launchConfetti(container: HTMLElement) {
  const layer = document.createElement("div")
  const colors = ["#0047ab", "#b20000", "#0f2758", "#f0c145", "#3ba676"]

  layer.className = "form-confetti-layer"
  container.appendChild(layer)

  for (let index = 0; index < 16; index += 1) {
    const piece = document.createElement("span")
    piece.className = "form-confetti"
    piece.style.setProperty("--confetti-x", `${Math.round(Math.random() * 240 - 120)}px`)
    piece.style.setProperty("--confetti-y", `${Math.round(Math.random() * -80 - 40)}px`)
    piece.style.setProperty("--confetti-rotation", `${Math.round(Math.random() * 320)}deg`)
    piece.style.setProperty("--confetti-delay", `${(Math.random() * 0.18).toFixed(2)}s`)
    piece.style.setProperty("--confetti-color", colors[index % colors.length])
    layer.appendChild(piece)
  }

  window.setTimeout(() => layer.remove(), 1800)
}

function initSocialProof() {
  const badge = document.querySelector<HTMLElement>("[data-social-proof]")

  if (!badge) {
    return
  }

  window.setTimeout(() => {
    badge.classList.add("is-visible")
  }, 5000)
}

function initButtonSparkles() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-button-sparkle]") : null

    if (!target) {
      return
    }

    createButtonSparkles(target)
  })
}

function createButtonSparkles(target: HTMLElement) {
  const sparks = 6

  for (let index = 0; index < sparks; index += 1) {
    const spark = document.createElement("span")
    spark.className = "button-spark"
    spark.style.setProperty("--spark-x", `${Math.round(Math.random() * 70 - 35)}px`)
    spark.style.setProperty("--spark-y", `${Math.round(Math.random() * -60 - 18)}px`)
    spark.style.setProperty("--spark-delay", `${(index * 0.03).toFixed(2)}s`)
    spark.style.left = `${Math.round(Math.random() * target.clientWidth)}px`
    spark.style.top = `${Math.round(target.clientHeight * 0.5)}px`
    target.appendChild(spark)
    window.setTimeout(() => spark.remove(), 900)
  }
}

function initCursor() {
  const dot = document.getElementById("cursor-dot")
  const ring = document.getElementById("cursor-ring")
  const label = ring?.querySelector<HTMLElement>("[data-cursor-label]")

  if (!dot || !ring || coarsePointer) {
    return
  }

  const root = document.documentElement
  root.classList.add("has-custom-cursor")

  let dotX = window.innerWidth * 0.5
  let dotY = window.innerHeight * 0.5
  let targetX = dotX
  let targetY = dotY
  let ringX = dotX
  let ringY = dotY

  const render = () => {
    ringX += (targetX - ringX) * 0.12
    ringY += (targetY - ringY) * 0.12

    dot.style.left = `${dotX}px`
    dot.style.top = `${dotY}px`
    ring.style.left = `${ringX}px`
    ring.style.top = `${ringY}px`

    window.requestAnimationFrame(render)
  }

  const showCursor = () => root.classList.add("cursor-visible")
  const hideCursor = () => root.classList.remove("cursor-visible")

  const resetMode = () => {
    ring.classList.remove("is-link", "is-card", "is-cta", "is-text")
    dot.classList.remove("is-pulse", "is-text")
    if (label) {
      label.textContent = "Voir →"
    }
  }

  const applyMode = (target: EventTarget | null) => {
    resetMode()

    const element = target instanceof Element ? target : null
    if (!element) {
      return
    }

    const textField = element.closest<HTMLElement>("input, textarea, select, [contenteditable='true'], [data-cursor-text]")
    if (textField) {
      ring.classList.add("is-text")
      dot.classList.add("is-text")
      return
    }

    const card = element.closest<HTMLElement>("[data-cursor='card'], .gallery-media, .service-card, .contact-card")
    if (card) {
      ring.classList.add("is-card")
      if (label) {
        label.textContent = card.dataset.cursorLabel ?? "Voir →"
      }
      return
    }

    const cta = element.closest<HTMLElement>("[data-cursor-cta]")
    if (cta) {
      ring.classList.add("is-link", "is-cta")
      dot.classList.add("is-pulse")
      return
    }

    const interactive = element.closest<HTMLElement>("a, button")
    if (interactive) {
      ring.classList.add("is-link")
    }
  }

  const hideIframeCursor = (iframe: HTMLIFrameElement) => {
    iframe.style.cursor = "none"

    try {
      const frameDocument = iframe.contentDocument
      if (!frameDocument?.head) {
        return
      }

      let styleTag = frameDocument.getElementById("custom-cursor-hide-style") as HTMLStyleElement | null
      if (!styleTag) {
        styleTag = frameDocument.createElement("style")
        styleTag.id = "custom-cursor-hide-style"
        styleTag.textContent = "*{cursor:none !important;}"
        frameDocument.head.appendChild(styleTag)
      }
    } catch {
      return
    }
  }

  document.querySelectorAll<HTMLIFrameElement>("iframe").forEach((iframe) => {
    hideIframeCursor(iframe)
    iframe.addEventListener("load", () => hideIframeCursor(iframe))
  })

  document.addEventListener("pointermove", (event) => {
    dotX = event.clientX
    dotY = event.clientY
    targetX = event.clientX
    targetY = event.clientY
    showCursor()
  })

  document.addEventListener("mouseover", (event) => applyMode(event.target))
  document.addEventListener("focusin", (event) => {
    if (!root.classList.contains("cursor-visible")) {
      return
    }

    applyMode(event.target)
  })
  document.documentElement.addEventListener("mouseleave", hideCursor)
  window.addEventListener("blur", hideCursor)

  document.addEventListener("pointerdown", () => {
    dot.classList.remove("is-splat")
    void dot.getBoundingClientRect()
    dot.classList.add("is-splat")
  })

  window.requestAnimationFrame(render)
}
