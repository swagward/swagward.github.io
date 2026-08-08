import { projects } from './projectData.js';

const grid = document.getElementById('project-grid');

const cardsHTML = Object.entries(projects).map(([id, project]) =>
{
    const thumbnail = project.images && project.images[0]
        ? `<div class="card-thumbnail">
                <img src="${project.images[0]}" alt="${project.title} gameplay screenshot" loading="lazy">
            </div>`
        : '';

    const tags = (project.tags ?? []).map(tag => `<span class="tag">${tag}</span>`).join('');

    return `
        <div class="card">
            ${thumbnail}
            <div class="card-content">
                <h2>${project.title}</h2>
                <p>${project.summary ?? project.description}</p>
                <div class="tags">${tags}</div>
                <a href="projectDetails.html?id=${id}" class="btn see-details-btn">See Details</a>
            </div>
        </div>
    `;
}).join('');

grid.innerHTML = cardsHTML;