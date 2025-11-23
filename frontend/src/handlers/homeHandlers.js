export const mouseRotationHandler = (elementRef, setMousePosition) => {
  return (event) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - 150).toFixed() / 40;
    const y = (event.clientY - rect.top - 150).toFixed() / 20;

    setMousePosition({
      x: x > 0 ? -x * 8 : -x * 2,
      y: y * 3,
    });
  };
};
