import { useEffect, useState } from "react";
import type { Family } from "./validators/familyValidator";
import { fetchFamily } from "./api/fetchFamily";
import { buildFamilyTree } from "./api/buildTree";
import type { FamilyTreeNode } from "./api/buildTree";
import { Loading } from "./components/Loading";
import { getTreeHeight, countTreeMembers, getRoots } from "./utils/familyUtils";

export default function App() {
  const [family, setFamily] = useState<Family | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFamily()
      .then(setFamily)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!family) return <Loading />;

  const tree: FamilyTreeNode[] = buildFamilyTree(family.members);

  // Tree statistics
  const totalNodes = countTreeMembers(tree);
  const treeHeight = getTreeHeight(tree);
  const rootCount = getRoots(tree).length;

  // Running counter
  let counter = 1;

  // Recursive function to render names with both counters
  const renderNames = (nodes: FamilyTreeNode[], prefix: number[] = []) => {
    return (
      <ul style={{ paddingLeft: `${prefix.length * 20}px`, listStyleType: "none" }}>
        {nodes.map((node, index) => {
          // Increment hierarchical prefix
          const currentPrefix = [...prefix, index + 1];
          const hierarchicalCounter = currentPrefix.join(".");
          const currentCount = counter++;

          return (
            <li key={node.id}>
              {currentCount}. {hierarchicalCounter} {node.first_name}{" "}
              {node.middle_name ? node.middle_name + " " : ""}
              {node.last_name} (Children: {node.children.length}, Level: {prefix.length})
              {node.children.length > 0 && renderNames(node.children, currentPrefix)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={{ width: "100%", padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>{family.name}</h1>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Tree Statistics:</strong>
        <ul>
          <li>Total nodes: {totalNodes}</li>
          <li>Root nodes (founders): {rootCount}</li>
          <li>Tree height (max generations): {treeHeight}</li>
        </ul>
      </div>

      <div>
        <strong>Family Members:</strong>
        {renderNames(tree)}
      </div>
    </div>
  );
}
