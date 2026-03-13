export type Vector3Like = { x: number; y: number; z: number };

export interface LevelData {
  speed: number;
  events: LevelEvent[];
}

export type LevelEvent = {
  progress: number;
  type: 'spawn_enemy';
  enemyType: string;
  position: Vector3Like;
};
