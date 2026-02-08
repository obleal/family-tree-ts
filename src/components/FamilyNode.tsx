import './FamilyNode.css';
import type { FamilyTreeNode } from "../api/buildTree";

export function FamilyNode({ node }: { node: FamilyTreeNode }) {
    const displayName = `${node.self.first_name}`;
    return <button className="family-node-btn">{displayName}</button>;
}
