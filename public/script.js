document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    document.getElementById('add-game-button').addEventListener('click', toggleAddGameForm);
    document.getElementById('game-form').addEventListener('submit', handleFormSubmit);
});

async function loadGames() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function displayGames(games) {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = '';
    games.forEach(game => {
        const gameElement = document.createElement('section');
        gameElement.classList.add('game');
        let mapsList = game.maps.join(', ');
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
            <p><strong>Genre:</strong> ${game.genre}</p>
            <p><strong>Main Platform:</strong> ${game.mainPlatform}</p>
            <p><strong>Series Number:</strong> ${game.seriesNumber}</p>
            <p><strong>Release Year:</strong> ${game.releaseYear}</p>
            <p><strong>Timeframe:</strong> ${game.timeframe}</p>
            <p><strong>Maps:</strong> ${mapsList}</p>
        `;
        gameList.appendChild(gameElement);
    });
}

function toggleAddGameForm() {
    const formContainer = document.getElementById('game-form-container');
    formContainer.classList.toggle('hidden');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const maps = formData.get('maps').split(',').map(map => map.trim());

    const newGame = {
        title: formData.get('title'),
        genre: formData.get('genre'),
        mainPlatform: formData.get('mainPlatform'),
        seriesNumber: formData.get('seriesNumber'),
        releaseYear: formData.get('releaseYear'),
        timeframe: formData.get('timeframe'),
        maps: maps,
    };

    try {
        const response = await fetch('/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGame)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayGames(result);
        toggleAddGameForm();
        event.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
