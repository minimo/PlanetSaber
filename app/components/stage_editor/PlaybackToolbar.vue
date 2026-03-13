<template>
  <div class="playback-toolbar">
    <div class="playback-controls">
      <button @click="togglePlay" class="play-btn" :class="{ playing: isPlaying }">
        {{ isPlaying ? '⏸ 一時停止' : '▶ 再生' }}
      </button>
      <button @click="stop" class="stop-btn">◼ 停止</button>
      
      <div class="separator"></div>
      
      <div class="mode-selector">
        <label>再生範囲:</label>
        <select v-model="playbackMode">
          <option value="all">ワールド全体</option>
          <option value="player">自機のみ</option>
          <option value="enemy">選択中の敵のみ</option>
        </select>
      </div>
    </div>
    
    <div class="timeline-container">
      <span class="time-label">{{ formatTime(currentTime) }}</span>
      <input 
        type="range" 
        :min="0" 
        :max="maxTime" 
        step="0.01" 
        v-model.number="currentTime"
        @input="onSeek"
        class="seek-bar"
      />
      <span class="time-label">{{ formatTime(maxTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';
import { PlaybackManager } from '../../stage_editor/core/PlaybackManager';

const { state } = useStageEditor();

const isPlaying = computed(() => state.isPlaying.value);
const playbackMode = computed({
  get: () => state.playbackMode.value,
  set: (val) => { state.playbackMode.value = val; }
});

const currentTime = computed({
  get: () => state.currentTime.value,
  set: (val) => { state.currentTime.value = val; }
});

const maxTime = computed(() => state.maxTime.value);

// 最大時間の計算
watch(() => state.data, () => {
  updateMaxTime();
}, { deep: true, immediate: true });

function updateMaxTime() {
  let total = 0;
  // 自機のパス時間
  const playerTime = PlaybackManager.calculateTotalTime(0, state.data.player.path);
  total = Math.max(total, playerTime);
  
  // 敵のパス時間（出現時間 + パス時間）
  state.data.enemies.forEach(e => {
    const enemyTime = PlaybackManager.calculateTotalTime(e.spawnTime, e.path);
    total = Math.max(total, enemyTime);
  });
  
  state.maxTime.value = total || 10; // デフォルト10秒
}

const togglePlay = () => {
  state.isPlaying.value = !state.isPlaying.value;
  if (state.isPlaying.value && state.currentTime.value >= state.maxTime.value) {
    state.currentTime.value = 0;
  }
};

const stop = () => {
  state.isPlaying.value = false;
  state.currentTime.value = 0;
};

const onSeek = () => {
  // 再生中にシークした場合は一時停止せずに継続
};

const formatTime = (seconds: number) => {
  return seconds.toFixed(2) + 's';
};
</script>

<style scoped>
.playback-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #252525;
  padding: 10px 15px;
  border-bottom: 1px solid #333;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

button {
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #555;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  min-width: 100px;
}

button:hover {
  background-color: #4e4e4e;
}

button.play-btn.playing {
  background-color: #27ae60;
  border-color: #2ecc71;
}

.separator {
  width: 1px;
  height: 20px;
  background-color: #444;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #ccc;
}

.mode-selector select {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
  padding: 4px 8px;
  border-radius: 4px;
}

.timeline-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-label {
  font-family: monospace;
  font-size: 12px;
  color: #888;
  min-width: 45px;
}

.seek-bar {
  flex: 1;
  accent-color: #2196f3;
  cursor: pointer;
}
</style>
