import React from 'react';

interface VerticalSpacerProps {
  size: number;
}

export const VerticalSpacer: React.FC<VerticalSpacerProps> = ({ size }) => {
  return <div style={{ height: size }} />;
};
