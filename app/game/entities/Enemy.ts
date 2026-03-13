import * as THREE from 'three';
import type { GameObject, Collider } from '../types/entity';

export abstract class Enemy implements GameObject, Collider {
  mesh: THREE.Group;
  isDead: boolean = false;
  radius: number = 1.0;
  
  maxHp: number = 1;
  hp: number = 1;
  scoreValue: number = 100;

  constructor(position: THREE.Vector3) {
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    // NOTE: Here you could emit hit effect
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  abstract update(dt: number, playerPos: THREE.Vector3): void;

  destroy() {
    // mesh cleanup
    this.mesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      }
    });
  }
}
