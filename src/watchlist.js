export const defaultDiv = document.querySelector(".default")
export const movieSection = document.querySelector(".movie-list")
export const loading = document.querySelector(".loading")
export const notFound = document.querySelector(".not-found")

let movieID = []

window.addEventListener("load", () => {
  const storedID = localStorage.getItem("watchlistID");
  if (storedID) {
    movieID = JSON.parse(storedID)
    render(movieID)
  }
})

document.addEventListener("click", (e) => {
  const removeMovie = e.target.dataset.remove
  if (removeMovie) {
    if (movieID.includes(removeMovie)) {
      let parent = e.target
      movieID = movieID.filter(item => item !== removeMovie)
      localStorage.setItem("watchlistID", JSON.stringify(movieID))
      e.target.closest(".movie-card").outerHTML = ''
    }
  }
})

async function render(movieID) {
  let html = ''
  movieSection.innerHTML = ''
  defaultDiv.style.display = 'none'
  loading.style.display = 'flex'
  try {
    for (const id of movieID) {
      const movieData = fetch(`https://www.omdbapi.com/?apikey=b108b436&i=${id}`)
      const [response, movie] = await Promise.all([movieData, movieData.then(response => response.json())])
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
          <div class="remove-btn" data-remove="${movie.imdbID}"><img src="./public/remove.svg" class="remove-icon">Remove</div>
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

  } catch(error) {
    console.log(error)  
  }
}

