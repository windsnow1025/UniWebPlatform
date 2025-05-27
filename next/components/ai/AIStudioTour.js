import React, {useState, useEffect, useCallback} from 'react';
import GuidedTour from '../common/GuidedTour';
import IconButton from '@mui/material/IconButton';
import {useTheme} from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const steps = [
  {
    target: 'body',
    content: 'Welcome to the AI Studio! This tour will guide you through the main features.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '#toggle-conversation-button',
    content: 'Click here to show or hide the conversation sidebar.',
    placement: 'bottom',
  },
  {
    target: '#api-type-select',
    content: 'Select the API type for your AI model here.',
    placement: 'bottom',
  },
  {
    target: '#model-select',
    content: 'Choose from different AI models with varying capabilities.',
    placement: 'bottom',
  },
  {
    target: '#temperature',
    content: 'Adjust the temperature to control the randomness of the AI responses.',
    placement: 'bottom',
  },
  {
    target: '#send',
    content: 'Click this button to send your message to the AI.',
    placement: 'top',
  },
  {
    target: '#clear-button',
    content: 'Use this button to clear the current conversation and start fresh.',
    placement: 'top',
  },
  {
    target: 'body',
    content: 'That\'s it! You\'re now ready to use the AI Studio. Enjoy exploring!',
    placement: 'center',
  },
];

const AIStudioTour = () => {
  const theme = useTheme();
  const [runTour, setRunTour] = useState(false);

  const handleTourCallback = useCallback((data) => {
    const { status, type } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
    }
  }, []);

  return (
    <>
      <IconButton
        size="large"
        onClick={() => setRunTour(true)}
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2.5),
          right: theme.spacing(2.5),
          boxShadow: 10,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      <GuidedTour
        steps={steps}
        run={runTour}
        callback={handleTourCallback}
      />
    </>
  );
};

export default AIStudioTour;