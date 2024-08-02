type TIsMaxWidthWindow = (value: number) => boolean;

const isMaxWidthWindow: TIsMaxWidthWindow = (value = 0) =>
  window?.matchMedia(`(max-width: ${value}px)`)?.matches;

export { isMaxWidthWindow as default };
