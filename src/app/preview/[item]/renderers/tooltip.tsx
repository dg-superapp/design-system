'use client';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../../registry/tooltip/tooltip';
import type { PreviewRenderer } from './index';

type Side = 'top' | 'right' | 'bottom' | 'left';

function isSide(v: unknown): v is Side {
  return typeof v === 'string' && ['top', 'right', 'bottom', 'left'].includes(v);
}

export const TooltipPreview: PreviewRenderer = ({ state }) => {
  const content =
    typeof state.content === 'string' && state.content.length > 0
      ? state.content
      : 'ជំនួយ';
  const side: Side = isSide(state.side) ? state.side : 'top';

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={100}>
      <div className="flex min-h-[120px] items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="h-[40px] rounded-[var(--radius-md)] bg-[hsl(var(--brand))] px-[16px] text-sm font-medium text-[hsl(var(--brand-foreground))] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
            >
              Hover me
            </button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            {content}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
