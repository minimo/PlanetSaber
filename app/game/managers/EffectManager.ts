import * as THREE from 'three';

interface ParticleSystem {
  group: THREE.Group;
  update: (dt: number) => boolean; // return true if dead
  destroy: () => void;
}

export class EffectManager {
  private effects: ParticleSystem[] = [];

  constructor(private scene: THREE.Scene) {}

  createExplosion(position: THREE.Vector3, size: number) {
    const group = new THREE.Group();
    group.position.copy(position);

    const particleCount = 20;
    const geom = new THREE.BoxGeometry(size * 0.3, size * 0.3, size * 0.3);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    
    // パーティクルのメッシュとそれぞれの速度を保持
    const particles: { mesh: THREE.Mesh; vel: THREE.Vector3 }[] = [];

    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(geom, mat);
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        particles.push({ mesh, vel });
        group.add(mesh);
    }

    this.scene.add(group);

    let life = 1.0;
    const ps: ParticleSystem = {
      group,
      update: (dt: number) => {
        life -= dt;
        particles.forEach(p => p.mesh.position.addScaledVector(p.vel, dt));
        // スケール縮小
        if(life > 0) {
           const scale = Math.max(0, life);
           group.scale.set(scale, scale, scale);
        }
        return life <= 0;
      },
      destroy: () => {
        geom.dispose();
        mat.dispose();
      }
    };
    
    this.effects.push(ps);
  }

  createLaser(origin: THREE.Vector3, target: THREE.Vector3, color: number) {
    const distance = origin.distanceTo(target);
    const geom = new THREE.CylinderGeometry(0.1, 0.1, distance, 8);
    geom.translate(0, distance / 2, 0);
    geom.rotateX(Math.PI / 2);
    
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(origin);
    mesh.lookAt(target);

    const group = new THREE.Group();
    group.add(mesh);
    this.scene.add(group);

    let life = 0.1; // 0.1秒で消滅
    const ps: ParticleSystem = {
      group,
      update: (dt: number) => {
        life -= dt;
        mat.opacity = Math.max(0, (life / 0.1) * 0.8);
        return life <= 0;
      },
      destroy: () => {
        geom.dispose();
        mat.dispose();
      }
    };
    
    this.effects.push(ps);
  }

  createHit(position: THREE.Vector3) {
    const geom = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(position);
    this.scene.add(mesh);

    let life = 0.2;
    const ps: ParticleSystem = {
      group: new THREE.Group().add(mesh), // hack for uniform interface
      update: (dt: number) => {
        life -= dt;
        return life <= 0;
      },
      destroy: () => {
        geom.dispose();
        mat.dispose();
      }
    };

    // Replace the group hack with actual mesh removal
    ps.group = new THREE.Group();
    ps.group.add(mesh);
    this.scene.add(ps.group);
    
    this.effects.push(ps);
  }

  update(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      if (!effect) continue;
      const isDead = effect.update(dt);
      if (isDead) {
        effect.destroy();
        this.scene.remove(effect.group);
        this.effects.splice(i, 1);
      }
    }
  }
}
