import * as Tooltip from '@radix-ui/react-tooltip';

export function DockTooltip({ children, content }: { children: React.ReactNode, content: string }) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className="bg-zinc-900/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap font-sans z-[9999]"
            sideOffset={10}
            side="top"
          >
            {content}
            <Tooltip.Arrow className="fill-zinc-900/90" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}