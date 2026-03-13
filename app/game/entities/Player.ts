import * as THREE from 'three';
import type { GameObject, Collider } from '../types/entity';
import { eventBus } from '../core/EventBus';

export class Player implements GameObject, Collider {
  mesh: THREE.Group;
  isDead: boolean = false;
  radius: number = 0.5;

  private targetX: number = 0;
  private targetY: number = 0;
  private baseZ: number = 5;

  private lastFireTime: number = 0;
  private fireInterval: number = 0.15; // sec

  constructor() {
    this.mesh = new THREE.Group();
    this.buildMesh();

    // 照準入力の購読
    eventBus.on('input:pointer', this.onPointer);
    eventBus.on('input:fire', this.onFire);
  }

  private buildMesh() {
    this.mesh.position.set(0, 0, this.baseZ);
  }

  private onPointer = ({ x, y }: { x: number; y: number }) => {
    // 正規化座標（-1 ~ 1）から移動範囲へ
    // 少し遅れて追従するような実装にしても良いが、ここでは直接目標位置を変える
    this.targetX = x * 8; // 横の稼働範囲
    this.targetY = y * 5; // 縦の稼働範囲
  };

  private onFire = (data?: {x: number, y: number}) => {
    if (!data) return;
    const now = performance.now() / 1000;
    if (now - this.lastFireTime > this.fireInterval) {
      this.lastFireTime = now;
      eventBus.emit('action:player_fire_laser', data);
    }
  };

  update(dt: number) {
    if (this.isDead) return;

    // 現在地から目標へのスムーズな補間（Lerp）
    this.mesh.position.x += (this.targetX - this.mesh.position.x) * dt * 5;
    this.mesh.position.y += (this.targetY - this.mesh.position.y) * dt * 5;

    // 機体の傾き（バンク角）
    this.mesh.rotation.z = -(this.mesh.position.x - this.targetX) * 0.2;
    this.mesh.rotation.x = -(this.mesh.position.y - this.targetY) * 0.1;
  }

  destroy() {
    eventBus.off('input:pointer', this.onPointer);
    eventBus.off('input:fire', this.onFire);
    
    // MaterialDisposeなどは本来ここで行う
    // ...
  }
}
