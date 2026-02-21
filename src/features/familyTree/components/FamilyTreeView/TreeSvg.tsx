import type { HierarchyPointNode } from "d3-hierarchy";
import type { FamilyTreeNode } from "../../types/types";
import { polarToCartesian } from "../../utils/radialLayout";
import { FamilyNode } from "../FamilyNode/FamilyNode";
import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, RADIUS_STEP } from "./constants";

interface Props {
  layoutRoot: HierarchyPointNode<FamilyTreeNode>;
  selectedNode: FamilyTreeNode | null;
  onSelect: (node: FamilyTreeNode) => void;
}

export function TreeSvg({ layoutRoot, selectedNode, onSelect }: Props) {
  // Container dimensions
  const width = WIDTH;
  const height = HEIGHT;
  const cx = CENTER_X;
  const cy = CENTER_Y;

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        <g transform={`translate(${cx}, ${cy})`}>
          
          {/* Rings */}
          {Array.from({ length: layoutRoot.height }).map((_, i) => {
            const radius = (i + 1) * RADIUS_STEP;
            return <circle key={i} r={radius} fill="none" stroke="#eee" />;
          })}

          {/* Links */}
          {layoutRoot.links().map((link, i) => {
            const source = polarToCartesian(link.source.x, link.source.y);
            const target = polarToCartesian(link.target.x, link.target.y);
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
          {layoutRoot.descendants().map((node, i) => {
            const { x, y } = polarToCartesian(node.x, node.y);
            const isSelected = selectedNode?.self.id === node.data.self.id;

            return (
              <foreignObject
                key={i}
                x={x - 40}
                y={y - 16}
                width={88}
                height={56}
                overflow="visible"
              >
                <FamilyNode node={node.data} onSelect={onSelect} isSelected={isSelected} />
              </foreignObject>
            );
          })}
        </g>
      </svg>
    </div>
  );
}