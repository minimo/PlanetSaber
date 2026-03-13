import * as THREE from 'three';
import { EnemyManager } from './EnemyManager';
import { gameState } from '../core/GameState';
import type { LevelData } from '../types/game';

export class StageManager {
  private currentEventIndex = 0;

  constructor(
    private enemyManager: EnemyManager,
    private levelData: LevelData
  ) {}

  update(dt: number) {
    if (gameState.status !== 'playing') return;

    // 定期的な（ステージ進行に応じた）敵生成イベント処理
    while (
      this.currentEventIndex < this.levelData.events.length &&
      gameState.progress >= this.levelData.events[this.currentEventIndex].progress
    ) {
      const ev = this.levelData.events[this.currentEventIndex];
      if (ev.type === 'spawn_enemy') {
        const tempVec = new THREE.Vector3(ev.position.x, ev.position.y, ev.position.z);
        this.enemyManager.spawnHelper(ev.enemyType, tempVec);
      }
      this.currentEventIndex++;
    }
  }

  reset() {
    this.currentEventIndex = 0;
  }
}
