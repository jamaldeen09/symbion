import SurfaceStateSyncProvider from "@/providers/SurfaceStateSyncProvider";
import WindowsProvider from "@/providers/WindowsProvider";

export default async function SurfaceLayout({ children, params }: {
    children: React.ReactNode,
    params: Promise<{ surfaceId: string }>
}) {
    const { surfaceId } = await params;
    return (
        <WindowsProvider surfaceId={surfaceId}>
            <SurfaceStateSyncProvider surfaceId={surfaceId}/>
            {children}
        </WindowsProvider>
    )
}