import { FunctionDeclaration, Type } from "@google/genai";

// Fields selectable on Node (scalars only – relations like fileBlob are handled separately)
const NODE_SCALAR_FIELDS = [
    "id", "name", "position", "isFolder", "parentId", "fileBlobId",
    "surfaceId", "projectId", "createdAt", "updatedAt"
];

// Fields selectable on FileBlob
const FILEBLOB_FIELDS = [
    "id", "url", "extension", "mimeType", "size", "content",
    "width", "height", "duration", "createdAt", "updatedAt"
];

export const createNodeDeclaration: FunctionDeclaration = {
    name: "createNode",
    description:
        "Creates a new node (file or folder) and optionally an entire subtree of children in one atomic call. " +
        "Use this to scaffold a folder and all its contents at once. " +
        "The node will be placed under an existing parent (if parentId is given) or at the root of the surface.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            surfaceId: {
                type: Type.STRING,
                description: "ID of the surface this node belongs to.",
            },
            name: {
                type: Type.STRING,
                description: "Name of the node (e.g. 'src', 'index.html').",
            },
            isFolder: {
                type: Type.BOOLEAN,
                description: "True for a folder, false for a file.",
            },
            parentId: {
                type: Type.STRING,
                nullable: true,
                description: "ID of the parent folder. Omit to place at the surface root.",
            },
            fileBlobId: {
                type: Type.STRING,
                nullable: true,
                description: "Attach an existing FileBlob to this node (for files).",
            },
            fileBlob: {
                type: Type.OBJECT,
                nullable: true,
                description: "Create a new FileBlob inline for this node (use for new files).",
                properties: {
                    extension: { type: Type.STRING, description: "File extension, e.g. 'png'." },
                    content: { type: Type.STRING, description: "File content (base64 or text)." },
                },
                required: ["extension", "content"],
            },
            children: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        isFolder: { type: Type.BOOLEAN },
                        fileBlob: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                extension: { type: Type.STRING },
                                content: { type: Type.STRING },
                            },
                            required: ["extension", "content"],
                        },
                        children: {
                            type: Type.ARRAY,
                            items: { type: Type.OBJECT }, // recursively same shape, but we keep it simple
                            description: "Nested children (recursive).",
                        },
                    },
                    required: ["name", "isFolder"],
                },
                description: "Optional list of child nodes to create recursively under this node.",
            },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: NODE_SCALAR_FIELDS },
                description: "Which node fields to return after creation. Omit for defaults.",
            },
        },
        required: ["surfaceId", "name", "isFolder"],
    },
};

// ---- listNodes ----
export const listNodesDeclaration: FunctionDeclaration = {
    name: "listNodes",
    description: "Lists nodes (files and folders) in a surface. Use this to browse the tree, check existence, or fetch specific nodes.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            surfaceId: {
                type: Type.STRING,
                description: "ID of the surface whose nodes you want to list.",
            },
            howMany: {
                type: Type.INTEGER,
                nullable: true,
                description: "Maximum number of nodes to return.",
            },
            specificNodes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific node IDs to fetch; omit for all nodes in the surface.",
            },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: NODE_SCALAR_FIELDS },
                description: "Which node fields to return. Omit for defaults.",
            },
        },
        required: ["surfaceId"],
    },
};

// ---- updateNode ----
export const updateNodeDeclaration: FunctionDeclaration = {
    name: "updateNode",
    description: "Updates an existing node's fields (name, folder status, parent, or attached file).",
    parameters: {
        type: Type.OBJECT,
        properties: {
            nodeId: { type: Type.STRING, description: "ID of the node to update." },
            data: {
                type: Type.OBJECT,
                description: "Fields to change – only include what you want to update.",
                properties: {
                    name: { type: Type.STRING },
                    isFolder: { type: Type.BOOLEAN },
                    parentId: { type: Type.STRING, nullable: true },
                    fileBlobId: { type: Type.STRING, nullable: true },
                },
            },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: NODE_SCALAR_FIELDS },
                description: "Which fields of the updated node to return.",
            },
        },
        required: ["nodeId", "data"],
    },
};

// ---- deleteNode ----
export const deleteNodeDeclaration: FunctionDeclaration = {
    name: "deleteNode",
    description: "Deletes a node (file or folder) and cascades to its children. Destructive – use with caution.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            nodeId: { type: Type.STRING, description: "ID of the node to delete." },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: NODE_SCALAR_FIELDS },
                description: "Which fields of the deleted node to return for confirmation.",
            },
        },
        required: ["nodeId"],
    },
};

// ---- FileBlob tools ----
export const createFileBlobDeclaration: FunctionDeclaration = {
    name: "createFileBlob",
    description: "Creates a new FileBlob record (content + metadata) without attaching it to a node yet. Use this to store a file independently.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            extension: { type: Type.STRING },
            content: { type: Type.STRING },
            mimeType: { type: Type.STRING, nullable: true },
            size: { type: Type.INTEGER, nullable: true },
            url: { type: Type.STRING, nullable: true },
            width: { type: Type.INTEGER, nullable: true },
            height: { type: Type.INTEGER, nullable: true },
            duration: { type: Type.NUMBER, nullable: true },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: FILEBLOB_FIELDS },
            },
        },
        required: ["extension", "content"],
    },
};

export const getFileBlobDeclaration: FunctionDeclaration = {
    name: "getFileBlob",
    description: "Retrieves a FileBlob by ID. Be careful with the `content` field – it can be large.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: FILEBLOB_FIELDS },
            },
        },
        required: ["id"],
    },
};

export const updateFileBlobDeclaration: FunctionDeclaration = {
    name: "updateFileBlob",
    description: "Updates a FileBlob's metadata or content.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            data: {
                type: Type.OBJECT,
                properties: {
                    url: { type: Type.STRING, nullable: true },
                    extension: { type: Type.STRING, nullable: true },
                    mimeType: { type: Type.STRING, nullable: true },
                    size: { type: Type.INTEGER, nullable: true },
                    content: { type: Type.STRING, nullable: true },
                    width: { type: Type.INTEGER, nullable: true },
                    height: { type: Type.INTEGER, nullable: true },
                    duration: { type: Type.NUMBER, nullable: true },
                },
            },
            fieldsToSelect: {
                type: Type.ARRAY,
                items: { type: Type.STRING, enum: FILEBLOB_FIELDS },
            },
        },
        required: ["id", "data"],
    },
};

export const deleteFileBlobDeclaration: FunctionDeclaration = {
    name: "deleteFileBlob",
    description: "Deletes a FileBlob record. This does NOT automatically detach it from nodes – you must update those nodes' fileBlobId to null first.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
        },
        required: ["id"],
    },
};

// Bundle all tools
export const agentTools = [
    {
        functionDeclarations: [
            createNodeDeclaration,
            listNodesDeclaration,
            updateNodeDeclaration,
            deleteNodeDeclaration,
            createFileBlobDeclaration,
            getFileBlobDeclaration,
            updateFileBlobDeclaration,
            deleteFileBlobDeclaration,
        ],
    },
];