/* =====================================================
   GALLERY.JS
===================================================== */

(() => {
    const items = [...document.querySelectorAll(".gallery-item")];
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImage");
    const close = document.getElementById("lightboxClose");
    const prev = document.getElementById("lightboxPrev");
    const next = document.getElementById("lightboxNext");

    if (!items.length) return;

    let current = 0;

    const open = index => {
        current = index;
        const item = items[current];
        image.src = item.dataset.full;
        image.alt = item.querySelector("img")?.alt || "Foto galeri";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-locked");
    };

    const closeBox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-locked");
    };

    const move = direction => {
        current = (current + direction + items.length) % items.length;
        const item = items[current];
        image.src = item.dataset.full;
        image.alt = item.querySelector("img")?.alt || "Foto galeri";
    };

    items.forEach(item => {
        item.addEventListener("click", () => open(Number(item.dataset.index)));
    });

    close.addEventListener("click", closeBox);
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeBox();
    });

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("is-open")) return;
        if (e.key === "Escape") closeBox();
        if (e.key === "ArrowLeft") move(-1);
        if (e.key === "ArrowRight") move(1);
    });

    let startX = 0;
    lightbox.addEventListener("touchstart", e => {
        startX = e.changedTouches[0].clientX;
    }, {passive:true});

    lightbox.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const delta = endX - startX;
        if (Math.abs(delta) < 45) return;
        move(delta < 0 ? 1 : -1);
    }, {passive:true});
})();
