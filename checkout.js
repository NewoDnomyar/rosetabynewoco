document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your Public Key
    emailjs.init('F3aEsyBhkvDJxHRZN'); // Your actual EmailJS Public Key
    console.log('EmailJS initialized.');

    const checkoutForm = document.getElementById('checkoutForm');

    // Handle form submission for EmailJS
    function sendEmail() {
        const serviceID = 'service_z8blkjs';  // Your actual EmailJS Service ID
        const templateID = 'template_muokur4';  // Your actual EmailJS Template ID

        // Convert canvas to base64 image
        const frontCanvas = document.getElementById('frontCanvas');
        const backCanvas = document.getElementById('backCanvas');
        const frontCanvasDataUrl = frontCanvas.toDataURL('image/png'); // Get front canvas as base64
        const backCanvasDataUrl = backCanvas.toDataURL('image/png'); // Get back canvas as base64

        // Gather form data
        const emailParams = {
            from_name: document.getElementById('name').value,
            shipping_address: document.getElementById('address').value,
            customer_email: document.getElementById('email').value,
            collage_code: document.getElementById('collageCode').value,
            front_canvas_image: frontCanvasDataUrl,
            back_canvas_image: backCanvasDataUrl,
            reply_to: document.getElementById('email').value
        };

        console.log('Email parameters:', emailParams);

        // Send the form using EmailJS
        emailjs.send(serviceID, templateID, emailParams)
            .then(() => {
                console.log('Email sent successfully.');
                alert('Order placed! You will receive an email shortly.');
            }, (err) => {
                console.error('Failed to send email:', err);
                alert('Failed to place order. Please try again. ' + JSON.stringify(err));
            });
    }

    // PayPal Buttons integration
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '6.73' // Replace with the actual price
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                console.log('Transaction completed by ' + details.payer.name.given_name);
                // Send the email after the PayPal payment is approved
                sendEmail();
            });
        },
        onCancel: function(data) {
            // If the PayPal payment is cancelled, still send the email
            sendEmail();
        },
        onError: function(err) {
            console.error('Error during PayPal payment:', err);
            // If there’s an error with PayPal, still send the email
            sendEmail();
        }
    }).render('#paypal-button-container'); // Display PayPal button

    // Handle Test button click (if you have one)
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', function() {
            console.log('Test button clicked.');
            sendEmail(); // Send the email for testing without actual payment
            alert('Test order processed. No payment was made.');
        });
    }

    // Automatically handle form submission if the form is directly submitted
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendEmail(); // Ensure email is sent on form submission
    });
});
