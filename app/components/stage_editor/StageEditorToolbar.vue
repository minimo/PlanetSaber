<template>
  <div class="toolbar">
    <div class="tool-group">
      <button @click="state.undo()" class="text-btn" title="Undo (Ctrl+Z)">Undo</button>
      <button @click="state.redo()" class="text-btn" title="Redo (Ctrl+Y)">Redo</button>
      
      <div class="separator"></div>

      <button 
        :class="{ active: currentMode === 'select' }" 
        @click="setMode('select')"
      >🖱️ 選択</button>
      
      <button 
        :class="{ active: currentMode === 'place_player' }" 
        @click="setMode('place_player')"
      >🚀 自機配置</button>
      <button 
        :class="{ active: currentMode === 'edit_player_path' }" 
        @click="setMode('edit_player_path')"
      >📍 自機パス追加</button>
      
      <button 
        :class="{ active: currentMode === 'place_enemy' }" 
        @click="setMode('place_enemy')"
      >👾 敵配置</button>
      <button 
        :class="{ active: currentMode === 'edit_enemy_path' }" 
        @click="setMode('edit_enemy_path')"
        :disabled="!canEditEnemyPath"
      >🚩 敵パス追加</button>
      
      <div class="separator"></div>
      
      <button 
        :class="{ active: gizmoMode === 'translate' }" 
        @click="setGizmoMode('translate')"
        class="gizmo-btn"
      >↔️ 移動</button>
      <button 
        :class="{ active: gizmoMode === 'rotate' }" 
        @click="setGizmoMode('rotate')"
        class="gizmo-btn"
      >🔄 回転</button>
    </div>
    
    <div class="tool-group-right">
      <button @click="resetCamera">🎥 カメラリセット</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';
import { useOrbitCamera } from '../../composables/stage_editor/useOrbitCamera';
import type { EditorModeType } from '../../stage_editor/types/stage-editor';

const { state } = useStageEditor();
const { resetCamera } = useOrbitCamera();

const currentMode = computed(() => state.currentMode.value);
const gizmoMode = computed(() => state.gizmoMode.value);

const canEditEnemyPath = computed(() => {
  return state.selection.type === 'enemy' && state.selection.id !== null;
});

const setMode = (mode: EditorModeType) => {
  state.setMode(mode);
};

const setGizmoMode = (mode: 'translate' | 'rotate') => {
  state.gizmoMode.value = mode;
};
</script>

<style scoped>
.toolbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.tool-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.separator {
  width: 1px;
  height: 24px;
  background-color: #555;
  margin: 0 8px;
}

button {
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #555;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

button.gizmo-btn {
  background-color: #2c3e50;
  border-color: #34495e;
}

button:hover:not(:disabled) {
  background-color: #4e4e4e;
}

button.active {
  background-color: #2196f3;
  border-color: #1976d2;
}

button.gizmo-btn.active {
  background-color: #e67e22;
  border-color: #d35400;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.icon-btn, .text-btn {
  background: #3e3e3e;
  border: 1px solid #555;
  color: #fff;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 0 8px;
  transition: background 0.2s;
}
.icon-btn:hover, .text-btn:hover {
  background: #4e4e4e;
}
</style>
