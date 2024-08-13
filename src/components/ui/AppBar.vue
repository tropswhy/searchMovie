<template>
  <v-toolbar
    density="default"
    scroll-behavior="hide"
  >
    <v-toolbar-title
      class="logo"
      @click="$router.push('/')"
    >
      ПоискКино
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn @click="$router.push('/markers')"> Закладки </v-btn>
      <v-divider
        class="align-self-center"
        length="50"
        vertical
      />
      <v-btn :disabled="$route.name === 'movieCard' ? true : false">
        Сортировка
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(item) in sortingParametrs"
              :key="item.id"
              :value="item.parametr"
              @click="sortHandler(item.parametr)"
            >
              <v-list-item-title>
                <v-icon class="mx-auto"> mdi-sort </v-icon>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup>
import { useMovieStore } from '../../stores/MovieStore.js'
const sortingParametrs = [
  { id: 1, title: 'По названию', parametr: 'title' },
  { id: 2, title: 'По году выхода', parametr: 'year' },
  { id: 3, title: 'По средней оценке', parametr: 'score' },
  { id: 4, title: 'По хронометражу', parametr: 'timing' },
]
const movieStore = useMovieStore()
const sortHandler = (param) => {
  if (param === movieStore.currentSorting) {
    movieStore.currentSorting = '-' + param
  } else {
    movieStore.currentSorting = param
  }
}
</script>

<style lang="scss" scoped>
.logo {
  cursor: pointer;
}
</style>
