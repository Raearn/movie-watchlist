import { searchMovie } from "./utils"

const searchBtn = document.querySelector(".search-btn")
export const searchInput = document.querySelector(".bar")
export const defaultDiv = document.querySelector(".default")
export const movieSection = document.querySelector(".movie-list")
export const loading = document.querySelector(".loading")
export const notFound = document.querySelector(".not-found")

export let movieID = []

window.addEventListener("load", () => {
  const stored = localStorage.getItem("watchlist");
  const storedID = localStorage.getItem("watchlistID");
  if (stored) {
    movieWatchlist = JSON.parse(stored)
  }
  if (storedID) {
    movieID = JSON.parse(storedID)
  }
})

searchBtn.addEventListener("click", searchMovie)
searchInput.addEventListener("keyup", searchMovie)

document.addEventListener("click", (e) => {
  const addMovie = e.target.dataset.add
  const removeMovie = e.target.dataset.remove
  if (addMovie) {
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
      parent.outerHTML = `<div class="add-btn" data-add="${removeMovie}"><img src="./add.svg" class="add-icon">Watchlist</div>`
    }
  }
})