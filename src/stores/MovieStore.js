import { defineStore } from 'pinia'
import kinopoisk from '../../BD/kinopoisk-1.json'

export const useMovieStore = defineStore('movieStore', {
  sortParam: '',

  state: () => ({
    movies: kinopoisk,
    currentSorting: 'title',
  }),

  getters: {
    getTotalPages: (state) => Math.ceil(state.movies.docs.length / 25),
    getMovieById: (state) => (id) =>
      state.movies.docs.find((movie) => movie.id === Number(id)),
    getMovieByName: (state) => (name) =>
      state.movies.docs.find(
        (movie) => movie.name.toLowerCase() === name.toLowerCase()
      ),
    getMovieFromLS: () => (name) => JSON.parse(localStorage.getItem(name)),
    getMarkedMovies: (state) =>
      state.movies.docs.filter((movie) => {
        let movieLS = state.getMovieFromLS(movie.name)
        if (movieLS && movieLS.isMark) {
          return true
        } else {
          return false
        }
      }),
  },

  actions: {
    sorting(movies) {
      switch (this.currentSorting) {
        case 'title': {
          return movies.sort((m1, m2) =>
            m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
          )
        }
        case 'year': {
          return movies.sort((m1, m2) => {
            if (m1.year > m2.year) {
              return 1
            } else if (m1.year < m2.year) {
              return -1
            } else {
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
            }
          })
        }
        case 'score': {
          return movies.sort((m1, m2) => {
            if (this.countAverageScore(m1) > this.countAverageScore(m2)) {
              return 1
            } else if (
              this.countAverageScore(m1) < this.countAverageScore(m2)
            ) {
              return -1
            } else {
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1 //0
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
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
            }
          })
        }
        case '-title': {
          return movies.sort((m2, m1) =>
            m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
          )
        }
        case '-year': {
          return movies.sort((m2, m1) => {
            if (m1.year > m2.year) {
              return 1
            } else if (m1.year < m2.year) {
              return -1
            } else {
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
            }
          })
        }
        case '-score': {
          return movies.sort((m2, m1) => {
            if (this.countAverageScore(m1) > this.countAverageScore(m2)) {
              return 1
            } else if (
              this.countAverageScore(m1) < this.countAverageScore(m2)
            ) {
              return -1
            } else {
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1 //0
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
              return m1.name.toLowerCase() > m2.name.toLowerCase() ? 1 : -1
            }
          })
        }
      }
    },
    countAverageScore(movie) {
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
    },
    addMovieToLocalStorage(movie) {
      console.log(movie)
      localStorage.setItem(
        movie.name.toString(),
        JSON.stringify({
          rating: 0,
          isMark: false,
        })
      )
    },
    changeDataAtLocalStorage(name, rating, mark) {
      localStorage.setItem(
        name,
        JSON.stringify({
          rating: rating,
          isMark: mark,
        })
      )
    },
  },
})
