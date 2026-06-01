import React from 'react';
import useMagneticEffect from '../hooks/useMagneticEffect';

const MagneticElement = ({ children }) => {
  const ref = useMagneticEffect();
  
  if (!React.isValidElement(children)) {
    return children;
  }
  
  const className = children.props.className || '';
  const needsDisplayClass = children.type === 'a' || children.type === 'button';
  const hasDisplay = className.includes('inline-block') || className.includes('block') || className.includes('flex') || className.includes('inline-flex');
  const displayClass = (needsDisplayClass && !hasDisplay) ? ' inline-block' : '';
  
  return React.cloneElement(children, {
    ref,
    className: `${className}${displayClass}`
  });
};

export default MagneticElement;
