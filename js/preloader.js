/* =====================================================
   PRELOADER.JS
===================================================== */

(() => {
    const preloader = document.getElementById("preloader");
    const progress = document.getElementById("loaderProgress");
    const percent = document.getElementById("loaderPercent");

    const assets = [
        "assets/images/bunga-biru.webp",
        "assets/images/groom.jpg",
        "assets/images/bride.jpg",
        "assets/images/gallery1.jpg",
        "assets/images/gallery2.jpg",
        "assets/images/gallery3.jpg",
        "assets/audio/pernikahan-kita.m4a"
    ];

    let completed = 0;

    const update = () => {
        completed++;
        const value = Math.min(100, Math.round((completed / assets.length) * 100));
        progress.style.width = `${value}%`;
        percent.textContent = `${value}%`;
    };

    const loadImage = src => new Promise(resolve => {
        const img = new Image();
        img.onload = () => { update(); resolve(); };
        img.onerror = () => { update(); resolve(); };
        img.src = src;
    });

    const loadAudio = src => new Promise(resolve => {
        const audio = new Audio();
        const done = () => { update(); resolve(); };
        audio.addEventListener("canplaythrough", done, {once:true});
        audio.addEventListener("error", done, {once:true});
        audio.preload = "metadata";
        audio.src = src;
        setTimeout(done, 1800);
    });

    const start = async () => {
        const startTime = performance.now();

        await Promise.all([
            ...assets.slice(0,6).map(loadImage),
            loadAudio(assets[6])
        ]);

        const elapsed = performance.now() - startTime;
        const minimum = 1400;

        setTimeout(() => {
            preloader.classList.add("is-hidden");
            document.body.classList.remove("is-locked");
            window.dispatchEvent(new Event("invitation:ready"));
        }, Math.max(0, minimum - elapsed));
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, {once:true});
    } else {
        start();
    }
})();
