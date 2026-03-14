import * as THREE from 'three';
import { gameState } from './GameState';
import { eventBus } from './EventBus';
import { Player } from '../entities/Player';
import { ProjectileManager } from '../managers/ProjectileManager';
import { EnemyManager } from '../managers/EnemyManager';
import { CollisionManager } from '../managers/CollisionManager';
import { EffectManager } from '../managers/EffectManager';
import { StageManager } from '../managers/StageManager';
import { stage1 } from '../data/stage1';

export class GameApp {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  
  player!: Player;
  projectileManager!: ProjectileManager;
  enemyManager!: EnemyManager;
  collisionManager!: CollisionManager;
  effectManager!: EffectManager;
  stageManager!: StageManager;
  
  private clock = new THREE.Clock();

  constructor() {}

  async init(canvas: HTMLCanvasElement) {
    this.initThree(canvas);
    this.initGameObjects();
    this.initListeners();
  }

  private initThree(canvas: HTMLCanvasElement) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000010, 0.015);
    this.scene.background = new THREE.Color(0x000005);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, -5);
    this.scene.add(ambientLight, dirLight);

    // スターフィールド（星空背景）
    const starGeom = new THREE.BufferGeometry();
    const starCount = 1000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.2, color: 0xffffff, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeom, starMat);
    this.scene.add(stars);

  }

  private initGameObjects() {
    this.player = new Player();
    this.scene.add(this.player.mesh);

    this.projectileManager = new ProjectileManager(this.scene);
    this.enemyManager = new EnemyManager(this.scene);
    this.collisionManager = new CollisionManager(this.player, this.enemyManager, this.projectileManager);
    this.effectManager = new EffectManager(this.scene);
    this.stageManager = new StageManager(this.enemyManager, stage1);
  }

  private initListeners() {
    eventBus.on('spawn:projectile', (data: any) => {
      this.projectileManager.spawn(data.position, data.velocity, data.isEnemy);
    });

    eventBus.on('action:player_fire_laser', (data: {x: number, y: number}) => {
      if (gameState.status !== 'playing' || gameState.isPaused || this.player.isDead) return;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(data.x, data.y), this.camera);
      
      const enemies = this.enemyManager.getEnemies();
      // Gather all meshes
      const enemyMeshes: THREE.Object3D[] = enemies.map(e => e.mesh);
      const intersects = raycaster.intersectObjects(enemyMeshes, true);
      
      let targetPoint = raycaster.ray.at(100, new THREE.Vector3());
      
      if (intersects.length > 0 && intersects[0]) {
        // hit!
        const hit = intersects[0];
        targetPoint = hit.point;
        
        // Find which enemy it belongs to
        let hitEnemy: any = undefined;
        for (const enemy of enemies) {
          enemy.mesh.traverse((child) => {
            if (child === hit.object) hitEnemy = enemy;
          });
          if (hitEnemy) break;
        }
        
        if (hitEnemy && !hitEnemy.isDead) {
          hitEnemy.takeDamage(1);
          eventBus.emit('effect:hit', { position: targetPoint });
          if (hitEnemy.isDead) {
            gameState.addScore(hitEnemy.scoreValue);
            eventBus.emit('effect:explosion', { position: hitEnemy.mesh.position.clone(), size: hitEnemy.radius });
          }
        }
      }

      // 画面下左右からの発射位置を計算する
      const leftOrigin = new THREE.Vector3(-2, -2, -1);
      leftOrigin.applyMatrix4(this.camera.matrixWorld);
      const rightOrigin = new THREE.Vector3(2, -2, -1);
      rightOrigin.applyMatrix4(this.camera.matrixWorld);
      
      this.effectManager.createLaser(leftOrigin, targetPoint, 0x00ffff);
      this.effectManager.createLaser(rightOrigin, targetPoint, 0x00ffff);
    });
    
    eventBus.on('effect:hit', (data: any) => {
      this.effectManager.createHit(data.position);
    });
    
    eventBus.on('effect:explosion', (data: any) => {
      this.effectManager.createExplosion(data.position, data.size || 1);
    });

    eventBus.on('state:changed', (state: any) => {
      if (state.status === 'playing' && state.score === 0 && state.progress === 0) {
        // Reset game
        this.enemyManager.clear();
        this.stageManager.reset();
        this.player.isDead = false;
        this.player.mesh.position.set(0,0,5);
      }
    });

    eventBus.on('state:gameover', () => {
      this.player.isDead = true;
      this.effectManager.createExplosion(this.player.mesh.position, 3);
      this.player.mesh.visible = false;
    });
  }

  resize(width: number, height: number) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  update() {
    const dt = this.clock.getDelta();

    if (gameState.status === 'playing' && !gameState.isPaused) {
      gameState.updateProgress(dt * 2); // 進行度（スクロール速度）
      
      this.player.update(dt);
      this.projectileManager.update(dt);
      this.enemyManager.update(dt, this.player.mesh.position.clone());
      this.collisionManager.update();
      this.effectManager.update(dt);
      this.stageManager.update(dt);

      // 背景の星を動かす等の演出
      this.scene.children.forEach(c => {
        if (c.type === 'Points') {
          c.position.z += 10 * dt;
          if (c.position.z > 50) c.position.z -= 100;
        }
      });
    } else if (gameState.status === 'gameover' || gameState.status === 'clear') {
         // ゲームオーバー後やクリア後も爆発などは描き続ける
         this.effectManager.update(dt);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    this.renderer.dispose();
    this.player.destroy();
  }
}

export const gameApp = new GameApp();
