# 🎬 CineMatch — Stop Scrolling, Start Watching

Ever spent more time picking a movie than actually watching it? Yeah, me too. I built **CineMatch** to solve that exact "Netflix Paralysis." Instead of scrolling through endless lists, you just tell the app how you're feeling, and it handles the rest.

## 👋 What is CineMatch?
Let’s be real: search bars are great, but sometimes you don't even know what you're looking for. CineMatch is a mood-first movie discovery tool. Whether you're in the mood for a good cry, a quick adrenaline boost, or just want to feel something, it filters through the top-rated films on TMDB to find your perfect match. 

The idea was to make discovery feel organic, fast, and—most importantly—instant.

## 🚀 Key Features
I’ve packed this version with everything you need for a smooth experience:
*   **🎭 Mood-Based Vibes:** Instant filtering by genre (Happy, Thrilled, Scared, etc.) using one-click buttons.
*   **🔍 Lightning Search:** A real-time search bar that filters as you type (no annoying "Enter" key needed).
*   **⭐ Smart Sorting:** Sort by popularity, rating, or the newest releases without any page reloads.
*   **❤️ Your personal Watchlist:** Save your favorites with one click. They stay saved even if you refresh, thanks to `localStorage`.
*   **🌗 Eye-Friendly Themes:** A sleek Dark Mode (my personal favorite) and a clean Light Mode for when you're actually out in the sun.

## 🧠 How it Works
The app is built entirely with **Vanilla JavaScript**—no heavy frameworks like React or Vue here. 
*   **The Data:** Everything comes from the **TMDB API**. I fetch a big batch of top-rated movies upfront so everything else feels snappy.
*   **The Logic:** All the magic happens on your side of the screen. I use Higher-Order Functions (`.filter()`, `.map()`, and `.sort()`) to process the data instantly. This means when you toggle a filter, you don't wait for a server—it’s immediate.

## 🛠 Tech Stack
*   **Core:** HTML5 & Vanilla JavaScript (ES6+)
*   **Styling:** Modern CSS (Flexbox, Grid, CSS Variables)
*   **API:** [The Movie Database (TMDB)](https://www.themoviedb.org/)
*   **Storage:** Browser `localStorage` for theme and favorites persistence.

## 🚧 Challenges I Faced
1.  **The "Jittery" Search:** Initially, the app tried to filter on every single keystroke, which felt a bit laggy. I implemented a **debounce** (a tiny timer) so the app waits until you finish typing before it updates the grid.
2.  **Async Headache:** Fetching multiple pages of data from TMDB and making sure they all flattened into one clean array without breaking the UI was a bit of a puzzle, but `Promise.all` and `.flatMap()` saved the day.
3.  **Clean State Management:** Keeping track of which mood is active while also checking for search terms and favorites filters required a very specific order of operations in the filtering logic.

## 🔮 What’s Next?
If I keep working on this, I'd love to add:
*   **Movie Trailers:** Integrating YouTube embeds so you can watch a teaser right in the app.
*   **Detailed Modals:** A pop-up with the full cast, budget, and similar movie recommendations.
*   **Mood Generator:** A "Surprise Me" button that picks one random movie based on your mood.

## 🏃 How to Run
1.  **Clone it:** `git clone https://github.com/dishaab03/CineMatch.git`
2.  **Open it:** Just double-click `index.html` in your file explorer.
3.  **Enjoy:** That’s it! No `npm install` or complex setup required.

---
*Built with ❤️ (and a lot of coffee) by a developer who just wants to find a good movie.*


