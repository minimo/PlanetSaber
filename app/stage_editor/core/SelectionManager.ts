import * as THREE from 'three';
import { StageEditorState } from './StageEditorState';

export class SelectionManager {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  // 選択可能なオブジェクト群を入れるグループ
  private selectableMeshes: THREE.Object3D[] = [];
  
  // Y座標0に配置された水平な面。地面クリック判定用
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  constructor(
    private camera: THREE.Camera, 
    private state: StageEditorState
  ) {}

  public setSelectableMeshes(meshes: THREE.Object3D[]) {
    this.selectableMeshes = meshes;
  }

  public getIntersectionPositionFromScreen(x: number, y: number, width: number, height: number): THREE.Vector3 | null {
    this.mouse.x = (x / width) * 2 - 1;
    this.mouse.y = -(y / height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Y=0の平面との交点を計算（グリッド上への配置用）
    const target = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.groundPlane, target)) {
      return target;
    }
    return null;
  }

  public getIntersectedObject(x: number, y: number, width: number, height: number): THREE.Intersection | null {
    this.mouse.x = (x / width) * 2 - 1;
    this.mouse.y = -(y / height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObjects(this.selectableMeshes, true);
    if (intersects.length > 0) {
      return intersects[0];
    }
    return null;
  }

  public handlePointerDown(x: number, y: number, width: number, height: number): boolean {
    const currentMode = this.state.currentMode.value;

    if (currentMode === 'select') {
      const intersect = this.getIntersectedObject(x, y, width, height);
      if (intersect) {
        // user metadataを使用してIDや型を判定する想定
        const userData = intersect.object.userData;
        if (userData && userData.type) {
          this.state.setSelection(userData.type, userData.id, userData.pointIndex);
          return true; // 選択成功
        }
      } else {
        // 何もクリックしていなければ選択解除
        this.state.clearSelection();
      }
      return false;
    } 
    else {
      // 空間配置モード (place_player, place_enemy, etc.)
      const pos = this.getIntersectionPositionFromScreen(x, y, width, height);
      if (!pos) return false;

      // 丸めて配置
      const placementPos = {
        x: Math.round(pos.x),
        y: Math.max(0, Math.round(pos.y)),
        z: Math.round(pos.z)
      };

      if (currentMode === 'place_player') {
        this.state.data.player.startPosition = placementPos;
        this.state.setSelection('player');
        this.state.setMode('select');
      } 
      else if (currentMode === 'place_enemy') {
        this.state.addEnemy(placementPos);
        this.state.setMode('select');
      }
      else if (currentMode === 'edit_player_path') {
        this.state.addPlayerPathPoint(placementPos);
      }
      else if (currentMode === 'edit_enemy_path') {
        const selectedEnemyId = this.state.selection.id;
        if (selectedEnemyId && this.state.selection.type === 'enemy') {
          this.state.addEnemyPathPoint(selectedEnemyId, placementPos);
        } else {
          console.warn('Cannot place enemy path: No enemy selected or invalid selection type.');
        }
      }
      return true;
    }
  }
}
