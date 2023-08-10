import { searchInput, notFound, loading, movieSection, defaultDiv } from "./main";

let movieArray = []
let movieID = []
let movieJSON = []

window.addEventListener("load", () => {
  const stored = localStorage.getItem("watchlist")
  const storedID = localStorage.getItem("watchlistID")
  if (stored) {
    movieJSON = JSON.parse(stored)
  }
  if (storedID) {
    movieID = JSON.parse(storedID)
  }
})

async function searchMovie(event) {
  if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
      event.preventDefault();
      const inputValue = searchInput.value

      try {
          const promiseData = fetch(`https://www.omdbapi.com/?apikey=b108b436&s=${inputValue}`)
          const [response, movie] = await Promise.all([promiseData, promiseData.then(response => response.json())])
          if (movie.Response === 'False') {
              // Add Not found
              defaultDiv.style.display = 'none'
              notFound.style.display = 'block'
          } else {
              notFound.style.display = 'none'
              let html = ''
              const movieList = movie.Search
              movieArray = []
              movieList.forEach(movie => {
                getMovieData(movie.imdbID)
              })
              getMovieHTML(movieArray)
          }
      } catch (error) {
          console.log(error)
      }
  }
}

function getMovieData(imdbID) {
  movieArray.push(imdbID)
  return movieArray
}

async function getMovieHTML(movieArray) {
  let html = ''
  movieSection.innerHTML = ''
  defaultDiv.style.display = 'none'

  loading.style.display = 'flex'

  try {
    for (const id of movieArray) {
      const movieData = fetch(`https://www.omdbapi.com/?apikey=b108b436&i=${id}`)
      const [response, movie] = await Promise.all([movieData, movieData.then(response => response.json())])
      const movieRating = movie.Ratings[0].Value

      function toggleButton(imdbID) {
        const button = movieID.includes(imdbID)
    ? `<div class="remove-btn" data-remove="${imdbID}"><img src="/remove.svg" class="remove-icon">Remove</div>`
    : `<div class="add-btn" data-add="${imdbID}"><img src="./add.svg" class="add-icon">Watchlist</div>`;
        return button
      }

      document.addEventListener("click", (e) => {
        const addMovie = e.target.dataset.add
        const removeMovie = e.target.dataset.remove
        if (addMovie) {
          const movieToAdd = movie
          if (movieToAdd && movieToAdd.imdbID === addMovie) {
            movieJSON.push(movieToAdd)
            localStorage.setItem("watchlist", JSON.stringify(movieJSON))
            console.log(movieJSON)
          }
          if (!movieID.includes(addMovie)) {
            let parent = e.target
            movieID.push(addMovie)
            localStorage.setItem("watchlistID", JSON.stringify(movieID))
            parent.outerHTML = `<div class="remove-btn" data-remove="${addMovie}"><img src="/remove.svg" class="remove-icon">Remove</div>`
          }
        }
        if (removeMovie) {
          if (movieID.includes(removeMovie)) {
            let parent = e.target
            movieID = movieID.filter(item => item !== removeMovie)
            localStorage.setItem("watchlistID", JSON.stringify(movieID))
            parent.outerHTML = `<div class="add-btn" data-add="${removeMovie}"><img src="/add.svg" class="add-icon">Watchlist</div>`
            movieJSON = movieJSON.filter((movie) => movie.imdbID !== removeMovie);
            localStorage.setItem("watchlist", JSON.stringify(movieJSON));
            console.log(movieJSON);
          }
        }
      })

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
          ${toggleButton(movie.imdbID)}
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

export {searchMovie, getMovieHTML, movieArray}