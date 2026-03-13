import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { StageEditorState } from './StageEditorState';
import { SelectionManager } from './SelectionManager';
import { PathManager } from './PathManager';
import { PlaybackManager } from './PlaybackManager';
import { EditorPlayer } from '../entities/EditorPlayer';
import { EditorEnemy } from '../entities/EditorEnemy';

export class StageEditorApp {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public transformControl: TransformControls;
  
  public state: StageEditorState;
  public selectionManager: SelectionManager;
  public pathManager: PathManager;

  private playerEntity: EditorPlayer;
  private enemyEntities: Map<string, EditorEnemy> = new Map();
  
  public gizmoTarget: THREE.Object3D = new THREE.Object3D();
  private isGizmoDragging = false;
  private lastTime = 0;
  private animationFrameId: number | null = null;
  private selectableGroup: THREE.Group = new THREE.Group();

  private onKeyDown = (e: KeyboardEvent) => {
    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            this.state.redo();
        } else {
            this.state.undo();
        }
    } else if (isMod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.state.redo();
    }
  };

  constructor(canvas: HTMLCanvasElement, state: StageEditorState) {
    this.state = state;

    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x1a1a1a, 1);

    // --- Scene ---
    this.scene = new THREE.Scene();
    
    // Grid Helper
    const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x222222);
    this.scene.add(gridHelper);
    
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    // --- Camera & Controls ---
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 10, 20);
    
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // --- Managers ---
    this.scene.add(this.selectableGroup);

    this.selectionManager = new SelectionManager(this.camera, state);
    this.pathManager = new PathManager(this.scene, this.selectableGroup);

    // --- Transform Controls (Gizmo) ---
    this.scene.add(this.gizmoTarget);

    this.transformControl = new TransformControls(this.camera, canvas);
    this.transformControl.setSpace('world');
    this.transformControl.addEventListener('dragging-changed', (event) => {
        this.controls.enabled = !event.value;
        if (event.value) {
            // ドラッグ開始時に現在の状態を保存
            this.state.pushState();
        }
    });
    this.transformControl.addEventListener('change', () => {
        if (!this.transformControl.object || !this.transformControl.dragging) return;
        
        this.isGizmoDragging = true;
        const pos = this.gizmoTarget.position;
        const rot = this.gizmoTarget.rotation;
        const sel = this.state.selection;
        
        if (sel.type === 'player_path_point' && sel.pointIndex !== null) {
            this.state.updatePlayerPathPoint(sel.pointIndex, { x: pos.x, y: pos.y, z: pos.z }, { x: rot.x, y: rot.y, z: rot.z });
        } else if (sel.type === 'enemy_path_point' && sel.id && sel.pointIndex !== null) {
            this.state.updateEnemyPathPoint(sel.id, sel.pointIndex, { x: pos.x, y: pos.y, z: pos.z }, { x: rot.x, y: rot.y, z: rot.z });
        } else if (sel.type === 'player') {
            this.state.updatePlayerStartPosition({ x: pos.x, y: pos.y, z: pos.z }, { x: rot.x, y: rot.y, z: rot.z });
        } else if (sel.type === 'enemy' && sel.id) {
            this.state.updateEnemyStartPosition(sel.id, { x: pos.x, y: pos.y, z: pos.z }, { x: rot.x, y: rot.y, z: rot.z });
        }
        this.isGizmoDragging = false;
    });
    this.scene.add(this.transformControl.getHelper());

    // --- Entities ---
    this.playerEntity = new EditorPlayer();
    this.selectableGroup.add(this.playerEntity.getMesh());

    // Event listener attached in component
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDown);
    }

    this.animate(0);
  }

  public resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public onClick(x: number, y: number, width: number, height: number, event: MouseEvent) {
    if (event.button !== 0) return; // 左クリックのみ
    
    if (this.transformControl.axis !== null) return; // ギズモ操作中なら選択判定をスキップ
    
    const handled = this.selectionManager.handlePointerDown(x, y, width, height);
    if (!handled && this.state.currentMode.value === 'select') {
      // 選択解除
      this.state.clearSelection();
    }
  }

  public syncEntities() {
    const data = this.state.data;
    const sel = this.state.selection;
    
    // Update TransformControls mode and space
    const targetMode = this.state.gizmoMode.value;
    if (this.transformControl.mode !== targetMode) {
      this.transformControl.setMode(targetMode);
      // 回転の場合はローカル、移動の場合はワールド座標系を使用
      this.transformControl.setSpace(targetMode === 'rotate' ? 'local' : 'world');
    }

    // Update Player
    if (data.player.startRotation) {
      this.playerEntity.getMesh().rotation.set(data.player.startRotation.x, data.player.startRotation.y, data.player.startRotation.z);
    }
    this.playerEntity.update(data.player.startPosition, sel.type === 'player');

    // Update Enemies
    const currentEnemyIds = new Set(data.enemies.map(e => e.id));
    
    // Remove deleted enemies
    for (const [id, enemyEntity] of this.enemyEntities.entries()) {
      if (!currentEnemyIds.has(id)) {
        this.selectableGroup.remove(enemyEntity.getMesh());
        this.enemyEntities.delete(id);
      }
    }

    // Add/Update existing enemies
    for (const enemyData of data.enemies) {
      let enemyEntity = this.enemyEntities.get(enemyData.id);
      if (!enemyEntity) {
        enemyEntity = new EditorEnemy(enemyData.id, enemyData.type);
        this.selectableGroup.add(enemyEntity.getMesh());
        this.enemyEntities.set(enemyData.id, enemyEntity);
      }
      if (enemyData.startRotation) {
        enemyEntity.getMesh().rotation.set(enemyData.startRotation.x, enemyData.startRotation.y, enemyData.startRotation.z);
      }
      const isSelected = sel.type === 'enemy' && sel.id === enemyData.id;
      enemyEntity.update(enemyData.startPosition, isSelected);
    }

    // Update Paths
    this.pathManager.updatePaths(data, sel);

    // Update Gizmo target and attachment
    let targetPos: any = null;
    let targetRot: any = null;
    let shouldAttach = false;

    if (sel.type === 'player') {
        targetPos = data.player.startPosition;
        targetRot = data.player.startRotation;
        shouldAttach = true;
    } else if (sel.type === 'enemy' && sel.id) {
        const enemy = data.enemies.find(e => e.id === sel.id);
        if (enemy) { targetPos = enemy.startPosition; targetRot = enemy.startRotation; shouldAttach = true; }
    } else if (sel.type === 'player_path_point' && sel.pointIndex !== null) {
        const point = data.player.path[sel.pointIndex];
        if (point) { targetPos = point.position; targetRot = point.rotation; shouldAttach = true; }
    } else if (sel.type === 'enemy_path_point' && sel.id && sel.pointIndex !== null) {
        const enemy = data.enemies.find(e => e.id === sel.id);
        if (enemy && enemy.path[sel.pointIndex]) {
            targetPos = enemy.path[sel.pointIndex].position;
            targetRot = enemy.path[sel.pointIndex].rotation;
            shouldAttach = true;
        }
    }

    if (shouldAttach && targetPos) {
        if (!this.isGizmoDragging) {
            this.gizmoTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
            if (targetRot && typeof (targetRot as any).x === 'number') {
                this.gizmoTarget.rotation.set((targetRot as any).x || 0, (targetRot as any).y || 0, (targetRot as any).z || 0);
            } else {
                this.gizmoTarget.rotation.set(0, 0, 0);
            }
            // オブジェクトの姿勢にギズモを正しく追従させるため更新を強制
            this.gizmoTarget.updateMatrixWorld();
        }
        if (this.transformControl.object !== this.gizmoTarget) {
            this.transformControl.attach(this.gizmoTarget);
        }
    } else {
        this.transformControl.detach();
    }

    // Selectable objects -> SelectionManager
    this.selectionManager.setSelectableMeshes(this.selectableGroup.children);
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
  }

  private animate = (time: number) => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Calculate Delta Time
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.controls.update();

    // Playback Logic
    if (this.state.isPlaying.value) {
        this.state.currentTime.value += deltaTime;
        if (this.state.currentTime.value >= this.state.maxTime.value) {
            this.state.isPlaying.value = false;
            this.state.currentTime.value = this.state.maxTime.value;
        }
    }
    
    // Sync entities based on current time (if playing or seeking)
    this.updateEntitiesForPlayback();
    
    this.renderer.render(this.scene, this.camera);
  };

  private updateEntitiesForPlayback() {
    const data = this.state.data;
    if (!data || !data.player) return;

    const time = this.state.currentTime.value;
    const mode = this.state.playbackMode.value;
    const isPlaying = this.state.isPlaying.value;
    const selection = this.state.selection;

    // 1. Player
    if (isPlaying || mode === 'player' || mode === 'all') {
        const playerState = PlaybackManager.getInterpolatedState(
            0, 
            data.player.startPosition, 
            data.player.startRotation, 
            data.player.path, 
            time
        );
        this.playerEntity.getMesh().position.copy(playerState.position);
        this.playerEntity.getMesh().rotation.copy(playerState.rotation);
    }

    // 2. Enemies
    if (!data.enemies) return;

    data.enemies.forEach(enemyData => {
        const enemyEntity = this.enemyEntities.get(enemyData.id);
        if (!enemyEntity) return;

        // 再生対象かどうか
        const isTarget = mode === 'all' || (mode === 'enemy' && selection.id === enemyData.id);
        
        if (isPlaying || (isTarget)) {
            const enemyState = PlaybackManager.getInterpolatedState(
                enemyData.spawnTime,
                enemyData.startPosition,
                enemyData.startRotation,
                enemyData.path,
                time
            );
            enemyEntity.getMesh().position.copy(enemyState.position);
            enemyEntity.getMesh().rotation.copy(enemyState.rotation);
            
            // 出現時間前なら非表示にする
            enemyEntity.getMesh().visible = time >= enemyData.spawnTime;
        } else {
            enemyEntity.getMesh().visible = true;
        }
    });
  }
}
