import './Tooltip.scss';
import type { TooltipProps } from './Tooltip.types';

const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  return (
    <div className="tooltip-wrapper">
      {children}
      <div className={`tooltip tooltip--${position}`}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
