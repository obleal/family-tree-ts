import type { HierarchyPointNode } from "d3-hierarchy";
import type { Family, Person } from "../../types/types";
import { useState } from "react";
import { buildAndLayoutTree } from "../../api/buildFamilyTree";
import { FamilyTreeStatistics } from "../FamilyTreeStatistics/FamilyTreeStatistics";
import { FamilyNodeInfoBox } from "../FamilyNodeInfoBox/FamilyNodeInfoBox";
import { TreeSvg } from "./TreeSvg";
import { RADIUS_STEP } from "./constants";


export function FamilyTreeView({
  family
}: {
  family: Family;
}) {
  const [selectedNode, setSelectedNode] = useState<HierarchyPointNode<Person> | null>(null);
  const tree = buildAndLayoutTree({ family: family, radiusStep: RADIUS_STEP });

  return (
    <>
      <h1>{family.name}</h1>

      <FamilyTreeStatistics root={tree} />

      <div className="info-overlay">
        <FamilyNodeInfoBox node={selectedNode} />
      </div>

      <TreeSvg
        root={tree}
        selectedNode={selectedNode}
        onSelect={setSelectedNode}
      />
    </>
  );
}
