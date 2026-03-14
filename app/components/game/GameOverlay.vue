<template>
  <div class="overlay" :class="{ clear: status === 'clear' }">
    <div class="content">
      <div v-if="status === 'title'" class="title-container">
        <h1 class="title-main" data-text="PLANET SABER">PLANET SABER</h1>
        <div class="title-glitch"></div>
      </div>
      <h1 v-else-if="status === 'gameover'" class="danger">GAME OVER</h1>
      <h1 v-else-if="status === 'clear'" class="success">MISSION CLEAR</h1>
      
      <p v-if="isPaused" class="blink">PAUSED</p>

      <div class="instructions" v-if="status === 'title'">
        <button class="start-button" @click="onEnter">START MISSION</button><br/>
        <small>Mouse: Aim / Click: Shoot</small>
      </div>
      
      <div class="instructions" v-if="status === 'gameover' || status === 'clear'">
        Press <span class="key">R</span> to Retry
      </div>
      
      <div v-if="status === 'gameover' || status === 'clear'" class="final-score">
        FINAL SCORE: {{ score }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gameState, type GameStatus } from '~/game/core/GameState';
import { eventBus } from '~/game/core/EventBus';

const status = ref<GameStatus>(gameState.status);
const isPaused = ref(gameState.isPaused);
const score = ref(gameState.score);

const onStateChange = (state: any) => {
  status.value = state.status;
  isPaused.value = state.isPaused;
  score.value = state.score;
};

const onEnter = () => {
  if (status.value === 'title') {
    gameState.reset();
  }
};

const onRetry = () => {
  if (status.value === 'gameover' || status === 'clear') {
    gameState.reset();
  }
};

const onPause = () => {
  gameState.togglePause();
};

onMounted(() => {
  eventBus.on('state:changed', onStateChange);
  eventBus.on('state:gameover', () => status.value = 'gameover');
  eventBus.on('state:clear', () => status.value = 'clear');
  eventBus.on('state:pause', (paused: boolean) => isPaused.value = paused);
  
  // エンターキーによる開始を廃止
  // eventBus.on('input:enter', onEnter);
  eventBus.on('input:retry', onRetry);
  eventBus.on('input:pause', onPause);
});

onUnmounted(() => {
  eventBus.off('state:changed', onStateChange);
  // ...off others in actual code if needed
});
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 10, 0.8);
  backdrop-filter: blur(4px);
  color: #fff;
  text-align: center;
  font-family: 'Orbitron', 'Courier New', Courier, monospace;
}

.overlay.clear {
  background: rgba(0, 20, 40, 0.8);
}

.content {
  padding: 40px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  background: rgba(0, 10, 20, 0.5);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  border-radius: 10px;
}

.title-container {
  position: relative;
  margin-bottom: 40px;
  perspective: 1000px;
}

.title-main {
  font-size: 84px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 12px;
  color: #fff;
  text-transform: uppercase;
  position: relative;
  /* メタリックな質感のためのグラデーションテキスト */
  background: linear-gradient(to bottom, #fff 0%, #bbb 50%, #888 51%, #ddd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* グローを控えめに抑える */
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.4));
  /* アニメーションを削除 */
}

/* 背後のグロー効果を整理 */
.title-main::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: initial;
  background: none;
  /* 複数のシャドウを整理し、ソリッドな印象に */
  text-shadow: 
    1px 1px 0px rgba(0, 255, 255, 0.3),
    -1px -1px 0px rgba(0, 255, 255, 0.3);
}

.title-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    rgba(0, 255, 255, 0.03) 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 5;
}

.start-button {
  background: rgba(0, 255, 255, 0.1);
  border: 2px solid #0ff;
  color: #0ff;
  padding: 15px 40px;
  font-size: 28px;
  font-family: inherit;
  cursor: pointer;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 3px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(0, 255, 255, 0.3),
    transparent
  );
  transition: all 0.5s;
}

.start-button:hover {
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
  transform: scale(1.1);
  letter-spacing: 5px;
}

.start-button:hover::before {
  left: 100%;
}

.start-button:active {
  transform: scale(0.95);
  background: rgba(0, 255, 255, 0.4);
}

.danger {
  color: #f0f;
  text-shadow: 0 0 20px #f0f;
}

.success {
  color: #0f0;
  text-shadow: 0 0 20px #0f0;
}

.blink {
  animation: bg-blink 1s infinite alternate;
  font-size: 32px;
  color: #ff0;
  text-shadow: 0 0 10px #ff0;
}

.instructions {
  font-size: 24px;
  margin-top: 30px;
  line-height: 1.5;
}

.key {
  display: inline-block;
  padding: 5px 15px;
  border: 1px solid #0ff;
  border-radius: 5px;
  background: rgba(0, 255, 255, 0.1);
  font-weight: bold;
}

.final-score {
  margin-top: 20px;
  font-size: 32px;
  font-weight: bold;
  color: #ff0;
}

@keyframes bg-blink {
  0% { opacity: 1; }
  100% { opacity: 0.3; }
}
</style>
