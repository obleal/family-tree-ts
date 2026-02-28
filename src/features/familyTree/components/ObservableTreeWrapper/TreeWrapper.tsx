import { useEffect, useRef } from "react";
import { Tree } from "./Tree";

type TreeWrapperProps<T> = {
  data: T;
  options?: Parameters<typeof Tree>[1]; // pass any Tree options
};

export function TreeWrapper<T>({
  data,
  options
}: TreeWrapperProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    containerRef.current.innerHTML = "";

    // Call the original Tree function
    const svgNode = Tree(data, options);

    if (svgNode) {
      containerRef.current.appendChild(svgNode);
    }
  }, [data, options]);

  return <div ref={containerRef} />;
}