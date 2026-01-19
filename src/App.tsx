import { useEffect, useState } from "react";
import type { Family } from "./validators/familyValidator";
import { fetchFamily } from "./api/fetchFamily";
import { buildFamilyTree } from "./api/buildTree";
import type { FamilyTreeNode } from "./api/buildTree";
import { Loading } from "./components/Loading";
import { getTreeHeight, countTreeMembers } from "./utils/familyUtils";

export default function App() {
  const [family, setFamily] = useState<Family | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFamily("/family.json")
      .then(setFamily)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!family) return <Loading />;

  const tree: FamilyTreeNode = buildFamilyTree(family.members);

  const totalNodes = countTreeMembers(tree);
  const treeHeight = getTreeHeight(tree);

  let counter = 1;

  // Recursive function with all list items aligned the same
  const renderRecursiveList = (nodes: FamilyTreeNode[], level = 0) => {
    return (
      <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
        {nodes.map((node) => {
          const displayName = `${node.first_name} ${node.middle_name ?? ""} ${node.last_name} ${
            node.alias ? `(${node.alias})` : ""
          }`;

          const currentCount = counter++;

          return (
            <li key={node.id}>
              {currentCount}. {displayName.trim()} (Children: {node.children.length}, Level: {level})
              {node.children.length > 0 && renderRecursiveList(node.children, level + 1)}
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
        <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          <li>Total nodes: {totalNodes}</li>
          <li>Tree height (max generations): {treeHeight}</li>
        </ul>
      </div>

      <div>
        <strong>Family Members:</strong>
        {renderRecursiveList([tree])}
      </div>
    </div>
  );
}
