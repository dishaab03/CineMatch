// My CineMatch App - Milestone 3
// Sticking to TMDB for the movie data because their API is super reliable
const API_KEY = '8b134ed64706b1b9e90724db613b82b2';
const BASE_URL = 'https://api.themoviedb.org/3';

// --- State stuff ---
// Storing everything in basic arrays and variables to keep things simple
let allTheMovies = []; // Keeping the full list here so we don't hit the API limit
let userFavs = JSON.parse(localStorage.getItem('cineMatchFavorites')) || []; // Grabbing saved favs from the browser
let currentUITheme = localStorage.getItem('cineMatchTheme') || 'dark'; // Dark mode by default because it looks cooler
let activeGenre = '';
let showFavsOnly = false;
let typeTimer; // Used for the search debounce so we don't refresh on every single keystroke

// Grabbing all the elements I'll need to update later
const gridContainer = document.getElementById('moviesGrid');
const searchBox = document.getElementById('searchInput');
const sortDropdown = document.getElementById('sortBy');
const genreButtons = document.querySelectorAll('.mood-btn');
const themeBtn = document.getElementById('themeToggle');
const favFilterBtn = document.getElementById('favOnlyBtn');

// This is where everything starts
function startApp() {
  applySelectedTheme();
  loadInitialMovies();
  setupEvents();
}

// Just toggling the CSS class on the body to switch colors
function applySelectedTheme() {
  document.body.classList.toggle('light-mode', currentUITheme === 'light');
  themeBtn.textContent = currentUITheme === 'light' ? '🌙' : '☀️';
}

function handleThemeSwitch() {
  currentUITheme = currentUITheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cineMatchTheme', currentUITheme); // Saving it so it stays same on refresh
  applySelectedTheme();
}

// Fetching 100 movies (5 pages) so there's actually something to search through
async function loadInitialMovies() {
  gridContainer.innerHTML = '<p class="loader">Fetching the good stuff...</p>';
  
  try {
    const pagesToLoad = [1, 2, 3, 4, 5];
    // Mapping pages to fetch promises then waiting for all of them
    const pagePromises = pagesToLoad.map(page => 
      fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`).then(res => res.json())
    );
    
    const allResults = await Promise.all(pagePromises);
    
    // Flattening the arrays into one big list of 100 movies
    allTheMovies = allResults.flatMap(data => data.results);
    
    displayMovies();
  } catch (err) {
    console.error('Oops, something went wrong with the fetch:', err);
    gridContainer.innerHTML = '<p class="loader">Failed to load movies. Maybe check your internet?</p>';
  }
}

// This function handles all the logic for search, filters, and sorting
function getProcessedList() {
  let list = [...allTheMovies]; // Working on a copy so we don't mess up the original data

  // 1. Search filter - checking if the title matches what the user typed
  const searchText = searchBox.value.toLowerCase().trim();
  if (searchText) {
    list = list.filter(m => m.title.toLowerCase().includes(searchText));
  }

  // 2. Genre filter - matched via the genre_ids array TMDB gives us
  if (activeGenre) {
    list = list.filter(m => m.genre_ids.includes(parseInt(activeGenre)));
  }

  // 3. Favorites only filter - if the toggle is on, check our userFavs list
  if (showFavsOnly) {
    list = list.filter(m => userFavs.includes(m.id));
  }

  // 4. Sorting - picking the right property based on the dropdown
  const sortType = sortDropdown.value;
  list.sort((a, b) => {
    if (sortType === 'popularity.desc') return b.popularity - a.popularity;
    if (sortType === 'vote_average.desc') return b.vote_average - a.vote_average;
    if (sortType === 'release_date.desc') {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return 0;
  });

  return list;
}

// The main render function that builds the grid
function displayMovies() {
  const filteredList = getProcessedList();
  
  // Show a message if nothing matches
  if (filteredList.length === 0) {
    gridContainer.innerHTML = '<p class="loader">No movies found! Try changing your filters.</p>';
    return;
  }

  // Using .map().join('') because it's much cleaner than using for-loops and += strings
  gridContainer.innerHTML = filteredList.map(movie => {
    const isActuallyFav = userFavs.includes(movie.id);
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : 'https://via.placeholder.com/300x450?text=No+Image'; // Fallback so we don't have broken images
    
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    
    return `
      <div class="movie-card" data-id="${movie.id}">
        <button class="favorite-btn ${isActuallyFav ? 'active' : ''}" onclick="event.stopPropagation(); hitFavorite(${movie.id})">
          ${isActuallyFav ? '❤️' : '🤍'}
        </button>
        <img src="${posterUrl}" alt="${movie.title}" loading="lazy" />
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <div class="card-meta">
            <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
            <span class="year">${releaseYear}</span>
          </div>
          <p class="overview">${movie.overview || 'Oops, no description for this one.'}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Adding or removing a movie from the favorites list
function hitFavorite(id) {
  if (userFavs.includes(id)) {
    // If it's already there, filter it out
    userFavs = userFavs.filter(favId => favId !== id);
  } else {
    // Otherwise, add it to the list
    userFavs = [...userFavs, id];
  }
  
  // Save the updated list to local storage so the user doesn't lose it
  localStorage.setItem('cineMatchFavorites', JSON.stringify(userFavs));
  displayMovies(); // Refresh the grid to show the new state
}

// Exposing this to the global window so the inline onclick in the template works
window.hitFavorite = hitFavorite;

// Setting up all the buttons and inputs
function setupEvents() {
  // Clicking on a mood button
  genreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      genreButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGenre = btn.dataset.genre;
      displayMovies();
    });
  });

  // Search input with a tiny delay (400ms) so we don't re-render on every letter
  searchBox.addEventListener('input', () => {
    clearTimeout(typeTimer);
    typeTimer = setTimeout(() => {
      displayMovies();
    }, 400);
  });

  // Sorting dropdown
  sortDropdown.addEventListener('change', displayMovies);

  // Theme switch button
  themeBtn.addEventListener('click', handleThemeSwitch);

  // Show only favorites toggle
  favFilterBtn.addEventListener('click', () => {
    showFavsOnly = !showFavsOnly;
    favFilterBtn.classList.toggle('active', showFavsOnly);
    displayMovies();
  });
}

// Finally, start everything up!
startApp();
