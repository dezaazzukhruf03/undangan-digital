/* =====================================================
   SCRIPT.JS
   DEZA & LARA
===================================================== */

(() => {

    /* =====================================================
       ELEMENT
    ===================================================== */

    const cover =
        document.getElementById("cover");

    const openButton =
        document.getElementById("openInvitation");

    const navItems =
        [...document.querySelectorAll(".nav-item")];

    const sections =
        [...document.querySelectorAll("main section[id]")];


    /* =====================================================
       GOOGLE APPS SCRIPT
    ===================================================== */

    const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwrHji0oU0VPiLM7lhkhGMd53HvzZJplOXwqRYE-ox-z_f4rGo1FluF_EgG6mU6Bpc/exec";

    const SHEET_NAME =
        "Lara-Deza";


    /* =====================================================
       GUEST PARAMETER
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const guest =
        params.get("to");

    const guestBox =
        document.getElementById("guestBox");

    const guestName =
        document.getElementById("guestName");


    let decodedGuest = "";

    if (
        guest &&
        guest.trim() !== ""
    ) {

        decodedGuest =
            guest
                .replace(/\+/g, " ")
                .trim();


        if (guestName) {
            guestName.textContent =
                decodedGuest;
        }


        if (guestBox) {
            guestBox.hidden = false;
        }

    }

const autoScrollTo = (targetY, duration) => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto"; // paksa nonaktifkan smooth CSS selama animasi

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();
    let cancelled = false;

    const restoreBehavior = () => {
        html.style.scrollBehavior = previousBehavior;
    };

    const cancel = () => {
        cancelled = true;
        restoreBehavior();
    };
    const cancelEvents = ["wheel", "touchstart", "keydown"];
    cancelEvents.forEach(evt => {
        window.addEventListener(evt, cancel, { once: true, passive: true });
    });

    const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

    const step = (now) => {
        if (cancelled) return;

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutSine(progress);

        const nextY = startY + distance * eased;
        document.documentElement.scrollTop = nextY;
        document.body.scrollTop = nextY;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            cancelEvents.forEach(evt => {
                window.removeEventListener(evt, cancel);
            });
            restoreBehavior();
        }
    };

    requestAnimationFrame(step);
};

    /* =====================================================
       OPEN COVER — SOFT FADE
    ===================================================== */

    let opened = false;

    const openInvitation = () => {
        if (opened) return;
        opened = true;

        if (openButton) {
            openButton.disabled = true;
        }

        if (cover) {
            cover.classList.add("is-opening");
        }

        window.dispatchEvent(
            new Event("invitation:open")
        );

        setTimeout(() => {
            if (cover) {
                cover.classList.add("is-opened");
            }
        }, 850);

setTimeout(() => {
    if (cover) {
        cover.style.display = "none";
    }

    document.body.classList.remove("is-locked");

    const giftSection = document.getElementById("gift");
    if (giftSection) {
        const targetY =
            giftSection.getBoundingClientRect().top + window.scrollY;

        autoScrollTo(targetY, 90000);
    }
}, 1200);
    };

    if (openButton) {
        openButton.addEventListener("click", openInvitation);
    }


    /* =====================================================
       REVEAL OBSERVER
    ===================================================== */

    const revealItems =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .12,

                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        revealItems.forEach(
            item =>
                observer.observe(item)
        );

    } else {

        revealItems.forEach(
            item =>
                item.classList.add(
                    "is-visible"
                )
        );

    }


    /* =====================================================
       ACTIVE SIDE NAVIGATION
    ===================================================== */

    const setActive =
        id => {

            navItems.forEach(
                item => {

                    item.classList.toggle(
                        "active",

                        item.getAttribute(
                            "href"
                        ) === `#${id}`
                    );

                }
            );

        };


    const sectionObserver =
        new IntersectionObserver(

            entries => {

                const visible =
                    entries
                        .filter(
                            entry =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        )[0];


                if (visible) {

                    setActive(
                        visible.target.id
                    );

                }

            },

            {
                rootMargin:
                    "-35% 0px -50% 0px",

                threshold:
                    [0, .2, .5, 1]
            }

        );


    sections.forEach(
        section =>
            sectionObserver.observe(
                section
            )
    );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                e => {

                    e.preventDefault();

                    const target =
                        document.querySelector(
                            item.getAttribute(
                                "href"
                            )
                        );


                    target?.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"
                    });

                }
            );

        }
    );


    /* =====================================================
       COPY ACCOUNT
    ===================================================== */

    document
        .querySelectorAll(
            "[data-copy]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const value =
                            button.dataset.copy;

                        const feedback =
                            button.parentElement
                                .querySelector(
                                    ".copy-feedback"
                                );


                        try {

                            await navigator
                                .clipboard
                                .writeText(
                                    value
                                );

                        } catch {

                            const area =
                                document.createElement(
                                    "textarea"
                                );

                            area.value =
                                value;

                            document.body
                                .appendChild(
                                    area
                                );

                            area.select();

                            document.execCommand(
                                "copy"
                            );

                            area.remove();

                        }


                        if (feedback) {

                            feedback.textContent =
                                "Nomor rekening berhasil disalin.";

                            setTimeout(
                                () => {

                                    feedback.textContent =
                                        "";

                                },
                                2200
                            );

                        }

                    }
                );

            }
        );


/* -------------------------------
   RSVP + UCAPAN
   GOOGLE SHEETS
-------------------------------- */

const form =
    document.getElementById("rsvpForm");

const list =
    document.getElementById("wishList");

const message =
    document.getElementById("formMessage");

const rsvpName =
    document.getElementById("rsvpName");

const rsvpStatus =
    document.getElementById("rsvpStatus");

const rsvpMessage =
    document.getElementById("rsvpMessage");

/* --------------------------------
   ESCAPE HTML
-------------------------------- */

const escapeHtml = value => {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

};


/* --------------------------------
   FORMAT TANGGAL
-------------------------------- */

const formatDate = value => {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

};

/* --------------------------------
   STATISTIK RSVP
-------------------------------- */

const updateRsvpStatistics = data => {

    const statHadir =
        document.getElementById(
            "statHadir"
        );

    const statTidakHadir =
        document.getElementById(
            "statTidakHadir"
        );

    const statRagu =
        document.getElementById(
            "statRagu"
        );

    const statTotal =
        document.getElementById(
            "statTotal"
        );


    /*
     * Pastikan element statistik
     * memang tersedia
     */

    if (
        !statHadir ||
        !statTidakHadir ||
        !statRagu ||
        !statTotal
    ) {

        return;

    }


    /*
     * Reset
     */

    let hadir = 0;

    let tidakHadir = 0;

    let ragu = 0;


    /*
     * Pastikan data berupa array
     */

    if (
        Array.isArray(data)
    ) {

        data.forEach(item => {

            const status =
                String(
                    item.kehadiran || ""
                )
                .trim()
                .toLowerCase();


            /*
             * HADIR
             */

            if (
                status === "hadir" ||
                status ===
                    "insya allah hadir"
            ) {

                hadir++;

            }


            /*
             * TIDAK HADIR
             */

            else if (
                status ===
                    "tidak hadir"
            ) {

                tidakHadir++;

            }


            /*
             * MASIH RAGU
             */

            else if (
                status ===
                    "ragu"
            ) {

                ragu++;

            }

        });

    }


    /*
     * TOTAL
     */

    const total =
        hadir +
        tidakHadir +
        ragu;


    /*
     * Tampilkan
     */

    statHadir.textContent =
        hadir;

    statTidakHadir.textContent =
        tidakHadir;

    statRagu.textContent =
        ragu;

    statTotal.textContent =
        total;

};

/* --------------------------------
   RENDER UCAPAN
-------------------------------- */

let allWishesData = [];
const WISH_PAGE_SIZE = 3;
let wishVisibleCount = WISH_PAGE_SIZE;

const renderWishes = data => {

    if (!list) {
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = `<p class="wish-empty">Belum ada ucapan.</p>`;
        return;
    }

    updateRsvpStatistics(data);

    allWishesData = data.slice().reverse();
    wishVisibleCount = WISH_PAGE_SIZE;
    renderWishPage();
};

const renderWishPage = () => {

    const visible = allWishesData.slice(0, wishVisibleCount);

    const itemsHtml = visible.map(item => `
        <article class="wish-item">
            <div class="wish-head">
                <span class="wish-name">${escapeHtml(item.nama)}</span>
                <span class="wish-status">${escapeHtml(item.kehadiran)}</span>
            </div>
            ${item.ucapan ? `<p class="wish-text">${escapeHtml(item.ucapan)}</p>` : ""}
            ${item.waktu ? `<small class="wish-time">${formatDate(item.waktu)}</small>` : ""}
        </article>
    `).join("");

    const hasMore = allWishesData.length > wishVisibleCount;

    list.innerHTML = itemsHtml + (
        hasMore
            ? `<button type="button" id="wishLoadMore" class="wish-load-more">
                   Muat Ucapan Lainnya (${allWishesData.length - wishVisibleCount})
               </button>`
            : ""
    );

    const loadMoreBtn = document.getElementById("wishLoadMore");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            wishVisibleCount += WISH_PAGE_SIZE;
            renderWishPage();
        });
    }
};


/* --------------------------------
   LOAD UCAPAN DARI GOOGLE SHEETS
-------------------------------- */

const loadWishes = () => {

    if (!list) {
        return;
    }


    /*
     * Google Apps Script akan mengembalikan
     * JSONP sehingga kita tidak bergantung
     * pada fetch/CORS.
     */

    const callbackName =
        "__dezaLaraCallback_" +
        Date.now();


    const script =
        document.createElement("script");


    window[callbackName] =
        data => {

            try {

                if (
                    data &&
                    data.success === false
                ) {

                    console.error(
                        "Apps Script:",
                        data.message
                    );

                    return;
                }


                renderWishes(data);

            }
            finally {

                delete window[
                    callbackName
                ];

                script.remove();

            }

        };


    script.onerror = () => {

        console.error(
            "Gagal mengambil data ucapan dari Google Sheets."
        );


        delete window[
            callbackName
        ];

        script.remove();

    };


    script.src =
        SCRIPT_URL +
        "?sheet=" +
        encodeURIComponent(
            SHEET_NAME
        ) +
        "&callback=" +
        encodeURIComponent(
            callbackName
        ) +
        "&t=" +
        Date.now();


    document.body.appendChild(
        script
    );


    /*
     * Timeout pengaman
     */

    setTimeout(() => {

        if (
            window[
                callbackName
            ]
        ) {

            delete window[
                callbackName
            ];

            script.remove();

            console.warn(
                "Request ucapan timeout."
            );

        }

    }, 10000);

};


/* --------------------------------
   KIRIM DATA KE GOOGLE SHEETS
-------------------------------- */

const submitToGoogleSheets =
    data => {

        return new Promise(
            (resolve, reject) => {

                /*
                 * Hidden iframe digunakan
                 * agar POST Google Apps Script
                 * tidak terkena masalah CORS.
                 */

                const iframeName =
                    "dezaLaraSubmit_" +
                    Date.now();


                const iframe =
                    document.createElement(
                        "iframe"
                    );


                iframe.name =
                    iframeName;

                iframe.style.display =
                    "none";


                document.body.appendChild(
                    iframe
                );


                const submitForm =
                    document.createElement(
                        "form"
                    );


                submitForm.method =
                    "POST";

                submitForm.action =
                    SCRIPT_URL;

                submitForm.target =
                    iframeName;

                submitForm.style.display =
                    "none";


                /*
                 * Masukkan data sebagai
                 * form parameter.
                 */

                Object.entries(data)
                    .forEach(
                        ([key, value]) => {

                            const input =
                                document.createElement(
                                    "input"
                                );


                            input.type =
                                "hidden";

                            input.name =
                                key;

                            input.value =
                                value ?? "";


                            submitForm.appendChild(
                                input
                            );

                        }
                    );


                document.body.appendChild(
                    submitForm
                );


                let finished = false;


                const cleanup = () => {

                    submitForm.remove();

                    setTimeout(
                        () => {
                            iframe.remove();
                        },
                        500
                    );

                };


                const success = () => {

                    if (finished) {
                        return;
                    }


                    finished = true;

                    cleanup();

                    resolve();

                };


                iframe.addEventListener(
                    "load",
                    success,
                    {
                        once: true
                    }
                );


                /*
                 * Kirim POST
                 */

                submitForm.submit();


                /*
                 * Pengaman.
                 *
                 * Apps Script melakukan redirect,
                 * sehingga kita tidak perlu membaca
                 * response JSON-nya.
                 */

                setTimeout(
                    () => {

                        if (!finished) {
                            success();
                        }

                    },
                    3000
                );

            }
        );

    };


/* --------------------------------
   SUBMIT RSVP
-------------------------------- */

if (form) {

    form.addEventListener(
        "submit",
        async e => {

            e.preventDefault();


            const name =
                rsvpName
                    ? rsvpName.value.trim()
                    : "";


            const status =
                rsvpStatus
                    ? rsvpStatus.value
                    : "";


            const msg =
                rsvpMessage
                    ? rsvpMessage.value.trim()
                    : "";


            /*
             * Validasi nama
             */

            if (!name) {

                if (message) {

                    message.textContent =
                        "Silakan isi nama terlebih dahulu.";

                }

                return;

            }


            /*
             * Tombol submit
             */

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Mengirim...";

            }


            try {

                /*
                 * Data yang akan masuk
                 * ke Sheet Deza-Lara
                 */

                const data = {

                    sheet:
                        SHEET_NAME,

                    nama:
                        name,

                    kehadiran:
                        status,

                    ucapan:
                        msg

                };


                console.log(
                    "Mengirim RSVP:",
                    data
                );


                /*
                 * Kirim ke Google Apps Script
                 */

                await submitToGoogleSheets(
                    data
                );


                /*
                 * Reset form
                 */

                form.reset();


                /*
                 * Pesan sukses
                 */

                if (message) {

                    message.textContent =
                        "Terima kasih, RSVP dan ucapan Anda berhasil dikirim.";

                }


                /*
                 * Tunggu sebentar,
                 * kemudian ambil data terbaru
                 */

                setTimeout(
                    () => {

                        loadWishes();

                    },
                    1000
                );


                /*
                 * Hilangkan pesan
                 */

                setTimeout(
                    () => {

                        if (message) {

                            message.textContent =
                                "";

                        }

                    },
                    4000
                );


            } catch (error) {

                console.error(
                    "Gagal mengirim RSVP:",
                    error
                );


                if (message) {

                    message.textContent =
                        "Maaf, ucapan belum berhasil dikirim. Silakan coba lagi.";

                }

            }
            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Kirim";

                }

            }

        }
    );

}


/* --------------------------------
   LOAD UCAPAN SAAT WEBSITE DIBUKA
-------------------------------- */

loadWishes();


})();


/* =====================================================
   COPY REKENING
===================================================== */

function copyRekening(id, button) {
    const element = document.getElementById(id);
    if (!element) return;

    const nomor = element.innerText.replace(/\s+/g, "").trim();

    const showCopied = () => {
        if (!button) return;
        button.classList.add("is-copied");
        showToast("Nomor rekening berhasil disalin");
        clearTimeout(button._copyTimeout);
        button._copyTimeout = setTimeout(() => {
            button.classList.remove("is-copied");
        }, 1800);
    };

    navigator.clipboard.writeText(nomor)
        .then(showCopied)
        .catch(() => {
            const area = document.createElement("textarea");
            area.value = nomor;
            document.body.appendChild(area);
            area.select();
            document.execCommand("copy");
            area.remove();
            showCopied();
        });
}

const toastEl = document.getElementById("toast");
let toastTimeout;

const showToast = message => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove("is-visible");
    }, 2200);
};

// Notifikasi saat ucapan RSVP terkirim / gagal
const formMessageEl = document.getElementById("formMessage");
if (formMessageEl) {
    let lastMessage = "";
    const messageObserver = new MutationObserver(() => {
        const text = formMessageEl.textContent.trim();
        if (text && text !== lastMessage) {
            showToast(text);
        }
        lastMessage = text;
    });
    messageObserver.observe(formMessageEl, {
        childList: true,
        characterData: true,
        subtree: true
    });
}