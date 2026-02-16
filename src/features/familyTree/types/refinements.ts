import type { Person } from "./types";

export const checkDuplicates = (members: Person[]): boolean => {
    const ids = new Set<string>();
    const duplicates = new Set<string>();

    for (const member of members) {
        if (ids.has(member.id)) duplicates.add(member.id);
        else ids.add(member.id);
    }

    if (duplicates.size > 0)
        console.error(`Duplicate ID(s) found: ${[...duplicates].join(", ")}`);

    return duplicates.size === 0;
};

export const checkMissingParents = (members: Person[]): boolean => {
    const ids = new Set(members.map(person => person.id));
    const parents = members.map(person => person.parent)

    const missing = parents.filter(
        (parent): parent is string =>
            parent !== null && !ids.has(parent)
    );

    if (missing.length > 0)
        console.error(`Missing parent ID(s): ${[...new Set(missing)].join(", ")}`);

    return missing.length === 0;
};

export const checkSingleRoot = (members: Person[]): boolean => {
    const roots = members.filter(person => person.parent === null);

    if (roots.length !== 1) {
        if (roots.length === 0) {
            console.error("No root found (parent=null required)");
        } else {
            console.error(`Multiple roots found: ${roots.map(r => r.id).join(", ")}`);
        }
    }

    return roots.length === 1;
};
