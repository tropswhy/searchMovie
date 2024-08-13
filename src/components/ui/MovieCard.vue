<template>
  <v-card
    class="ma-1 pa-1"
    :height="$route.path === '/markers' ? '475px' : '450px'"
    max-width="200px"
    hover
  >
    <v-btn
      v-if="$route.path === '/markers'"
      class="text-subtitle-1 mx-auto mb-2"
      variant="elevated"
      size="regular"
      text="Убрать из закладок"
      density="compact"
      append-icon="mdi-bookmark-remove-outline"
      outlined
      @click="$emit('unmarkMovie', movie.name)"
    />
    <div
      @click="
        $router.push({
          name: 'movieCard',
          params: {
            movieId: movie.id,
          },
        })
      "
    >
      <v-img
        height="300px"
        :src="poster"
        cover
      />
      <v-card-title>
        {{ name }}
      </v-card-title>
      <v-card-subtitle>
        <p>{{ 'Средняя оценка: ' + score }}</p>
        <p>{{ year + ' года выпуска' }}</p>
      </v-card-subtitle>
      <v-btn
        text="Узнать больше..."
        density="compact"
        class="mt-3"
      />
    </div>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['unmarkMovie'])
const movie = defineProps(['name', 'score', 'year', 'poster', 'id'])
</script>