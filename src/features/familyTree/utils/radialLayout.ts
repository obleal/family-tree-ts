import * as d3 from "d3";
import type { HierarchyPointNode } from "d3-hierarchy";
import type { FamilyTreeNode } from "../types/types";

export function computeRadialLayout(
  tree: FamilyTreeNode,
  radiusStep = 120
): HierarchyPointNode<FamilyTreeNode> {
  const root = d3.hierarchy(tree, d => d.children);

  const radius = root.height * radiusStep;

  const layout = d3
    .tree<FamilyTreeNode>()
    .size([2 * Math.PI, radius]);

  const layoutRoot = layout(root);

  return layoutRoot;
}

export function polarToCartesian(angle: number, radius: number) {
  return {
    x: radius * Math.cos(angle - Math.PI / 2),
    y: radius * Math.sin(angle - Math.PI / 2),
  };
}