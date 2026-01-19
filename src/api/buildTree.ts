import type { FamilyMember } from "../validators/familyValidator";

export interface FamilyTreeNode extends FamilyMember {
  children: FamilyTreeNode[];
}

export function buildFamilyTree(members: FamilyMember[]): FamilyTreeNode {
  const map = new Map<string, FamilyTreeNode>();
  members.forEach((m) => { map.set(m.id, { ...m, children: [] }); });
  let root: FamilyTreeNode | null = null;
  map.forEach((node) => {
    if (node.parent) {
      const parentNode = map.get(node.parent);
      if (parentNode) parentNode.children.push(node);
    } else {
      if (root) throw new Error(`Multiple root members found: '${root.id}' and '${node.id}'`);
      root = node;
    }
  });
  if (!root) throw new Error("No root member found (member without parent)");
  return root;
}
