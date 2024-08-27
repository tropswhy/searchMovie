<template>
  <AppBar />
  <v-card
    class="my-5 mx-auto"
    :title="movie.name"
    :subtitle="movie.alternativeName"
    width="1000"
  >
    <template v-slot:append>
      <v-btn
        width="250px"
        :text="checkTextMark"
        :prepend-icon="checkIconMark"
        @click="changeMark()"
      />
    </template>
    <v-divider />
    <v-container>
      <v-row
        justify="start"
        class="mb-5"
        no-gutters
      >
        <v-col cols="4">
          <v-img
            :src="movie.poster.url"
            height="auto"
            width="300px"
            cover
          />
        </v-col>
        <v-col>
          <h3 class="ml-4">О фильме:</h3>
          <v-list lines="one">
            <v-list-item
              v-for="item in aboutMovie"
              :key="item.id"
              :title="item.title + item.value"
              :value="item.value"
            >
              <v-divider />
            </v-list-item>
          </v-list>
          <v-container class="text-center">
            <v-card-action>
              <div class="d-flex">
                Оценка пользователя:
                {{ movieLS.rating > 0 ? movieLS.rating : '' }}
              </div>
              <v-rating
                v-model="movieLS.rating"
                hover
                half-increments
                length="10"
                clearable
                class="mb-0"
                @update:modelValue="
                  movieStore.changeDataAtLocalStorage(
                    movie.id,
                    movie.name,
                    movieLS.rating,
                    movieLS.isMark
                  )
                "
              />
            </v-card-action>
          </v-container>
        </v-col>
      </v-row>
      <v-divider />
      <strong>Описание:</strong>
      <p class="mx-auto">{{ movie.description }}</p>
    </v-container>
  </v-card>
  <v-card
    title="Вам также может понравится:"
    class="my-5 mx-auto"
    width="1000"
  >
    <v-container>
      <v-row
        justify="start"
        align="center"
        class="mb-5"
      >
        <v-col
          class="text-center"
          cols="auto"
          v-for="movie in recomendations"
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
    </v-container>
  </v-card>
</template>

<script setup>
import { useMovieStore } from '../../stores/MovieStore.js'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../ui/MovieCard.vue'
import AppBar from '../ui/AppBar.vue'
const movieStore = useMovieStore()
const route = useRoute()
const movieId = computed(() => route.params.movieId)
const movie = computed(() => movieStore.getMovieById(movieId.value))
const movieLS = ref({})
const forCheck = JSON.parse(localStorage.getItem(movieId.value.toString()))
window.scrollTo(0, 0)
if (!forCheck) {
  movieStore.addMovieToLocalStorage(movie.value)
}
movieLS.value = JSON.parse(localStorage.getItem(movieId.value.toString()))
function changeMark() {
  movieLS.value.isMark = !movieLS.value.isMark
  movieStore.changeDataAtLocalStorage(
    movie.value.id,
    movie.value.name,
    movieLS.value.rating,
    movieLS.value.isMark
  )
}
const checkTextMark = computed(() =>
  movieLS.value.isMark ? 'Убрать из закладок' : 'Добавить в закладки'
)
const checkIconMark = computed(() =>
  movieLS.value.isMark
    ? 'mdi-bookmark-remove-outline'
    : 'mdi-bookmark-plus-outline'
)
const recomendations = computed(() => {
  return movieStore.movies.docs
    .filter((movieRec) => {
      return (
        movieRec.year >= movie.value.year - 3 &&
        movieRec.year <= movie.value.year + 3 &&
        movieRec.id !== movie.value.id
      )
    })
    .slice(0, 4)
})
const aboutMovie = [
  {
    id: 1,
    title: 'Год производства: ',
    value: movie.value.year,
  },
  {
    id: 2,
    title: 'Длительность: ',
    value: movie.value.movieLength + ' минут',
  },
  {
    id: 3,
    title: 'Оценка на КиноПоиске: ',
    value: movie.value.rating.kp,
  },
  {
    id: 4,
    title: 'Оценка на IMDb: ',
    value: movie.value.rating.imdb,
  },
  {
    id: 5,
    title: 'Рейтинг критиков: ',
    value:
      movie.value.rating.filmCritics > 0
        ? movie.value.rating.filmCritics
        : 'Рейтинг отсутствует',
  },
  {
    id: 6,
    title: 'Рейтинг российских критиков: ',
    value:
      movie.value.rating.russianFilmCritics > 0
        ? movie.value.rating.russianFilmCritics
        : 'Рейтинг отсутствует',
  },
]
</script>
