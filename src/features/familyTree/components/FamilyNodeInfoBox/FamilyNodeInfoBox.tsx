import type { Person } from "../../types/types";
import type { HierarchyPointNode } from "d3-hierarchy";
import { PersonSchema } from "../../types/schemas";
import "./FamilyNodeInfoBox.css";

function formatFieldName(field: string) {
    return field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFieldValue(value: unknown) {
    return value !== null && value !== undefined ? String(value) : "-";
}

interface Props {
    node?: HierarchyPointNode<Person> | null;
}

export function FamilyNodeInfoBox({ node }: Props) {
    // Use actual data if node exists, otherwise default empty values
    const person: Partial<Person> = node?.data ?? {};

    const fields = Object.entries(PersonSchema.shape)
        .filter(([_, schema]) => schema.description !== "hidden")
        .map(([key]) => key) as (keyof Person)[];

    return (
        <div className="family-node-info-box">
            {/* Header */}
            <h3 className="info-header">Personal Information</h3>

            {/* Fields */}
            {fields.map((field) => (
                <p key={field}>
                    <span className="field-name">{formatFieldName(field)}:</span>
                    <span className="field-value">{formatFieldValue(person[field])}</span>
                </p>
            ))}

            {/* Number of children */}
            <p>
                <span className="field-name">Number of Children:</span>
                <span className="field-value">{node ? node.children?.length ?? 0 : "-"}</span>
            </p>

            {/* Number of descendants */}
            <p>
                <span className="field-name">Number of Descendants:</span>
                <span className="field-value">{node ? node.descendants().length - 1 : "-"}</span>
            </p>
        </div>
    );
}