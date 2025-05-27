import React from 'react';
import Joyride from 'react-joyride';

const GuidedTour = ({steps, run, callback}) => {
  return (
    <Joyride
      steps={steps}
      run={run}
      callback={callback}
      continuous
      disableScrollParentFix={true}
      styles={{
        options: {
          zIndex: 9999
        }
      }}
    />
  );
};

export default GuidedTour;
