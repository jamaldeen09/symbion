import Image from "next/image";
import { DockTooltip } from "./DockTooltip";

interface DockItemProps {
    name: string;
    type: "svg" | "image";
    src?: string;
    svg?: React.ReactElement;
    onClick?: () => void;
}

export default function DockItem(props: DockItemProps) {
    const width = Math.round(34 * 1.025);
    const height = 34;

    const content = (
        <div
            className="relative cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1.5 active:scale-90 z-10"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            {(props.type === "image" && props.src) ? (

                <div className="w-full h-full relative">
                    <Image
                        src={props.src}
                        alt={props.name}
                        className="w-full h-full object-contain select-none pointer-events-none"
                        draggable={false}
                        decoding="auto"
                        unoptimized
                        fill
                    />
                </div>
            ) : (props?.svg ?? <></>)}
        </div>
    );

    // Wrap the result in the Tooltip
    const wrappedContent = (
        <DockTooltip content={props.name}>
            {/* {href ? (
                <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                </Link>
            ) : (
                <div onClick={onClick}>{content}</div>
            )} */}

            <div onClick={props.onClick}>{content}</div>
        </DockTooltip>
    );

    return wrappedContent;
}