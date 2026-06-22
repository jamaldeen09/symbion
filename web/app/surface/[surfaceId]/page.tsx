import DesktopBackground from '@/components/surface/SurfaceBackground';
import BottomDock from '@/components/surface/BottomDock';
import Windows from '@/components/surface/Windows';
import DraggableNode from '@/components/surface/DraggableNode';
import TopDeck from '@/components/surface/TopDeck';
import TestWindow from '@/components/surface/TestWindow';

export default async function SurfacePage({ params }: { params: Promise<{ surfaceId: string }> }) {
  const { surfaceId } = await params
  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#EAEAEA]">
      <DesktopBackground />

      {/* Layer 2: Full-Width Canvas */}
      <div
        className="absolute inset-0 pt-8 z-10 pointer-events-auto transition-all duration-300"
      >
        <TopDeck />

        {/* Windows */}
        <Windows surfaceId={surfaceId} />

        {/* Artifacts */}
        <DraggableNode
          title="RAMÓWKA"
          initialTop="25%"
          initialLeft="22%"
        />

      </div>

      {/* Layer 3: The now-horizontal, scrollable BottomDock */}
      <BottomDock />
      <TestWindow />
    </main>
  );
}