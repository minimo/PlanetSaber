<template>
  <div class="panel path-editor">
    <div class="panel-header">パス編集 ({{ targetName }})</div>
    <div class="panel-content" v-if="pathData && pathData.length > 0">
      <ul class="point-list">
        <li v-for="(p, i) in pathData" :key="i" class="point-item">
          <span class="index">#{{ i }}</span>
          <div class="coord-inputs small">
            <input type="number" v-model.number="p.x" step="0.5" title="X"/>
            <input type="number" v-model.number="p.y" step="0.5" title="Y"/>
            <input type="number" v-model.number="p.z" step="0.5" title="Z"/>
          </div>
          <button @click="removePoint(i)" class="btn-remove" title="削除">✕</button>
        </li>
      </ul>
      <button class="btn-clear" @click="clearPath">パスをすべてクリア</button>
    </div>
    <div class="panel-content empty" v-else-if="pathData">
      <p>パスポイントがありません。ツールバーから追加モードにして3D領域をクリックしてください。</p>
    </div>
    <div class="panel-content empty" v-else>
      <p>自機または敵を選択するとパスを編集できます。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';

const { state, getApp } = useStageEditor();

const targetName = computed(() => {
  if (state.selection.type === 'player') return '自機';
  if (state.selection.type === 'enemy') return '敵';
  return '未選択';
});

const pathData = computed(() => {
  if (state.selection.type === 'player') {
    return state.data.player.path;
  }
  if (state.selection.type === 'enemy' && state.selection.id) {
    const enemy = state.data.enemies.find(e => e.id === state.selection.id);
    return enemy ? enemy.path : null;
  }
  return null;
});

const removePoint = (index: number) => {
  if (pathData.value) {
    pathData.value.splice(index, 1);
  }
};

const clearPath = () => {
  if (pathData.value) {
    pathData.value.splice(0, pathData.value.length);
  }
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
.panel-content.empty {
  color: #888;
  font-style: italic;
  text-align: center;
}
.point-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  max-height: 200px;
  overflow-y: auto;
}
.point-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2a2a2a;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}
.index {
  color: #888;
  width: 20px;
  font-size: 11px;
}
.coord-inputs.small input {
  width: 44px;
  background: #1e1e1e;
  color: #fff;
  border: 1px solid #444;
  padding: 2px 4px;
  border-radius: 2px;
  margin-right: 2px;
}
.btn-remove {
  background: transparent;
  color: #ff5252;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-remove:hover {
  background: #ff525233;
}
.btn-clear {
  width: 100%;
  background: #3a2222;
  color: #ff8888;
  border: 1px solid #553333;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-clear:hover {
  background: #4a2222;
}
</style>
