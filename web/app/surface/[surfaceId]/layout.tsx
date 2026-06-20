import SavedArtifactWindowsProvider from "@/providers/SavedArtifactWindowsProvider";
import SurfaceStateSyncProvider from "@/providers/SurfaceStateSyncProvider";

export default async function SurfaceLayout({ children, params }: {
    children: React.ReactNode,
    params: Promise<{ surfaceId: string }>
}) {
    const { surfaceId } = await params;
    return (
        <SavedArtifactWindowsProvider surfaceId={surfaceId}>
            <SurfaceStateSyncProvider surfaceId={surfaceId}/>
            {children}
        </SavedArtifactWindowsProvider>
    )
}