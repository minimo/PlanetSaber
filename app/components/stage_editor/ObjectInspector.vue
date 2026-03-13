<template>
  <div class="panel object-inspector">
    <div class="panel-header">オブジェクトプロパティ</div>
    <div class="panel-content" v-if="selectionType">
      <div v-if="selectionType === 'player'">
        <div class="prop-title">自機初期位置</div>
        <div class="coord-inputs">
          <label>X: <input type="number" v-model.number="playerPos.x" step="0.5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" v-model.number="playerPos.y" step="0.5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" v-model.number="playerPos.z" step="0.5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">自機初期回転</div>
        <div class="coord-inputs" v-if="playerRot">
          <label>X: <input type="number" :value="radToDeg(playerRot.x)" @input="updatePlayerRot('x', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" :value="radToDeg(playerRot.y)" @input="updatePlayerRot('y', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" :value="radToDeg(playerRot.z)" @input="updatePlayerRot('z', $event)" step="5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">到達時間 (秒)</div>
        <div class="prop-row">
          <input type="number" value="0" disabled />
          <span class="hint">※初期地点のため0固定</span>
        </div>
      </div>
      <div v-else-if="selectionType === 'enemy' && selectedEnemy">
        <div class="prop-title">敵 ID: {{ selectedEnemy.id }}</div>
        <div class="prop-row">
          <label>Type:</label>
          <select v-model="selectedEnemy.type" @focus="state.pushState()">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="boss">Boss</option>
          </select>
        </div>
        <div class="prop-row">
          <label>Spawn Time (s):</label>
          <input type="number" v-model.number="selectedEnemy.spawnTime" step="0.1" @focus="state.pushState()" />
        </div>
        <div class="prop-title">初期位置</div>
        <div class="coord-inputs">
          <label>X: <input type="number" v-model.number="selectedEnemy.startPosition.x" step="0.5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" v-model.number="selectedEnemy.startPosition.y" step="0.5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" v-model.number="selectedEnemy.startPosition.z" step="0.5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">初期回転</div>
        <div class="coord-inputs" v-if="selectedEnemy.startRotation">
          <label>X: <input type="number" :value="radToDeg(selectedEnemy.startRotation.x)" @input="updateEnemyRot('x', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" :value="radToDeg(selectedEnemy.startRotation.y)" @input="updateEnemyRot('y', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" :value="radToDeg(selectedEnemy.startRotation.z)" @input="updateEnemyRot('z', $event)" step="5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">到達時間 (秒)</div>
        <div class="prop-row">
          <input type="number" value="0" disabled />
          <span class="hint">※初期地点のため0固定</span>
        </div>
      </div>
      <div v-else-if="selectionType === 'player_path_point' && playerSelectedPoint">
        <div class="prop-title">自機パス座標 [#{{ state.selection.pointIndex }}]</div>
        <div class="coord-inputs">
          <label>X: <input type="number" v-model.number="playerSelectedPoint.position.x" step="0.5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" v-model.number="playerSelectedPoint.position.y" step="0.5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" v-model.number="playerSelectedPoint.position.z" step="0.5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">パス回転</div>
        <div class="coord-inputs" v-if="playerSelectedPoint.rotation">
          <label>X: <input type="number" :value="radToDeg(playerSelectedPoint.rotation.x)" @input="updatePlayerPathRot('x', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" :value="radToDeg(playerSelectedPoint.rotation.y)" @input="updatePlayerPathRot('y', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" :value="radToDeg(playerSelectedPoint.rotation.z)" @input="updatePlayerPathRot('z', $event)" step="5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">前のパスからの到達時間 (秒)</div>
        <div class="prop-row">
          <input 
            type="number" 
            v-model.number="playerSelectedPoint.timeToReach" 
            step="0.1" 
            min="0"
            @focus="state.pushState()"
          />
        </div>
      </div>
      <div v-else-if="selectionType === 'enemy_path_point' && enemySelectedPoint">
        <div class="prop-title">敵[{{ state.selection.id }}] パス [#{{ state.selection.pointIndex }}]</div>
        <div class="coord-inputs">
          <label>X: <input type="number" v-model.number="enemySelectedPoint.position.x" step="0.5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" v-model.number="enemySelectedPoint.position.y" step="0.5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" v-model.number="enemySelectedPoint.position.z" step="0.5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">パス回転</div>
        <div class="coord-inputs" v-if="enemySelectedPoint.rotation">
          <label>X: <input type="number" :value="radToDeg(enemySelectedPoint.rotation.x)" @input="updateEnemyPathRot('x', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Y: <input type="number" :value="radToDeg(enemySelectedPoint.rotation.y)" @input="updateEnemyPathRot('y', $event)" step="5" @focus="state.pushState()"/></label>
          <label>Z: <input type="number" :value="radToDeg(enemySelectedPoint.rotation.z)" @input="updateEnemyPathRot('z', $event)" step="5" @focus="state.pushState()"/></label>
        </div>
        <div class="prop-title">前のパスからの到達時間 (秒)</div>
        <div class="prop-row">
          <input 
            type="number" 
            v-model.number="enemySelectedPoint.timeToReach" 
            step="0.1" 
            min="0"
            @focus="state.pushState()"
          />
        </div>
      </div>
      <div v-else>
        未対応の選択オブジェクトです
      </div>
    </div>
    <div class="panel-content empty" v-else>
      オブジェクトが選択されていません。<br>
      3D空間のオブジェクトをクリックするか、リストから選択してください。
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStageEditor } from '../../composables/stage_editor/useStageEditor';

const { state } = useStageEditor();

const selectionType = computed(() => state.selection.type);

const playerPos = computed(() => state.data.player.startPosition);
const playerRot = computed(() => state.data.player.startRotation);

const selectedEnemy = computed(() => {
  if (state.selection.type === 'enemy' && state.selection.id) {
    return state.data.enemies.find(e => e.id === state.selection.id);
  }
  return null;
});

const playerSelectedPoint = computed(() => {
  if (state.selection.type === 'player_path_point' && state.selection.pointIndex !== null) {
    return state.data.player.path[state.selection.pointIndex];
  }
  return null;
});

const enemySelectedPoint = computed(() => {
  if (state.selection.type === 'enemy_path_point' && state.selection.id && state.selection.pointIndex !== null) {
    const enemy = state.data.enemies.find(e => e.id === state.selection.id);
    return enemy ? enemy.path[state.selection.pointIndex] : null;
  }
  return null;
});

// helpers
const radToDeg = (rad: number) => Math.round(rad * 180 / Math.PI);
const degToRad = (deg: number) => deg * Math.PI / 180;

const updatePlayerRot = (axis: 'x'|'y'|'z', event: Event) => {
  const val = degToRad(Number((event.target as HTMLInputElement).value));
  if (playerRot.value) playerRot.value[axis] = val;
};
const updateEnemyRot = (axis: 'x'|'y'|'z', event: Event) => {
  const val = degToRad(Number((event.target as HTMLInputElement).value));
  if (selectedEnemy.value && selectedEnemy.value.startRotation) selectedEnemy.value.startRotation[axis] = val;
};
const updatePlayerPathRot = (axis: 'x'|'y'|'z', event: Event) => {
  const val = degToRad(Number((event.target as HTMLInputElement).value));
  if (playerSelectedPoint.value && playerSelectedPoint.value.rotation) playerSelectedPoint.value.rotation[axis] = val;
};
const updateEnemyPathRot = (axis: 'x'|'y'|'z', event: Event) => {
  const val = degToRad(Number((event.target as HTMLInputElement).value));
  if (enemySelectedPoint.value && enemySelectedPoint.value.rotation) enemySelectedPoint.value.rotation[axis] = val;
};
</script>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
}
.panel-header {
  font-size: 14px;
  font-weight: bold;
  color: #aeb4c4;
  margin-bottom: 8px;
}
.panel-content {
  font-size: 13px;
  color: #ccc;
  background: #1e1e1e;
  padding: 12px;
  border-radius: 4px;
}
.panel-content.empty {
  color: #888;
  font-style: italic;
  text-align: center;
}
.prop-title {
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 8px;
  color: #fff;
}
.prop-title:first-child {
  margin-top: 0;
}
.prop-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.prop-row select, .prop-row input {
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 4px 8px;
  border-radius: 4px;
  width: 120px;
}
.coord-inputs {
  display: flex;
  gap: 8px;
}
.coord-inputs label {
  display: flex;
  align-items: center;
  gap: 4px;
}
.coord-inputs input {
  width: 50px;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  padding: 4px;
  border-radius: 2px;
}
.hint {
  font-size: 11px;
  color: #888;
  margin-left: 8px;
}
</style>
