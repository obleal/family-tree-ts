export function polarToCartesian(angle: number, radius: number) {
  return {
    // Rotates so 0 is “up” instead of “right”
    x: radius * Math.cos(angle - Math.PI / 2), 
    y: radius * Math.sin(angle - Math.PI / 2), 
  };
}