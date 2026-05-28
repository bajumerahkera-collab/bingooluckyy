// !! GANTI LINK UTAMAMU DI SINI !!
const TARGET_REDIRECT_LINK = "https://siulpordi.com/";

const prizes = [
    { label: "75.000", color: "#ef4444" },
    { label: "100.000", color: "#3b82f6" },
    { label: "250.000", color: "#10b981" },
    { label: "500.000", color: "#f59e0b" },
    { label: "750.000", color: "#8b5cf6" },
    { label: "1.000.000", color: "#ec4899" }
];

let isChurning = false;
let currentUser = "";
let finalPrizeLabel = "";

// Amankan fungsi validateInput agar tidak mengganggu pengetikan
function validateInput() {
    return true;
}

// SOLUSI TOTAL: Fungsi Masuk Game yang Dipaksa Berjalan Tanpa Syarat Batasan
function submitUserId() {
    console.log("Tombol Masuk Game Berhasil Diklik!"); // Cek di Inspect Element

    const userIdInput = document.getElementById('user-id');
    const loginOverlay = document.getElementById('login-overlay');
    const mainGameContainer = document.getElementById('main-game-container');
    const welcomeTitle = document.getElementById('welcome-title');
    const errorMsg = document.getElementById('error-message');

    // Validasi Dasar Input
    if (!userIdInput) {
        alert("Gagal: Elemen input 'user-id' tidak ditemukan di HTML!");
        return;
    }

    const idValue = userIdInput.value.trim().toUpperCase();
    if (idValue === "") {
        alert("Silakan masukkan User ID / Akun Anda terlebih dahulu!");
        return;
    }

    // Pengecekan LocalStorage dibungkus Try-Catch agar tidak membekukan tombol jika error
    try {
        const alreadyPlayed = localStorage.getItem("bingo_user_" + idValue);
        if (alreadyPlayed) {
            if (errorMsg) errorMsg.style.display = 'block';
            return;
        }
    } catch (e) {
        console.log("LocalStorage tidak aktif atau error: ", e);
    }

    // Set User Aktif
    currentUser = idValue;
    if (errorMsg) errorMsg.style.display = 'none';

    // LANGKAH EKSEKUSI UTAMA: Hilangkan Popup secara paksa
    if (loginOverlay) {
        loginOverlay.style.opacity = "0";
        loginOverlay.style.visibility = "hidden";
        setTimeout(() => {
            loginOverlay.style.display = "none";
        }, 400);
    } else {
        // Alternatif jika ID overlay berbeda di css
        const overlayAlt = document.querySelector('.overlay-modal');
        if (overlayAlt) overlayAlt.style.display = 'none';
    }

    // LANGKAH EKSEKUSI KEDUA: Nyalakan Kontainer Game Utama
    if (mainGameContainer) {
        mainGameContainer.classList.add("active");
        mainGameContainer.style.opacity = "1";
        mainGameContainer.style.pointerEvents = "auto";
        mainGameContainer.style.transform = "scale(1)";
    }

    // Ubah Judul Sambutan
    if (welcomeTitle) {
        welcomeTitle.innerHTML = `🔮 WELCOME, ${currentUser} 🔮`;
    }
}

// Fungsi Mengocok Mesin Bingo
function startBingo() {
    if (isChurning || currentUser === "") return;

    const spinBtn = document.getElementById('spin-btn');
    const resultContainer = document.getElementById('result-container');
    const winnerBallDisplay = document.getElementById('winner-ball');
    const prizeText = document.getElementById('prize-text');
    const claimBtn = document.getElementById('claim-btn');

    isChurning = true;
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.style.background = "#4b5563";
    }
    if (resultContainer) resultContainer.style.display = 'none';

    const htmlBalls = document.querySelectorAll('.html-ball');
    htmlBalls.forEach(ball => {
        ball.style.setProperty('--x1', `${(Math.random() - 0.5) * 140}px`);
        ball.style.setProperty('--y1', `-${Math.random() * 100}px`);
        ball.style.setProperty('--x2', `${(Math.random() - 0.5) * 140}px`);
        ball.style.setProperty('--y2', `-${Math.random() * 100}px`);
        ball.style.setProperty('--x3', `${(Math.random() - 0.5) * 140}px`);
        ball.style.setProperty('--y3', `-${Math.random() * 100}px`);
        ball.style.setProperty('--x4', `${(Math.random() - 0.5) * 140}px`);
        ball.style.setProperty('--y4', `-${Math.random() * 100}px`);
        ball.style.animation = "shake 0.18s infinite linear";
    });

    setTimeout(() => {
        htmlBalls.forEach(ball => ball.style.animation = 'none');
        const winnerIndex = Math.floor(Math.random() * prizes.length);
        const winner = prizes[winnerIndex];
        finalPrizeLabel = winner.label;

        localStorage.setItem("bingo_user_" + currentUser, "SUDAH_CLAIM_Rp_" + winner.label);

        if (resultContainer && winnerBallDisplay && prizeText) {
            winnerBallDisplay.style.backgroundColor = winner.color;
            winnerBallDisplay.innerText = "?";
            prizeText.innerText = "Membuka Hadiah...";
            resultContainer.style.display = 'block';

            setTimeout(() => {
                winnerBallDisplay.innerText = "🎉";
                prizeText.innerHTML = `Selamat ID <span style="color:#60a5fa;">${currentUser}</span>!<br>Anda mendapatkan:<br><span style="color:${winner.color}; font-size:24px; font-weight:bold;">Rp ${winner.label}</span>`;
                if (spinBtn) spinBtn.style.display = 'none';
                if (claimBtn) claimBtn.style.display = 'block';
                isChurning = false;
            }, 1500);
        }
    }, 2000);
}

function redirectToClaim() {
    if (currentUser === "" || finalPrizeLabel === "") return;
    const linkLengkap = `${TARGET_REDIRECT_LINK}?id=${encodeURIComponent(currentUser)}&hadiah=${encodeURIComponent(finalPrizeLabel)}`;
    window.open(linkLengkap, '_blank');
}

// Inisialisasi Running Text Teks Klaim Palsu
document.addEventListener("DOMContentLoaded", () => {
    const marqueeText = document.getElementById('marquee-text');
    if (!marqueeText) return;
    const fakeNames = ["Rian", "Gacor", "Sultan", "Hoki", "Dewi", "Budi", "Santi", "Chandra", "Putra", "MegaWin"];
    let htmlContent = "";
    for (let i = 0; i < 7; i++) {
        const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)] + Math.floor(Math.random() * 80 + 10);
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)].label;
        htmlContent += `<span class="winner-tag">🎉 ID <span class="w-id">${randomName}</span> Claim <span class="w-prize">Rp ${randomPrize}</span></span>`;
    }
    marqueeText.innerHTML = htmlContent;
});
