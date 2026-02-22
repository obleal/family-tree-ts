import type { HierarchyPointNode } from "d3-hierarchy";
import type { Person } from "../../types/types";
import './FamilyNode.css';

interface Props {
  node: HierarchyPointNode<Person>;
  onSelect: (person: HierarchyPointNode<Person>) => void;
  isSelected?: boolean;
}

export function FamilyNode({ node, onSelect, isSelected }: Props) {
  return (
    <button
      className={`family-node-btn ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(node)}
    >
      {node.data.first_name}
    </button>
  );
}
