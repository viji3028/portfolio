
const sections = Array.from(
    document.querySelectorAll(".page-section")
);

const navLinks = Array.from(
    document.querySelectorAll(".nav-link")
);

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("sectionCounter");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");

let currentSection = 0;
let scrollTimer = null;

document.getElementById("year").textContent =
    new Date().getFullYear();

function updateNavigation() {
    counter.textContent =
        String(currentSection + 1).padStart(2, "0") +
        " / " +
        String(sections.length).padStart(2, "0");

    navLinks.forEach((link) => {
        const isActive =
            link.getAttribute("href") ===
            "#" + sections[currentSection].id;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    prevBtn.disabled = currentSection === 0;
    nextBtn.disabled = currentSection === sections.length - 1;
}

function goToSection(index) {
    const nextIndex = Math.max(
        0,
        Math.min(index, sections.length - 1)
    );

    currentSection = nextIndex;
    updateNavigation();

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    sections[currentSection].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

prevBtn.addEventListener("click", () => {
    goToSection(currentSection - 1);
});

nextBtn.addEventListener("click", () => {
    goToSection(currentSection + 1);
});

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const sectionId = link.getAttribute("href").slice(1);

        const index = sections.findIndex(
            (section) => section.id === sectionId
        );

        if (index !== -1) {
            goToSection(index);
        }
    });
});

menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

// Keep the active navigation in sync with manual scrolling.
window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
        const referencePoint =
            window.scrollY + window.innerHeight * 0.35;

        let visibleIndex = 0;

        sections.forEach((section, index) => {
            if (section.offsetTop <= referencePoint) {
                visibleIndex = index;
            }
        });

        currentSection = visibleIndex;
        updateNavigation();
    }, 70);
}, { passive: true });

// Close the mobile menu when the viewport becomes wider.
window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }
});

// Keyboard shortcuts: left arrow = previous, right arrow = next.
document.addEventListener("keydown", (event) => {
    const target = event.target;

    const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

    if (
        isTyping ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        goToSection(currentSection + 1);
    }

    if (event.key === "ArrowLeft") {
        goToSection(currentSection - 1);
    }

    if (event.key === "Escape") {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

updateNavigation();
