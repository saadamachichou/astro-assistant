export function createWidgetState(initialOpen = false) {
  let open = initialOpen;

  return {
    isOpen() {
      return open;
    },
    open() {
      open = true;
    },
    close() {
      open = false;
    },
  };
}
