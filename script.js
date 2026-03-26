let model;
let baseY = 0;
let targetRotationY = 0; // <-- Add this new line
const container = document.getElementById("model-container");

const scene = new THREE.Scene();


// LIGHTS
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
backLight.position.set(-5, 3, -5);
scene.add(backLight);


// CAMERA
const camera = new THREE.PerspectiveCamera(
    60,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
);

// Perfecting the framing and the top-down angle
if (window.innerWidth <= 768) {
    camera.position.z = 7.8; // The exact sweet spot for mobile size vs. no clipping
    camera.position.y = 2.5; // Raises the camera up to reveal the keyboard
} else {
    camera.position.z = 10.5; // The exact sweet spot for desktop size vs. no clipping
    camera.position.y = 3.5; // Raises the camera up to reveal the keyboard
}


// RENDERER
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(
    container.offsetWidth,
    container.offsetHeight
);

container.appendChild(renderer.domElement);


// CONTROLS
const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enableZoom = false;

// NEW: Tell the camera to look slightly lower to match the new laptop height!
// This centers the rotation and stops the top corner from clipping.
controls.target.set(0, -1.0, 0);

// LOADER
const loader = new THREE.GLTFLoader();

// LOADER
//const loader = new THREE.GLTFLoader();

loader.load(
    "assets/models/laptop.glb",
    function (gltf) {

        model = gltf.scene;

        model.scale.set(1.7, 1.7, 1.7);

        // center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        baseY = -1.2;
        model.position.y = baseY;

        // (The old rotation math used to be here, now it's beautifully clean!)

        scene.add(model);
    }
);

// ANIMATION
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // 1. The smooth up-and-down floating (bobbing)
        model.position.y = baseY + Math.sin(Date.now() * 0.0012) * 0.35;
        
        // 2. The continuous pro-spin! (Change 0.005 to make it faster or slower)
        model.rotation.y += 0.008; 
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// --- SCROLL ANIMATION LOGIC ---

// 1. Create the lookout (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the element is visible on the screen...
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-drop');
        }
    });
});

// 2. Tell the lookout to watch ALL section titles, not just the first one
const titlesToAnimate = document.querySelectorAll('.section-title');

titlesToAnimate.forEach((title) => {
    observer.observe(title);
});


// --- PROJECT MODAL LOGIC ---
const modalOverlay = document.getElementById('project-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const projectCards = document.querySelectorAll('.project-card');

// 1. Our Project "Database"
// 1. Our Project "Database" (Updated with LifeLine++ and Portfolio)
const projectData = {
    'card-lifeline': {
        title: "LifeLine++ | AI Emergency Response",
        subtitle: "AI-Integrated system for real-time crisis coordination and resource management.",
        desc: "LifeLine++ is a sophisticated emergency management platform designed to bridge the gap between victims and first responders. It utilizes predictive analytics to optimize resource allocation and provides a real-time communication layer for crisis teams.",
        tech: ["Python", "Machine Learning", "Predictive Analytics", "Real-time APIs"],
        features: [
            "Predictive modeling for crisis resource optimization.",
            "Real-time coordination dashboard for emergency teams.",
            "Scalable architecture for high-concurrency data processing.",
            "Automated incident categorization using NLP."
        ],
        workflow: [
            "Ingested real-time crisis data via multiple API endpoints.",
            "Applied predictive models to forecast resource needs.",
            "Streamlined coordination logic for faster response times.",
            "Ongoing development focused on system resilience."
        ],
        links: `<a href="#" class="btn-github">Ongoing</a>`
    },
    'card-portfolio': {
        title: "Dev Portfolio",
        subtitle: "A high-performance personal brand site built with modern 3D rendering.",
        desc: "This portfolio was engineered to move beyond standard templates. It features a custom WebGL environment and a bespoke design system that prioritizes technical depth and visual micro-interactions.",
        tech: ["Three.js (WebGL)", "JavaScript (ES6+)", "HTML5 / CSS3", "Git"],
        features: [
            "Integrated interactive 3D laptop model with Three.js.",
            "Custom glassmorphism design system.",
            "Fully responsive layout with mobile-specific 3D optimizations.",
            "High-contrast typography for professional accessibility."
        ],
        workflow: [
            "Developed custom GLB loading and animation logic.",
            "Optimized CSS animations for 60FPS performance.",
            "Implemented dynamic modal content swapping via JS.",
            "Refined camera positioning for multi-device compatibility."
        ],
        links: `<a href="https://github.com/vandita-yadav/vandita-yadav.github.io" class="btn-github" target="_blank">GitHub ↗</a>`
    },
    'card-netflix': {
        title: "Netflix & TV Shows Content Analyser",
        subtitle: "An interactive Streamlit-powered recommender system for 32,000+ movies and TV shows.",
        desc: "This project is a content-based recommender that achieves 85% relevance using genre and language insights. It utilizes cosine similarity on combined features (genre, cast, director, description) to generate smart recommendations. Performance is highly optimized by accelerating memory handling with Joblib, reducing the 7.6 GB matrix load times by 40%.",
        tech: ["Python", "Pandas", "Scikit-learn", "Streamlit", "Joblib"],
        features: [
            "Content-based recommendations showing 5 similar titles.",
            "Filtering for Top 20 titles globally by language or genre.",
            "Interactive Streamlit dashboard with modular functions.",
            "Advanced data preprocessing and text normalization."
        ],
        workflow: [
            "Vectorized text using CountVectorizer.",
            "Calculated cosine similarity for content matching.",
            "Saved the massive 7.6 GB similarity matrix locally via Joblib.",
            "Handled missing source data without breaking the UI."
        ],
        links: `<a href="https://github.com/vandita-yadav/Netflix-TV-Shows-Content-Explorer" class="btn-github" target="_blank">GitHub ↗</a>`
    },
    'card-metro': {
        title: "Metro Lens | Operations Intelligence",
        subtitle: "A scalable Power BI analytics dashboard for metro ridership data.",
        desc: "Modeled 65,700+ metro records into a robust star-schema to enable scalable analytics. This intelligence dashboard quantifies ridership and congestion patterns, successfully identifying 3-4x times station load variations and revealing a 40% peak-hour dominance.",
        tech: ["Power BI", "Power Query", "DAX"],
        features: [
            "Interactive visualizations of ridership trends.",
            "Identification of high-density stations and peak intervals.",
            "Scalable analytics handling 65,700+ records.",
            "Actionable insights into congestion patterns."
        ],
        workflow: [
            "Data modeling into a star-schema.",
            "Created 12 custom DAX measures for deep analytics.",
            "Data transformation using Power Query.",
            "Dashboard design and deployment."
        ],
        links: `<a href="https://app.powerbi.com/view?r=eyJrIjoiNmQ5ZGI4YTYtZGMwOC00MzA4LWI5NjAtZmI3YzlmZTQ0NmY1IiwidCI6ImUxNGU3M2ViLTUyNTEtNDM4OC04ZDY3LThmOWYyZTJkNWE0NiIsImMiOjEwfQ%3D%3D" class="btn-live" target="_blank">Live Dashboard ↗</a>`
    },
    'card-fraud': {
        title: "Credit Card Fraud Prediction",
        subtitle: "Real-time machine learning fraud detection dashboard.",
        desc: "Developed a decision tree-based fraud detection model achieving 92% accuracy while reducing false positives by 12%. The model is deployed via a Streamlit dashboard that provides real-time predictions, processing over 280,000 records and cutting evaluation time by 60%.",
        tech: ["Python", "Pandas", "Scikit-learn", "Streamlit"],
        features: [
            "Real-time fraud prediction processing.",
            "High-accuracy (92%) decision tree model.",
            "Significant 12% reduction in false positive rates.",
            "Interactive interface cutting evaluation time by 60%."
        ],
        workflow: [
            "Processed dataset of 280,000+ records.",
            "Trained and evaluated Decision Tree algorithms.",
            "Optimized model to minimize false positives.",
            "Deployed interactive UI using Streamlit."
        ],
        links: `<a href="https://github.com/vandita-yadav/Credit-Card-Fraud-Prediction" class="btn-github" target="_blank">GitHub ↗</a>`
    }
};
// 2. Function to inject data into the modal
function populateModal(cardId) {
    const data = projectData[cardId];
    if (!data) return;

    // 1. Inject Basic Text
    document.querySelector('.modal-title').textContent = data.title;
    document.querySelector('.modal-subtitle').textContent = data.subtitle;
    document.querySelector('.modal-desc').textContent = data.desc;

    // 2. Inject Tech Pills
    const techContainer = document.querySelector('.modal-tech');
    techContainer.innerHTML = data.tech.map(tech => `<span>${tech}</span>`).join('');

    // 3. Inject Lists
    const lists = document.querySelectorAll('.grid-column ul');
    lists[0].innerHTML = data.features.map(feat => `<li>${feat}</li>`).join('');
    lists[1].innerHTML = data.workflow.map(work => `<li>${work}</li>`).join('');

    // 4. Inject Links
    document.querySelector('.link-buttons').innerHTML = data.links;
}

// 3. Open Modal Events
if (modalOverlay && closeModalBtn && projectCards.length > 0) {
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            populateModal(card.id); // Load the correct data!
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// --- SCROLL TO TOP BUTTON LOGIC ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (scrollToTopBtn) {
    // 1. Show button when scrolled down 300px from the top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // 2. Smooth scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- CLEAN URL SMOOTH SCROLLING ---
// Find every link on the page that starts with a "#" (your navigation links)
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // 1. Stop the default behavior (This prevents the '#' from adding to the URL!)
        e.preventDefault();
        
        // 2. Get the exact word after the '#' (like "projects" or "experience")
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        // 3. If that section exists, glide smoothly to it
        if (targetSection) {
            window.scrollTo({
                // The - 50 gives a little breathing room at the top so the header doesn't cover the title
                top: targetSection.offsetTop - 50, 
                behavior: 'smooth'
            });
        }
    });
});



// --- MOBILE HAMBURGER MENU LOGIC ---
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');
const mobileNavItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
    // Toggle menu open/close
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksMenu.classList.toggle('active');
    });

    // Close the menu automatically when a link is clicked
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksMenu.classList.remove('active');
        });
    });
}

// --- CONTACT FORM SUBMISSION LOGIC ---

/*const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        // 1. Stop the browser from redirecting to Formspree
        e.preventDefault(); 

        // 2. Gather the data from the form
        const formData = new FormData(contactForm);
        const endpoint = contactForm.getAttribute("action");

        // 3. Show a loading state (optional but good for UX)
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        try {
            // 4. Send the data to Formspree quietly in the background
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success! Show green message and clear the form
                formStatus.innerText = "Message successfully sent!";
                formStatus.style.color = "#4ade80"; // Green
                formStatus.style.display = "block";
                contactForm.reset();
            } else {
                // Formspree returned an error (e.g., missing field)
                formStatus.innerText = "Oops! There was a problem sending your message.";
                formStatus.style.color = "#e11d48"; // Red
                formStatus.style.display = "block";
            }
        } catch (error) {
            // Network error
            formStatus.innerText = "Network error. Please try again later.";
            formStatus.style.color = "#e11d48"; // Red
            formStatus.style.display = "block";
        } finally {
            // Reset button state
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide the status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = "none";
            }, 5000);
        }
    });
}*/