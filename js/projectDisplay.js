import { projects } from './projectData.js';

//get project ID from URL (?id=swagaria)
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
const project = projects[projectId];

//this is so scuffed but i dont care its late and im tired.
if (project)
{
    document.title = `${project.title} | Swagward`;
    document.getElementById('p-title').innerText = project.title;
    document.getElementById('p-subtitle').innerText = project.subtitle;
    document.getElementById('p-description').innerText = project.description;
    document.getElementById('p-role').innerText = project.role;
    document.getElementById('p-grade').innerText = project.grade;
    document.getElementById('p-link').href = project.website;

    const mediaBox = document.getElementById('media-container');

    if (project.video)
    {
        mediaBox.innerHTML = `
                <div class="about-image-container">
                    <iframe width="100%" height="315" src="${project.video}" frameborder="0" allowfullscreen style="border-radius: 12px; border: 1px solid var(--border-color);"></iframe>
                </div>`;
    }
    else
    {
        //show first image if video is not available
        const imgUrl = project.images[0] || 'assets/placeholder.png';
        mediaBox.innerHTML = `
                <div class="about-image-container">
                    <img src="${imgUrl}" alt="${project.title}" class="about-photo">
                </div>`;
    }
}
else window.location.href = 'projects.html'; //just redirect to project page if id is wrong
