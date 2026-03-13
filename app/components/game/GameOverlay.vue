<template>
  <div class="overlay" :class="{ clear: status === 'clear' }">
    <div class="content">
      <h1 v-if="status === 'title'">PLANET SABER</h1>
      <h1 v-else-if="status === 'gameover'" class="danger">GAME OVER</h1>
      <h1 v-else-if="status === 'clear'" class="success">MISSION CLEAR</h1>
      
      <p v-if="isPaused" class="blink">PAUSED</p>

      <div class="instructions" v-if="status === 'title'">
        Press <span class="key">ENTER</span> to Start<br/>
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
  
  eventBus.on('input:enter', onEnter);
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
  color: #0ff;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
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

h1 {
  font-size: 64px;
  margin: 0 0 20px 0;
  text-shadow: 0 0 20px #0ff;
  letter-spacing: 5px;
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
