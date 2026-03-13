<template>
  <div class="game-container" :class="{ 'hide-cursor': status === 'playing' && !isPaused }">
    <GameCanvas />
    <GameHud v-if="status === 'playing'" />
    <GameOverlay v-if="status !== 'playing' || isPaused" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gameState } from '~/game/core/GameState';
import { eventBus } from '~/game/core/EventBus';

const status = ref(gameState.status);
const isPaused = ref(gameState.isPaused);

onMounted(() => {
  eventBus.on('state:changed', (state: any) => {
    status.value = state.status;
    isPaused.value = state.isPaused;
  });
  eventBus.on('state:gameover', () => status.value = 'gameover');
  eventBus.on('state:clear', () => status.value = 'clear');
  eventBus.on('state:pause', (paused: boolean) => isPaused.value = paused);
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.game-container.hide-cursor,
.game-container.hide-cursor * {
  cursor: none !important;
}
</style>
