// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggles
    document.getElementById('openMenu').addEventListener('click', toggleSideMenu);
    document.getElementById('closeMenu').addEventListener('click', toggleSideMenu);
    
    // Close menu when clicking outside on overlay (optional but good UX)
    document.getElementById('homePage').addEventListener('click', (e) => {
        if (document.getElementById('sideMenu').classList.contains('active') && !e.target.closest('#sideMenu') && !e.target.closest('#openMenu')) {
            toggleSideMenu();
        }
    });
});

// --- Core Functions ---

// 1. Toggle Side Menu
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('active');
}

// 2. Switch Pages smoothly and scroll to top
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const sideMenu = document.getElementById('sideMenu');
    
    // Hide all pages
    pages.forEach(p => p.classList.add('hidden'));
    
    // Show target page
    document.getElementById(pageId).classList.remove('hidden');
    
    // Close menu if open
    sideMenu.classList.remove('active');
    
    // Scroll to top of the new page
    window.scrollTo(0, 0);
}

// 3. Open/Close Form Accordions smoothly
function toggleAccordion(contentId, headerElement) {
    const accordion = headerElement.parentElement;
    
    // Toggle active class on the main accordion container (handles arrow rotation and visual state)
    accordion.classList.toggle('active');
    
    const content = document.getElementById(contentId);
    
    // If opening, close any other open accordions (optional, keeps view clean)
    if (accordion.classList.contains('active')) {
        const allAccordions = document.querySelectorAll('.accordion');
        allAccordions.forEach(acc => {
            if (acc !== accordion && acc.classList.contains('active')) {
                acc.classList.remove('active');
            }
        });
    }
}

// 4. Simulate M-Pesa Prompt & Confirmation ("Done")
function triggerMpesaPrompt(amount) {
    const overlay = document.getElementById('statusOverlay');
    const loader = document.getElementById('statusLoader');
    const text = document.getElementById('statusText');
    const doneBtn = document.getElementById('doneBtn');

    // Show Overlay with Processing State
    overlay.classList.remove('hidden');
    loader.classList.remove('hidden');
    doneBtn.classList.add('hidden');
    text.innerText = `Sending M-Pesa prompt for KSh ${amount}...`;

    // Simulate Network Delay (e.g., waiting for M-Pesa callback)
    setTimeout(() => {
        // Change to "Done" State
        loader.classList.add('hidden');
        doneBtn.classList.remove('hidden');
        text.innerText = "Check your phone for the M-Pesa PIN prompt. Once paid, your application is complete!";
        text.style.color = "#008000"; // Optional: Make text green for success
    }, 3500); // 3.5 seconds simulation
}
function triggerMpesaPrompt(amount) {
    // Get the phone number from the active form
    const activeForm = document.querySelector('.accordion.active');
    const phoneNumber = activeForm.querySelector('input[type="tel"]').value;

    if (!phoneNumber || phoneNumber.length < 10) {
        alert("Please enter a valid mpesa phone number.");
        return;
    }

    const overlay = document.getElementById('statusOverlay');
    overlay.classList.remove('hidden');
    document.getElementById('statusText').innerText = `Requesting KSh ${amount} from ${phoneNumber}...`;

    // This is where we will eventually call the PHP script
    console.log("Initiating STK Push for:", phoneNumber, "Amount:", amount);

    // Simulated success for now
    setTimeout(() => {
        document.getElementById('statusLoader').classList.add('hidden');
        document.getElementById('doneBtn').classList.remove('hidden');
        document.getElementById('statusText').innerText = "Prompt Sent! Enter your M-Pesa PIN on your phone to finish.";
    }, 2000);
}
async function triggerMpesaPrompt(amount) {
    // 1. Get phone number from the input
    const activeAccordion = document.querySelector('.accordion.active');
    const phoneInput = activeAccordion.querySelector('input[type="tel"]').value;

    if (!phoneInput) {
        alert("Please enter your M-Pesa number first!");
        return;
    }

    // 2. Show the "Processing" overlay
    const overlay = document.getElementById('statusOverlay');
    overlay.classList.remove('hidden');
    document.getElementById('statusText').innerText = "Requesting M-Pesa PIN...";

    // 3. Send data to your PHP script
    const formData = new FormData();
    formData.append('phone', phoneInput);
    formData.append('amount', amount);

    try {
        const response = await fetch('stk_push.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.ResponseCode == "0") {
            document.getElementById('statusText').innerText = "Check your phone and enter your M-Pesa PIN now.";
            // We show the "Done" button after a few seconds
            setTimeout(() => {
                document.getElementById('statusLoader').classList.add('hidden');
                document.getElementById('doneBtn').classList.remove('hidden');
                document.getElementById('statusText').innerText = "Payment Sent! Your application is being processed.";
            }, 5000);
        } else {
            alert("Error: " + result.CustomerMessage);
            overlay.classList.add('hidden');
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Connection failed. Make sure you are running on a server!");
        overlay.classList.add('hidden');
    }
}
function showPage(id) {
    // Hide all sections with class 'page'
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });

    // Show the target page
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    }

    // Always scroll to top when changing pages
    window.scrollTo(0, 0);
}
