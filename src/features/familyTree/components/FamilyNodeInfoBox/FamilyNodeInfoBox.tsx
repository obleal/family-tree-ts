import type { FamilyTreeNode } from "../../types/types";
import { PersonSchema } from "../../types/schemas";
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
    const fields = Object.entries(PersonSchema.shape)
        .filter(([_, schema]) => schema.description !== "hidden")
        .map(([key]) => key) as (keyof typeof self)[];
        
    return (
        <div className="family-node-info-box">
            {/* Header */}
            <h3 className="info-header">Personal Information</h3>

            {/* Fields */}
            {fields.map((field) => (
                <p key={field}>
                    <span className="field-name">{formatFieldName(field)}:</span> 
                    <span className="field-value">{formatFieldValue(self[field])}</span>
                </p>
            ))}

            {/* Number of children */}
            <p>
                <span className="field-name">Number of Children:</span>
                <span className="field-value">{node.children.length}</span>
            </p>
        </div>
    );
}
