"use client";
import Artifact from "./artifact-launcher/ArtifactLauncher";
import DockDivider from "./DockDivider";

export default function BottomDock() {
    const handleAppLaunch = (appName: string) => {
        console.log(`Launching client container sandbox instance for: ${appName}`);
    };

    return (
        <nav
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50
             flex items-center gap-[10px] px-3 py-2.5 
             rounded-xl bg-white/12 backdrop-blur-xl 
             w-[90vw] md:w-max max-w-[95vw] 
             overflow-x-auto no-scrollbar
             transition-all duration-300"
        >

            <div className="flex items-center gap-[10px] w-max shrink-0">

                {/* Group A: Programs */}
                <div className="flex items-center gap-[10px]">
                    <Artifact size={34} name="After Effects" src="https://framerusercontent.com/images/FGXr3pqtmk0UpCXHi0IZJgC4H8.png" onClick={() => handleAppLaunch('AE')} />
                    <Artifact size={34} name="Photoshop" src="https://framerusercontent.com/images/iDBBsIGms7v4vkBAa7EBeh9PGuM.png" onClick={() => handleAppLaunch('PS')} />
                    <Artifact size={34} name="Illustrator" src="https://framerusercontent.com/images/VHJFQu7ykJIdCqTTduCtUcpcA.png" onClick={() => handleAppLaunch('AI')} />
                    <Artifact size={34} name="Error Console" src="https://framerusercontent.com/images/BSPnJPSH4K1WxhDJJbEfUgT7U.png" onClick={() => handleAppLaunch('Error')} />
                </div>

                <DockDivider />

                {/* Group B: Info / Utilities */}
                <div className="flex items-center gap-[10px]">
                    <Artifact size={34} name="Notes" src="https://framerusercontent.com/images/es0axIAu0guUZSRBu6xvsteey8w.png" onClick={() => handleAppLaunch('Notes')} />
                    <Artifact size={34} name="Gallery" src="https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png" onClick={() => handleAppLaunch('Gallery')} />
                </div>

                <DockDivider />

                {/* Group C: Social Channels */}
                <div className="flex items-center gap-[10px]">
                    <Artifact size={34} name="Instagram" src="https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png" href="https://www.instagram.com/bychudy/" />
                    <Artifact size={34} name="Mail" src="https://framerusercontent.com/images/4ZZQ6ZFOyrBZ3TXhVZjMFK7zbGk.png" href="mailto:bychudy@gmail.com" />
                </div>

                <DockDivider />

                {/* Group D: System Bin */}
                <div className="flex items-center">
                    <Artifact size={34} name="Bin" src="https://framerusercontent.com/images/Hydn1FB5V1VnB099tUlAIyjV1tC4.png" onClick={() => handleAppLaunch('Trash')} />
                </div>
            </div>
        </nav>
    );
}