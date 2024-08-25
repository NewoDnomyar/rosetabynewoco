document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    let collageCode = '';
    const orderButton = document.getElementById('orderButton');
    const imageGallery = document.getElementById('imageGallery');
    const frontCanvas = document.getElementById('frontCanvas');
    const ctxFront = frontCanvas.getContext('2d');
    const rosetaCodeElement = document.getElementById('rosetacodeID');
    const uploadButton = document.getElementById('uploadButton');

    const grid = []; // To hold the grid regions
    const letters = 'ABCDEFGH'.split(''); // Adjust letters for your grid size
    const numbers = '12345678'.split(''); // Adjust numbers for your grid size

    const tileWidth = 324; // Credit card width in pixels (3.375 inches * 96 DPI)
    const tileHeight = 204; // Credit card height in pixels (2.125 inches * 96 DPI)

    // Initialize grid regions for a grid layout
    letters.forEach((letter, colIndex) => {
        numbers.forEach((number, rowIndex) => {
            const regionId = `${letter}${number}`;
            grid.push({
                id: regionId,
                x: colIndex * tileWidth,
                y: rowIndex * tileHeight,
                width: tileWidth,
                height: tileHeight,
                occupied: false // Track if the grid slot is occupied
            });
        });
    });

    // Function to update the collage code
    function updateCollageCode(regionId, imageId) {
        const existingEntryIndex = collageCode.split('|').findIndex(entry => entry.startsWith(`${regionId}:`));
        if (existingEntryIndex !== -1) {
            const entries = collageCode.split('|');
            entries[existingEntryIndex] = `${regionId}:${imageId}`;
            collageCode = entries.join('|');
        } else {
            if (collageCode) {
                collageCode += `|${regionId}:${imageId}`;
            } else {
                collageCode = `${regionId}:${imageId}`;
            }
        }
        rosetaCodeElement.textContent = `Roseta Code: ${collageCode}`;
        localStorage.setItem('rsidCode', collageCode);

        // Enable the "Proceed to Checkout" button if the collage code is valid
        if (collageCode.length > 0) {
            orderButton.disabled = false;
        }
    }

    // Fetch and load tiles from the JSON file
    fetch('tiles.json')
        .then(response => response.json())
        .then(tiles => {
            tiles.forEach(tile => {
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.style.backgroundImage = `url(${tile.src})`;
                tileElement.dataset.id = tile.id;
                tileElement.addEventListener('click', function() {
                    placeTileOnGrid(tile.id);
                });
                imageGallery.appendChild(tileElement);
            });
        })
        .catch(error => console.error('Error loading tiles:', error));

    // Function to place a tile on the next available grid slot
    function placeTileOnGrid(imageId) {
        const nextSlot = grid.find(slot => !slot.occupied);
        if (nextSlot) {
            const imgElement = new Image();
            imgElement.src = `assets/tiles/${imageId}.png`; // Assumes image naming convention matches ID
            imgElement.onload = function() {
                ctxFront.drawImage(imgElement, nextSlot.x, nextSlot.y, nextSlot.width, nextSlot.height);
                nextSlot.occupied = true;
                updateCollageCode(nextSlot.id, imageId);
            };
        } else {
            alert("No more available slots on the grid.");
        }
    }

    const checkoutForm = document.getElementById('checkoutForm');
    const serviceID = 'service_z8blkjs';
    const templateID = 'template_muokur4';

    // Event listener for form submission to handle EmailJS and PayPal
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const codeField = document.createElement('input');
        codeField.type = 'hidden';
        codeField.name = 'collage_code';
        codeField.value = collageCode;
        this.appendChild(codeField);

        // Prepare email parameters
        const emailParams = {
            user_name: document.getElementById('name').value,
            user_address: document.getElementById('address').value,
            user_city: document.getElementById('city').value,
            user_state: document.getElementById('state').value,
            user_zip: document.getElementById('zip').value,
            user_email: document.getElementById('email').value,
            collage_code: collageCode,
        };

        const btn = document.querySelector("input[type='submit']");
        btn.value = 'Sending...';

        emailjs.send(serviceID, templateID, emailParams)
            .then(() => {
                btn.value = 'Send Email';
                console.log('Email sent successfully.');
                alert('Order placed! You will receive an email shortly.');
                // Proceed with form submission after email is sent
                checkoutForm.submit();
            }, (err) => {
                btn.value = 'Send Email';
                console.error('Failed to send email:', err);
                alert('Failed to place order. Please try again. ' + JSON.stringify(err));
            });
    });

    const paypalButton = document.getElementById('paypalButton');
    const testButton = document.getElementById('testButton');

    // Handle PayPal button click
    if (paypalButton) {
        paypalButton.addEventListener('click', function() {
            console.log('PayPal button clicked.');
            checkoutForm.submit(); // Simulate form submission to send the email
            window.location.href = 'https://www.paypal.com/ncp/payment/F2AG3LYLVNGYL'; // Replace with your actual PayPal link
        });
    }

    // Handle Test Order button click
    if (testButton) {
        testButton.addEventListener('click', function() {
            console.log('Test button clicked.');
            checkoutForm.submit(); // Simulate form submission to send the email
            alert('Test order processed. No payment was made.');
        });
    }

    // Load the gallery when the page loads
    function loadGallery() {
        // This function should be updated if images are dynamically loaded
    }

    // Handle custom photo uploads
    uploadButton.addEventListener('click', function() {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSdM8t-2nnSDtBTVBPyjqp74fivXbbgjxYy_aUO6C5BwB9EzXw/viewform', '_blank');
        document.getElementById('uploadMessage').textContent = 'Thank you for submitting your photos! We will add them shortly.';
    });

    // Initialize the gallery
    loadGallery();
});

