import type { FamilyTreeNode } from "../api/buildTree";
import { getTreeHeight, countTreeMembers } from "../utils/familyUtils";
import "./FamilyTreeStatistics.css";

export function FamilyTreeStatistics({ root }: { root: FamilyTreeNode }) {
  const totalNodes = countTreeMembers(root);
  const treeHeight = getTreeHeight(root);

  return (
    <div className="family-tree-stats">
      <div className="stats-header">
        Family Tree Overview
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Members</span>
          <span className="stat-value">{totalNodes}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Generations</span>
          <span className="stat-value">{treeHeight}</span>
        </div>
      </div>
    </div>
  );
}
