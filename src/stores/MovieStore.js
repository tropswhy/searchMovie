import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import kinopoisk from '../../BD/kinopoisk-1.json'

export const useMovieStore = defineStore('movieStore', () => {
  const movies = ref(kinopoisk)
  const currentSorting = ref('title')

  function sorting(movies) {
    switch (currentSorting.value) {
      case 'title': {
        return movies.sort((m1, m2) => m1.name.localeCompare(m2.name))
      }
      case 'year': {
        return movies.sort((m1, m2) => {
          if (m1.year > m2.year) {
            return 1
          } else if (m1.year < m2.year) {
            return -1
          } else {
            return m1.name.localeCompare(m2.name)
          }
        })
      }
      case 'score': {
        return movies.sort((m1, m2) => {
          if (this.countAverageScore(m1) > this.countAverageScore(m2)) {
            return 1
          } else if (this.countAverageScore(m1) < this.countAverageScore(m2)) {
            return -1
          } else {
            return m1.name.localeCompare(m2.name)
          }
        })
      }
      case 'timing': {
        return movies.sort((m1, m2) => {
          if (m1.movieLength > m2.movieLength) {
            return 1
          } else if (m1.movieLength < m2.movieLength) {
            return -1
          } else {
            m1.name.localeCompare(m2.name)
          }
        })
      }
      case '-title': {
        return movies.sort((m2, m1) => m1.name.localeCompare(m2.name))
      }
      case '-year': {
        return movies.sort((m2, m1) => {
          if (m1.year > m2.year) {
            return 1
          } else if (m1.year < m2.year) {
            return -1
          } else {
            return m1.name.localeCompare(m2.name)
          }
        })
      }
      case '-score': {
        return movies.sort((m2, m1) => {
          if (this.countAverageScore(m1) > this.countAverageScore(m2)) {
            return 1
          } else if (this.countAverageScore(m1) < this.countAverageScore(m2)) {
            return -1
          } else {
            return m1.name.localeCompare(m2.name)
          }
        })
      }
      case '-timing': {
        return movies.sort((m2, m1) => {
          if (m1.movieLength > m2.movieLength) {
            return 1
          } else if (m1.movieLength < m2.movieLength) {
            return -1
          } else {
            return m1.name.localeCompare(m2.name)
          }
        })
      }
    }
  }
  function countAverageScore(movie) {
    let sum = 0
    let count = 0
    if (movie.rating.kp > 0) {
      sum += movie.rating.kp
      count += 1
    }
    if (movie.rating.imdb > 0) {
      sum += movie.rating.imdb
      count += 1
    }
    if (movie.rating.filmCritics > 0) {
      sum += movie.rating.filmCritics
      count += 1
    }
    if (movie.rating.russianFilmCritics > 0) {
      sum += movie.rating.russianFilmCritics / 10
      count += 1
    }
    if (movie.rating.await > 0) {
      sum += movie.rating.await / 10
      count += 1
    }

    return Math.round((sum / count) * 1000) / 1000
  }
  function addMovieToLocalStorage(movie) {
    localStorage.setItem(
      movie.id,
      JSON.stringify({
        name: movie.name.toString(),
        rating: 0,
        isMark: false,
      })
    )
  }
  function changeDataAtLocalStorage(id, name, rating, mark) {
    localStorage.setItem(
      id,
      JSON.stringify({
        name: name,
        rating: rating,
        isMark: mark,
      })
    )
  }
  const getMovieById = computed(
    () => (id) => movies.value.docs.find((movie) => movie.id === Number(id))
  )
  const getMovieByName = computed(
    () => (name) =>
      movies.value.docs.find(
        (movie) => movie.name.toLowerCase() === name.toLowerCase()
      )
  )
  const getMarkedMovies = computed(() =>
    movies.value.docs.filter((movie) => {
      let movieLS = getMovieFromLS.value(movie.name)
      return movieLS && movieLS.isMark
    })
  )

  return {
    sortParam,
    movies,
    currentSorting,
    sorting,
    countAverageScore,
    addMovieToLocalStorage,
    changeDataAtLocalStorage,
    getMovieById,
    getMovieByName,
    getMarkedMovies,
  }
})