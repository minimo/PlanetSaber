<template>
  <div class="sidebar">
    <div class="section-title">ステージエディタ</div>
    <div class="panels">
      <FilePanel />
      <hr class="divider" />
      <ObjectInspector />
      <hr class="divider" />
      <PathEditorPanel />
      <hr class="divider" />
      <EnemyListPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import FilePanel from './FilePanel.vue';
import ObjectInspector from './ObjectInspector.vue';
import PathEditorPanel from './PathEditorPanel.vue';
import EnemyListPanel from './EnemyListPanel.vue';
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  padding: 12px 16px;
  background-color: #1a1a1a;
  font-weight: bold;
  font-size: 16px;
  color: #8bb4f6;
  border-bottom: 1px solid #333;
}

.panels {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.divider {
  border: 0;
  border-top: 1px solid #3a3a3a;
  margin: 0;
}
</style>
