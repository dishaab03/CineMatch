# 🎬 CineMatch

A mood-based movie discovery web app powered by the TMDB API.
Tell CineMatch how you're feeling — it finds the perfect movie for you.

## 🎯 Purpose
CineMatch helps users discover movies based on their current mood.
Instead of endlessly scrolling, users pick a mood (Happy, Sad, Thrilled,
Romantic, etc.) and get curated movie recommendations with instant client-side
filtering and sorting options.

## 🌟 Milestone 3 Upgrades
This project has been upgraded to **Milestone 3** with the following enhancements:

- **🚀 Client-Side Processing**: All searching, filtering, and sorting now happen instantly on the client using JavaScript Higher-Order Functions (`filter`, `map`, `sort`). Bulk loading ensures no API lag during interaction.
- **🎨 Soft-Cyber UI**: A completely redesigned, modern interface featuring glassmorphism, animated mesh backgrounds, and premium typography (Outfit font).
- **❤️ Favourites System**: Users can now save their favourite movies to a personal list that persists via `localStorage`.
- **🌗 Dark/Light Mode**: Full theme support with persistence, allowing users to switch between sleek dark and clean light modes.
- **✍️ Humanized Code**: The underlying logic has been documented with informal, "human" comments explaining the *why* behind the code.

## 🌐 API Used
- **The Movie Database (TMDB) API** — https://www.themoviedb.org/documentation/api
- Provides movie data including titles, posters, ratings, genres,
  and release dates.

## ✨ Features
- 🎭 Mood-based movie recommendations (Happy, Sad, Adventurous, Romantic...)
- 🔍 Client-side search by title (instant & case-insensitive)
- 🎬 Instant genre filtering without API calls
- ⭐ Dynamic sorting by popularity, rating, or release date
- 🔖 Save favourite movies to a personal watchlist (localStorage)
- 🌗 Persistent dark and light mode themes

## 🛠 Technologies
- HTML5, CSS3 (CSS Variables for theming)
- Vanilla JavaScript (ES6+ HOFs: `filter`, `map`, `sort`, `flatMap`)
- TMDB REST API (fetch / async-await)
- localStorage for persistence

## 🚀 How to Run
1. Clone this repository:
```bash
   git clone https://github.com/dishaab03/CineMatch.git
```
2. Open `index.html` in your browser — no build step needed.
3. The app comes pre-configured with a TMDB API key in `script.js`.

## 📁 Project Structure
```
cinematch/
├── index.html      # Main UI structure & Font imports
├── style.css       # Soft-Cyber UI & Glassmorphism styles
├── script.js       # Core logic (Client-side HOFs & Persistence)
└── README.md       # Project documentation (Updated for M3)
```

## 📌 Current Status
**Milestone 3 — Completed.** The app is now a high-performance, interactive, and beautifully designed movie discovery platform.

