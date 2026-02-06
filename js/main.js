// Main JavaScript for Portfolio Website

let currentSection = null;
let currentProjectIndex = 0;
let projects = [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeDateTime();
    initializeNavigation();
    initializePowerButton();
    initializeResetButton();
});

// DateTime Update
function initializeDateTime() {
    function updateDateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        const dateString = `${month} ${day}, ${year}`;
        
        document.getElementById('datetime').innerHTML = `
            <span class="time">${timeString}</span>
            <span class="date">${dateString}</span>
        `;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Navigation Buttons
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update status text
            updateStatusText(section);
            
            // Load section content
            loadSection(section);
            
            currentSection = section;
        });
    });
}

// Update Status Text
function updateStatusText(section) {
    const statusText = document.getElementById('statusText');
    const sectionNames = {
        'about': 'About Me',
        'projects': 'Projects',
        'certifications': 'Certifications',
        'contact': 'Contact Me',
        'cv': 'CV'
    };
    
    statusText.textContent = sectionNames[section] || 'Welcome';
}

// Load Section Content
function loadSection(section) {
    const panelTitle = document.getElementById('panelTitle');
    const panelContent = document.getElementById('panelContent');
    const centerImage = document.getElementById('centerImage');
    const projectCarousel = document.getElementById('projectCarousel');
    
    // Hide carousel by default
    projectCarousel.classList.add('hidden');
    centerImage.classList.remove('hidden');
    
    switch(section) {
        case 'about':
            loadAbout(panelTitle, panelContent, centerImage);
            break;
        case 'projects':
            loadProjects(panelTitle, panelContent, centerImage, projectCarousel);
            break;
        case 'certifications':
            loadCertifications(panelTitle, panelContent, centerImage);
            break;
        case 'contact':
            loadContact(panelTitle, panelContent, centerImage);
            break;
        case 'cv':
            loadCV();
            break;
    }
}

// Load About Section
function loadAbout(titleEl, contentEl, centerEl) {
    titleEl.textContent = portfolioData.about.title;
    contentEl.innerHTML = portfolioData.about.content;
    
    // Update center image
    const img = centerEl.querySelector('img');
    const text = centerEl.querySelector('.default-hub-text');
    if (img) img.src = portfolioData.about.images;
    if (text) text.textContent = 'ABOUT';
}

// Load Projects Section
function loadProjects(titleEl, contentEl, centerEl, carouselEl) {
    titleEl.textContent = 'Projects';
    
    // Create catalog in right panel
    let catalogHTML = '<div class="catalog-grid">';
    
    portfolioData.projects.forEach((project, index) => {
        catalogHTML += `
            <div class="catalog-item" onclick="selectProject(${index})">
                <div class="language">${project.language}</div>
                <h3>${project.name}</h3>
                <p class="description">${project.description}</p>
                <a href="${project.github}" target="_blank" class="github-link" onclick="event.stopPropagation()">
                    View on GitHub →
                </a>
            </div>
        `;
    });
    
    catalogHTML += '</div>';
    contentEl.innerHTML = catalogHTML;
    
    // Show carousel in center
    centerEl.classList.add('hidden');
    carouselEl.classList.remove('hidden');
    
    projects = portfolioData.projects;
    currentProjectIndex = 0;
    renderCarousel();
}

let currentImageIndex = 0;

function renderCarousel() {
    const container = document.querySelector('.carousel-container');
    container.innerHTML = '';
    
    if (projects.length === 0) return;
    
    const currentProject = projects[currentProjectIndex];
    const projectImages = currentProject.images || [];
    
    // Reset image index when switching projects
    if (!window.lastProjectIndex || window.lastProjectIndex !== currentProjectIndex) {
        currentImageIndex = 0;
        window.lastProjectIndex = currentProjectIndex;
    }
    
    // If no images, create placeholder
    if (projectImages.length === 0) {
        projectImages.push(createPlaceholderImage(currentProject.name));
    }
    
    // Create carousel item
    const item = document.createElement('div');
    item.className = 'carousel-item active';
    
    const imgSrc = projectImages[currentImageIndex];
    
    item.innerHTML = `
        <img src="${imgSrc}" alt="${currentProject.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect width=%22300%22 height=%22300%22 fill=%22%23333%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23e8d44d%22 font-size=%2220%22>${encodeURIComponent(currentProject.name)}</text></svg>'">
    `;
    
    container.appendChild(item);
    
    // Add language badge
    const languageBadge = document.createElement('div');
    languageBadge.className = 'project-language';
    languageBadge.textContent = currentProject.language;
    container.appendChild(languageBadge);
    
    // Add description box
    const descBox = document.createElement('div');
    descBox.className = 'project-description-box';
    descBox.innerHTML = `
        <p>${currentProject.description}</p>
    `;
    container.appendChild(descBox);
    
    // Add navigation arrows if multiple images
    if (projectImages.length > 1) {
        addImageNavigationArrows(projectImages.length);
        addImageIndicators(projectImages.length);
    }
    
    // Add scroll listener for catalog
    addCatalogScrollListener();
}

// Add navigation arrows for images
function addImageNavigationArrows(totalImages) {
    const container = document.querySelector('.carousel-container');
    
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'carousel-arrow carousel-arrow-left';
    leftArrow.innerHTML = '‹';
    leftArrow.onclick = () => navigateImage(-1, totalImages);
    container.appendChild(leftArrow);
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-arrow carousel-arrow-right';
    rightArrow.innerHTML = '›';
    rightArrow.onclick = () => navigateImage(1, totalImages);
    container.appendChild(rightArrow);
}

// Add image indicators (dots)
function addImageIndicators(totalImages) {
    const container = document.querySelector('.carousel-container');
    
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('span');
        dot.className = 'indicator-dot' + (i === currentImageIndex ? ' active' : '');
        dot.onclick = () => {
            currentImageIndex = i;
            renderCarousel();
        };
        indicators.appendChild(dot);
    }
    
    container.appendChild(indicators);
}

// Navigate between images
function navigateImage(direction, totalImages) {
    currentImageIndex = (currentImageIndex + direction + totalImages) % totalImages;
    renderCarousel();
}

// Select Project
function selectProject(index) {
    currentProjectIndex = index;
    currentImageIndex = 0;  // Reset to first image when changing projects
    renderCarousel();
}

// Create placeholder image
function createPlaceholderImage(text) {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%23333"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23e8d44d" font-size="20">${encodeURIComponent(text)}</text></svg>`;
}

// Select Project
function selectProject(index) {
    currentProjectIndex = index;
    renderCarousel();
}

// Add catalog scroll listener
function addCatalogScrollListener() {
    const catalogGrid = document.querySelector('.catalog-grid');
    if (!catalogGrid) return;
    
    let scrollTimeout;
    catalogGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const items = catalogGrid.querySelectorAll('.catalog-item');
            items.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const catalogRect = catalogGrid.getBoundingClientRect();
                
                if (rect.top >= catalogRect.top && rect.top <= catalogRect.top + 100) {
                    selectProject(index);
                }
            });
        }, 100);
    });
}

// Load Certifications Section
function loadCertifications(titleEl, contentEl, centerEl) {
    titleEl.textContent = 'Certifications';
    
    // 1. Build the catalog for the right panel
    let catalogHTML = '<div class="catalog-grid">';
    portfolioData.certifications.forEach((cert, index) => {
        catalogHTML += `
            <div class="catalog-item" onclick="displayCertInHub(${index})">
                <h3>${cert.name}</h3>
                <p class="description">${cert.description}</p>
            </div>
        `;
    });
    catalogHTML += '</div>';
    contentEl.innerHTML = catalogHTML;
    
    // 2. Display the first certificate by default
    displayCertInHub(0);
}

function displayCertInHub(index) {
    const cert = portfolioData.certifications[index];
    const centerImage = document.getElementById('centerImage');
    
    const imgTag = centerImage.querySelector('img');
    const textTag = centerImage.querySelector('.default-hub-text');
    
    if (imgTag && cert.images && cert.images.length > 0) {
        imgTag.src = cert.images[0]; 
        imgTag.alt = cert.name;
    }
    
    if (textTag) {
        textTag.textContent = 'CERTIFIED';
    }
}

// Load Contact Section
function loadContact(titleEl, contentEl, centerEl) {
    titleEl.textContent = 'Contact Me';
    
    const contactHTML = `
        <div class="catalog-grid">
            <div class="catalog-item" onclick="copyEmail()">
                <h3>Email</h3>
                <p class="description">Click to copy email to clipboard</p>
            </div>
            <div class="catalog-item" onclick="openLink('${portfolioData.contact.github}')">
                <h3>GitHub</h3>
                <p class="description">Visit my GitHub profile</p>
            </div>
            <div class="catalog-item" onclick="openLink('${portfolioData.contact.linkedin}')">
                <h3>LinkedIn</h3>
                <p class="description">Connect with me on LinkedIn</p>
            </div>
        </div>
    `;
    
    contentEl.innerHTML = contactHTML;
    
    // Update center image
    centerEl.innerHTML = '<img src="assets/images/profile/profile.jpg" alt="Contact">';
}

// Copy Email to Clipboard
function copyEmail() {
    navigator.clipboard.writeText(portfolioData.contact.email).then(() => {
        showNotification('Email copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy email:', err);
        showNotification('Failed to copy email');
    });
}

// Open External Link
function openLink(url) {
    window.open(url, '_blank');
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.remove('hide');
    
    // Trigger slide in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Start slide out after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Reset to hidden after animation
        setTimeout(() => {
            notification.classList.add('hidden');
            notification.classList.remove('hide');
        }, 500);
    }, 2000);
}

// Load CV
function loadCV() {
    // Create zoom effect and redirect to PDF
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.transform = 'scale(1.5)';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.open(portfolioData.cv.pdfUrl, '_blank');
        resetWebsite();
        document.body.style.transform = 'scale(1)';
        document.body.style.opacity = '1';
    }, 500);
}

// Reset Website
function resetWebsite() {
    // Remove active class from all buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset status text
    document.getElementById('statusText').textContent = 'Welcome';
    
    // Reset panel
    const panelTitle = document.getElementById('panelTitle');
    const panelContent = document.getElementById('panelContent');
    const centerImage = document.getElementById('centerImage');
    const projectCarousel = document.getElementById('projectCarousel');
    
    panelTitle.textContent = 'Welcome';
    panelContent.innerHTML = '<p>Good Morning, Good Afternoon, Good Evening, and Good Night to you...</p>';
    
    const profileImg = centerImage.querySelector('img');
    if (profileImg) profileImg.src = 'assets/images/profile/profile.jpg';
    const hubText = centerImage.querySelector('.default-hub-text');
    if (hubText) hubText.textContent = 'PROFILE';
    centerImage.classList.remove('hidden');
    projectCarousel.classList.add('hidden');
    
    currentSection = null;
}

// Initialize Reset Button
function initializeResetButton() {
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', resetWebsite);
}

// Initialize Power Button
function initializePowerButton() {
    const powerBtn = document.getElementById('powerBtn');
    powerBtn.addEventListener('click', () => {
        // Create fade out effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            // Close the window or show a message
            if (window.opener) {
                window.close();
            } else {
                document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 48px; color: #e8d44d;">SYSTEM OFFLINE</div>';
            }
        }, 500);
    });
}