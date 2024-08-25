document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('letterCanvas');
    const ctx = canvas.getContext('2d');

    // Letter size in inches (8.5" x 11") converted to pixels (assuming 96 DPI)
    const letterWidthInches = 8.5;
    const letterHeightInches = 11;
    const dpi = 96; // Dots per inch

    // Canvas dimensions in pixels
    const canvasWidth = letterWidthInches * dpi;
    const canvasHeight = letterHeightInches * dpi;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Credit card size in inches converted to pixels
    const cardWidthInches = 3.375;
    const cardHeightInches = 2.125;
    const cardWidth = cardWidthInches * dpi;
    const cardHeight = cardHeightInches * dpi;

    // Optional: Background color for the canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw credit card-sized regions
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Calculate positions for 4 credit card regions on the letter-sized paper
    const regions = [
        { x: 0, y: 0 }, // Top-left
        { x: canvasWidth - cardWidth, y: 0 }, // Top-right
        { x: 0, y: canvasHeight - cardHeight }, // Bottom-left
        { x: canvasWidth - cardWidth, y: canvasHeight - cardHeight } // Bottom-right
    ];

    // Draw each region
    regions.forEach(region => {
        ctx.strokeRect(region.x, region.y, cardWidth, cardHeight);
    });

    // Optional: Add text to each region
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    regions.forEach((region, index) => {
        ctx.fillText(`Region ${index + 1}`, region.x + cardWidth / 2, region.y + cardHeight / 2);
    });
});
