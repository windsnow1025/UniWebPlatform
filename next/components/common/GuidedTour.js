import React from 'react';
import Joyride from 'react-joyride';

const GuidedTour = ({steps, run}) => {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      disableScrollParentFix={true}
    />
  );
};

export default GuidedTour;
