import type { LevelData } from '../types/game';

export const stage1: LevelData = {
  speed: 10,
  events: [
    { progress: 5, type: 'spawn_enemy', enemyType: 'small', position: { x: 0, y: 0, z: -50 } },
    { progress: 10, type: 'spawn_enemy', enemyType: 'small', position: { x: -5, y: 2, z: -50 } },
    { progress: 12, type: 'spawn_enemy', enemyType: 'small', position: { x: 5, y: -2, z: -50 } },
    
    // turret
    { progress: 20, type: 'spawn_enemy', enemyType: 'turret', position: { x: -8, y: -5, z: -60 } },
    { progress: 25, type: 'spawn_enemy', enemyType: 'turret', position: { x: 8, y: 5, z: -60 } },
    
    // mid
    { progress: 40, type: 'spawn_enemy', enemyType: 'mid', position: { x: 0, y: 0, z: -60 } },

    // rush
    { progress: 60, type: 'spawn_enemy', enemyType: 'small', position: { x: -3, y: 0, z: -50 } },
    { progress: 62, type: 'spawn_enemy', enemyType: 'small', position: { x: 0, y: 3, z: -50 } },
    { progress: 64, type: 'spawn_enemy', enemyType: 'small', position: { x: 3, y: 0, z: -50 } },
    { progress: 66, type: 'spawn_enemy', enemyType: 'small', position: { x: 0, y: -3, z: -50 } },
    
    // final defense
    { progress: 80, type: 'spawn_enemy', enemyType: 'turret', position: { x: -5, y: -5, z: -60 } },
    { progress: 80, type: 'spawn_enemy', enemyType: 'turret', position: { x: 5, y: -5, z: -60 } },
    { progress: 85, type: 'spawn_enemy', enemyType: 'mid', position: { x: -5, y: 5, z: -60 } },
    { progress: 85, type: 'spawn_enemy', enemyType: 'mid', position: { x: 5, y: 5, z: -60 } },
  ]
};
