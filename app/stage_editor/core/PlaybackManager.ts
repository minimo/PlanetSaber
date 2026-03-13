import * as THREE from 'three';
import type { PathPoint, Vector3D, Euler3D } from '../types/stage-editor';

export interface InterpolatedState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export class PlaybackManager {
  /**
   * 指定された時間におけるオブジェクトの状態（位置・回転）を計算します。
   */
  public static getInterpolatedState(
    startTime: number,
    startPos: Vector3D,
    startRot: Euler3D | undefined,
    path: PathPoint[],
    currentTime: number
  ): InterpolatedState {
    const currentState: InterpolatedState = {
      position: new THREE.Vector3(startPos.x, startPos.y, startPos.z),
      rotation: new THREE.Euler(startRot?.x || 0, startRot?.y || 0, startRot?.z || 0)
    };

    if (currentTime <= startTime) {
      return currentState;
    }

    let accumulatedTime = startTime;
    let prevPos = startPos;
    let prevRot = startRot || { x: 0, y: 0, z: 0 };

    for (let i = 0; i < path.length; i++) {
        const point = path[i];
        if (!point) continue;
        const segDuration = point.timeToReach;
        const segEndTime = accumulatedTime + segDuration;

        if (currentTime <= segEndTime) {
            // このセグメント内での補間率(0.0 - 1.0)
            const t = segDuration > 0 ? (currentTime - accumulatedTime) / segDuration : 1;
            
            // 位置の補間 (Lerp)
            currentState.position.set(
                prevPos.x + (point.position.x - prevPos.x) * t,
                prevPos.y + (point.position.y - prevPos.y) * t,
                prevPos.z + (point.position.z - prevPos.z) * t
            );

            // 回転の補間 (Quaternion Lerp)
            const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(prevRot.x, prevRot.y, prevRot.z));
            const rot2 = point.rotation || { x: 0, y: 0, z: 0 };
            const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(rot2.x, rot2.y, rot2.z));
            q1.slerp(q2, t);
            currentState.rotation.setFromQuaternion(q1);

            return currentState;
        }

        accumulatedTime = segEndTime;
        prevPos = point.position;
        prevRot = point.rotation || { x: 0, y: 0, z: 0 };
    }

    // パスの終端に到達
    currentState.position.set(prevPos.x, prevPos.y, prevPos.z);
    currentState.rotation.set(prevRot.x, prevRot.y, prevRot.z);
    return currentState;
  }

  /**
   * パスの全行程にかかる合計時間を計算します。
   */
  public static calculateTotalTime(startTime: number, path: PathPoint[]): number {
    return startTime + path.reduce((acc, p) => acc + p.timeToReach, 0);
  }
}
