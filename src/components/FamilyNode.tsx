import './FamilyNode.css';
import type { TreeNode } from "../api/buildTree";

export function FamilyNode({
  node,
  onSelect,
  isSelected,
}: {
  node: TreeNode;
  onSelect: (node: TreeNode) => void;
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
