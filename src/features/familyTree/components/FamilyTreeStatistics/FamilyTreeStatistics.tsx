import type { Person } from "../../types/types";
import type { HierarchyPointNode } from "d3-hierarchy";
import "./FamilyTreeStatistics.css";

interface Props {
  root: HierarchyPointNode<Person>;
}

export function FamilyTreeStatistics({ root }: Props) {
  return (
    <div className="family-tree-stats">
      <div className="stats-header">
        Overview
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Members</span>
          <span className="stat-value">{root.descendants().length}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Generations</span>
          <span className="stat-value">{root.height + 1}</span>
        </div>
      </div>
    </div>
  );
}
