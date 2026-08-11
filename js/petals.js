(() => {
    const layer = document.getElementById("petals");
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const colors = ["petal-white", "petal-blue", "petal-gold"];
    const MAX_PETALS = 50;

    const spawnPetal = () => {
        if (layer.childElementCount >= MAX_PETALS) return;

        const wrap = document.createElement("span");
        const petal = document.createElement("i");

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 9;
        const fallDuration = 11 + Math.random() * 8;
        const swayDuration = 3 + Math.random() * 3;
        const drift = 30 + Math.random() * 60;
        const left = Math.random() * 100;
        const delay = Math.random() * 3;

        wrap.className = "petal-sway";
        wrap.style.left = `${left}vw`;
        wrap.style.animationDuration = `${swayDuration}s`;
        wrap.style.setProperty("--drift", `${drift}px`);

        petal.className = `petal ${color}`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 0.8}px`;
        petal.style.animationDuration = `${fallDuration}s`;
        petal.style.animationDelay = `${delay}s`;

        petal.addEventListener("animationend", () => wrap.remove());

        wrap.appendChild(petal);
        layer.appendChild(wrap);
    };

    for (let i = 0; i < 6; i++) {
        setTimeout(spawnPetal, i * 200);
    }

    setInterval(spawnPetal, 700);
})();