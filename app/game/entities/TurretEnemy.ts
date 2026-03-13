import * as THREE from 'three';
import { Enemy } from './Enemy';
import { eventBus } from '../core/EventBus';

export class TurretEnemy extends Enemy {
  radius = 1.5;
  hp = 3;
  scoreValue = 300;
  
  private speed = 0; // 砲台なので自ら前進はしない（背景のスクロールに合わせて動かすか、相対速度にする）
  private baseSpeed = 20; // ステージのスクロール速度相当

  private lastFireTime: number = 0;
  private fireInterval: number = 2.0;

  private headMesh!: THREE.Mesh;

  constructor(position: THREE.Vector3) {
    super(position);
    this.buildMesh();
  }

  private buildMesh() {
    // 台座
    const baseGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    this.mesh.add(base);

    // 砲塔頭部
    const headGeom = new THREE.SphereGeometry(1, 16, 16);
    const headMat = new THREE.MeshPhongMaterial({ color: 0xff8800, emissive: 0x442200 });
    this.headMesh = new THREE.Mesh(headGeom, headMat);
    this.headMesh.position.y = 0.5;
    this.mesh.add(this.headMesh);
  }

  update(dt: number, playerPos: THREE.Vector3) {
    // スクロールによる接近
    this.mesh.position.z += this.baseSpeed * dt;

    // プレイヤーに向いて弾を撃つ
    if (this.headMesh) {
      this.headMesh.lookAt(playerPos);
    }

    const now = performance.now() / 1000;
    // 画面内(zが-50より奥でなく、2より手前でない範囲)にいるときだけ撃つ
    if (this.mesh.position.z > -60 && this.mesh.position.z < 0) {
      if (now - this.lastFireTime > this.fireInterval) {
        this.lastFireTime = now;
        this.fireProjectile(playerPos);
      }
    }

    if (this.mesh.position.z > 10) {
      this.isDead = true;
    }
  }

  private fireProjectile(playerPos: THREE.Vector3) {
    const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position).normalize();
    const velocity = dir.multiplyScalar(25); // 弾速
    
    eventBus.emit('spawn:projectile', {
      position: this.mesh.position.clone().add(new THREE.Vector3(0, 1, 0)),
      velocity,
      isEnemy: true
    });
  }
}
