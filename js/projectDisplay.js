import { projects } from './projectData.js';

const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const project = projects[projectId];

if (project) {
    document.title = `${project.title} | Swagward`;
    document.getElementById('p-title').innerText = project.title;
    document.getElementById('p-subtitle').innerText = project.subtitle;
    document.getElementById('p-description').innerText = project.description;
    document.getElementById('p-role').innerText = project.role;
    document.getElementById('p-grade').innerText = project.grade;
    document.getElementById('p-link').href = project.website;

    const mediaBox = document.getElementById('media-container');

    if (project.video) {
        mediaBox.innerHTML = `
            <div class="about-image-container">
                <iframe width="100%" height="315" src="${project.video}" frameborder="0" allowfullscreen style="border-radius: 12px; border: 1px solid var(--border-color);"></iframe>
            </div>`;
    } else if (project.images && project.images.length > 0 && project.images[0] !== "") {
        // Build Carousel
        let currentIdx = 0;

        const galleryHTML = `
            <div class="gallery-container">
                <div class="carousel-viewport">
                    <button class="carousel-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                    ${project.images.map((img, i) => `
                        <img src="${img}" class="carousel-image ${i === 0 ? 'active' : ''}" id="img-${i}">
                    `).join('')}
                    <button class="carousel-btn next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="carousel-dots">
                    ${project.images.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" id="dot-${i}"></div>`).join('')}
                </div>
            </div>
        `;

        mediaBox.innerHTML = galleryHTML;

        // Carousel Logic
        const images = mediaBox.querySelectorAll('.carousel-image');
        const dots = mediaBox.querySelectorAll('.dot');

        const updateGallery = (newIdx) => {
            images[currentIdx].classList.remove('active');
            dots[currentIdx].classList.remove('active');

            currentIdx = (newIdx + project.images.length) % project.images.length;

            images[currentIdx].classList.add('active');
            dots[currentIdx].classList.add('active');
        };

        mediaBox.querySelector('.next-btn').addEventListener('click', () => updateGallery(currentIdx + 1));
        mediaBox.querySelector('.prev-btn').addEventListener('click', () => updateGallery(currentIdx - 1));

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateGallery(i));
        });

    } else {
        mediaBox.innerHTML = `<p style="color: #555; text-align: center;">No images available for this project.</p>`;
    }
} else {
    window.location.href = 'projects.html';
}