"use client";
import FolderPlusIcon from "../svgs/FolderPlusIcon";
import DockDivider from "./DockDivider";
import DockItem from "./DockItem";


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
                    <DockItem
                        name="New Folder"
                        type="svg"
                        svg={(<FolderPlusIcon />)}
                        onClick={() => handleAppLaunch('AE')}
                    />

                    <DockItem
                        type="image"
                        name="New folder"
                        src="https://framerusercontent.com/images/iDBBsIGms7v4vkBAa7EBeh9PGuM.png"
                        onClick={() => handleAppLaunch('PS')}
                    />

                    <DockItem type="image" name="Illustrator" src="https://framerusercontent.com/images/VHJFQu7ykJIdCqTTduCtUcpcA.png" onClick={() => handleAppLaunch('AI')} />
                    <DockItem type="image" name="Error Console" src="https://framerusercontent.com/images/BSPnJPSH4K1WxhDJJbEfUgT7U.png" onClick={() => handleAppLaunch('Error')} />
                </div>

                <DockDivider />

                {/* Group B: Info / Utilities */}
                <div className="flex items-center gap-[10px]">
                    <DockItem type="image" name="Notes" src="https://framerusercontent.com/images/es0axIAu0guUZSRBu6xvsteey8w.png" onClick={() => handleAppLaunch('Notes')} />
                    <DockItem type="image" name="Gallery" src="https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png" onClick={() => handleAppLaunch('Gallery')} />
                </div>

                <DockDivider />

                {/* Group C: Social Channels */}
                <div className="flex items-center gap-[10px]">
                    <DockItem type="image" name="Instagram" src="https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png" />
                    <DockItem type="image" name="Mail" src="https://framerusercontent.com/images/4ZZQ6ZFOyrBZ3TXhVZjMFK7zbGk.png" />
                </div>

                <DockDivider />

                {/* Group D: System Bin */}
                <div className="flex items-center">
                    <DockItem type="image" name="Bin" src="https://framerusercontent.com/images/Hydn1FB5V1VnB099tUlAIyjV1tC4.png" onClick={() => handleAppLaunch('Trash')} />
                </div>
            </div>
        </nav>
    );
}