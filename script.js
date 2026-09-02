const rail = document.querySelector(".work-rail");
const contactForm = document.querySelector("#contact-form");

if (rail) {
  rail.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollBy({ left: event.deltaY, behavior: "smooth" });
    },
    { passive: false },
  );
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get("name")?.toString().trim() || "Website visitor";
    const email = data.get("email")?.toString().trim() || "";
    const message = data.get("message")?.toString().trim() || "";
    const body = [`From: ${name}`, `Email: ${email}`, "", message].join("\n");
    const subject = `Website note from ${name}`;

    window.location.href = `mailto:hello@evadaniel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
