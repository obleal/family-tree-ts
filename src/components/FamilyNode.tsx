import './FamilyNode.css';
import type { FamilyTreeNode } from "../api/buildTree";

export function FamilyNode({
  node,
  onSelect,
  isSelected,
}: {
  node: FamilyTreeNode;
  onSelect: (node: FamilyTreeNode) => void;
  isSelected?: boolean;
}) {
  const displayName = node.self.first_name;

  return (
    <button
      className={`family-node-btn ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(node)}
    >
      {displayName}
    </button>
  );
}
