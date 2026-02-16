import type { Family, FamilyTreeNode } from "../types/types";

/**
  * Build a family tree from a flat list of family members.
  * 
  * @param family The family object containing the members array.
  * @returns The root node of the family tree.
  */ 
export function buildFamilyTree(family: Family): FamilyTreeNode {

  // Extract members from the family object
  const { members } = family;

  // Auxiliar id-to-node map for easy lookup
  const map = new Map<string, FamilyTreeNode>();

  // Build an id-to-node map and initialize each node with empty children
  members.forEach((m) => {
    map.set(m.id, { self: m, children: [] });
  });

  // Variable to hold the root node
  let root!: FamilyTreeNode;

  // Populate the children arrays of each node
  map.forEach((node) => {

    // If the node has a parent
    if (node.self.parent) {

      // Find the parent node 
      const parent = map.get(node.self.parent)!;

      // Add this node to its children
      parent.children.push(node);

      // If the node has no parent
    } else {

      // Is the root of the tree
      root = node;
    }
  });

  // Return the root node
  return root;
}
