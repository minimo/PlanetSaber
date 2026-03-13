import { onMounted, onUnmounted } from 'vue';

export function useGameLoop(updateFn: () => void) {
  let animationFrameId: number;
  let isRunning = false;

  const loop = () => {
    if (!isRunning) return;
    updateFn();
    animationFrameId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (isRunning) return;
    isRunning = true;
    loop();
  };

  const stop = () => {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return { start, stop };
}
