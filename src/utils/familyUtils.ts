import type { FamilyTreeNode } from "../api/buildTree";

/**
 * Recursively find a node by ID
 */
export function findNodeById(root: FamilyTreeNode, id: string): FamilyTreeNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Get number of direct children
 */
export function getChildrenCount(node: FamilyTreeNode): number {
  return node.children.length;
}

/**
 * Get all descendants of a node (excluding the node itself)
 */
export function getDescendants(node: FamilyTreeNode): FamilyTreeNode[] {
  const descendants: FamilyTreeNode[] = [];

  function traverse(current: FamilyTreeNode) {
    for (const child of current.children) {
      descendants.push(child);
      traverse(child);
    }
  }

  traverse(node);
  return descendants;
}

/**
 * Count all descendants
 */
export function countDescendants(node: FamilyTreeNode): number {
  return getDescendants(node).length;
}

/**
 * Get the level of a node in the tree
 * Level of root is 0
 */
export function getNodeLevel(root: FamilyTreeNode, id: string, level = 0): number | null {
  if (root.id === id) return level;
  for (const child of root.children) {
    const childLevel = getNodeLevel(child, id, level + 1);
    if (childLevel !== null) return childLevel;
  }
  return null;
}

/**
 * Count all nodes in the tree including the root
 */
export function countTreeMembers(root: FamilyTreeNode): number {
  return 1 + root.children.reduce((sum, child) => sum + countTreeMembers(child), 0);
}

/**
 * Get the height of the tree
 * Height of a single node is 1
 */
export function getTreeHeight(root: FamilyTreeNode): number {
  if (root.children.length === 0) return 1;
  return 1 + Math.max(...root.children.map(getTreeHeight));
}
