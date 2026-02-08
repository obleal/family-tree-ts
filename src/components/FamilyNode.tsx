import './FamilyNode.css';
import type { FamilyTreeNode } from "../api/buildTree";

export function FamilyNode({ node }: { node: FamilyTreeNode }) {
  const displayName = `${node.self.first_name} ${node.self.middle_name ?? ""} ${node.self.last_name} ${node.self.alias ? `(${node.self.alias})` : ""}`;
  return <button className="family-node">{displayName}</button>;
}
