import * as THREE from 'three';
import { Enemy } from './Enemy';

export class MidEnemy extends Enemy {
  radius = 2.0;
  hp = 10;
  scoreValue = 1000;
  
  private speed = 10;
  private time = 0;
  private startX = 0;

  constructor(position: THREE.Vector3) {
    super(position);
    this.startX = position.x;
    this.buildMesh();
  }

  private buildMesh() {
    const geom = new THREE.OctahedronGeometry(this.radius, 1); // Subdivided octahedron = pseudo sphere
    const mat = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0x440044,
      wireframe: true // UI的なカッコよさを出すためにワイヤーフレームも入れる
    });
    
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x880088
    });
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(this.radius * 0.5), coreMat);
    
    this.mesh.add(new THREE.Mesh(geom, mat));
    this.mesh.add(core);
  }

  update(dt: number, playerPos: THREE.Vector3) {
    this.time += dt;
    this.mesh.position.z += this.speed * dt;
    
    // サインカーブで左右に揺れる
    this.mesh.position.x = this.startX + Math.sin(this.time * 2) * 5;

    // 自転
    this.mesh.rotation.y -= dt;
    this.mesh.rotation.z -= dt * 0.5;

    if (this.mesh.position.z > 10) {
      this.isDead = true;
    }
  }
}
