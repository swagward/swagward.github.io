import { Delaunay } from "https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm";

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mouse State
let mouse = { x: -1000, y: -1000 };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    const scaleX = newWidth / width;
    const scaleY = newHeight / height;

    particles.forEach(p => {
        p.x *= scaleX;
        p.y *= scaleY;
    });

    width = canvas.width = newWidth;
    height = canvas.height = newHeight;
});

let particles = [];
const PARTICLE_COUNT = 60; // Bumped up slightly for better density
const MAX_DIST = 150;
const MOUSE_RADIUS = 200;

function rand(min, max) { return Math.random() * (max - min) + min; }

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.5, 0.5), // Slightly faster base speed
            vy: rand(-0.5, 0.5),
            phase: rand(0, Math.PI * 2)
        });
    }
}
initParticles();

function updateAndDraw(time) {
    ctx.clearRect(0, 0, width, height);

    // 1. Update Particle Positions & Handle Mouse Interaction
    particles.forEach(p => {
        // Calculate distance to mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interaction: Repel particles if mouse is close
        if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS; // Stronger when closer
            const angle = Math.atan2(dy, dx);
            const repelStrength = 0.8; // Adjust this to make it punchier/weaker

            p.vx += Math.cos(angle) * force * repelStrength;
            p.vy += Math.sin(angle) * force * repelStrength;
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.005;

        // Friction (to stop them from accelerating to infinity due to mouse)
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    // 2. Prepare points for Delaunay
    // We Map the moving particles...
    const pointsArray = particles.map(p => [p.x, p.y]);

    // ...AND explicitly add the 4 corners to the array.
    // This fixes the "padding" issue by forcing the mesh to touch the edges.
    pointsArray.push([0, 0], [width, 0], [width, height], [0, height]);

    const delaunay = Delaunay.from(pointsArray);
    const triangles = delaunay.triangles;

    // 3. Draw Triangles
    ctx.lineJoin = "round"; // Makes the triangle corners smoother

    for (let i = 0; i < triangles.length; i += 3) {
        // We need to handle the fact that we added 4 extra points at the end of the array
        // If an index is >= particles.length, it's one of our static corners.
        // We create a helper to get coordinates safely.
        const getPoint = (index) => {
            if (index < particles.length) return particles[index];
            return { x: pointsArray[index][0], y: pointsArray[index][1], phase: 0 };
        };

        const p0 = getPoint(triangles[i]);
        const p1 = getPoint(triangles[i + 1]);
        const p2 = getPoint(triangles[i + 2]);

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        // Brighter Colors: Range from 100 to 150 (Light Gray/Slate)
        const avgPhase = (p0.phase + p1.phase + p2.phase) / 3; // corners have 0 phase
        const brightness = 100 + 50 * Math.sin(avgPhase);

        // Increased Opacity to 0.25 (was 0.15)
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.25)`;
        ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.1)`;
        ctx.fill();
        ctx.stroke();
    }

    // 4. Draw Connections (Only between actual particles, ignore corners)
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Brighter Dots
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DIST) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - dist / MAX_DIST)})`;
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