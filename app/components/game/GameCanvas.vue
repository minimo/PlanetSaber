<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasRef" class="game-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gameApp } from '~/game/core/GameApp';
import { useResize } from '~/composables/useResize';
import { usePointerInput } from '~/composables/usePointerInput';
import { useGameLoop } from '~/composables/useGameLoop';

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  if (canvasRef.value) {
    await gameApp.init(canvasRef.value);
  }
});

onUnmounted(() => {
  gameApp.destroy();
});

// Update each frame
useGameLoop(() => {
  gameApp.update();
});

// Auto resize
useResize((width, height) => {
  gameApp.resize(width, height);
});

// Receive input events
usePointerInput(canvasRef);
</script>

<style scoped>
.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.game-canvas {
  display: block;
  outline: none;
}
</style>
