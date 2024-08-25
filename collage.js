document.addEventListener('DOMContentLoaded', function() {
    const tileSelector = document.getElementById('tileSelector');
    const selectedTilesContainer = document.getElementById('selectedTilesContainer');
    const rosetaCodeElement = document.getElementById('rosetacodeID');
    const frontCanvas = document.getElementById('frontCanvas');
    const backCanvas = document.getElementById('backCanvas');
    const frontCtx = frontCanvas.getContext('2d');
    const backCtx = backCanvas.getContext('2d');
    const clearRSIDButton = document.getElementById('clearRSID');

    let selectedTiles = [];
    let collageCode = '';

    const images = [
        { id: 'img1', src: 'assets/tiles/tile1.png', name: 'Tile 1' },
        { id: 'img2', src: 'assets/tiles/tile2.png', name: 'Tile 2' },
        { id: 'img3', src: 'assets/tiles/tile3.png', name: 'Tile 3' },
        { id: 'img4', src: 'assets/tiles/tile4.png', name: 'Tile 4' },
        { id: 'img5', src: 'assets/tiles/tile5.png', name: 'Tile 5' },
        // Add more images as needed
    ];

    function loadTileSelector() {
        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image.id;
            option.textContent = image.name;
            tileSelector.appendChild(option);
        });
    }

    function updateCollageCode() {
        collageCode = selectedTiles.map((tile, index) => `${index + 1}:${tile.id}`).join('|');
        rosetaCodeElement.textContent = `Roseta Code: ${collageCode}`;
        localStorage.setItem('rsidCode', collageCode);
        drawCollage(); // Update the canvases each time the code is updated
    }

    function drawCollage() {
        frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height); // Clear the front canvas
        backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height); // Clear the back canvas

        const tileWidth = 324; // Credit card width in pixels (3.375 inches * 96 DPI)
        const tileHeight = 204; // Credit card height in pixels (2.125 inches * 96 DPI)
        const tilesPerRow = Math.floor(frontCanvas.width / tileWidth);
        const totalTiles = tilesPerRow * Math.floor(frontCanvas.height / tileHeight);

        let tileIndex = 0;

        // Fill the front canvas
        for (let i = 0; i < totalTiles; i++) {
            const x = (i % tilesPerRow) * tileWidth;
            const y = Math.floor(i / tilesPerRow) * tileHeight;
            if (tileIndex < selectedTiles.length) {
                const imgElement = new Image();
                imgElement.src = selectedTiles[tileIndex].src;

                imgElement.onload = function() {
                    frontCtx.drawImage(imgElement, x, y, tileWidth, tileHeight);
                    drawGridLines(frontCtx, x, y, tileWidth, tileHeight); // Draw grid lines around the tile
                };
                tileIndex++;
            }
        }

        // Fill the back canvas
        for (let i = 0; i < totalTiles; i++) {
            const x = (i % tilesPerRow) * tileWidth;
            const y = Math.floor(i / tilesPerRow) * tileHeight;
            if (tileIndex < selectedTiles.length) {
                const imgElement = new Image();
                imgElement.src = selectedTiles[tileIndex].src;

                imgElement.onload = function() {
                    backCtx.drawImage(imgElement, x, y, tileWidth, tileHeight);
                    drawGridLines(backCtx, x, y, tileWidth, tileHeight); // Draw grid lines around the tile
                };
                tileIndex++;
            }
        }
    }

    function drawGridLines(ctx, x, y, width, height) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height); // Draw grid lines
    }

    tileSelector.addEventListener('change', function() {
        if (selectedTiles.length < 48) {
            const selectedTileId = tileSelector.value;
            const selectedTile = images.find(image => image.id === selectedTileId);
            selectedTiles.push(selectedTile);

            const imgElement = document.createElement('img');
            imgElement.src = selectedTile.src;
            selectedTilesContainer.appendChild(imgElement);

            updateCollageCode();
        } else {
            alert("You have reached the maximum number of tiles (48).");
        }
        tileSelector.value = ""; // Reset the dropdown menu
    });

    clearRSIDButton.addEventListener('click', clearRSID);

    function clearRSID() {
        selectedTiles = [];
        collageCode = '';
        selectedTilesContainer.innerHTML = '';
        rosetaCodeElement.textContent = 'Roseta Code: ';
        localStorage.removeItem('rsidCode');
        frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height); // Clear the front canvas
        backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height); // Clear the back canvas
    }

    loadTileSelector();

    const storedRosetaCode = localStorage.getItem('rsidCode');
    if (storedRosetaCode) {
        collageCode = storedRosetaCode;
        rosetaCodeElement.textContent = `Roseta Code: ${collageCode}`;

        const tilePairs = collageCode.split('|');
        tilePairs.forEach(pair => {
            const [index, tileId] = pair.split(':');
            const tile = images.find(image => image.id === tileId);
            if (tile) {
                selectedTiles.push(tile);
                const imgElement = document.createElement('img');
                imgElement.src = tile.src;
                selectedTilesContainer.appendChild(imgElement);
            }
        });

        drawCollage(); // Draw the collage based on the stored Roseta code
    }
});
