import * as THREE from 'three';
import { Enemy } from './Enemy';

export class SmallEnemy extends Enemy {
  radius = 0.8;
  hp = 1;
  scoreValue = 100;
  
  private speed = 15;

  constructor(position: THREE.Vector3) {
    super(position);
    this.buildMesh();
  }

  private buildMesh() {
    const geom = new THREE.TetrahedronGeometry(this.radius);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xff0044,
      emissive: 0x440011,
      flatShading: true
    });
    const subMesh = new THREE.Mesh(geom, mat);
    this.mesh.add(subMesh);
  }

  update(dt: number, playerPos: THREE.Vector3) {
    // 直進してくる
    this.mesh.position.z += this.speed * dt;
    // 回転アクション
    this.mesh.rotation.x += dt;
    this.mesh.rotation.y += dt * 2;
    
    // プレイヤーを通り過ぎたら消滅
    if (this.mesh.position.z > 10) {
      this.isDead = true;
    }
  }
}
