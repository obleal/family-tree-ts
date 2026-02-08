import { useEffect, useState } from "react";
import type { Family } from "./validators/familyValidator";
import { fetchFamily } from "./api/fetchFamily";
import { buildFamilyTree } from "./api/buildTree";
import type { FamilyTreeNode } from "./api/buildTree";
import { Loading } from "./components/Loading";
import { computeRadialLayout, polarToCartesianSafe } from "./utils/radialLayout";
import { FamilyNode } from "./components/FamilyNode";
import { getTreeHeight } from "./utils/familyUtils";
import { FamilyTreeStatistics } from "./components/FamilyTreeStatistics";

const WIDTH = 2000;
const HEIGHT = 2000;
const CENTER = WIDTH / 2;

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

  const treeHeight = getTreeHeight(tree);

  const root = computeRadialLayout(tree);


  return (
    <div style={{ width: "100%", padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>{family.name}</h1>

      <FamilyTreeStatistics root={tree} />

      <svg width={WIDTH} height={HEIGHT}>
        <g transform={`translate(${CENTER}, ${CENTER})`}>
          {/* Generation rings */}
          {Array.from({ length: treeHeight-1 }).map((_, i) => (
            <circle
              key={i}
              r={(i + 1) * 120}
              fill="none"
              stroke="#eee"
            />
          ))}

          {/* Links */}
          {root.links().map((link, i) => {
            const source = polarToCartesianSafe(link.source.x, link.source.y);
            const target = polarToCartesianSafe(link.target.x, link.target.y);

            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#ccc"
              />
            );
          })}

          {/* Nodes */}
          {root.descendants().map((node, i) => {
            const { x, y } = polarToCartesianSafe(node.x, node.y);

            return (
              <foreignObject
                key={i}
                x={x - 40}
                y={y - 16}
                width={80}
                height={32}
              >
                <FamilyNode node={node.data} />
              </foreignObject>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
