import * as THREE from 'three';
import type { EditorStageData, EditorSelection } from '../types/stage-editor';

export class PathManager {
  private lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
  private enemyLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
  
  // 自機のパスは自機と同じ形状(Cone)で半透明にする
  private playerPathGeometry: THREE.ConeGeometry;
  private playerPathMaterial = new THREE.MeshStandardMaterial({ color: 0x0088ff, opacity: 0.5, transparent: true, roughness: 0.5 });
  private playerPathSelectedMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x004488, opacity: 0.8, transparent: true, roughness: 0.2 });

  private enemySphereMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0000, roughness: 0.5 });
  private selectedSphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x666600, roughness: 0.2 });
  
  private sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);

  private pathLines: THREE.Line[] = [];
  private pathSpheres: THREE.Mesh[] = [];

  constructor(private scene: THREE.Scene, private selectableGroup: THREE.Group) {
      this.playerPathGeometry = new THREE.ConeGeometry(0.5, 1.5, 8);
      this.playerPathGeometry.rotateX(Math.PI / 2);
  }

  public updatePaths(data: EditorStageData, selection: EditorSelection) {
    this.clearAll();

    this.updatePlayerPath(data, selection);
    this.updateEnemyPaths(data, selection);
  }

  private clearAll() {
    this.pathLines.forEach(line => this.scene.remove(line));
    this.pathLines = [];

    this.pathSpheres.forEach(mesh => this.selectableGroup.remove(mesh));
    this.pathSpheres = [];
  }

  private updatePlayerPath(data: EditorStageData, selection: EditorSelection) {
    const points = [data.player.startPosition, ...data.player.path];
    if (points.length >= 2) {
      for (let i = 0; i < points.length - 1; i++) {
          const pt1 = points[i];
          const pt2 = points[i + 1];
          if (!pt1 || !pt2) continue;
          
          const p1 = 'position' in pt1 ? (pt1 as any).position : pt1;
          const p2 = 'position' in pt2 ? (pt2 as any).position : pt2;
          if (!p1 || !p2 || typeof p1.x !== 'number' || typeof p2.x !== 'number') continue;

          const geometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(p1.x, p1.y, p1.z),
              new THREE.Vector3(p2.x, p2.y, p2.z)
          ]);
          const line = new THREE.Line(geometry, this.lineMaterial);
          this.scene.add(line);
          this.pathLines.push(line);
      }
    }
    
    data.player.path.forEach((p, index) => {
        const isSelected = selection.type === 'player_path_point' && selection.pointIndex === index;
        const mesh = new THREE.Mesh(this.playerPathGeometry, isSelected ? this.playerPathSelectedMaterial : this.playerPathMaterial);
        
        mesh.position.set(p.position.x, p.position.y, p.position.z);
        if (p.rotation) {
            mesh.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
        }

        mesh.userData = { type: 'player_path_point', id: 'player', pointIndex: index };
        this.selectableGroup.add(mesh);
        this.pathSpheres.push(mesh);
    });
  }

  private updateEnemyPaths(data: EditorStageData, selection: EditorSelection) {
    data.enemies.forEach(enemy => {
      const points = [enemy.startPosition, ...enemy.path];
      if (points.length >= 2) {
          for (let i = 0; i < points.length - 1; i++) {
            const pt1 = points[i];
            const pt2 = points[i + 1];
            if (!pt1 || !pt2) continue;
            
            const p1 = 'position' in pt1 ? (pt1 as any).position : pt1;
            const p2 = 'position' in pt2 ? (pt2 as any).position : pt2;
            if (!p1 || !p2 || typeof p1.x !== 'number' || typeof p2.x !== 'number') continue;

            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(p1.x, p1.y, p1.z),
                new THREE.Vector3(p2.x, p2.y, p2.z)
            ]);
            const line = new THREE.Line(geometry, this.enemyLineMaterial);
            this.scene.add(line);
            this.pathLines.push(line);
          }
      }
      
      enemy.path.forEach((p, index) => {
          const isSelected = selection.type === 'enemy_path_point' && selection.id === enemy.id && selection.pointIndex === index;
          const sphere = new THREE.Mesh(this.sphereGeometry, isSelected ? this.selectedSphereMaterial : this.enemySphereMaterial);
          sphere.position.set(p.position.x, p.position.y, p.position.z);
          if (p.rotation) {
            sphere.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
          }
          sphere.userData = { type: 'enemy_path_point', id: enemy.id, pointIndex: index };
          this.selectableGroup.add(sphere);
          this.pathSpheres.push(sphere);
      });
    });
  }
}
