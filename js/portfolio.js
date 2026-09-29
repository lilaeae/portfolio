const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const textToType = "Hi, I'm Lila";
let typeIndex = 0;

function typeOutText() {
    if (typeIndex < textToType.length) {
        loaderText.textContent += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeOutText, 100);
    } else {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                const reveals = document.querySelectorAll('.reveal-text');
                reveals.forEach(el => el.classList.add('animate'));
            }, 800);
        }, 600);
    }
}

setTimeout(typeOutText, 300);
const projects = document.querySelectorAll('.project-item');

const projectVisuals = [
    { bg: '#E6EBEE', accent: '#7f52da', ink: '#0B1015', motif: 'orbit' }, // Ocare
    { bg: '#0B1015', accent: '#E8B86D', ink: '#E6EBEE', motif: 'frame' }, // Antwerp unseen
    { bg: '#3A70E8', accent: '#E6EBEE', ink: '#E6EBEE', motif: 'diag' }, // Antwerp unseen intro
    { bg: '#E8B86D', accent: '#0B1015', ink: '#0B1015', motif: 'type' }, // TYPE01
    { bg: '#B83AE8', accent: '#E8B86D', ink: '#F4E9FB', motif: 'blocks' }, // MILES & MEALS
    { bg: '#0B1015', accent: '#B83AE8', ink: '#E6EBEE', motif: 'line' }, // IN MEMORY OF HER
    { bg: '#1E7A52', accent: '#E6EBEE', ink: '#E6EBEE', motif: 'grid' }, // COGO
];

function motifMarkup(m, accent) {
    switch (m) {
        case 'orbit':
            return `<circle cx="150" cy="205" r="92" fill="none" stroke="${accent}" stroke-width="2"/>
                    <circle cx="150" cy="113" r="16" fill="${accent}"/>`;
        case 'frame':
            return `<rect x="52" y="90" width="196" height="210" fill="none" stroke="${accent}" stroke-width="2"/>
                    <rect x="70" y="108" width="196" height="210" fill="none" stroke="${accent}" stroke-width="1" opacity="0.45"/>`;
        case 'diag':
            return `<path d="M0 400 L300 130 L300 400 Z" fill="${accent}" opacity="0.22"/>
                    <line x1="0" y1="320" x2="300" y2="60" stroke="${accent}" stroke-width="2"/>`;
        case 'type':
            return `<text x="150" y="270" font-family="Helvetica, Arial, sans-serif" font-size="190" font-weight="700" fill="${accent}" text-anchor="middle">Aa</text>`;
        case 'blocks':
            return `<rect x="48" y="120" width="90" height="90" fill="${accent}"/>
                    <rect x="150" y="150" width="110" height="110" fill="${accent}" opacity="0.55"/>`;
        case 'line':
            return `<line x1="40" y1="205" x2="260" y2="205" stroke="${accent}" stroke-width="2"/>
                    <circle cx="150" cy="205" r="6" fill="${accent}"/>`;
        case 'grid':
            let dots = '';
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 4; c++) {
                    dots += `<circle cx="${72 + c * 52}" cy="${130 + r * 44}" r="5" fill="${accent}"/>`;
                }
            }
            return dots;
        default:
            return '';
    }
}

function makeCover(cfg, num) {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
            <rect width="300" height="400" fill="${cfg.bg}"/>
            ${motifMarkup(cfg.motif, cfg.accent)}
            <text x="26" y="52" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${cfg.ink}">${num}</text>
         </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

projects.forEach((project, i) => {
    if (!project.dataset.img) {
        const cfg = projectVisuals[i] || projectVisuals[0];
        const num = String(i + 1).padStart(2, '0');
        project.dataset.img = makeCover(cfg, num);
    }
});

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    if (currentTheme === 'dark') {
        document.body.dataset.theme = 'light';
    } else {
        document.body.dataset.theme = 'dark';
    }
});

if (!isTouch && !prefersReducedMotion) {
    document.body.classList.add('custom-cursor');

    const cursorSquare = document.querySelector('.cursor-square');

    document.addEventListener('mousemove', (e) => {
        cursorSquare.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    const interactables = document.querySelectorAll('a, button, .project-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorSquare.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorSquare.classList.remove('hovered'));
    });

    const cards = document.querySelectorAll('.hero-card');
    document.addEventListener('mousemove', (e) => {
        const xCenter = window.innerWidth / 2;
        const yCenter = window.innerHeight / 2;
        const xOffset = (e.clientX - xCenter);
        const yOffset = (e.clientY - yCenter);

        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const rx = card.dataset.rx;

            let tx = 0, ty = 0;
            if (index === 0) { tx = -15; ty = -10; }
            if (index === 1) { tx = 5; ty = 5; }
            if (index === 2) { tx = 15; ty = -15; }

            card.style.transform = `translate(calc(${tx}% + ${xOffset * speed}px), calc(${ty}% + ${yOffset * speed}px)) rotate(${rx}deg)`;
        });
    });

    const floatCard = document.getElementById('floatCard');
    const floatCardImg = document.getElementById('floatCardImg');
    const floatCardVideo = document.getElementById('floatCardVideo');
    const floatCardLabel = document.getElementById('floatCardLabel');

    let isFloating = false;
    let fX = window.innerWidth / 2;
    let fY = window.innerHeight / 2;
    let mouseX = fX;
    let mouseY = fY;
    let videoPreviewTimeout = null;

    const resetFloatCardMedia = () => {
        clearTimeout(videoPreviewTimeout);
        videoPreviewTimeout = null;
        floatCardVideo.pause();
        floatCardVideo.removeAttribute('src');
        floatCardVideo.load();
        floatCardVideo.classList.remove('is-active');
        floatCardImg.style.display = 'block';
    };

    const showProjectPreview = (project) => {
        if (project.dataset.video) {
            floatCardImg.style.display = 'none';
            floatCardVideo.classList.add('is-active');
            if (floatCardVideo.src !== new URL(project.dataset.video, window.location.href).href) {
                floatCardVideo.src = project.dataset.video;
            }
            floatCardVideo.currentTime = 0;
            floatCardVideo.play().catch(() => {
                floatCardVideo.classList.remove('is-active');
                floatCardVideo.pause();
                if (project.dataset.img) {
                    floatCardImg.style.display = 'block';
                    floatCardImg.src = project.dataset.img;
                    floatCardImg.alt = project.dataset.title;
                }
            });
            clearTimeout(videoPreviewTimeout);
            videoPreviewTimeout = setTimeout(() => {
                floatCardVideo.pause();
            }, 3000);
            return;
        }

        resetFloatCardMedia();
        floatCardImg.src = project.dataset.img;
        floatCardImg.alt = project.dataset.title;
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    projects.forEach(project => {
        project.addEventListener('mouseenter', (e) => {
            isFloating = true;
            floatCard.classList.add('visible');
            showProjectPreview(project);
            floatCardLabel.textContent = project.dataset.title;
            fX = e.clientX;
            fY = e.clientY;
            floatCard.style.transform = `translate(calc(${fX}px - 50%), calc(${fY}px - 50%)) rotate(-4deg)`;
        });

        project.addEventListener('mouseleave', () => {
            isFloating = false;
            floatCard.classList.remove('visible');
            resetFloatCardMedia();
        });
    });

    const loopFloat = () => {
        if (isFloating) {
            fX += (mouseX - fX) * 0.1;
            fY += (mouseY - fY) * 0.1;
            floatCard.style.transform = `translate(calc(${fX}px - 50%), calc(${fY}px - 50%)) rotate(-4deg)`;
        }
        requestAnimationFrame(loopFloat);
    };
    requestAnimationFrame(loopFloat);
}
