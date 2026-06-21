import { Prisma } from "@/generated";

export interface ToolResponse {
    status: 'success' | 'error';
    data?: any;
    error?: {
        code: string;    
        message: string;    
        suggestion?: string;  
        details?: any;
    };
    metadata: {
        timestamp: string;
        executionTimeMs: number;
    };
}

type NodeScalarField = keyof Omit<Prisma.NodeSelect, 'children' | 'parent' | 'surface' | 'project' | 'fileBlob'>;
type FileMetadataField = 'extension' | 'mimeType' | 'size' | 'duration' | 'width' | 'height';
type NestedFileField = `fileBlob.${FileMetadataField}`;

export type SafeNodeField = NodeScalarField | NestedFileField;
export type SafeFileBlobField = keyof Prisma.FileBlobSelect;


export type Tool<TArgs, TField = "id"> = (
    args: Partial<TArgs> & { fieldsToSelect?: Array<TField> }
) => Promise<ToolResponse>;

