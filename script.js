const API_KEY = 'YOUR_TMDB_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';

// grabbing all the elements i need from the page
let moviesGrid = document.getElementById('moviesGrid');
let searchInput = document.getElementById('searchInput');
let sortBy = document.getElementById('sortBy');
let moodBtns = document.querySelectorAll('.mood-btn');

let selectedGenre = '';
let searchTimer;

// this runs when mood button is clicked
moodBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // remove active class from all buttons first
    moodBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    selectedGenre = btn.dataset.genre;
    getMovies();
  });
});

// search box - wait for user to stop typing before calling API
searchInput.addEventListener('input', function() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function() {
    getMovies();
  }, 600);
});

// when sort dropdown changes
sortBy.addEventListener('change', function() {
  getMovies();
});

// main function to fetch movies from TMDB
async function getMovies() {
  moviesGrid.innerHTML = '<p class="loader">Loading movies...</p>';

  let query = searchInput.value;
  let sort = sortBy.value;
  let url;

  // if user typed something, use search endpoint
  // otherwise use discover endpoint with genre
  if (query != '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
  } else {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}`;
    if (selectedGenre != '') {
      url += `&with_genres=${selectedGenre}`;
    }
  }

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.results.length == 0) {
      moviesGrid.innerHTML = '<p class="loader">No movies found!</p>';
      return;
    }

    showMovies(data.results);

  } catch(error) {
    console.log('Error:', error);
    moviesGrid.innerHTML = '<p class="loader">Something went wrong. Try again!</p>';
  }
}

// takes movie data and creates cards on the page
function showMovies(movies) {
  moviesGrid.innerHTML = '';

  movies.forEach(function(movie) {
    let imgUrl;
    if (movie.poster_path) {
      imgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    } else {
      imgUrl = 'https://via.placeholder.com/300x450?text=No+Image';
    }

    let year = 'N/A';
    if (movie.release_date) {
      year = movie.release_date.split('-')[0];
    }

    let overview = movie.overview;
    if (overview.length > 100) {
      overview = overview.slice(0, 100) + '...';
    }

    let card = `
      <div class="movie-card">
        <img src="${imgUrl}" alt="${movie.title}" />
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p class="rating">⭐ ${movie.vote_average.toFixed(1)}</p>
          <p class="year">${year}</p>
          <p class="overview">${overview}</p>
        </div>
      </div>
    `;

    moviesGrid.innerHTML += card;
  });
}

// load some movies when page first opens
getMovies();
