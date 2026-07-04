// Sample tour data
const tours = [
    {
        id: 1,
        name: 'Paris City Tour',
        emoji: '🗼',
        description: 'Explore the City of Light with visits to Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
        price: 89.99,
        rating: 4.8,
        duration: '8 hours',
        groupSize: '1-20 people',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe', 'Champs-Élysées']
    },
    {
        id: 2,
        name: 'Tokyo Adventure',
        emoji: '🗾',
        description: 'Immerse yourself in Tokyo with visits to temples, markets, and modern districts.',
        price: 79.99,
        rating: 4.7,
        duration: '10 hours',
        groupSize: '1-15 people',
        highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Meiji Shrine', 'Akihabara']
    },
    {
        id: 3,
        name: 'New York Explorer',
        emoji: '🗽',
        description: 'Experience the energy of NYC with iconic landmarks and world-class museums.',
        price: 99.99,
        rating: 4.9,
        duration: '12 hours',
        groupSize: '1-25 people',
        highlights: ['Statue of Liberty', 'Times Square', 'Central Park', 'Empire State Building']
    },
    {
        id: 4,
        name: 'London Heritage Tour',
        emoji: '🇬🇧',
        description: 'Discover London\'s rich history with royal palaces, museums, and historic landmarks.',
        price: 84.99,
        rating: 4.6,
        duration: '9 hours',
        groupSize: '1-18 people',
        highlights: ['Big Ben', 'Buckingham Palace', 'Tower of London', 'British Museum']
    },
    {
        id: 5,
        name: 'Barcelona Beach & Culture',
        emoji: '🏖️',
        description: 'Combine beach relaxation with cultural exploration of Gaudí and Gothic quarters.',
        price: 74.99,
        rating: 4.7,
        duration: '8 hours',
        groupSize: '1-20 people',
        highlights: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter', 'Montjuïc']
    },
    {
        id: 6,
        name: 'Rome Ancient Wonders',
        emoji: '🏛️',
        description: 'Walk through history visiting the Colosseum, Roman Forum, and Vatican City.',
        price: 94.99,
        rating: 4.8,
        duration: '10 hours',
        groupSize: '1-22 people',
        highlights: ['Colosseum', 'Roman Forum', 'Vatican', 'Pantheon']
    }
];

// DOM Elements
const toursGrid = document.getElementById('toursGrid');
const modal = document.getElementById('tourModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTours();
    setupEventListeners();
});

// Load tours
function loadTours() {
    toursGrid.innerHTML = tours.map(tour => `
        <div class="tour-card" onclick="openTourDetails(${tour.id})">
            <div class="tour-image">${tour.emoji}</div>
            <div class="tour-content">
                <h3>${tour.name}</h3>
                <p>${tour.description.substring(0, 80)}...</p>
                <div class="tour-rating">★★★★★ ${tour.rating}</div>
                <div class="tour-price">$${tour.price}</div>
                <button class="btn btn-primary">View Details</button>
            </div>
        </div>
    `).join('');
}

// Open tour details modal
function openTourDetails(tourId) {
    const tour = tours.find(t => t.id === tourId);
    if (tour) {
        modalBody.innerHTML = `
            <h2>${tour.name}</h2>
            <div style="font-size: 3rem; text-align: center; margin: 1rem 0;">${tour.emoji}</div>
            <p><strong>Description:</strong> ${tour.description}</p>
            <p><strong>Duration:</strong> ${tour.duration}</p>
            <p><strong>Group Size:</strong> ${tour.groupSize}</p>
            <p><strong>Price:</strong> $${tour.price} per person</p>
            <p><strong>Rating:</strong> ★★★★★ ${tour.rating}</p>
            <h4>Highlights:</h4>
            <ul>
                ${tour.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Book Now</button>
        `;
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
