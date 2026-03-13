<template>
  <div class="panel file-panel">
    <div class="panel-header">ファイル入出力</div>
    <div class="panel-content">
      <div class="prop-row">
        <label>Stage ID:</label>
        <input type="text" v-model="state.data.stageId" />
      </div>
      
      <div class="actions">
        <button class="btn-primary" @click="handleExport">📥 JSONで保存</button>
        
        <div class="file-upload-wrapper">
          <button class="btn-secondary">📤 JSONを読込</button>
          <input type="file" accept=".json" @change="handleImport" class="file-input" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';
import { SerializationManager } from '../../stage_editor/core/SerializationManager';

const { state, getApp } = useStageEditor();

const handleExport = () => {
  const jsonStr = SerializationManager.exportToJson(state.data);
  const filename = `${state.data.stageId || 'stage'}.json`;
  SerializationManager.downloadJsonFile(jsonStr, filename);
};

const handleImport = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const data = await SerializationManager.loadJsonFile(file);
    if (data) {
      state.loadData(data);
      // Data changed significantly, force an update in threejs scene just in case watcher misses some deep nested object initialization
      const app = getApp();
      if (app) {
        app.syncEntities();
      }
    } else {
      alert("JSONファイルの読み込みに失敗しました。フォーマットを確認してください。");
    }
    // reset input
    target.value = '';
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
.prop-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.prop-row input {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 4px 8px;
  border-radius: 4px;
  width: 150px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.btn-primary, .btn-secondary {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}
.btn-primary {
  background: #1976d2;
  color: white;
}
.btn-primary:hover {
  background: #1565c0;
}
.btn-secondary {
  background: #424242;
  color: white;
  border: 1px solid #555;
}
.btn-secondary:hover {
  background: #555;
}
.file-upload-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
}
.file-input {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  height: 100%;
}
</style>
