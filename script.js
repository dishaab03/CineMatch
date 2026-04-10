/**
 * CineMatch - Milestone 4 Refined
 * A movie discovery app that feels human.
 */

const API_KEY = '8b134ed64706b1b9e90724db613b82b2';
const BASE_URL = 'https://api.themoviedb.org/3';

// --- State Management ---
// I'm keeping things simple with global state for now. 
// No need to overcomplicate a small app with Redux-style stuff!
let masterMovieList = []; 
let favoriteIds = JSON.parse(localStorage.getItem('cineMatchFavorites')) || [];
let currentTheme = localStorage.getItem('cineMatchTheme') || 'dark';
let selectedGenre = '';
let showingFavoritesOnly = false;
let searchDebounceTimer;

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortBy');
const moodButtons = document.querySelectorAll('.mood-btn');
const themeToggleBtn = document.getElementById('themeToggle');
const favoritesToggleBtn = document.getElementById('favOnlyBtn');

/**
 * The entry point of our app.
 */
function initializeApp() {
  updateThemeUI();
  fetchInitialData();
  attachEventListeners();
}

/**
 * Handles the theme switching logic and persistence.
 */
function updateThemeUI() {
  const isLight = currentTheme === 'light';
  document.body.classList.toggle('light-mode', isLight);
  themeToggleBtn.textContent = isLight ? '🌙' : '☀️';
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cineMatchTheme', currentTheme);
  updateThemeUI();
}

/**
 * Grabs 100 top-rated movies from TMDB. 
 * I fetch standard pages and flatten them into one big list.
 */
async function fetchInitialData() {
  moviesGrid.innerHTML = '<p class="loader">Waking up the local movie buffs...</p>';
  
  try {
    const pages = [1, 2, 3, 4, 5];
    const fetchPromises = pages.map(page => 
      fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`).then(r => r.json())
    );
    
    const results = await Promise.all(fetchPromises);
    
    // Flattening 5 pages of 20 movies each into a 100-movie cache
    masterMovieList = results.flatMap(data => data.results);
    
    renderGallery();
  } catch (error) {
    console.error('Fetch failed:', error);
    moviesGrid.innerHTML = '<p class="loader">Ugh, the API is being cranky. Check your connection?</p>';
  }
}

/**
 * This is the "brain" of the app. It filters and sorts our list
 * based on every user action (search, mood, sort).
 */
function getFilteredAndSortedMovies() {
  let filtered = [...masterMovieList];

  // 1. Filter by Search Text
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(movie => movie.title.toLowerCase().includes(query));
  }

  // 2. Filter by Mood/Genre
  if (selectedGenre) {
    filtered = filtered.filter(movie => movie.genre_ids.includes(Number(selectedGenre)));
  }

  // 3. Filter by User Favorites
  if (showingFavoritesOnly) {
    filtered = filtered.filter(movie => favoriteIds.includes(movie.id));
  }

  // 4. Sort the Results
  const sortType = sortSelect.value;
  filtered.sort((a, b) => {
    if (sortType === 'popularity.desc') return b.popularity - a.popularity;
    if (sortType === 'vote_average.desc') return b.vote_average - a.vote_average;
    if (sortType === 'release_date.desc') return new Date(b.release_date) - new Date(a.release_date);
    return 0;
  });

  return filtered;
}

/**
 * Generates the HTML string for a single movie card.
 */
function generateMovieCardHTML(movie) {
  const isFav = favoriteIds.includes(movie.id);
  const poster = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/300x450?text=No+Poster';
  
  const year = movie.release_date ? movie.release_date.split('-')[0] : '????';

  return `
    <div class="movie-card" data-id="${movie.id}">
      <button class="favorite-btn ${isFav ? 'active' : ''}" data-fav-id="${movie.id}">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <img src="${poster}" alt="${movie.title}" loading="lazy" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="card-meta">
          <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
          <span class="year">${year}</span>
        </div>
        <p class="overview">${movie.overview || 'Description MIA.'}</p>
      </div>
    </div>
  `;
}

/**
 * Updates the grid in the UI.
 */
function renderGallery() {
  const list = getFilteredAndSortedMovies();
  
  if (list.length === 0) {
    moviesGrid.innerHTML = '<p class="loader">Nothing matches! Maybe try a different mood?</p>';
    return;
  }

  moviesGrid.innerHTML = list.map(generateMovieCardHTML).join('');
}

/**
 * Toggles a movie's favorite status.
 */
function handleFavoriteToggle(id) {
  const movieId = Number(id);
  if (favoriteIds.includes(movieId)) {
    favoriteIds = favoriteIds.filter(fId => fId !== movieId);
  } else {
    favoriteIds.push(movieId);
  }
  
  localStorage.setItem('cineMatchFavorites', JSON.stringify(favoriteIds));
  renderGallery(); // Re-render to update the heart icons
}

/**
 * All the event wiring goes here.
 */
function attachEventListeners() {
  // Mood Button Clicks
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      const alreadyActive = btn.classList.contains('active');
      moodButtons.forEach(b => b.classList.remove('active'));
      
      if (alreadyActive) {
        selectedGenre = '';
      } else {
        btn.classList.add('active');
        selectedGenre = btn.dataset.genre;
      }
      renderGallery();
    });
  });

  // Search Input (with debounce)
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      renderGallery();
    }, 450); // A bit more relaxed timing
  });

  // Dropdown & Filter Toggles
  sortSelect.addEventListener('change', renderGallery);
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  favoritesToggleBtn.addEventListener('click', () => {
    showingFavoritesOnly = !showingFavoritesOnly;
    favoritesToggleBtn.classList.toggle('active', showingFavoritesOnly);
    renderGallery();
  });

  // Event Delegation for the Favorite Button (Cleaner than inline onclick)
  moviesGrid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.favorite-btn');
    if (favBtn) {
      e.stopPropagation();
      handleFavoriteToggle(favBtn.dataset.favId);
    }
  });
}

// Kick it off!
initializeApp();

