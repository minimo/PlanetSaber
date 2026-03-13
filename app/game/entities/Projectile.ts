import * as THREE from 'three';
import type { GameObject, Collider } from '../types/entity';

export class Projectile implements GameObject, Collider {
  mesh: THREE.Mesh;
  isDead: boolean = false;
  radius: number = 0.2;
  
  velocity: THREE.Vector3;
  isEnemy: boolean;
  
  private lifeTime: number = 3.0; // 秒数で消滅

  constructor(position: THREE.Vector3, velocity: THREE.Vector3, isEnemy: boolean) {
    this.velocity = velocity;
    this.isEnemy = isEnemy;
    
    const geom = new THREE.SphereGeometry(this.radius, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: isEnemy ? 0xff00ff : 0x00ffff,
      transparent: true,
      opacity: 0.8
    });
    
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.position.copy(position);
  }

  update(dt: number) {
    if (this.isDead) return;

    this.mesh.position.addScaledVector(this.velocity, dt);
    
    this.lifeTime -= dt;
    if (this.lifeTime <= 0) {
      this.isDead = true;
    }
  }

  destroy() {
    // mesh materials dispose
    if (this.mesh.geometry) this.mesh.geometry.dispose();
    if (this.mesh.material) {
      (this.mesh.material as THREE.Material).dispose();
    }
  }
}
