import { onMounted, onUnmounted } from 'vue';

export function useResize(resizeFn: (width: number, height: number) => void) {
  const onResize = () => {
    resizeFn(window.innerWidth, window.innerHeight);
  };

  onMounted(() => {
    window.addEventListener('resize', onResize);
    // 初期サイズ適用
    onResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });
}
