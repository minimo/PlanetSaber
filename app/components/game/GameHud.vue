<template>
  <div class="game-hud">
    <div class="top-bar">
      <div class="score">SCORE: {{ score }}</div>
      <div class="life">
        LIFE: 
        <span v-for="n in Math.max(0, life)" :key="n" class="heart">★</span>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
    
    <!-- 照準（クロスヘア） -->
    <div 
      class="crosshair"
      :style="{ left: cursorX + 'px', top: cursorY + 'px', transform: 'translate(-50%, -50%)' }"
    >
      <div class="crosshair-h"></div>
      <div class="crosshair-v"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gameState } from '~/game/core/GameState';
import { eventBus } from '~/game/core/EventBus';

const score = ref(gameState.score);
const life = ref(gameState.life);
const progress = ref(gameState.progress);
const cursorX = ref(window.innerWidth / 2);
const cursorY = ref(window.innerHeight / 2);

const onScore = (val: number) => score.value = val;
const onLife = (val: number) => life.value = val;
const onProgress = (val: number) => progress.value = val;
const onPointer = ({ x, y }: { x: number; y: number }) => {
  // 正規化座標から画面座標へ計算し直す
  cursorX.value = ((x + 1) / 2) * window.innerWidth;
  cursorY.value = ((-y + 1) / 2) * window.innerHeight;
};

onMounted(() => {
  eventBus.on('state:score', onScore);
  eventBus.on('state:life', onLife);
  eventBus.on('state:progress', onProgress);
  eventBus.on('input:pointer', onPointer);
});

onUnmounted(() => {
  eventBus.off('state:score', onScore);
  eventBus.off('state:life', onLife);
  eventBus.off('state:progress', onProgress);
  eventBus.off('input:pointer', onPointer);
});
</script>

<style scoped>
.game-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* UIのクリックを透過させる */
  z-index: 10;
  color: #0ff;
  font-family: 'Courier New', Courier, monospace;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px #0ff;
}

.heart {
  color: #f0f;
  text-shadow: 0 0 10px #f0f;
  margin-right: 5px;
}

.progress-bar {
  position: absolute;
  bottom: 20px;
  left: 10%;
  width: 80%;
  height: 10px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #0ff;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #0ff;
  box-shadow: 0 0 10px #0ff;
  transition: width 0.1s linear;
}

.crosshair {
  position: absolute;
  width: 40px;
  height: 40px;
}

.crosshair-h, .crosshair-v {
  position: absolute;
  background-color: rgba(0, 255, 255, 0.8);
  box-shadow: 0 0 5px #0ff;
}

.crosshair-h {
  top: 19px;
  left: 0;
  width: 40px;
  height: 2px;
}

.crosshair-v {
  top: 0;
  left: 19px;
  width: 2px;
  height: 40px;
}
</style>
