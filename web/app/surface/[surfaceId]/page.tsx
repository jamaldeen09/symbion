import DesktopBackground from '@/components/surface/SurfaceBackground';
import BottomDock from '@/components/surface/BottomDock';
import DraggableArtifact from '@/components/surface/artifact-launcher/DraggableArtifactLauncher';
import ArtifactWindows from '@/components/surface/artifact-window/ArtifactWindows';

export default function SurfacePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#EAEAEA]">
      <DesktopBackground />

      {/* Layer 2: Full-Width Canvas */}
      <div
        className="absolute inset-0 pt-8 z-10 pointer-events-auto transition-all duration-300"
      >
        {/* Artifact windows */}
        <ArtifactWindows />

        {/* Artifacts */}
        <DraggableArtifact
          title="RAMÓWKA"
          initialTop="25%"
          initialLeft="22%"
        />
      </div>

      {/* Layer 3: The now-horizontal, scrollable BottomDock */}
      <BottomDock />
    </main>
  );
}