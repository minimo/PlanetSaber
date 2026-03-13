import { useStageEditor } from './useStageEditor';
import type { Vector3D } from '../../stage_editor/types/stage-editor';

export const useOrbitCamera = () => {
  const { getApp } = useStageEditor();
  
  const resetCamera = () => {
    const app = getApp();
    if (app) {
      app.camera.position.set(0, 10, 20);
      app.controls.target.set(0, 0, 0);
      app.camera.lookAt(0, 0, 0);
      app.controls.update();
    }
  };

  const focusOnPoint = (point: Vector3D) => {
    const app = getApp();
    if (app) {
      // ターゲットを注視点に設定し、少し離れた位置にカメラを置く
      app.camera.position.set(point.x, point.y + 10, point.z + 20);
      app.controls.target.set(point.x, point.y, point.z);
      app.camera.lookAt(point.x, point.y, point.z);
      app.controls.update();
    }
  };

  return { resetCamera, focusOnPoint };
};
