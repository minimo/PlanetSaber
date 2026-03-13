import * as THREE from 'three';
import type { Vector3D } from '../types/stage-editor';

export class EditorEnemy {
  private mesh: THREE.Mesh;
  private material: THREE.MeshStandardMaterial;

  readonly id: string;
  public enemyType: string;

  constructor(id: string, type: string) {
    this.id = id;
    this.enemyType = type;

    // 敵を表す簡素な形状（Boxなど、typeによって変えても良い）
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // 種類に応じて初期色を変える
    const baseColor = type === 'boss' ? 0xff00ff : 0xff4400;

    this.material = new THREE.MeshStandardMaterial({ 
      color: baseColor,
      roughness: 0.6,
      metalness: 0.2
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    
    // SelectionManagerで識別するためのメタデータ
    this.mesh.userData = {
      type: 'enemy',
      id: this.id
    };
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public update(position: Vector3D, isSelected: boolean) {
    if (!isSelected) {
      this.mesh.position.set(position.x, position.y, position.z);
    }
    
    const baseColor = this.enemyType === 'boss' ? 0xff00ff : 0xff4400;

    // 選択状態に応じて色や強調表示を変える
    if (isSelected) {
      this.material.color.setHex(0xffffff);
      this.material.emissive.setHex(baseColor);
    } else {
      this.material.color.setHex(baseColor);
      this.material.emissive.setHex(0x000000);
    }
  }
}
