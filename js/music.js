/* =====================================================
   MUSIC.JS
===================================================== */

(() => {
    const audio = document.getElementById("music");
    const button = document.getElementById("musicButton");

    if (!audio || !button) return;

    const setState = playing => {
        button.classList.toggle("is-playing", playing);
        button.setAttribute("aria-pressed", String(playing));
        button.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
    };

    const play = async () => {
        try {
            await audio.play();
            setState(true);
        } catch {
            setState(false);
        }
    };

    const pause = () => {
        audio.pause();
        setState(false);
    };

    window.addEventListener("invitation:open", play);

    button.addEventListener("click", () => {
        if (audio.paused) play();
        else pause();
    });

    audio.addEventListener("play", () => setState(true));
    audio.addEventListener("pause", () => setState(false));
})();
