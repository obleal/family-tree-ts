import * as d3 from "d3";
import type { HierarchyPointNode } from "d3-hierarchy";
import type { FamilyTreeNode } from "../types/types";

export function computeRadialLayout(
  tree: FamilyTreeNode,
  radiusStep = 120
): HierarchyPointNode<FamilyTreeNode> {
  
  // Create and sort the tree
  const root = d3.hierarchy(tree, d => d.children)
                  .sort((a, b) => d3.descending(a.data.self.first_name, b.data.self.first_name));
  
  // Calculate outter radius based on tree height
  const radius = root.height * radiusStep;

  // Create radial tree layout
  const layout = d3.tree<FamilyTreeNode>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  // Apply layout to the hierarchy and return the positioned nodes
  return layout(root);
}

export function polarToCartesian(angle: number, radius: number) {
  return {
    // The -90 rotates so 0° is “up” instead of “right”.
    x: radius * Math.cos(angle - Math.PI / 2), 
    y: radius * Math.sin(angle - Math.PI / 2), 
  };
}
