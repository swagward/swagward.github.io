import { projects } from './projectData.js';

const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const project = projects[projectId];

if (project)
{
    document.title = `${project.title} | Alex Pannell`;

    const metaDescription = document.querySelector('meta[name="description"]') ?? (() =>
    {
        const tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
        return tag;
    })();
    metaDescription.content = project.description;

    document.getElementById('p-title').innerText = project.title;
    document.getElementById('p-subtitle').innerText = project.subtitle;
    document.getElementById('p-description').innerText = project.description;
    document.getElementById('p-role').innerText = project.role;
    document.getElementById('p-grade').innerText = project.grade;

    const sourceLink = document.getElementById('p-link');
    sourceLink.href = project.website;
    if (project.website.startsWith('http'))
    {
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
    }

    const mediaBox = document.getElementById('media-container');
    const allMedia = [];
    if (project.video) allMedia.push({ type: 'video', src: project.video });
    if (project.images)
    {
        project.images.forEach(img =>
        {
            if (img !== "") allMedia.push({ type: 'image', src: img });
        });
    }

    if (allMedia.length > 0)
    {
        let currentIdx = 0;

        const galleryHTML = `
            <div class="gallery-container">
                <div class="carousel-viewport">
                    ${allMedia.length > 1 ? `<button class="carousel-btn prev-btn" aria-label="Previous media"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>` : ''}
                    
                    ${allMedia.map((item, i) =>
        {
            if (item.type === 'video') {
                return `<div class="carousel-image ${i === 0 ? 'active' : ''}" id="media-${i}" style="width:100%; height:100%;">
                                                    <iframe width="100%" height="100%" src="${item.src}" title="${project.title} demo video" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>
                                                </div>`;
            }
            else
                return `<img src="${item.src}" class="carousel-image ${i === 0 ? 'active' : ''}" id="media-${i}" alt="${project.title} screenshot ${i + 1}">`;
        }).join('')}

                    ${allMedia.length > 1 ? `<button class="carousel-btn next-btn" aria-label="Next media"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>` : ''}
                </div>
                
                <div class="carousel-dots">
                    ${allMedia.length > 1 ? allMedia.map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" id="dot-${i}" aria-label="Go to media ${i + 1}"></button>`).join('') : ''}
                </div>
            </div>
        `;

        mediaBox.innerHTML = galleryHTML;

        const mediaElements = mediaBox.querySelectorAll('.carousel-image');
        const dots = mediaBox.querySelectorAll('.dot');

        if (allMedia.length > 1)
        {
            const updateGallery = (newIdx) =>
            {
                mediaElements[currentIdx].classList.remove('active');
                if(dots[currentIdx]) dots[currentIdx].classList.remove('active');

                currentIdx = (newIdx + allMedia.length) % allMedia.length;

                mediaElements[currentIdx].classList.add('active');
                if(dots[currentIdx]) dots[currentIdx].classList.add('active');
            };

            mediaBox.querySelector('.next-btn').addEventListener('click', () => updateGallery(currentIdx + 1));
            mediaBox.querySelector('.prev-btn').addEventListener('click', () => updateGallery(currentIdx - 1));
            dots.forEach((dot, i) => dot.addEventListener('click', () => updateGallery(i)));
        }
    }
    else
        mediaBox.innerHTML = `<p style="color: #555; text-align: center;">No media available.</p>`;
}
else
    window.location.href = 'projects.html';