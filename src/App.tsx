import { useEffect, useState } from "react";
import type { Family, FamilyTreeNode} from "./features/familyTree/types/types";
import { getFamilyData } from "./features/familyTree/api/getFamilyData";
import { buildFamilyTree } from "./features/familyTree/api/buildFamilyTree";
import { Loading } from "./components/Loading/Loading";
import { computeRadialLayout, polarToCartesianSafe } from "./features/familyTree/utils/radialLayout";
import { getTreeHeight } from "./features/familyTree/utils/familyTreeUtils";
import { FamilyNode } from "./features/familyTree/components/FamilyNode/FamilyNode";
import { FamilyTreeStatistics } from "./features/familyTree/components/FamilyTreeStatistics/FamilyTreeStatistics";
import { FamilyNodeInfoBox } from "./features/familyTree/components/FamilyNodeInfoBox/FamilyNodeInfoBox";
// import "./index.css"
// import "./App.css"; // Import the CSS for the app

const WIDTH = 1800;
const HEIGHT = 1800;
const CENTER = WIDTH / 2;
const RADIUS_STEP = 120;

export default function App() {
  const [family, setFamily] = useState<Family | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FamilyTreeNode | null>(null);

  useEffect(() => {
    getFamilyData("/family.json")
      .then(setFamily)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!family) return <Loading />;

  const tree: FamilyTreeNode = buildFamilyTree(family);

  const treeHeight = getTreeHeight(tree);

  const root = computeRadialLayout(tree, RADIUS_STEP);


  return (
    <div
      style={{
        width: "100%",
        padding: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1>{family.name}</h1>

      <FamilyTreeStatistics root={tree} />

      {/* Tree Container */}
      <div
        style={{
          position: "relative",
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        {/* Info Box Overlay */}
        {selectedNode && (
          <div className="info-overlay">
            <FamilyNodeInfoBox node={selectedNode} />
          </div>
        )}

        {/* SVG */}
        <svg width={WIDTH} height={HEIGHT}>
          <g transform={`translate(${CENTER}, ${CENTER})`}>
            {/* Generation rings */}
            {Array.from({ length: treeHeight -1 }).map((_, i) => (
              <circle
                key={i}
                r={(i + 1) * RADIUS_STEP}
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
                  x={x - 40}      // center horizontally
                  y={y - 16}      // center vertically, leave room
                  width={88}
                  height={56}     // enough space for padding + scale
                  overflow="visible"
                >
                  <FamilyNode
                    node={node.data}
                    onSelect={setSelectedNode}
                    isSelected={selectedNode?.self.id === node.data.self.id}
                  />
                </foreignObject>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
