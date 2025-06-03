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
    target: 'div[style*="justify-content: center"] .markdown-body',
    content: 'This is the system message that provides instructions to the AI. It sets the behavior and capabilities of the assistant.',
    placement: 'bottom',
  },
  {
    target: '[aria-label="toggle-preview"]',
    content: 'Toggle between edit mode and preview mode. Edit mode allows you to modify the message, while preview mode shows how it will be rendered.',
    placement: 'bottom',
  },
  {
    target: 'div[style*="justify-content: flex-end"] .markdown-body',
    content: 'Type your question here. You can use markdown formatting for rich text.',
    placement: 'bottom',
  },
  {
    target: '.flex-center.mt-1\\.5.inflex-fill',
    content: 'You can upload files to share with the AI. Click the paperclip icon to upload individual files or the folder icon to upload entire folders.',
    placement: 'bottom',
  },
  {
    target: '.cursor-move',
    content: 'Use this drag button to reorder your content. For better AI understanding, try to drag your text question after the uploaded files, so the AI can better understand what you want to do with the files.',
    placement: 'bottom',
  },
  {
    target: '#send',
    content: 'Click this button to send your message to the AI.',
    placement: 'top',
  },
  {
    target: '.flex-around .MuiTypography-root',
    content: 'This shows your current credit balance. Credits are consumed when you use AI services, with different models having different costs. Check the price information in the model dropdown to see how many credits will be used for input and output tokens.',
    placement: 'bottom',
  },
  {
    target: '#clear-button',
    content: 'Use this button to clear the current conversation and start fresh.',
    placement: 'top',
  },
  {
    target: '#toggle-conversation-button',
    content: 'Click this button to toggle the conversation drawer. It allows you to switch between different conversations or start a new one.',
    placement: 'left',
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
