import * as React from 'react';
import { styleSingleton } from 'react-style-singleton';

import { fullWidthClassName, zeroRightClassName, noScrollbarsClassName, removedBarSizeVariable } from './constants';
import { GapMode, GapOffset, getGapWidth } from './utils';

export interface BodyScroll {
  noRelative?: boolean;
  noImportant?: boolean;
  gapMode?: GapMode;
}

const Style = styleSingleton();

// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
const getStyles = (
  { left, top, right, gap }: GapOffset,
  allowRelative: boolean,
  gapMode: GapMode = 'margin',
  important: string
) => `
  .${noScrollbarsClassName} {
   overflow: hidden ${important};
   padding-right: ${gap}px ${important};
  }
  body {
    overflow: hidden ${important};
    overscroll-behavior: contain;
    ${[
      allowRelative && `position: relative ${important};`,
      gapMode === 'margin' &&
        `
    padding-left: ${left}px;
    padding-top: ${top}px;
    padding-right: ${right}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${gap}px ${important};
    `,
      gapMode === 'padding' && `padding-right: ${gap}px ${important};`,
    ]
      .filter(Boolean)
      .join('')}
  }
  
  .${zeroRightClassName} {
    right: ${gap}px ${important};
  }
  
  .${fullWidthClassName} {
    margin-right: ${gap}px ${important};
  }
  
  .${zeroRightClassName} .${zeroRightClassName} {
    right: 0 ${important};
  }
  
  .${fullWidthClassName} .${fullWidthClassName} {
    margin-right: 0 ${important};
  }
  
  body {
    ${removedBarSizeVariable}: ${gap}px;
  }
`;

/**
 * Removes page scrollbar and blocks page scroll when mounted
 */
export const RemoveScrollBar: React.FC<BodyScroll> = (props) => {
  const { noRelative, noImportant, gapMode = 'margin' } = props;
  const gap = React.useMemo(() => getGapWidth(gapMode), [gapMode]);

  return <Style styles={getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '')} />;
};
