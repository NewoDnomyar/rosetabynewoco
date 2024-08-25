document.addEventListener('DOMContentLoaded', function() {
    const sortOptions = document.getElementById('sortOptions');
    const tileLibraryContainer = document.getElementById('tileLibraryContainer');

    const images = [
        { id: 'img1', src: 'assets/tiles/tile1.png', name: 'Tile 1', category: 'Nature' },
        { id: 'img2', src: 'assets/tiles/tile2.png', name: 'Tile 2', category: 'Nature' },
        { id: 'img3', src: 'assets/tiles/tile3.png', name: 'Tile 3', category: 'Abstract' },
        { id: 'img4', src: 'assets/tiles/tile4.png', name: 'Tile 4', category: 'Abstract' },
        { id: 'img5', src: 'assets/tiles/tile5.png', name: 'Tile 5', category: 'Pattern' },
        // Add more image objects with categories as needed
    ];

    // Function to display the tiles
    function displayTiles(tiles) {
        tileLibraryContainer.innerHTML = ''; // Clear previous tiles
        tiles.forEach(tile => {
            const imgElement = document.createElement('img');
            imgElement.src = tile.src;
            tileLibraryContainer.appendChild(imgElement);
        });
    }

    // Function to sort tiles
    function sortTiles(criteria) {
        let sortedTiles = [];
        if (criteria === 'name') {
            sortedTiles = [...images].sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === 'category') {
            sortedTiles = [...images].sort((a, b) => a.category.localeCompare(b.category));
        }
        displayTiles(sortedTiles);
    }

    // Initial display of tiles
    displayTiles(images);

    // Event listener for sort options
    sortOptions.addEventListener('change', function() {
        const criteria = sortOptions.value;
        sortTiles(criteria);
    });
});
