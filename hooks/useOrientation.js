// useOrientation.js
import { useState, useEffect } from 'react';

const getRawOrientation = (e) => {
  if (!e) {
    return { alpha: 0, beta: 0, gamma: 0 };
  } else {
    return { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
  }
};

const getOrientationObject = (e, baseOrientation) => {
  const orientation = getRawOrientation(e);
  return {
    absolute: orientation,
    relative: {
      alpha: orientation.alpha - baseOrientation.alpha,
      beta: orientation.beta - baseOrientation.beta,
      gamma: orientation.gamma - baseOrientation.gamma,
    },
  };
};

const useOrientation = () => {
  const [baseOrientation, setBaseOrientation] = useState(getRawOrientation());
  const [orientation, setOrientation] = useState(getOrientationObject(null, baseOrientation));

  useEffect(() => {
    const handleOrientation = (e) => {
      if (baseOrientation.alpha === 0 && baseOrientation.beta === 0 && baseOrientation.gamma === 0) {
        setBaseOrientation(getRawOrientation(e));
      }
      setOrientation(getOrientationObject(e, baseOrientation));
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [baseOrientation]);

  const resetBaseOrientation = () => {
    setBaseOrientation(getRawOrientation());
  };

  return { orientation, resetBaseOrientation };
};

export default useOrientation;
