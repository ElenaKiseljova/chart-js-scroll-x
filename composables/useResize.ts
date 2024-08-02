type TW = {
  [key: string]: number;
};

type TWatch = 'both' | 'width' | 'height';

type TOptions = { watch: TWatch };

type TCallback = () => void;

type TUseResize = (callback?: TCallback, options?: TOptions) => { w: TW };

export const useResize: TUseResize = (callback, options) => {
  // Watch settings
  const defaultOptions: TOptions = {
    watch: 'both',
  };

  options = {
    ...defaultOptions,
    ...(options || {}),
  };

  const w = reactive<TW>({});

  onMounted(() => {
    window.addEventListener('resize', resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });

  // Handler resize window
  const resizeHandler = () => {
    const MIN_DIFF_VALUE = 1;

    const diffW = Math.abs((w.width || 0) - window.innerWidth);
    const diffH = Math.abs((w.height || 0) - window.innerHeight);

    if (diffW >= MIN_DIFF_VALUE || diffH >= MIN_DIFF_VALUE) {
      if (
        typeof callback === 'function' &&
        (options.watch === 'both' ||
          (options.watch === 'width' && diffW >= MIN_DIFF_VALUE) ||
          (options.watch === 'height' && diffH >= MIN_DIFF_VALUE))
      ) {
        callback();
      }

      // Update information about window size
      w.width = window.innerWidth;
      w.height = window.innerHeight;
    }
  };

  return {
    w,
  };
};
