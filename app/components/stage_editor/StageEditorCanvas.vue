<template>
  <div class="canvas-container" ref="containerRef">
    <canvas ref="canvasRef" @pointerdown="onPointerDown" @pointerup="onPointerUp"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const { initApp, destroyApp, getApp } = useStageEditor();

const pointerDownPos = ref({ x: 0, y: 0 });
const pointerDownTime = ref(0);

const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0) return;
  pointerDownPos.value = { x: e.clientX, y: e.clientY };
  pointerDownTime.value = performance.now();
};

const onPointerUp = (e: PointerEvent) => {
  if (e.button !== 0) return;
  
  const dx = e.clientX - pointerDownPos.value.x;
  const dy = e.clientY - pointerDownPos.value.y;
  const distanceSq = dx * dx + dy * dy;
  const timeElapsed = performance.now() - pointerDownTime.value;
  
  // ドラッグではなく、クリックとみなせる場合(移動距離と時間で判定)
  if (distanceSq < 25 && timeElapsed < 500) {
    const app = getApp();
    if (!app || !canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    app.onClick(x, y, rect.width, rect.height, e as unknown as MouseEvent);
  }
};

const onResize = () => {
  const app = getApp();
  if (app && containerRef.value) {
    const w = containerRef.value.clientWidth;
    const h = containerRef.value.clientHeight;
    app.resize(w, h);
  }
};

onMounted(() => {
  if (canvasRef.value && containerRef.value) {
    initApp(canvasRef.value);
    onResize();
    window.addEventListener('resize', onResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  destroyApp();
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}
canvas {
  display: block;
  outline: none;
  width: 100%;
  height: 100%;
}
</style>
