/*
SPDX-License-Identifier: GPL-2.0-only
Copyright © Interactive Echoes. All rights reserved.
Author: mozahzah 
*/

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', function () 
{
    setupNavlink();
    window.addEventListener('scroll', onWindowScroll);

    const loader = document.getElementById('loader-container');
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', function () 
    {
        if (loader)
        {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
    });

    if (!loader)
    {
        document.body.style.overflow = 'visible';
    }

    updateActiveNavLink();
});


/* Setup */


function setupNavlink()
{
    document.querySelectorAll('a[href^="#"]').forEach(anchor => 
    {
        anchor.addEventListener('click', function (e) 
        {
            e.preventDefault();
      
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
      
            const targetPosition = targetElement.offsetTop;
      
            window.scrollTo(
            {
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}


/* Events */


function onWindowScroll() 
{
    updateActiveNavLink();

    if (isMobile)
    {
        updateCenteredContainer();
    }
}


/* Helpers */


function getDistanceFromCenter(element) 
{
    const elementRect = element.getBoundingClientRect(); 
    const elementCenter = elementRect.top + elementRect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    return Math.abs(viewportCenter - elementCenter);
}

function updateCenteredContainer() 
{
    const projectContainers = document.querySelectorAll(".project-container");
    let activeContainer = null;
    let closestDistance = Infinity;

    projectContainers.forEach(projectContainer => 
    {
        const distance = getDistanceFromCenter(projectContainer);
        if (distance < closestDistance) 
        { 
            closestDistance = distance;
            activeContainer = projectContainer;
        }
    });

    projectContainers.forEach(container => container.classList.remove("project-container-hovered"));
    if (activeContainer) 
    {
        activeContainer.classList.add("project-container-hovered");
    }
}

function updateActiveNavLink() 
{
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const scrollPosition = window.scrollY;
    let activeLink = null;
    let closestDistance = Infinity;

    navLinks.forEach(link => 
    {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) 
        {
            const distance = Math.abs(targetElement.offsetTop - scrollPosition);
            if (distance < closestDistance) 
            {
                closestDistance = distance;
                activeLink = link;
            }
        }
        link.classList.remove('active');
        link.classList.remove('hover');
    });

    if (activeLink) 
    {
        activeLink.classList.add('active');
    }
}


/* Content loading */


function loadProjectsJsonFile() 
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../CMS/projects-cms.json', false);
    xhr.send();

    if (xhr.status === 200)
    {
        const data = JSON.parse(xhr.responseText);
        const portfolioBody = document.getElementById('projects-section');
        
        data.forEach(projectItem => 
        {
            let toolsDiv = '<div class="project-tools">';
            projectItem.tools.forEach(tool => 
            {
                toolsDiv += `<a class="project-tools-item">${tool}</a>`;
            });
            toolsDiv += '</div>';

            portfolioBody.innerHTML += `
            <div class="project-container">
                <div class="project-image-wrapper" onclick="window.open('${projectItem.link}', '_blank')">
                    <a class="arrow">→</a>
                    <img src="../CMS/${projectItem.image}" class="project-image" style="width: ${projectItem.zoom}%"></img>
                </div>
                <div class="project-text-section">
                    <h3 class="project-title">${projectItem.title}</h3>
                    <p class="project-description">${projectItem.description}</p>
                    ${toolsDiv}
                </div>
            </div>
            `;
        });

        const projectContainers = document.getElementsByClassName("project-container");
        if (projectContainers) 
        {
            for (let i = 0; i < projectContainers.length; i++) 
            {
                const projectItem = projectContainers.item(i);
                const imageWrapper = projectItem.querySelector(".project-image-wrapper");
                const textSection = projectItem.querySelector(".project-text-section");
                if (i % 2 !== 0) 
                {
                    projectItem.style.flexDirection = "row-reverse";
                    imageWrapper.classList.add("add-right-border-radius");
                    textSection.classList.add("add-left-border-radius");
                }
                else
                {
                    projectItem.style.flexDirection = "row";
                    imageWrapper.classList.add("add-left-border-radius");
                    textSection.classList.add("add-right-border-radius");
                }
            }
        }
    }
}
loadProjectsJsonFile();