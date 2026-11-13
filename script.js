
/* ==========================================
   ANUSHKA BIRTHDAY WEBSITE
   JavaScript Functionality
========================================== */

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

const $ = (id) => document.getElementById(id);

function showScreen(screenId) {
    const activeScreen = document.querySelector(".screen.active");
    if (activeScreen && activeScreen.id === "video-screen" && screenId !== "video-screen") {
        $("birthday-video").pause();
    }

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = $(screenId);

    if (target) {
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}


// ==========================================
// 2. BIRTHDAY COUNTDOWN
// Birthday: 14 November 2026, 12 AM IST
// ==========================================

function updateCountdown() {

    const birthday = new Date("2026-11-14T00:00:00+05:30");
    const now = new Date();

    const difference = birthday.getTime() - now.getTime();

    if (difference <= 0) {
        $("days").innerText = "00";
        $("hours").innerText = "00";
        $("minutes").innerText = "00";
        $("seconds").innerText = "00";

        $("countdown-message").innerText =
            "IT'S ANUSHKA'S BIRTHDAY! 🎉❤️";

        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    $("days").innerText = String(days).padStart(2, "0");
    $("hours").innerText = String(hours).padStart(2, "0");
    $("minutes").innerText = String(minutes).padStart(2, "0");
    $("seconds").innerText = String(seconds).padStart(2, "0");

    $("countdown-message").innerText =
        "Get ready for the biggest celebration! 💗";
}

updateCountdown();

setInterval(updateCountdown, 1000);


// ==========================================
// 3. WELCOME BUTTON
// ==========================================

$("start-btn").addEventListener("click", () => {

    showScreen("quiz-screen");

    createConfetti(25);

});


// ==========================================
// 4. COLLEGE BOND QUIZ
// ==========================================

const questions = [

    {
        question: "Where did our special bond begin?",

        options: [
            "In college ❤️",
            "In a movie theatre",
            "On a world tour",
            "In school"
        ],

        correct: 0,

        success: "Correct! College gets credit for introducing us. ❤️",

        failure: "Nope! The movie theatre is innocent this time. Try again! 😄"
    },

    {
        question: "What's your most important superpower?",

        options: [
            "Making everyone laugh",
            "Being dramatic",
            "Making ordinary days memorable",
            "All of the above 😂"
        ],

        correct: 3,

        success: "Correct! One person, an entire collection of superpowers. 😂",

        failure: "You only picked one! Your talents come as a full package. 😄"
    },

    {
        question: "What is our bond made of?",

        options: [
            "Trust and care",
            "Endless conversations",
            "Funny arguments and memories",
            "All of these ❤️"
        ],

        correct: 3,

        success: "That's us: all the good stuff, and a few funny arguments. ❤️",

        failure: "Close, but our bond comes with the whole memory-filled package. 💕"
    },

    {
        question: "What's my birthday wish for you?",

        options: [
            "Lots of happiness",
            "Success in everything",
            "Beautiful memories and endless smiles",
            "All of the above — always! 💕"
        ],

        correct: 3,

        success: "Exactly! You deserve every bit of happiness. Happy birthday! 💕",

        failure: "One wish could never cover it all—you're getting every good thing! 🎂"
    }

];

let currentQuestion = 0;
let quizLocked = false;

function loadQuestion() {

    const question = questions[currentQuestion];

    $("quiz-question").innerText = question.question;

    $("quiz-number").innerText =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    $("quiz-progress-bar").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    $("quiz-feedback").innerText = "";

    $("quiz-options").innerHTML = "";

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "quiz-option";

        button.innerText = option;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        $("quiz-options").appendChild(button);

    });

}

function checkAnswer(selectedIndex) {

    if (quizLocked) return;

    const question = questions[currentQuestion];

    if (selectedIndex === question.correct) {

        quizLocked = true;

        $("quiz-feedback").innerText = question.success;

        document.querySelectorAll(".quiz-option").forEach(button => {
            button.disabled = true;
        });

        createConfetti(20);

        setTimeout(() => {

            currentQuestion++;

            if (currentQuestion < questions.length) {

                quizLocked = false;

                loadQuestion();

            } else {

                $("quiz-progress-bar").style.width = "100%";

                $("quiz-feedback").innerText =
                    "You passed! Welcome to your surprise! 🎉";

                setTimeout(() => {

                    currentQuestion = 0;
                    quizLocked = false;

                    showScreen("gift-screen");

                }, 1300);

            }

        }, 1300);

    } else {

        $("quiz-feedback").innerText = question.failure;

    }

}

loadQuestion();


// ==========================================
// 5. GIFT BOX INTERACTION
// ==========================================

let giftOpened = false;

function openGift() {

    if (giftOpened) return;

    giftOpened = true;

    $("gift-title").innerText =
        "SURPRISE! 🎉";

    $("gift-description").innerText =
        "Your gift is unlimited love, lifetime support and one college friend who will never stop teasing you! 😂❤️";

    $("gift-box").classList.add("opened");
    $("gift-box").setAttribute("aria-label", "Birthday gift opened");
    $("gift-title").classList.add("gift-reveal");
    $("gift-description").classList.add("gift-reveal");

    $("gift-next").classList.remove("hidden");

    createConfetti(100);

}

$("gift-box").addEventListener("click", openGift);

$("gift-box").addEventListener("keydown", (event) => {

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGift();
    }

});

$("gift-next").addEventListener("click", () => {

    showScreen("memories-screen");

});


// ==========================================
// 6. PHOTO GALLERY
// ==========================================

const galleryImages = [...document.querySelectorAll(".photo-card img")];
const lightbox = $("photo-lightbox");
let activePhotoIndex = 0;
let lastFocusedPhoto = null;

function showLightboxPhoto(index) {
    activePhotoIndex = (index + galleryImages.length) % galleryImages.length;
    const photo = galleryImages[activePhotoIndex];
    $("lightbox-image").src = photo.src;
    $("lightbox-image").alt = photo.alt;
    $("lightbox-caption").innerText = photo.closest(".photo-card").querySelector("p").innerText;
}

function openLightbox(index) {
    lastFocusedPhoto = galleryImages[index];
    showLightboxPhoto(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    $("lightbox-close").focus();
}

function closeLightbox() {
    if (!lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (lastFocusedPhoto) lastFocusedPhoto.focus();
}

galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index));
    image.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(index);
        }
    });
});

$("lightbox-close").addEventListener("click", closeLightbox);
$("lightbox-prev").addEventListener("click", () => showLightboxPhoto(activePhotoIndex - 1));
$("lightbox-next").addEventListener("click", () => showLightboxPhoto(activePhotoIndex + 1));
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showLightboxPhoto(activePhotoIndex - 1);
    if (event.key === "ArrowRight") showLightboxPhoto(activePhotoIndex + 1);
});


// ==========================================
// 7. LETTER BUTTON
// ==========================================

$("video-btn").addEventListener("click", () => {
    showScreen("video-screen");
    createConfetti(24);
});

$("letter-btn").addEventListener("click", () => {

    showScreen("letter-screen");

    createConfetti(30);

});

const birthdayVideo = $("birthday-video");
const videoPlayButton = $("video-play-btn");

function updateVideoPlayControl() {
    const playing = !birthdayVideo.paused && !birthdayVideo.ended;
    videoPlayButton.innerText = playing ? "❚❚ Pause video" : "▶ Play video";
    videoPlayButton.setAttribute("aria-label", playing ? "Pause birthday video" : "Play birthday video");
}

videoPlayButton.addEventListener("click", async () => {
    if (birthdayVideo.paused || birthdayVideo.ended) {
        try {
            await birthdayVideo.play();
            $("video-status").innerText = "Enjoy your birthday film. 💗";
        } catch (error) {
            $("video-status").innerText = "The video could not start. Please use the player controls to try again.";
            resumeBackgroundMusicAfterVideo();
            console.error("Birthday video could not play:", error);
        }
    } else {
        birthdayVideo.pause();
    }
});

birthdayVideo.addEventListener("play", updateVideoPlayControl);
birthdayVideo.addEventListener("pause", updateVideoPlayControl);
birthdayVideo.addEventListener("play", pauseBackgroundMusicForVideo);
birthdayVideo.addEventListener("pause", resumeBackgroundMusicAfterVideo);
birthdayVideo.addEventListener("ended", () => {
    updateVideoPlayControl();
    $("video-status").innerText = "Hope that made you smile, Anushka! 💗";
    resumeBackgroundMusicAfterVideo();
});

birthdayVideo.addEventListener("error", () => {
    $("video-error-panel").classList.remove("hidden");
    $("video-status").innerText = "The birthday video file could not be found.";
    videoPlayButton.disabled = true;
    videoPlayButton.setAttribute("aria-label", "Birthday video unavailable");
    resumeBackgroundMusicAfterVideo();
});


// ==========================================
// 8. BIRTHDAY CAKE
// ==========================================

let candlesBlown = false;

function blowCandles() {

    if (candlesBlown) return;

    candlesBlown = true;

    $("birthday-cake").classList.add("blown");
    $("birthday-cake").setAttribute("aria-label", "Birthday candles blown out");

    $("cake-message").innerText =
        "WISH GRANTED! ✨ May all your dreams come true! ❤️";

    createConfetti(100);
    createHeartBurst(24);
    launchFireworks(3);

}

$("birthday-cake").addEventListener("click", blowCandles);

$("birthday-cake").addEventListener("keydown", (event) => {

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        blowCandles();
    }

});

$("blow-candles-btn").addEventListener("click", blowCandles);

$("cake-btn").addEventListener("click", () => {

    showScreen("cake-screen");

    createConfetti(60);

});


// ==========================================
// 9. CONFETTI CELEBRATION
// ==========================================

function createConfetti(amount = 80) {

    const container = $("confetti-container");

    const colors = [
        "#ff69a6",
        "#ffd166",
        "#a78bfa",
        "#67d5c4",
        "#ff8b8b",
        "#ffffff"
    ];

    for (let i = 0; i < amount; i++) {

        const piece = document.createElement("div");

        piece.className = "confetti-piece";

        piece.style.left = Math.random() * 100 + "%";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        piece.style.animationDelay =
            Math.random() * 0.7 + "s";

        piece.style.width =
            (6 + Math.random() * 7) + "px";

        piece.style.height =
            (8 + Math.random() * 10) + "px";

        container.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 6500);

    }

}

function createHeartBurst(amount = 18) {
    const container = $("confetti-container");
    const colors = ["💗", "💕", "✨", "💖", "⭐"];
    for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");
        heart.className = "heart-particle";
        heart.innerText = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = `${8 + Math.random() * 84}%`;
        heart.style.animationDelay = `${Math.random() * 0.8}s`;
        heart.style.animationDuration = `${2.8 + Math.random() * 1.8}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 5200);
    }
}


// ==========================================
// 10. FIREWORKS CANVAS
// ==========================================

const fireworksCanvas = $("fireworks-canvas");
const fireworksContext = fireworksCanvas.getContext("2d");
let fireworksParticles = [];
let fireworksUntil = 0;
let fireworksFrame = 0;

function resizeFireworksCanvas() {
    const scale = window.devicePixelRatio || 1;
    fireworksCanvas.width = Math.floor(window.innerWidth * scale);
    fireworksCanvas.height = Math.floor(window.innerHeight * scale);
    fireworksContext.setTransform(scale, 0, 0, scale, 0, 0);
}

window.addEventListener("resize", resizeFireworksCanvas);
resizeFireworksCanvas();

function launchFireworks(bursts = 4) {
    const colors = ["#ff63a5", "#ffd166", "#a78bfa", "#67d5c4", "#ffffff"];
    for (let burst = 0; burst < bursts; burst++) {
        const originX = window.innerWidth * (0.18 + Math.random() * 0.64);
        const originY = window.innerHeight * (0.15 + Math.random() * 0.45);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const count = 48;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 1.3 + Math.random() * 3.8;
            fireworksParticles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color,
                size: 1.5 + Math.random() * 2.2
            });
        }
    }
    fireworksUntil = performance.now() + 2600;
    if (!fireworksFrame) fireworksFrame = requestAnimationFrame(animateFireworks);
}

function animateFireworks(time) {
    fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fireworksParticles = fireworksParticles.filter(particle => particle.alpha > 0.03);
    fireworksParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.035;
        particle.vx *= 0.986;
        particle.vy *= 0.986;
        particle.alpha -= 0.012;
        fireworksContext.globalAlpha = Math.max(0, particle.alpha);
        fireworksContext.fillStyle = particle.color;
        fireworksContext.shadowBlur = 12;
        fireworksContext.shadowColor = particle.color;
        fireworksContext.beginPath();
        fireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        fireworksContext.fill();
    });
    fireworksContext.globalAlpha = 1;
    fireworksContext.shadowBlur = 0;

    if (time < fireworksUntil || fireworksParticles.length) {
        fireworksFrame = requestAnimationFrame(animateFireworks);
    } else {
        fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        fireworksFrame = 0;
    }
}

// Subtle floating glimmers keep the background alive without requiring interaction.
const ambientParticles = $("ambient-particles");
window.setInterval(() => {
    if (document.hidden || ambientParticles.childElementCount > 16) return;
    const particle = document.createElement("span");
    particle.className = "ambient-particle";
    particle.innerText = Math.random() > 0.55 ? "✦" : "♥";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.fontSize = `${10 + Math.random() * 12}px`;
    particle.style.setProperty("--drift", `${-50 + Math.random() * 100}px`);
    particle.style.animationDuration = `${8 + Math.random() * 7}s`;
    ambientParticles.appendChild(particle);
    setTimeout(() => particle.remove(), 15500);
}, 850);


// ==========================================
// 11. MORE CONFETTI BUTTON
// ==========================================

$("celebrate-btn").addEventListener("click", () => {

    createConfetti(150);
    createHeartBurst(30);
    launchFireworks(6);

    $("cake-message").innerText =
        "ANUSHKA DESERVES ALL THE HAPPINESS IN THE WORLD! 🎉💗";

});


// ==========================================
// 12. BACKGROUND MUSIC
// ==========================================

const music = $("birthday-music");
const musicToggle = $("music-toggle");
const musicStatus = $("music-status");
const musicControl = document.querySelector(".music-control");
let musicEnabledByVisitor = false;
let musicUnavailable = false;
let musicLoadTimeout = 0;
let musicPlayRequest = 0;

function updateMusicStatus(playing, message = "") {
    musicToggle.innerText = musicEnabledByVisitor ? "🔊" : "🔇";
    musicToggle.setAttribute("aria-pressed", String(musicEnabledByVisitor));
    musicToggle.setAttribute("aria-label", musicEnabledByVisitor ? "Turn birthday music off" : "Turn birthday music on");
    musicStatus.innerText = message || (playing ? "Now playing" : musicEnabledByVisitor ? "Music is paused" : "Music is off");
    musicControl.classList.toggle("playing", playing);
}

function isBirthdayVideoPlaying() {
    return !birthdayVideo.paused && !birthdayVideo.ended;
}

function markMusicUnavailable(message) {
    musicUnavailable = true;
    window.clearTimeout(musicLoadTimeout);
    music.pause();
    updateMusicStatus(false, message);
}

function checkMusicPlayback(playRequest) {
    if (playRequest !== musicPlayRequest || musicUnavailable ||
        !musicEnabledByVisitor || isBirthdayVideoPlaying()) return;

    if (music.error || music.networkState === 3) {
        markMusicUnavailable("Music file unavailable");
    } else if (!music.paused && music.readyState > 0) {
        updateMusicStatus(true);
    } else {
        musicStatus.innerText = "Still loading...";
        musicLoadTimeout = window.setTimeout(() => checkMusicPlayback(playRequest), 1000);
    }
}

async function startBackgroundMusic(retryUnavailable = false) {
    if (!musicEnabledByVisitor) return;
    if (isBirthdayVideoPlaying()) {
        updateMusicStatus(false, "Music will resume after the video");
        return;
    }
    if (musicUnavailable && !retryUnavailable) {
        updateMusicStatus(false, "Music file unavailable");
        return;
    }
    if (retryUnavailable) musicUnavailable = false;
    if (!music.paused) {
        updateMusicStatus(true);
        return;
    }

    const playRequest = ++musicPlayRequest;
    window.clearTimeout(musicLoadTimeout);
    updateMusicStatus(false, "Loading music...");
    musicLoadTimeout = window.setTimeout(() => checkMusicPlayback(playRequest), 1500);

    try {
        await music.play();
        if (playRequest !== musicPlayRequest || !musicEnabledByVisitor ||
            isBirthdayVideoPlaying() || musicUnavailable) return;
        if (music.error || music.networkState === 3) {
            markMusicUnavailable("Music file unavailable");
        } else if (!music.paused && music.readyState > 0) {
            updateMusicStatus(true);
        }
    } catch (error) {
        if (playRequest !== musicPlayRequest || musicUnavailable) return;
        markMusicUnavailable("Music unavailable");
        console.error("Birthday music could not play:", error);
    }
}

function pauseBackgroundMusicForVideo() {
    musicPlayRequest++;
    window.clearTimeout(musicLoadTimeout);
    if (!music.paused) music.pause();
    updateMusicStatus(false, musicEnabledByVisitor ? "Music paused for video" : "Music is off");
}

function resumeBackgroundMusicAfterVideo() {
    if (isBirthdayVideoPlaying()) return;
    if (!musicEnabledByVisitor) {
        if (!musicUnavailable) updateMusicStatus(false, "Music is off");
        return;
    }
    void startBackgroundMusic();
}

music.volume = Number($("music-volume").value);

musicToggle.addEventListener("click", () => {
    if (musicEnabledByVisitor) {
        musicEnabledByVisitor = false;
        musicPlayRequest++;
        window.clearTimeout(musicLoadTimeout);
        music.pause();
        updateMusicStatus(false, "Music is off");
        return;
    }

    musicEnabledByVisitor = true;
    void startBackgroundMusic(true);
});

$("music-volume").addEventListener("input", event => {
    music.volume = Number(event.target.value);
});

music.addEventListener("playing", () => {
    window.clearTimeout(musicLoadTimeout);
    if (musicUnavailable) return;
    if (!musicEnabledByVisitor || isBirthdayVideoPlaying()) {
        if (!isBirthdayVideoPlaying()) updateMusicStatus(false, "Music is off");
        pauseBackgroundMusicForVideo();
        return;
    }
    updateMusicStatus(true);
});
music.addEventListener("pause", () => {
    if (musicUnavailable) {
        updateMusicStatus(false, "Music file unavailable");
    } else if (isBirthdayVideoPlaying() && musicEnabledByVisitor) {
        updateMusicStatus(false, "Music paused for video");
    } else if (!musicEnabledByVisitor) {
        updateMusicStatus(false, "Music is off");
    } else {
        updateMusicStatus(false);
    }
});
music.addEventListener("error", () => markMusicUnavailable("Music file unavailable"));


// ==========================================
// 13. REPLAY WEBSITE
// ==========================================

$("replay-btn").addEventListener("click", () => {

    currentQuestion = 0;
    quizLocked = false;
    giftOpened = false;
    candlesBlown = false;

    $("gift-title").innerText =
        "Something is hiding inside...";

    $("gift-description").innerText =
        "Tap the gift box to reveal your surprise!";

    $("gift-next").classList.add("hidden");

    $("gift-box").classList.remove("opened");
    $("gift-box").setAttribute("aria-label", "Open birthday gift");
    $("gift-title").classList.remove("gift-reveal");
    $("gift-description").classList.remove("gift-reveal");

    $("birthday-cake").classList.remove("blown");
    $("birthday-cake").setAttribute("aria-label", "Blow out birthday candles");

    $("cake-message").innerText =
        "Make a wish and tap the cake! 🕯️";

    $("quiz-progress-bar").style.width = "0%";

    closeLightbox();
    fireworksParticles = [];
    fireworksUntil = 0;
    if (fireworksFrame) {
        cancelAnimationFrame(fireworksFrame);
        fireworksFrame = 0;
    }
    fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    loadQuestion();

    showScreen("welcome-screen");

});


// ==========================================
// 13. INITIALIZE WEBSITE
// ==========================================

console.log("🎂 Anushka Birthday Website Loaded!");
console.log("💗 Made with love and lots of fun!");

