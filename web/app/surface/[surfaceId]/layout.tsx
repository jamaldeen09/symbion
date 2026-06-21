import SavedWindowsProvider from "@/providers/SavedWindowsProvider";
import SurfaceStateSyncProvider from "@/providers/SurfaceStateSyncProvider";

export default async function SurfaceLayout({ children, params }: {
    children: React.ReactNode,
    params: Promise<{ surfaceId: string }>
}) {
    const { surfaceId } = await params;
    return (
        <SavedWindowsProvider surfaceId={surfaceId}>
            <SurfaceStateSyncProvider surfaceId={surfaceId}/>
            {children}
        </SavedWindowsProvider>
    )
}