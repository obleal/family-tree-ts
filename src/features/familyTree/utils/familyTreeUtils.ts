import type { FamilyTreeNode } from "../types/types";

/**
 * Count all descendants of a node (excluding the node itself)
 */
export function countDescendants(node: FamilyTreeNode): number {
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

/**
 * Count all nodes in a tree including the node itself
 */
export function countAllNodes(node: FamilyTreeNode): number {
  return 1 + countDescendants(node);
}

/**
 * Get the height of the tree.
 * A single node has height 1.
 */
export function getTreeHeight(node: FamilyTreeNode): number {
  if (node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(getTreeHeight));
}

/**
 * Recursively find a node by its ID.
 * Returns the node if found, otherwise null.
 */
export function findNodeById(node: FamilyTreeNode, id: string): FamilyTreeNode | null {
  if (node.self.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Get the number of direct children of a node
 */
export function getChildrenCount(node: FamilyTreeNode): number {
  return node.children.length;
}

/**
 * Get the level (depth) of a node in the tree by ID.
 * The root node has level 0.
 * Returns null if node is not found.
 */
export function getNodeLevel(node: FamilyTreeNode, id: string, level = 0): number | null {
  if (node.self.id === id) return level;
  for (const child of node.children) {
    const childLevel = getNodeLevel(child, id, level + 1);
    if (childLevel !== null) return childLevel;
  }
  return null;
}
