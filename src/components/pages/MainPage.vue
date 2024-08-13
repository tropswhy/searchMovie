<template>
  <v-app>
    <AppBar />
    <v-responsive
      class="mx-auto mt-4"
      width="500px"
      max-height="70px"
    >
      <v-text-field
        v-model="search"
        class="my-2"
        label="Поиск"
        variant="outlined"
        clearable
        prepend-inner-icon="mdi-magnify"
        rounded
      />
    </v-responsive>
    <v-container class="text-center">
      <v-row
        v-if="showMovies.length > 0"
        justify="start"
        align="center"
      >
        <v-col
          class="text-center"
          v-for="movie in showMovies"
          cols="auto"
        >
          <MovieCard
            :name="movie.name"
            :score="movieStore.countAverageScore(movie)"
            :year="movie.year"
            :poster="movie.poster.previewUrl"
            :id="movie.id"
          />
        </v-col>
      </v-row>
      <v-alert
        v-else
        class="mx-auto mb-20"
        position="relative"
        rounded
        tonal
        max-width="450"
        min-width="250"
        title="Ничего не найдено"
        text="К сожалению, фильма с таким названием нет. Попробуйте поискать что-нибудь другое."
      />
    </v-container>
    <v-pagination
      v-model="currentPage"
      :length="paginationLength"
      @update:modelValue="changePage"
    />
  </v-app>
</template>

<script setup>
import { useMovieStore } from '../../stores/MovieStore.js'
import { ref, computed } from 'vue'
import MovieCard from '../ui/MovieCard.vue'
import AppBar from '../ui/AppBar.vue'
const movieStore = useMovieStore()
const movies = ref(movieStore.movies)
const currentPage = ref(1)
const search = ref('')
const MOVIES_PER_PAGE = 25
const changePage = (page) => {
  currentPage.value = page
  window.scrollTo(0, 0)
}
const searchMovies = computed(() => {
  if (search.value) {
    return movies.value.docs.filter((movie) =>
      movie.name.toLowerCase().includes(search.value.toLowerCase())
    )
  } else {
    return movies.value.docs
  }
})
const showMovies = computed(() => {
  const start = (currentPage.value - 1) * MOVIES_PER_PAGE
  const end = start + MOVIES_PER_PAGE
  if (!search.value) {
    const m = movieStore.sorting(movies.value.docs)
    return m.slice(start, end)
  } else {
    const m = movieStore.sorting(searchMovies.value)
    //changePage(1)
    return m.slice(start, end)
  }
})
const paginationLength = computed(() =>
  searchMovies.value.length
    ? Math.ceil(searchMovies.value.length / MOVIES_PER_PAGE)
    : 1
)
changePage(1)
</script>

<style scoped>
.v-col {
  width: 225px;
  max-width: 225px;
}
</style>