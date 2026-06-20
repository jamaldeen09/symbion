import Link from "next/link";
import { DockTooltip } from "../DockTooltip"; // Import your new component

interface ArtifactProps {
    name: string;
    src: string;
    href?: string;
    size?: number;
    onClick?: () => void;
}

export default function ArtifactLauncher(props: ArtifactProps) {
    const { name, src, href, size = 40, onClick } = props;
    const width = Math.round(size * 1.025);
    const height = size;

    const content = (
        <div
            className="relative cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1.5 active:scale-90 z-10"
            style={{ width: `${width}px`, height: `${height}px` }}
        >
            <div className="w-full h-full relative">
                <img
                    src={src}
                    alt={name}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                    decoding="auto"
                />
            </div>
        </div>
    );

    // Wrap the result in the Tooltip
    const wrappedContent = (
        <DockTooltip content={name}>
            {href ? (
                <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                </Link>
            ) : (
                <div onClick={onClick}>{content}</div>
            )}
        </DockTooltip>
    );

    return wrappedContent;
}