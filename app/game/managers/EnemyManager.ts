import * as THREE from 'three';
import { Enemy } from '../entities/Enemy';
import { SmallEnemy } from '../entities/SmallEnemy';
import { MidEnemy } from '../entities/MidEnemy';
import { TurretEnemy } from '../entities/TurretEnemy';

export class EnemyManager {
  private enemies: Enemy[] = [];

  constructor(private scene: THREE.Scene) {}

  spawnHelper(type: string, posStr?: THREE.Vector3) {
    const pos = posStr || new THREE.Vector3(0, 0, -50);
    this.spawn(type, pos);
  }

  private spawn(type: string, position: THREE.Vector3) {
    let enemy: Enemy;
    switch (type) {
      case 'mid':
        enemy = new MidEnemy(position);
        break;
      case 'turret':
        enemy = new TurretEnemy(position);
        break;
      case 'small':
      default:
        enemy = new SmallEnemy(position);
        break;
    }
    this.enemies.push(enemy);
    this.scene.add(enemy.mesh);
  }

  update(dt: number, playerPos: THREE.Vector3) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt, playerPos);

      if (e.isDead) {
        e.destroy();
        this.scene.remove(e.mesh);
        this.enemies.splice(i, 1);
      }
    }
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }
  
  clear() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.destroy();
      this.scene.remove(e.mesh);
    }
    this.enemies = [];
  }
}
