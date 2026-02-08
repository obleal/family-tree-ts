import type { FamilyMember } from "../validators/familyValidator";

export interface FamilyTreeNode {
  self: FamilyMember;
  children: FamilyTreeNode[];
}

export function buildFamilyTree(members: FamilyMember[]): FamilyTreeNode {
  const map = new Map<string, FamilyTreeNode>();
  members.forEach((m) => { map.set(m.id, { self: m, children: [] }); });
  let root: FamilyTreeNode | null = null;
  map.forEach((node) => {
    if (node.self.parent) {
      const parentNode = map.get(node.self.parent);
      if (parentNode) parentNode.children.push(node);
    } else {
      if (root) throw new Error(`Multiple root members found: '${root.self.id}' and '${node.self.id}'`);
      root = node;
    }
  });
  if (!root) throw new Error("No root member found (member without parent)");
  return root;
}
