import { prisma } from "../config/prisma";

export async function getProjectTreeSnapshot(surfaceId: string): Promise<string> {
    const nodes = await prisma.node.findMany({
        where: { surfaceId },
        orderBy: [
            { position: 'asc' },
            { name: 'asc' }
        ],
        select: {
            id: true,
            name: true,
            isFolder: true,
            parentId: true,
        },
    });

    if (nodes.length === 0) {
        return '(empty surface – no files or folders yet)';
    }

    // Build a map of parentId → children array
    const childrenMap = new Map<string | null, typeof nodes>();
    for (const node of nodes) {
        const parentKey = node.parentId ?? null;
        if (!childrenMap.has(parentKey)) {
            childrenMap.set(parentKey, []);
        }
        childrenMap.get(parentKey)!.push(node);
    }

    // Recursive tree builder
    function buildTree(parentId: string | null, prefix = '', isLast = true): string {
        const children = childrenMap.get(parentId) ?? [];
        let result = '';

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const isLastChild = i === children.length - 1;
            const connector = isLastChild ? '└── ' : '├── ';
            const childPrefix = prefix + (isLastChild ? '    ' : '│   ');

            // Append the node name, with a trailing slash for folders
            // Inside the buildTree function
            const displayName = child.isFolder
                ? `${child.name}/ (id: ${child.id})`
                : `${child.name} (id: ${child.id})`;
            result += `${prefix}${connector}${displayName}\n`;

            // Recurse into folders
            if (child.isFolder) {
                result += buildTree(child.id, childPrefix, isLastChild);
            }
        }

        return result;
    }

    // Start building from the root (nodes with parentId === null)
    const treeString = buildTree(null);

    // Remove the trailing newline for a cleaner output
    return treeString.trim();
}