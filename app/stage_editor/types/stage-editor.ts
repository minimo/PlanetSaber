export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Euler3D {
  x: number;
  y: number;
  z: number;
}

export interface PathPoint {
  position: Vector3D;
  rotation?: Euler3D;
  timeToReach: number;
}

export interface EditorPlayerData {
  startPosition: Vector3D;
  startRotation?: Euler3D;
  path: PathPoint[];
}

export interface EditorEnemyData {
  id: string;
  type: string;
  spawnTime: number;
  startPosition: Vector3D;
  startRotation?: Euler3D;
  path: PathPoint[];
}

export interface EditorStageData {
  stageId: string;
  player: EditorPlayerData;
  enemies: EditorEnemyData[];
}

export type EditorModeType = 
  | 'select' 
  | 'place_player' 
  | 'place_enemy' 
  | 'edit_player_path' 
  | 'edit_enemy_path';

export interface EditorSelection {
  type: 'player' | 'enemy' | 'player_path_point' | 'enemy_path_point' | null;
  id: string | null;
  pointIndex: number | null;
}
