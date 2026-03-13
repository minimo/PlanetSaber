import * as THREE from 'three';
import { Projectile } from '../entities/Projectile';

export class ProjectileManager {
  private projectiles: Projectile[] = [];

  constructor(private scene: THREE.Scene) {}

  spawn(position: THREE.Vector3, velocity: THREE.Vector3, isEnemy: boolean) {
    const p = new Projectile(position, velocity, isEnemy);
    this.projectiles.push(p);
    this.scene.add(p.mesh);
  }

  update(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      
      if (p.isDead) {
        p.destroy();
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }
}
