<template>
  <AppBar />
  <v-container v-if="showMovies.length > 0">
    <v-row justify="start">
      <v-col
        class="text-center"
        v-for="movie in showMovies"
        :key="movie.id"
        cols="auto"
      >
        <MovieCard
          :name="movie.name"
          :score="movieStore.countAverageScore(movie)"
          :year="movie.year"
          :poster="movie.poster.previewUrl"
          :id="movie.id"
          @unmark-movie="unmark(movie)"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-alert
      class="mx-auto mb-20"
      position="relative"
      rounded
      tonal
      max-width="450"
      min-width="250"
      title="Здесь пока что пусто"
      text="Вы ещё ничего не добавили в закладки"
    />
  </v-container>
  <v-pagination
    v-model="currentPage"
    :length="paginationLength"
    @update:modelValue="changePage"
  />
</template>

<script setup>
import { useMovieStore } from '../../stores/MovieStore.js'
import { ref, computed } from 'vue'
import MovieCard from '../ui/MovieCard.vue'
import AppBar from '../ui/AppBar.vue'

window.scrollTo(0, 0)

const movieStore = useMovieStore()
const currentPage = ref(1)
const MOVIES_PER_PAGE = 25

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo(0, 0)
}

function unmark(movie) {
  movieStore.changeDataAtLocalStorage(
    movie.id,
    movie.name,
    JSON.parse(localStorage.getItem(movie.id)).rating,
    false
  )
  markedMovies.value = Object.keys(localStorage).reduce((accum, item) => {
    if (JSON.parse(localStorage[item]).isMark) {
      return [...accum, movieStore.getMovieById(item)]
    }
    return accum
  }, [])
}

const markedMovies = ref(
  Object.keys(localStorage).reduce((accum, item) => {
    if (JSON.parse(localStorage[item]).isMark) {
      return [...accum, movieStore.getMovieById(item)]
    }
    return accum
  }, [])
)

const showMovies = computed(() => {
  const start = (currentPage.value - 1) * MOVIES_PER_PAGE
  const end = start + MOVIES_PER_PAGE
  return movieStore.sorting(markedMovies.value).slice(start, end)
})

const paginationLength = computed(() =>
  markedMovies.value.length ? Math.ceil(markedMovies.value.length / MOVIES_PER_PAGE) : 1
)
</script>
<style scoped>
.v-col {
  width: 225px;
  max-width: 225px;
}
</style>