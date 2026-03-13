<template>
  <div class="panel enemy-list">
    <div class="panel-header">配置済み敵リスト ({{ enemies.length }})</div>
    <div class="panel-content">
      <ul class="list" v-if="enemies.length > 0">
        <li 
          v-for="e in enemies" :key="e.id"
          :class="['list-item', { selected: selectedId === e.id }]"
          @click="selectEnemy(e.id)"
        >
          <span class="type-badge" :class="e.type">{{ e.type }}</span>
          <span class="time">T: {{ e.spawnTime }}s</span>
          <button class="btn-delete" @click.stop="removeEnemy(e.id)">削除</button>
        </li>
      </ul>
      <div v-else class="empty-list">敵は配置されていません。</div>
      
      <div class="add-new">
        <div class="sub-header">次に追加する敵の設定</div>
        <div class="prop-row">
          <label>Type:</label>
          <select v-model="state.nextEnemyType.value">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="boss">Boss</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';

const { state } = useStageEditor();

const enemies = computed(() => state.data.enemies);
const selectedId = computed(() => {
  return state.selection.type === 'enemy' ? state.selection.id : null;
});

const selectEnemy = (id: string) => {
  state.setSelection('enemy', id);
};

const removeEnemy = (id: string) => {
  state.removeEnemy(id);
};
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
}
.panel-header {
  font-size: 14px;
  font-weight: bold;
  color: #aeb4c4;
  margin-bottom: 8px;
}
.panel-content {
  font-size: 13px;
  color: #ccc;
  background: #1e1e1e;
  padding: 12px;
  border-radius: 4px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  max-height: 150px;
  overflow-y: auto;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a2a2a;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  border: 1px solid transparent;
}
.list-item:hover {
  background: #333;
}
.list-item.selected {
  border-color: #4caf50;
  background: #2a3a2a;
}
.type-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  background: #555;
  color: #fff;
  text-transform: uppercase;
  width: 50px;
  text-align: center;
}
.type-badge.small { background: #ff9800; }
.type-badge.medium { background: #f44336; }
.type-badge.boss { background: #9c27b0; }

.time {
  color: #aaa;
  font-family: monospace;
}

.sub-header {
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.prop-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.prop-row select {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 4px 8px;
  border-radius: 4px;
  flex: 1;
  margin-left: 8px;
}
.btn-delete {
  background: transparent;
  color: #ff5252;
  border: 1px solid #ff525255;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}
.btn-delete:hover {
  background: #ff525233;
}
.empty-list {
  color: #888;
  font-style: italic;
  text-align: center;
  margin-bottom: 16px;
}
</style>
