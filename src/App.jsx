import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import parse from "html-react-parser";
import { activeSections, navItems, pageTemplates } from "./pageTemplates.js";

function currentPage() {
  const page = window.location.pathname.split("/").filter(Boolean).at(-1);
  return page || "index.html";
}

function readTemplate(template) {
  const document = new DOMParser().parseFromString(template, "text/html");
  return {
    description:
      document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    main: document.querySelector("main")?.innerHTML || "",
    title: document.querySelector("title")?.textContent || "Eva Daniel",
  };
}

function Header({ page }) {
  const activePage = activeSections[page] || page;

  return (
    <header className="site-header" aria-label="Primary">
      <a className="brand" href="index.html" aria-label="Eva Daniel home">
        EVA DANIEL
      </a>
      <nav className="nav-links">
        {navItems.map(([label, href]) => (
          <a key={href} href={href} aria-current={activePage === href ? "page" : undefined}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function updateMetadata({ title, description }) {
  document.title = title;

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.append(meta);
  }
  meta.setAttribute("content", description);
}

const introStorageKey = "eva-portfolio-intro-seen";

function shouldShowIntro(page) {
  if (page !== "index.html") return false;
  if (new URLSearchParams(window.location.search).get("intro") === "1") return true;

  try {
    return window.localStorage.getItem(introStorageKey) !== "true";
  } catch {
    return true;
  }
}

function IntroLoader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setIsExiting(true), reducedMotion ? 850 : 2800);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsExiting(true);
    };

    document.body.classList.add("intro-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("intro-open");
    };
  }, []);

  useEffect(() => {
    if (!isExiting) return undefined;
    const timer = window.setTimeout(onComplete, 560);
    return () => window.clearTimeout(timer);
  }, [isExiting, onComplete]);

  return (
    <div
      className={`intro-loader${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Hello, I'm Eva Daniel"
    >
      <button className="intro-skip" type="button" onClick={() => setIsExiting(true)}>
        SKIP
      </button>
      <div className="intro-lockup" aria-hidden="true">
        <p>Hello, I&apos;m</p>
        <h1>
          <span className="intro-eva">
            Eva
            <svg className="intro-sprout" viewBox="0 0 64 72" focusable="false">
              <path className="intro-stem" d="M32 69 C31 55 32 38 32 20" />
              <path
                className="intro-leaf intro-leaf-left"
                d="M31 46 C20 46 12 38 11 27 C22 27 30 34 31 46 Z"
              />
              <path
                className="intro-leaf intro-leaf-right"
                d="M33 36 C34 25 42 18 53 18 C52 29 44 36 33 36 Z"
              />
            </svg>
          </span>{" "}
          Daniel
        </h1>
      </div>
    </div>
  );
}

function App() {
  const progressRef = useRef(null);
  const page = currentPage();
  const [showIntro, setShowIntro] = useState(() => shouldShowIntro(page));
  const isJournalAlias = page === "journal.html";
  const template = pageTemplates[page] || pageTemplates["index.html"];
  const content = useMemo(() => readTemplate(template), [template]);

  const completeIntro = useCallback(() => {
    try {
      window.localStorage.setItem(introStorageKey, "true");
    } catch {
      // The intro can still close when storage is unavailable.
    }
    setShowIntro(false);
  }, []);

  useEffect(() => {
    if (isJournalAlias) {
      window.location.replace(`creatives.html${window.location.hash}`);
      return undefined;
    }

    updateMetadata(content);

    const rail = document.querySelector(".work-rail");
    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollBy({ left: event.deltaY, behavior: "smooth" });
    };

    rail?.addEventListener("wheel", handleWheel, { passive: false });
    return () => rail?.removeEventListener("wheel", handleWheel);
  }, [content, isJournalAlias]);

  useEffect(() => {
    if (isJournalAlias) return undefined;

    const root = document.documentElement;
    const header = document.querySelector(".site-header");
    const hero = document.querySelector(".hero");
    const heroCopy = document.querySelector(".hero-copy");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealSelectors = [
      ".hero .kicker",
      ".hero h1",
      ".hero-copy > p",
      ".hero-meta > *",
      ".section-label > *",
      ".info-copy > *",
      ".resume-group",
      ".project-card",
      ".journal-intro",
      ".journal-group-header",
      ".journal-feature",
      ".journal-snapshots",
      ".snapshot-gallery figure",
      ".snapshot-grid figure",
      ".modeling-hero-copy > *",
      ".modeling-hero-portrait",
      ".modeling-meta > div",
      ".modeling-gallery figure",
      ".modeling-credit > *",
      ".case-hero-copy > *",
      ".case-hero-image",
      ".case-meta > div",
      ".case-chapter > .case-label",
      ".case-chapter-body > *",
      ".case-stat > *",
      ".case-product > *",
      ".contact-form > *",
      ".photo-essay-header > *",
      ".photo-essay-cover",
      ".photo-sequence > *",
      ".concert-program > *",
      ".photo-essay-back",
    ];
    const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];

    root.classList.add("motion-ready");
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${(index % 6) * 55}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7%", threshold: 0.08 },
    );

    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const updateScrollEffects = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current?.style.setProperty("--scroll-progress", progress.toString());
      header?.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollEffects);
    };

    const handleHeroPointer = (event) => {
      if (!hero || !heroCopy || reduceMotion.matches) return;
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
      heroCopy.style.setProperty("--hero-x", `${x}px`);
      heroCopy.style.setProperty("--hero-y", `${y}px`);
    };
    const resetHeroPointer = () => {
      heroCopy?.style.setProperty("--hero-x", "0px");
      heroCopy?.style.setProperty("--hero-y", "0px");
    };

    updateScrollEffects();
    window.addEventListener("scroll", handleScroll, { passive: true });
    hero?.addEventListener("pointermove", handleHeroPointer, { passive: true });
    hero?.addEventListener("pointerleave", resetHeroPointer);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      hero?.removeEventListener("pointermove", handleHeroPointer);
      hero?.removeEventListener("pointerleave", resetHeroPointer);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
      revealItems.forEach((item) => {
        item.classList.remove("reveal-item", "is-visible");
        item.style.removeProperty("--reveal-delay");
      });
    };
  }, [content, isJournalAlias]);

  const handleSubmit = (event) => {
    if (event.target.id !== "contact-form") return;
    event.preventDefault();

    const data = new FormData(event.target);
    const name = data.get("name")?.toString().trim() || "Website visitor";
    const email = data.get("email")?.toString().trim() || "";
    const message = data.get("message")?.toString().trim() || "";
    const body = [`From: ${name}`, `Email: ${email}`, "", message].join("\n");
    const subject = `Website note from ${name}`;

    window.location.href = `mailto:hello@evadaniel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isJournalAlias) {
    return (
      <main className="redirect-page">
        <p>
          <a href={`creatives.html${window.location.hash}`}>Continue to Creatives</a>
        </p>
      </main>
    );
  }

  return (
    <>
      {showIntro && <IntroLoader onComplete={completeIntro} />}
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <Header page={page} />
      <main onSubmit={handleSubmit}>{parse(content.main)}</main>
    </>
  );
}

export default App;
