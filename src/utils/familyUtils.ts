import type { FamilyMember } from "../validators/familyValidator";
import type { FamilyTreeNode } from "../api/buildTree";

// =============================
// BASIC INSPECTION (FLAT DATA)
// =============================

export function getTotalMembers(members: FamilyMember[]): number {
  return members.length;
}

export function findMemberById(
  members: FamilyMember[],
  id: string
): FamilyMember | undefined {
  return members.find((m) => m.id === id);
}

export function getChildrenFlat(
  members: FamilyMember[],
  parentId: string
): FamilyMember[] {
  return members.filter((m) => m.parent === parentId);
}

export function getChildrenCountFlat(
  members: FamilyMember[],
  parentId: string
): number {
  return getChildrenFlat(members, parentId).length;
}

export function getSiblingsFlat(
  members: FamilyMember[],
  id: string
): FamilyMember[] {
  const member = findMemberById(members, id);
  if (!member || !member.parent) return [];

  return members.filter(
    (m) => m.parent === member.parent && m.id !== id
  );
}

export function getAncestorsFlat(
  members: FamilyMember[],
  id: string
): FamilyMember[] {
  const map = new Map(members.map((m) => [m.id, m]));
  const ancestors: FamilyMember[] = [];

  let current = map.get(id);
  while (current?.parent) {
    const parent = map.get(current.parent);
    if (!parent) break;
    ancestors.push(parent);
    current = parent;
  }

  return ancestors;
}

// =============================
// TREE-BASED INSPECTION
// =============================

export function findNodeById(
  nodes: FamilyTreeNode[],
  id: string
): FamilyTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
}

export function getChildrenCount(node: FamilyTreeNode): number {
  return node.children.length;
}

export function getDescendants(node: FamilyTreeNode): FamilyTreeNode[] {
  const result: FamilyTreeNode[] = [];

  function traverse(n: FamilyTreeNode) {
    for (const child of n.children) {
      result.push(child);
      traverse(child);
    }
  }

  traverse(node);
  return result;
}

export function countDescendants(node: FamilyTreeNode): number {
  return getDescendants(node).length;
}

export function getNodeLevel(
  nodes: FamilyTreeNode[],
  id: string,
  level = 0
): number | null {
  for (const node of nodes) {
    if (node.id === id) return level;
    const childLevel = getNodeLevel(node.children, id, level + 1);
    if (childLevel !== null) return childLevel;
  }
  return null;
}

// Count total nodes in a tree
export function countTreeMembers(nodes: FamilyTreeNode[]): number {
  return nodes.reduce(
    (sum, node) => sum + 1 + countTreeMembers(node.children),
    0
  );
}

// Get tree height (max generations)
export function getTreeHeight(nodes: FamilyTreeNode[]): number {
  if (nodes.length === 0) return 0;
  return Math.max(...nodes.map((node) => 1 + getTreeHeight(node.children)));
}

// Get root nodes (founders)
export function getRoots(nodes: FamilyTreeNode[]): FamilyTreeNode[] {
  return nodes; // The top-level array returned by buildFamilyTree
}