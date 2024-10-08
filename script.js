const apiKey = 'fea65e6d7ccb2a15b5df2d12dd418791';
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Muestras las películas populáres
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display Películas
function displayMovies(movies) {
    movieList.innerHTML = ''; 
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); 
        movieList.appendChild(li);
    });
}

// Sección de Detalles de la Película
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const movie = await response.json();

        selectedMovieId = movieId;
        detailsContainer.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p><strong>Resumen:</strong> ${movie.overview}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
            <p><strong>Calificación:</strong> ${movie.vote_average}/10</p>
        `;

        movieDetails.classList.remove('hidden'); 
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Sección de Busqueda
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Agregar a Favoritos
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent,
            poster: document.querySelector('#details img').src 
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); 
            displayFavorites(); 
        }
    }
});

// Pantalla de Favoritos
function displayFavorites() {
    favoritesList.innerHTML = ''; 
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" style="width: 50px; border-radius: 5px;">
            <span>${movie.title}</span>
        `;
        favoritesList.appendChild(li);
    });
}


// Initial fetch of popular movies and display favorites
fetchPopularMovies(); 
displayFavorites(); 
