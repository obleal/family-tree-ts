import type { HierarchyPointNode } from "d3-hierarchy";
import type { FamilyTreeNode } from "../../types/types";
import { polarToCartesian } from "../../utils/radialLayout";
import { FamilyNode } from "../FamilyNode/FamilyNode";
import { WIDTH, HEIGHT, CENTER, RADIUS_STEP } from "./constants";

interface Props {
  layoutRoot: HierarchyPointNode<FamilyTreeNode>;
  selectedNode: FamilyTreeNode | null;
  onSelect: (node: FamilyTreeNode) => void;
}

export function TreeSvg({
  layoutRoot,
  selectedNode,
  onSelect,
}: Props) {
  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT }}>
      <svg width={WIDTH} height={HEIGHT}>
        <g transform={`translate(${CENTER}, ${CENTER})`}>
          
          {/* Rings */}
          {Array.from({ length: layoutRoot.height }).map((_, i) => (
            <circle
              key={i}
              r={(i + 1) * RADIUS_STEP}
              fill="none"
              stroke="#eee"
            />
          ))}

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

            return (
              <foreignObject
                key={i}
                x={x - 40}
                y={y - 16}
                width={88}
                height={56}
                overflow="visible"
              >
                <FamilyNode
                  node={node.data}
                  onSelect={onSelect}
                  isSelected={
                    selectedNode?.self.id === node.data.self.id
                  }
                />
              </foreignObject>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
