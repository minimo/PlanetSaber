import * as THREE from 'three';

export interface GameObject {
  mesh: THREE.Object3D;
  isDead: boolean;
  update(dt: number, ...args: any[]): void;
  destroy(): void;
}

export interface Collider {
  radius: number;
}
