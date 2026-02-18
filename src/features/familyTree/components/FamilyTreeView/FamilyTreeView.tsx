import { useState } from "react";
import type { Family, FamilyTreeNode } from "../../types/types";
import { buildFamilyTree } from "../../api/buildFamilyTree";
import { computeRadialLayout } from "../../utils/radialLayout";
import { getTreeHeight } from "../../utils/familyTreeUtils";
import { FamilyTreeStatistics } from "../FamilyTreeStatistics/FamilyTreeStatistics";
import { FamilyNodeInfoBox } from "../FamilyNodeInfoBox/FamilyNodeInfoBox";
import { TreeSvg } from "./TreeSvg";
import { RADIUS_STEP } from "./constants";

interface Props {
  family: Family;
}

export function FamilyTreeView({ family }: Props) {
  const [selectedNode, setSelectedNode] =
    useState<FamilyTreeNode | null>(null);

  const tree = buildFamilyTree(family);
  const treeHeight = getTreeHeight(tree);
  const layoutRoot = computeRadialLayout(tree, RADIUS_STEP);

  return (
    <>
      <h1>{family.name}</h1>

      <FamilyTreeStatistics root={tree} />

      {selectedNode && (
        <div className="info-overlay">
          <FamilyNodeInfoBox node={selectedNode} />
        </div>
      )}

      <TreeSvg
        layoutRoot={layoutRoot}
        treeHeight={treeHeight}
        selectedNode={selectedNode}
        onSelect={setSelectedNode}
      />
    </>
  );
}
