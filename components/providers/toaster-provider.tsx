'use client';

import { StackedDeckToaster } from '../toasts/stacked-deck-toaster';

export const ToasterProvider = () => {
  return (
    <StackedDeckToaster
      maxVisible={3}
      offsetY={12}
      scaleFactor={0.05}
    />
  );
};