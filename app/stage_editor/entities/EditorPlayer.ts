import * as THREE from 'three';
import type { Vector3D } from '../types/stage-editor';

export class EditorPlayer {
  private mesh: THREE.Mesh;
  private material: THREE.MeshStandardMaterial;

  constructor() {
    // 自機を表す簡素な形状（Cone）
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
    // 上を向いているConeをZ軸負の方向（奥）に向かせる
    geometry.rotateX(Math.PI / 2);

    this.material = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      roughness: 0.5,
      metalness: 0.5
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    
    // SelectionManagerで識別するためのメタデータ
    this.mesh.userData = {
      type: 'player',
      id: 'player'
    };
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public update(position: Vector3D, isSelected: boolean) {
    if (!isSelected) {
      this.mesh.position.set(position.x, position.y, position.z);
    }
    
    // 選択状態に応じて色や強調表示を変える
    if (isSelected) {
      this.material.color.setHex(0x00ffff);
      this.material.emissive.setHex(0x004488);
    } else {
      this.material.color.setHex(0x0088ff);
      this.material.emissive.setHex(0x000000);
    }
  }
}
