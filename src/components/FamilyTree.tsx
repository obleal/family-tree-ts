import type { FamilyTreeNode } from "../api/buildTree";

interface Props {
  nodes: FamilyTreeNode[];
  prefix?: string; // for hierarchical numbering
}

export function FamilyTree({ nodes, prefix = "" }: Props) {
  return (
    <ul>
      {nodes.map((node, index) => {
        const currentPrefix = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
        return (
          <li key={node.id}>
            {currentPrefix} {node.first_name} {node.middle_name ?? ""} {node.last_name}{" "}
            {node.alias ? `(aka ${node.alias})` : ""}
            {node.children.length > 0 && (
              <FamilyTree nodes={node.children} prefix={currentPrefix} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
