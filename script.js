const rail = document.querySelector(".work-rail");

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
