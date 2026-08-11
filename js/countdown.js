/* =====================================================
   COUNTDOWN.JS
===================================================== */

(() => {
    const target = new Date("2026-10-24T09:00:00+07:00").getTime();

    const els = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    const pad = value => String(Math.max(0, value)).padStart(2, "0");

    const tick = () => {
        const distance = target - Date.now();

        if (distance <= 0) {
            Object.values(els).forEach(el => el.textContent = "00");
            return false;
        }

        els.days.textContent = pad(Math.floor(distance / 86400000));
        els.hours.textContent = pad(Math.floor((distance % 86400000) / 3600000));
        els.minutes.textContent = pad(Math.floor((distance % 3600000) / 60000));
        els.seconds.textContent = pad(Math.floor((distance % 60000) / 1000));

        return true;
    };

    tick();

    const timer = setInterval(() => {
        if (!tick()) clearInterval(timer);
    }, 1000);
})();
