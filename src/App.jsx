import { useEffect, useMemo } from "react";
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

function App() {
  const page = currentPage();
  const isJournalAlias = page === "journal.html";
  const template = pageTemplates[page] || pageTemplates["index.html"];
  const content = useMemo(() => readTemplate(template), [template]);

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
      <Header page={page} />
      <main onSubmit={handleSubmit}>{parse(content.main)}</main>
    </>
  );
}

export default App;
