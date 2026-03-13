<template>
  <div class="stage-editor-layout">
    <div class="toolbar-area">
      <StageEditorToolbar />
      <PlaybackToolbar />
    </div>
    <div class="main-area">
      <div class="canvas-area">
        <ClientOnly>
          <StageEditorCanvas />
        </ClientOnly>
      </div>
      <div class="sidebar-area">
        <StageEditorSidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StageEditorCanvas from '~/components/stage_editor/StageEditorCanvas.vue';
import StageEditorToolbar from '~/components/stage_editor/StageEditorToolbar.vue';
import PlaybackToolbar from '~/components/stage_editor/PlaybackToolbar.vue';
import StageEditorSidebar from '~/components/stage_editor/StageEditorSidebar.vue';

definePageMeta({
  layout: false
});
</script>

<style scoped>
.stage-editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1a1a1a;
  color: #eeeeee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

.toolbar-area {
  min-height: 60px;
  background-color: #2c2c2c;
  border-bottom: 1px solid #3c3c3c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10;
}

.main-area {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.canvas-area {
  flex: 1;
  position: relative;
}

.sidebar-area {
  width: 320px;
  background-color: #242424;
  border-left: 1px solid #3c3c3c;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}
</style>
