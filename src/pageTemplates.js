import about from "./content/about.html?raw";
import contact from "./content/contact.html?raw";
import creatives from "./content/creatives.html?raw";
import cv from "./content/cv.html?raw";
import europe2018 from "./content/europe-2018.html?raw";
import experience from "./content/experience.html?raw";
import gknow from "./content/gknow.html?raw";
import home from "./content/index.html?raw";
import ioStudio from "./content/io-studio.html?raw";
import newYork2019 from "./content/new-york-2019.html?raw";
import projects from "./content/projects.html?raw";
import snapshots from "./content/snapshots.html?raw";
import vietnam2024 from "./content/vietnam-december-2024.html?raw";

export const pageTemplates = {
  "index.html": home,
  "about.html": about,
  "contact.html": contact,
  "creatives.html": creatives,
  "cv.html": cv,
  "europe-2018.html": europe2018,
  "experience.html": experience,
  "gknow.html": gknow,
  "io-studio.html": ioStudio,
  "new-york-2019.html": newYork2019,
  "projects.html": projects,
  "snapshots.html": snapshots,
  "vietnam-december-2024.html": vietnam2024,
};

export const navItems = [
  ["HOME", "index.html"],
  ["ABOUT", "about.html"],
  ["EXPERIENCE", "experience.html"],
  ["PROJECTS", "projects.html"],
  ["CREATIVES", "creatives.html"],
  ["CONTACT", "contact.html"],
  ["CV", "cv.html"],
];

export const activeSections = {
  "europe-2018.html": "creatives.html",
  "io-studio.html": "creatives.html",
  "new-york-2019.html": "creatives.html",
  "snapshots.html": "creatives.html",
  "vietnam-december-2024.html": "creatives.html",
  "gknow.html": "projects.html",
};
