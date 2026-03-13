import * as THREE from 'three';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { ProjectileManager } from './ProjectileManager';
import { EnemyManager } from './EnemyManager';
import { gameState } from '../core/GameState';
import { eventBus } from '../core/EventBus';

export class CollisionManager {
  constructor(
    private player: Player,
    private enemyManager: EnemyManager,
    private projectileManager: ProjectileManager
  ) {}

  update() {
    if (gameState.status !== 'playing') return;

    const enemies = this.enemyManager.getEnemies();
    const projectiles = this.projectileManager.getProjectiles();

    // プレイヤーの弾と敵の当たり判定
    for (const p of projectiles) {
      if (p.isEnemy || p.isDead) continue;

      for (const e of enemies) {
        if (e.isDead) continue;

        const dist = p.mesh.position.distanceTo(e.mesh.position);
        if (dist < p.radius + e.radius) {
          p.isDead = true;
          e.takeDamage(1);
          eventBus.emit('effect:hit', { position: p.mesh.position.clone() });
          
          if (e.isDead) {
            gameState.addScore(e.scoreValue);
            eventBus.emit('effect:explosion', { position: e.mesh.position.clone(), size: e.radius });
          }
          break;
        }
      }
    }

    if (this.player.isDead) return;

    // 敵の弾とプレイヤーの当たり判定
    for (const p of projectiles) {
      if (!p.isEnemy || p.isDead) continue;

      const dist = p.mesh.position.distanceTo(this.player.mesh.position);
      if (dist < p.radius + this.player.radius) {
        p.isDead = true;
        this.playerHit();
        break;
      }
    }

    // 敵本体とプレイヤーの当たり判定
    for (const e of enemies) {
      if (e.isDead) continue;
      const dist = e.mesh.position.distanceTo(this.player.mesh.position);
      if (dist < e.radius + this.player.radius) {
        e.isDead = true;
        eventBus.emit('effect:explosion', { position: e.mesh.position.clone(), size: e.radius });
        this.playerHit();
      }
    }
  }

  private playerHit() {
    eventBus.emit('effect:hit', { position: this.player.mesh.position.clone() });
    gameState.takeDamage(1);
    // カメラシェイクなどをEventBusで飛ばしても良い
  }
}
