export const defaultDiv = document.querySelector(".default")
export const movieSection = document.querySelector(".movie-list")
export const loading = document.querySelector(".loading")
export const notFound = document.querySelector(".not-found")

let movieJSON = []
let movieID = []

window.addEventListener("load", () => {
  const stored = localStorage.getItem("watchlist")
  const storedID = localStorage.getItem("watchlistID")
  if (stored) {
    movieJSON = JSON.parse(stored)
  }
  if (storedID) {
    movieID = JSON.parse(storedID)
  }
  render(movieJSON)
})

document.addEventListener("click", (e) => {
  const removeMovie = e.target.dataset.remove
  if (removeMovie) {
    if (movieID.includes(removeMovie)) {
      let parent = e.target
      movieID = movieID.filter(item => item !== removeMovie)
      localStorage.setItem("watchlistID", JSON.stringify(movieID))
      movieJSON = movieJSON.filter((movie) => movie.imdbID !== removeMovie)
      localStorage.setItem("watchlist", JSON.stringify(movieJSON))
      e.target.closest(".movie-card").outerHTML = ""
    }
  }
})

function render(movieJSON) {
  let html = ''
  movieSection.innerHTML = ''
  defaultDiv.style.display = 'none'
  loading.style.display = 'flex'
    for (const movie of movieJSON) {
      const movieRating = movie.Ratings[0].Value

      html += `<article class="movie-card">
      <img src="${movie.Poster}" class="poster" alt="">
      <div class="movie">
        <div class="movie-title">
          <h3>${movie.Title}</h3>
          <span>⭐ ${movieRating.substring(0, movieRating.length - 3)}</span>
        </div>
        <div class="movie-details">
          <span class="movie-duration">${movie.Runtime}</span>
          <span class="movie-genre">${movie.Genre}</span>
          <div class="remove-btn" data-remove="${movie.imdbID}"><img src="/remove.svg" class="remove-icon">Remove</div>
        </div>
        <div class="movie-desc">
          ${movie.Plot}
        </div>
      </div>
    </article>`
    }
    loading.style.display = 'none'
    movieSection.style.display = 'flex'
    movieSection.innerHTML = html;
}

