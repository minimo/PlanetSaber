import { onMounted, onUnmounted, ref } from 'vue';
import { eventBus } from '../game/core/EventBus';

export function usePointerInput(canvasRef: Ref<HTMLCanvasElement | null>) {
  const pointerX = ref(0);
  const pointerY = ref(0);
  const normalizedX = ref(0); // -1.0 to +1.0
  const normalizedY = ref(0); // -1.0 to +1.0

  const onPointerMove = (e: MouseEvent) => {
    pointerX.value = e.clientX;
    pointerY.value = e.clientY;
    
    normalizedX.value = (e.clientX / window.innerWidth) * 2 - 1;
    normalizedY.value = -(e.clientY / window.innerHeight) * 2 + 1;

    eventBus.emit('input:pointer', { x: normalizedX.value, y: normalizedY.value });
  };

  const onClick = (e: MouseEvent) => {
    if (e.button === 0) {
      eventBus.emit('input:fire', { x: normalizedX.value, y: normalizedY.value });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      eventBus.emit('input:enter');
    }
    if (e.key === 'r' || e.key === 'R') {
      eventBus.emit('input:retry');
    }
    if (e.key === 'Escape') {
      eventBus.emit('input:pause');
    }
  };

  onMounted(() => {
    if (canvasRef.value) {
      canvasRef.value.addEventListener('mousemove', onPointerMove);
      canvasRef.value.addEventListener('click', onClick);
    }
    window.addEventListener('keydown', onKeyDown);
  });

  onUnmounted(() => {
    if (canvasRef.value) {
      canvasRef.value.removeEventListener('mousemove', onPointerMove);
      canvasRef.value.removeEventListener('click', onClick);
    }
    window.removeEventListener('keydown', onKeyDown);
  });

  return { pointerX, pointerY, normalizedX, normalizedY };
}
