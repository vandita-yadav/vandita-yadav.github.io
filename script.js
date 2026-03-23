let model;
let baseY = 0;

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

camera.position.z = 10;


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


// LOADER
const loader = new THREE.GLTFLoader();

loader.load(
    "assets/models/laptop.glb",
    function (gltf) {

        model = gltf.scene;

        model.scale.set(1.5, 1.5, 1.5);

        // center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        baseY = -0.6;
        model.position.y = baseY;

        scene.add(model);
    }
);


// ANIMATION
function animate() {

    requestAnimationFrame(animate);

    if (model) {

        model.position.y =
            baseY + Math.sin(Date.now() * 0.0012) * 0.35;

    }

    controls.update();

    renderer.render(scene, camera);
}

animate();


// --- CONTACT FORM SUBMISSION LOGIC ---

const contactForm = document.getElementById("contact-form");
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
}