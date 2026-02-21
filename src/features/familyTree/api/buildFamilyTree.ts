import * as d3 from "d3";
import type { HierarchyNode, HierarchyPointNode } from "d3-hierarchy";
import type { Family, Person } from "../types/types";

/**
 * Build a hierarchical family tree from a flat array of members.
 * Each node wraps the original member in `data` and includes `children`, `parent`, `depth`, and `height`.
 * See https://d3js.org/d3-hierarchy/hierarchy for hierarchy details.
 *
 * @param family - Object containing a a flat `members` array.
 * @returns The root of the family tree as HierarchyNode<Person>.
 */
export function buildTree({
  family,
}: {
  family: Family;
}): HierarchyNode<Person> {

  const { members } = family;

  const stratifyFunc = d3
    .stratify<Person>()
    .id(d => d.id)
    .parentId(d => d.parent || null);

  return stratifyFunc(members);
}

/**
 * Apply a radial layout to an existing hierarchy.
 *
 * Adds `x` and `y` coordinates to each node using d3.tree().
 *
 * @param tree - Root hierarchy node.
 * @param radiusStep - Distance between generations.
 * @returns Root node as HierarchyPointNode<Person>.
 */
export function layoutTree({
  tree,
  radiusStep = 120,
}: {
  tree: HierarchyNode<Person>;
  radiusStep?: number;
}): HierarchyPointNode<Person> {

  // Optional sorting (mutates hierarchy)
  tree.sort((a, b) => d3.descending(a.data.first_name, b.data.first_name));

  // Calculate outer radius
  const radius = tree.height * radiusStep;

  // Create layout func
  const layoutFunc = d3
    .tree<Person>()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  // Return the tree root with layout coordinates
  return layoutFunc(tree);
}

/**
 * Convenience function that builds the hierarchy
 * and immediately applies the radial layout.
 *
 * Useful when the tree does not need to be manipulated
 * between build and layout steps.
 *
 * @param family - Family object containing flat member data.
 * @param radiusStep - Optional generation spacing (default: 120).
 * @returns Root node with layout coordinates (HierarchyPointNode<Person>).
 */
export function buildAndLayoutTree({
  family,
  radiusStep = 120,
}: {
  family: Family;
  radiusStep?: number;
}): HierarchyPointNode<Person> {

  const tree = buildTree({ family: family });
  const treeLayout = layoutTree({ tree: tree, radiusStep: radiusStep });

  return treeLayout;
}
