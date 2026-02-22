import type { HierarchyPointNode } from "d3-hierarchy";
import type { Family, Person } from "../../types/types";
import { useState } from "react";
import { buildAndLayoutTree } from "../../api/build";
import { FamilyTreeStatistics } from "../FamilyTreeStatistics/FamilyTreeStatistics";
import { FamilyNodeInfoBox } from "../FamilyNodeInfoBox/FamilyNodeInfoBox";
import { TreeSvg } from "./TreeSvg";
import { RADIUS_STEP } from "./constants";
import "./FamilyTreeView.css";

export function FamilyTreeView({
  family
}: {
  family: Family;
}) {
  const [selectedNode, setSelectedNode] = useState<HierarchyPointNode<Person> | null>(null);

  const tree = buildAndLayoutTree({ family: family, radiusStep: RADIUS_STEP });

  return (
    <>
      {/* Left fixed panel */}
      <div className="family-info-panel">
        <h1>{family.name}</h1>

        {/* Tree stats */}
        <FamilyTreeStatistics root={tree} />

        {/* Selected node info */}
        <FamilyNodeInfoBox node={selectedNode} />
      </div>

      {/* Tree area */}
      <div className="tree-container">
        <TreeSvg
          root={tree}
          selectedNode={selectedNode}
          onSelect={setSelectedNode}
        />
      </div>
    </>
  );
}
