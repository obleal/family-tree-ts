import type { FamilyMember } from "../validators/familyValidator";

export interface FamilyTreeNode extends FamilyMember {
  children: FamilyTreeNode[];
}

export function buildFamilyTree(members: FamilyMember[]): FamilyTreeNode[] {
  const map = new Map<string, FamilyTreeNode>();

  members.forEach((m) => {
    map.set(m.id, { ...m, children: [] });
  });

  const roots: FamilyTreeNode[] = [];

  map.forEach((node) => {
    if (node.parent) {
      const parentNode = map.get(node.parent);
      if (parentNode) parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
