// ==================== INTRO SCREEN ====================
function enterSite() {
    const introScreen = document.getElementById('introScreen');
    introScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Stop intro music when entering the site
    const introMusic = document.getElementById('introMusic');
    if (introMusic) {
        introMusic.pause();
        introMusic.currentTime = 0;
    }
}

// Start intro music when user interacts with the page
function startIntroMusic() {
    const introMusic = document.getElementById('introMusic');
    const introScreen = document.getElementById('introScreen');
    if (introMusic && introScreen && !introScreen.classList.contains('hidden')) {
        introMusic.volume = 0.5;
        introMusic.play().catch(e => console.log('Audio autoplay blocked'));
    }
    // Remove listeners after first interaction
    document.removeEventListener('click', startIntroMusic);
    document.removeEventListener('touchstart', startIntroMusic);
    document.removeEventListener('keydown', startIntroMusic);
}

// Prevent scrolling while intro is showing
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.getElementById('introScreen');
    if (introScreen && !introScreen.classList.contains('hidden')) {
        document.body.style.overflow = 'hidden';
        // Try autoplay, if blocked wait for user interaction
        const introMusic = document.getElementById('introMusic');
        if (introMusic) {
            introMusic.volume = 0.5;
            introMusic.play().catch(e => {
                // Autoplay blocked, wait for user interaction
                document.addEventListener('click', startIntroMusic);
                document.addEventListener('touchstart', startIntroMusic);
                document.addEventListener('keydown', startIntroMusic);
            });
        }
    }
});

// ==================== SLIDESHOW ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

// Initialize slideshow
function initSlideshow() {
    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }
}

// Show specific slide
function showSlide(index) {
    // Handle wrap-around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide and activate dot
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

// Change slide by delta
function changeSlide(delta) {
    showSlide(currentSlide + delta);
    resetAutoSlide();
}

// Go to specific slide
function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

// Auto-advance slides every 4 seconds
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);
}

// Reset auto-slide timer when user interacts
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSlideshow);

// ==================== NAVIGATION ====================
// Smooth scrolling for navigation links
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update scroll indicator based on scroll position
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator::after');
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    // Update scroll indicator position
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        const indicatorHeight = indicator.offsetHeight;
        const thumbHeight = 20;
        const maxPosition = indicatorHeight - thumbHeight;
        const position = (scrollPercentage / 100) * maxPosition;
        
        indicator.style.setProperty('--scroll-position', `${position}px`);
    }
});

// Play button functionality for video section
const playButtons = document.querySelectorAll('.play-button, .play-btn');
playButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Toggle play/pause icon
        if (this.textContent === '▶') {
            this.textContent = '❚❚';
        } else {
            this.textContent = '▶';
        }
    });
});

// Letter card hover effects
const letterCards = document.querySelectorAll('.letter-card');
letterCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Initialize - show first section immediately
window.addEventListener('load', () => {
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.style.opacity = '1';
        firstSection.style.transform = 'translateY(0)';
    }
});

// ==================== DAILY AFFIRMATIONS ====================
const affirmations = [
    "Tired is never a thing when it comes to you.",
    "The possibility of you outweighs the actuality of anyone else.",
    "From the strands of your hair down to the fingertips of your toes, you are beautiful, Kate.",
    "I want all of you, your flaws, imperfections. Everything.",
    "This work of mine came out beautiful because the woman behind it is perfect."
];

let lastAffirmationIndex = -1;

function showNewAffirmation() {
    const textElement = document.getElementById('affirmationText');
    if (!textElement) return;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * affirmations.length);
    } while (newIndex === lastAffirmationIndex && affirmations.length > 1);
    
    lastAffirmationIndex = newIndex;
    
    // Fade out
    textElement.style.opacity = '0';
    textElement.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        textElement.textContent = affirmations[newIndex];
        // Fade in
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
    }, 300);
}

// Initialize affirmation on page load
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('affirmationText');
    if (textElement) {
        textElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        showNewAffirmation();
    }
});
