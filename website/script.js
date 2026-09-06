document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuButton.classList.toggle("active");
        });

        // Close menu after clicking a navigation link
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuButton.classList.remove("active");
            });
        });
    }


    // ==========================================
    // SCROLL REVEAL ANIMATION
    // ==========================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    // ==========================================
    // HERO 3D MOUSE EFFECT
    // ==========================================

    const heroVisual = document.querySelector(".hero-visual");

    if (
        heroVisual &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        heroVisual.addEventListener("mousemove", (event) => {
            const rect = heroVisual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const rotateX = -y * 8;
            const rotateY = x * 8;

            heroVisual.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-4px)
            `;
        });

        heroVisual.addEventListener("mouseleave", () => {
            heroVisual.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateY(0)
            `;
        });
    }


    // ==========================================
    // EXTERNAL LINK SECURITY
    // ==========================================

    document.querySelectorAll("a[target='_blank']").forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });


    // ==========================================
    // CURRENT YEAR
    // ==========================================

    const yearElements = document.querySelectorAll("[data-year]");
    const currentYear = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
    });


    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // ==========================================
    // ACTIVE NAVIGATION
    // ==========================================

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.getAttribute("id");

                        navLinks.forEach((link) => {
                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${currentId}`
                            ) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.35
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    // ==========================================
    // CURSOR GLOW
    // ==========================================

    const cursorGlow = document.createElement("div");

    cursorGlow.className = "cursor-glow";

    document.body.appendChild(cursorGlow);

    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (event) => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        });
    }


    // ==========================================
    // TERMINAL TYPING EFFECT
    // ==========================================

    const terminalLines = document.querySelectorAll(
        ".terminal-line"
    );

    terminalLines.forEach((line, index) => {
        line.style.opacity = "0";

        setTimeout(() => {
            line.style.opacity = "1";
            line.classList.add("terminal-visible");
        }, 250 * index);
    });


    // ==========================================
    // CARD TILT EFFECT
    // ==========================================

    const cards = document.querySelectorAll(
        ".project-card, .skill-card, .universe-card"
    );

    if (window.matchMedia("(pointer: fine)").matches) {
        cards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect = card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                const rotateX = -y * 4;
                const rotateY = x * 4;

                card.style.transform = `
                    perspective(800px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-5px)
                `;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }


    // ==========================================
    // SYSTEM STATUS
    // ==========================================

    const statusText = document.querySelector(".system-status");

    if (statusText) {
        const statuses = [
            "SYSTEM ONLINE",
            "BUILD MODE ACTIVE",
            "CREATIVE CORE ONLINE",
            "READY TO CREATE"
        ];

        let statusIndex = 0;

        setInterval(() => {
            statusIndex =
                (statusIndex + 1) % statuses.length;

            statusText.textContent =
                statuses[statusIndex];
        }, 4000);
    }


    // ==========================================
    // CONSOLE EASTER EGG
    // ==========================================

    console.log(
        "%c AASIF // DEVELOPER SYSTEM ",
        "font-size:18px;font-weight:bold;"
    );

    console.log(
        "%cIdeas → Code → Design → Reality",
        "font-size:14px;"
    );

    console.log(
        "%cSystem initialized successfully.",
        "font-size:12px;"
    );
});
