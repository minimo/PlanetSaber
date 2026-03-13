import { reactive } from 'vue';
import type { EditorModeType, EditorSelection, EditorStageData, EditorEnemyData, Vector3D } from '../types/stage-editor';

// シリアライズ・デシリアライズ用の初期データ生成
export const createDefaultStageData = (): EditorStageData => ({
  stageId: 'stage-001',
  player: {
    startPosition: { x: 0, y: 0, z: 0 },
    startRotation: { x: 0, y: 0, z: 0 },
    path: []
  },
  enemies: []
});

export class StageEditorState {
  // Vueのreactiveを使ってUIとThree.js側で状態を同期させる
  public data = reactive<EditorStageData>(createDefaultStageData());
  
  public currentMode = reactive<{ value: EditorModeType }>({ value: 'select' });
  public selection = reactive<EditorSelection>({ type: null, id: null, pointIndex: null });
  
  // TransformControlsの操作モード: 'translate' | 'rotate'
  public gizmoMode = reactive<{ value: 'translate' | 'rotate' }>({ value: 'translate' });
  
  // 再生関連の状態
  public isPlaying = reactive({ value: false });
  public currentTime = reactive({ value: 0 });
  public playbackMode = reactive<{ value: 'all' | 'player' | 'enemy' }>({ value: 'all' });
  public maxTime = reactive({ value: 0 });

  // Undo/Redo用のスタック
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private readonly MAX_STACK_SIZE = 50;

  // 次に追加する敵のデフォルト設定
  public nextEnemyType = reactive({ value: 'small' });
  public nextEnemySpawnTime = reactive({ value: 0 });

  constructor() {}

  // --- 状態変更メソッド ---

  public setMode(mode: EditorModeType) {
    this.currentMode.value = mode;
    if (mode !== 'select') {
      this.clearSelection();
    }
  }

  public setSelection(type: EditorSelection['type'], id: string | null = null, pointIndex: number | null = null) {
    this.selection.type = type;
    this.selection.id = id;
    this.selection.pointIndex = pointIndex;
  }

  public clearSelection() {
    this.setSelection(null, null, null);
  }

  // --- 履歴管理メソッド ---

  public pushState() {
    // 現在の状態をシリアライズしてスタックに積む
    const snapshot = JSON.stringify(this.data);
    
    // 直前の状態と同じなら積まない
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === snapshot) {
      return;
    }

    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.MAX_STACK_SIZE) {
      this.undoStack.shift();
    }
    // 新しい操作が行われたのでRedoスタックはクリア
    this.redoStack = [];
  }

  public undo() {
    if (this.undoStack.length === 0) return;

    // 現在の状態をRedo用に保存
    this.redoStack.push(JSON.stringify(this.data));
    
    // Undoスタックから戻す
    const previousStateString = this.undoStack.pop()!;
    const previousState = JSON.parse(previousStateString);
    this.loadDataInternal(previousState);
  }

  public redo() {
    if (this.redoStack.length === 0) return;

    // 現在の状態をUndo用に保存
    this.undoStack.push(JSON.stringify(this.data));

    // Redoスタックから戻す
    const nextStateString = this.redoStack.pop()!;
    const nextState = JSON.parse(nextStateString);
    this.loadDataInternal(nextState);
  }

  // クラス内部でのデータ更新用（履歴のpushを行わない）
  private loadDataInternal(newData: EditorStageData) {
    this.data.stageId = newData.stageId || 'stage-001';
    
    // Player
    this.data.player.startPosition = { ...newData.player.startPosition };
    this.data.player.startRotation = newData.player.startRotation ? { ...newData.player.startRotation } : { x: 0, y: 0, z: 0 };
    this.data.player.path = (newData.player.path || []).map((p: any) => ({
      position: { ...p.position },
      rotation: p.rotation ? { ...p.rotation } : { x: 0, y: 0, z: 0 },
      timeToReach: p.timeToReach ?? 1
    }));
    
    // Enemies
    this.data.enemies = (newData.enemies || []).map(e => ({
      id: e.id,
      type: e.type,
      spawnTime: e.spawnTime,
      startPosition: { ...e.startPosition },
      startRotation: e.startRotation ? { ...e.startRotation } : { x: 0, y: 0, z: 0 },
      path: (e.path || []).map((p: any) => ({
        position: { ...p.position },
        rotation: p.rotation ? { ...p.rotation } : { x: 0, y: 0, z: 0 },
        timeToReach: p.timeToReach ?? 1
      }))
    }));
    // 選択状態は維持しようとする（IDやインデックスが変わっている可能性はあるが）
  }

  // --- データ操作メソッド ---
  public loadData(newData: EditorStageData) {
    this.undoStack = [];
    this.redoStack = [];
    this.loadDataInternal(newData);
    this.clearSelection();
  }

  public getSelectedEnemy(): EditorEnemyData | undefined {
    if (this.selection.type === 'enemy' && this.selection.id) {
      return this.data.enemies.find(e => e.id === this.selection.id);
    }
    return undefined;
  }

  public addEnemy(position: Vector3D) {
    this.pushState();
    const newId = `enemy-${Date.now()}`;
    const newEnemy: EditorEnemyData = {
      id: newId,
      type: this.nextEnemyType.value,
      spawnTime: this.nextEnemySpawnTime.value,
      startPosition: { ...position },
      startRotation: { x: 0, y: 0, z: 0 },
      path: []
    };
    this.data.enemies.push(newEnemy);
    this.setSelection('enemy', newId);
  }

  public removeEnemy(id: string) {
    this.pushState();
    const index = this.data.enemies.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.enemies.splice(index, 1);
      if (this.selection.type === 'enemy' && this.selection.id === id) {
        this.clearSelection();
      }
    }
  }

  // Path operations
  public addPlayerPathPoint(position: Vector3D) {
    this.pushState();
    this.data.player.path.push({
      position: { ...position },
      rotation: { x: 0, y: 0, z: 0 },
      timeToReach: 1
    });
  }

  public addEnemyPathPoint(enemyId: string, position: Vector3D) {
    this.pushState();
    const enemy = this.data.enemies.find(e => e.id === enemyId);
    if (enemy) {
      enemy.path.push({
        position: { ...position },
        rotation: { x: 0, y: 0, z: 0 },
        timeToReach: 1
      });
    }
  }

  public updatePlayerPathPoint(index: number, position: Vector3D, rotation?: Vector3D) {
    if (this.data.player.path[index]) {
      this.data.player.path[index].position.x = position.x;
      this.data.player.path[index].position.y = position.y;
      this.data.player.path[index].position.z = position.z;
      if (rotation && this.data.player.path[index].rotation) {
        this.data.player.path[index].rotation!.x = rotation.x;
        this.data.player.path[index].rotation!.y = rotation.y;
        this.data.player.path[index].rotation!.z = rotation.z;
      }
    }
  }

  public updateEnemyPathPoint(enemyId: string, index: number, position: Vector3D, rotation?: Vector3D) {
    const enemy = this.data.enemies.find(e => e.id === enemyId);
    if (enemy && enemy.path[index]) {
      enemy.path[index].position.x = position.x;
      enemy.path[index].position.y = position.y;
      enemy.path[index].position.z = position.z;
      if (rotation && enemy.path[index].rotation) {
        enemy.path[index].rotation!.x = rotation.x;
        enemy.path[index].rotation!.y = rotation.y;
        enemy.path[index].rotation!.z = rotation.z;
      }
    }
  }

  public updatePlayerStartPosition(position: Vector3D, rotation?: Vector3D) {
    this.data.player.startPosition.x = position.x;
    this.data.player.startPosition.y = position.y;
    this.data.player.startPosition.z = position.z;
    if (rotation && this.data.player.startRotation) {
      this.data.player.startRotation.x = rotation.x;
      this.data.player.startRotation.y = rotation.y;
      this.data.player.startRotation.z = rotation.z;
    }
  }

  public updateEnemyStartPosition(enemyId: string, position: Vector3D, rotation?: Vector3D) {
    const enemy = this.data.enemies.find(e => e.id === enemyId);
    if (enemy) {
      enemy.startPosition.x = position.x;
      enemy.startPosition.y = position.y;
      enemy.startPosition.z = position.z;
      if (rotation && enemy.startRotation) {
        enemy.startRotation.x = rotation.x;
        enemy.startRotation.y = rotation.y;
        enemy.startRotation.z = rotation.z;
      }
    }
  }
}
