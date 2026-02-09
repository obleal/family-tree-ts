import type { FamilyTreeNode } from "../api/buildTree";
import { FamilyMemberSchema } from "../validators/familyValidator";
import "./FamilyNodeInfoBox.css"; // Import the CSS

function formatFieldName(field: string) {
    return field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFieldValue(value: unknown) {
    return value !== null && value !== undefined ? String(value) : "-";
}

export function FamilyNodeInfoBox({ node }: { node: FamilyTreeNode }) {
    const { self } = node;
    const fields = Object.entries(FamilyMemberSchema.shape)
        .filter(([_, schema]) => schema.description !== "hidden")
        .map(([key]) => key) as (keyof typeof self)[];
        
    return (
        <div className="family-node-info-box">
            {fields.map((field) => (
                <p key={field}>
                    <span className="field-name">{formatFieldName(field)}:</span> 
                    <span className="field-value">{formatFieldValue(self[field])}</span>
                </p>
            ))}
            <p>
                <span className="field-name">Number of Children:</span>
                <span className="field-value">{node.children.length}</span>
            </p>
        </div>
    );
}
