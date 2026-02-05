import { Delaunay } from "https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm";

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

//light/dark theme
const toggleBtn = document.getElementById("theme-toggle");
const icon = toggleBtn?.querySelector("i");

//get theme from local storage
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateIcon(savedTheme);

toggleBtn?.addEventListener("click", () =>
{
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme)
{
    if (!icon) return;
    icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

function getRGBValue()
{
    return getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
}

//particle logic
window.addEventListener("resize", () =>
{
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    const scaleX = newWidth / width;
    const scaleY = newHeight / height;

    particles.forEach(p =>
    {
        p.x *= scaleX;
        p.y *= scaleY;
    });

    width = canvas.width = newWidth;
    height = canvas.height = newHeight;
});

let particles = [];
const PARTICLE_COUNT = 60;
const MAX_DIST = 150;

function rand(min, max)
{
    return Math.random() * (max - min) + min;
}

function initParticles()
{
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++)
    {
        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.3, 0.3),
            vy: rand(-0.3, 0.3),
            phase: rand(0, Math.PI * 2)
        });
    }
}
initParticles();

function updateAndDraw()
{
    ctx.clearRect(0, 0, width, height);
    const currentColor = getRGBValue(); //dynamic black or white

    particles.forEach(p =>
    {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.005;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    const allPoints = particles.map(p => [p.x, p.y]);
    allPoints.push([0, 0], [width, 0], [width, height], [0, height]);

    const delaunay = Delaunay.from(allPoints);
    const triangles = delaunay.triangles;

    ctx.lineJoin = "round";

    for (let i = 0; i < triangles.length; i += 3)
    {
        const getPoint = (index) =>
        {
            if (index < particles.length) return particles[index];
            return { x: allPoints[index][0], y: allPoints[index][1], phase: 0 };
        };

        const p0 = getPoint(triangles[i]);
        const p1 = getPoint(triangles[i + 1]);
        const p2 = getPoint(triangles[i + 2]);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        const avgPhase = (p0.phase + p1.phase + p2.phase) / 3;
        //invert brightness slightly on light mode (so points arent too dark)
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const baseBright = isDark ? 100 : 200;
        const brightness = baseBright + 50 * Math.sin(avgPhase);

        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.15)`;
        ctx.strokeStyle = `rgba(${currentColor}, 0.05)`;
        ctx.fill();
        ctx.stroke();
    }

    for (let i = 0; i < particles.length; i++)
    {
        const p1 = particles[i];

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${currentColor}, 0.5)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++)
        {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DIST)
            {
                ctx.strokeStyle = `rgba(${currentColor}, ${0.2 * (1 - dist / MAX_DIST)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(updateAndDraw);
}

updateAndDraw();