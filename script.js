// ===============================
// PRELOADER
// ===============================

window.addEventListener("load",function(){

    const preloader=document.getElementById("preloader");

    setTimeout(()=>{

        preloader.style.opacity="0";

        setTimeout(()=>{

            preloader.style.display="none";

        },800);

    },1200);

});

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwrHji0oU0VPiLM7lhkhGMd53HvzZJplOXwqRYE-ox-z_f4rGo1FluF_EgG6mU6Bpc/exec";

// ===============================
// BUKA UNDANGAN
// ===============================

window.onload = function () {
  const openBtn = document.getElementById("openInvitation");
  const coverScreen = document.getElementById("cover-screen");

  const music=document.getElementById("music");
const musicBtn=document.getElementById("musicBtn");

music.volume=0.5;

  openBtn.onclick = function () {

    coverScreen.classList.add("fade-out");

    music.play();

    musicBtn.style.display="flex";

    musicBtn.classList.add("playing");

    setTimeout(() => {

        coverScreen.style.display="none";

        startAutoScroll();

    },800);

};
};

// ===============================
// COUNTDOWN
// ===============================

const weddingDate = new Date("Oct 24, 2026 10:00:00").getTime();

const countdown = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;

  if (distance < 0) {
    clearInterval(countdown);
  }
}, 1000);

// ===============================
// COPY REKENING
// ===============================

function copyRek(id) {
  const nomor = document.getElementById(id).innerText;

  navigator.clipboard.writeText(nomor);

  alert("Nomor rekening berhasil disalin");
}

// ===============================
// NAMA TAMU
// ===============================

const params = new URLSearchParams(window.location.search);

const guest = params.get("to");

const guestBox = document.querySelector(".guest-box");

const guestName = document.getElementById("guestName");

if (guest) {
  guestName.innerHTML = guest.replace(/~/g, "<br>");
} else {
  guestBox.classList.add("hidden");
}

// ===============================
// FADE UP
// ===============================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

document.querySelectorAll(".fade-up").forEach((el) => {
  observer.observe(el);
});

// ===============================
// AUTO SCROLL
// ===============================

let autoScrollId = null;

function startAutoScroll() {
  const target = document.getElementById("gift").offsetTop;

  function scroll() {
    if (window.scrollY >= target) {
      cancelAnimationFrame(autoScrollId);

      return;
    }

    window.scrollBy(0, 1);

    autoScrollId = requestAnimationFrame(scroll);
  }

  scroll();
}

// ===============================
// STOP AUTO SCROLL
// ===============================

function stopAutoScroll() {
  if (autoScrollId) {
    cancelAnimationFrame(autoScrollId);
  }
}

window.addEventListener("wheel", stopAutoScroll);

window.addEventListener("touchstart", stopAutoScroll);

window.addEventListener("mousedown", stopAutoScroll);

// ===============================
// UCAPAN TAMU
// ===============================

const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

const loading = document.getElementById("loading");

const submitWish = document.getElementById("submitWish");

function getStatus(status) {
  switch (status) {
    case "Hadir":
      return {
        text: "🟢 Hadir",
        class: "hadir",
      };

    case "Tidak Hadir":
      return {
        text: "🔴 Tidak Hadir",
        class: "tidak-hadir",
      };

    default:
      return {
        text: "🟡 Masih Ragu",
        class: "ragu",
      };
  }
}

function formatTanggal(waktu) {
  return new Date(waktu).toLocaleString("id-ID", {
    day: "2-digit",

    month: "long",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  });
}

function createWishCard(item) {
  const status = getStatus(item.kehadiran);

  return `

    <div class="wish-card">

        <div class="wish-header">

            <div class="wish-name">

                <i class="fa-solid fa-user"></i>

                ${item.nama}

            </div>

            <div class="wish-status ${status.class}">

                ${status.text}

            </div>

        </div>

        <div class="wish-message">

            ${item.ucapan}

        </div>

        <div class="wish-date">

            <i class="fa-regular fa-clock"></i>

            ${formatTanggal(item.waktu)}

        </div>

    </div>

    `;
}

    function updateStatistik(data) {
      let hadir = 0;
      let ragu = 0;
      let tidak = 0;

      data.forEach((item) => {
        if (item.kehadiran === "Hadir") {
          hadir++;
        } else if (item.kehadiran === "Masih Ragu") {
          ragu++;
        } else {
          tidak++;
        }
      });

      document.getElementById("totalUcapan").innerText = data.length;
      document.getElementById("totalHadir").innerText = hadir;
      document.getElementById("totalRagu").innerText = ragu;
      document.getElementById("totalTidakHadir").innerText = tidak;
    }

// ===============================
// AMBIL UCAPAN
// ===============================

async function loadWishes() {

    try{

        wishList.innerHTML=`
            <div class="wish-card">
                Sedang memuat ucapan...
            </div>
        `;

        const response = await fetch(SCRIPT_URL);

        const data = await response.json();

        console.log(data);

        wishList.innerHTML="";

        updateStatistik(data);

        data.reverse();

const totalUcapan = data.length;

const terbaru = data.slice(0, 3);

terbaru.forEach(item => {

    wishList.innerHTML += createWishCard(item);

});

if (totalUcapan > 3) {

    wishList.innerHTML += `
        <button id="showAllWish" class="show-more-btn">
            Lihat Semua Ucapan (${totalUcapan})
        </button>
    `;

    document
        .getElementById("showAllWish")
        .addEventListener("click", function () {

            wishList.innerHTML = "";

            data.forEach(item => {

                wishList.innerHTML += createWishCard(item);

            });

        });

}

    }catch(error){

        console.log(error);

        wishList.innerHTML=`
            <div class="wish-card">
                Gagal memuat ucapan.
            </div>
        `;

    }

}

loadWishes();

// ===============================
// KIRIM UCAPAN
// ===============================

wishForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  submitWish.disabled = true;
  submitWish.innerText = "Mengirim...";

  loading.style.display = "block";

  const data = {
    nama: document.getElementById("nama").value,

    kehadiran: document.getElementById("kehadiran").value,

    ucapan: document.getElementById("ucapan").value,
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",

      body: JSON.stringify(data),
    });

    wishForm.reset();

    loadWishes();

    alert("Ucapan berhasil dikirim ❤️");
  } catch (error) {
    alert("Gagal mengirim ucapan");

    console.log(error);
  }

  submitWish.disabled = false;

  submitWish.innerText = "Kirim Ucapan";

  loading.style.display = "none";
});

const sections=document.querySelectorAll("section[id]");
const navLinks=document.querySelectorAll(".bottom-nav a");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(section=>{

        const top=section.offsetTop-120;

        if(window.scrollY>=top){

            current=section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+current){

            link.classList.add("active");

        }

    });

});

musicBtn.addEventListener("click",function(){

    if(music.paused){

        music.play();

        musicBtn.classList.add("playing");

    }else{

        music.pause();

        musicBtn.classList.remove("playing");

    }

});