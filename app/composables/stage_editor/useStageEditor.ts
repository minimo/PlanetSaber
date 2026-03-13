import { ref, watchEffect } from 'vue';
import { StageEditorState } from '../../stage_editor/core/StageEditorState';
import { StageEditorApp } from '../../stage_editor/core/StageEditorApp';

// グローバルなシングルトンインスタンスとして管理（ページ遷移などで破棄が必要な場合は工夫するが今回はエディタ専用）
const editorState = new StageEditorState();
let editorApp: StageEditorApp | null = null;

export const useStageEditor = () => {
  const isReady = ref(false);

  const initApp = (canvas: HTMLCanvasElement) => {
    if (editorApp) {
      editorApp.destroy();
    }
    
    // キャンバスのコンテキスト調整（DPI等）
    const dpr = window.devicePixelRatio || 1;
    // renderer側でsetPixelRatioしているのでCanvasのCSSサイズだけ合わせる
    
    editorApp = new StageEditorApp(canvas, editorState);
    isReady.value = true;
    
    // Vueのリアクティブな状態が変更されるたびにThree.js側に伝える
    watchEffect(() => {
      // 依存関係を収集するため、意図的にアクセス
      const d = editorState.data;
      const s = editorState.selection;
      
      // データ全体や選択状態が変わった際に画面を同期
      editorApp?.syncEntities();
    });
  };

  const destroyApp = () => {
    if (editorApp) {
      editorApp.destroy();
      editorApp = null;
      isReady.value = false;
    }
  };
  
  const getApp = () => editorApp;

  return {
    state: editorState,
    initApp,
    destroyApp,
    getApp,
    isReady
  };
};
