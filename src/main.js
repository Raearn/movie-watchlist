import { searchMovie } from "./utils"

const searchBtn = document.querySelector(".search-btn")
export const searchInput = document.querySelector(".bar")
export const defaultDiv = document.querySelector(".default")
export const movieSection = document.querySelector(".movie-list")
export const loading = document.querySelector(".loading")
export const notFound = document.querySelector(".not-found")


searchBtn.addEventListener("click", searchMovie)
searchInput.addEventListener("keyup", searchMovie)
