import React, {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {Add as AddIcon, ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import ColorPicker from './label/ColorPicker';
import {PRESET_COLORS} from './label/PresetColors';
import LabelLogic from '../../../../lib/label/LabelLogic';

function NewLabelAccordion({setLabels}) {
  const labelLogic = new LabelLogic();

  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[1]);
  const [isCreating, setIsCreating] = useState(false);

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      showAlert('Label name is required', 'warning');
      return;
    }

    setIsCreating(true);
    try {
      const createdLabel = await labelLogic.createLabel(name.trim(), color);
      setLabels(prev => [...prev, createdLabel]);
      setName('');
      setColor(PRESET_COLORS[1]);
      setExpanded(false);
      showAlert('Label created', 'success');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={(e, isExpanded) => setExpanded(isExpanded)}
        disableGutters
        elevation={4}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          sx={{backgroundColor: 'background.paper'}}
        >
          <div className="flex-center w-full gap-2">
            <AddIcon fontSize="small"/>
            <Typography variant="subtitle2" className="flex-1">
              New Label
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <TextField
              size="small"
              placeholder="Label name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  e.stopPropagation();
                  handleCreate();
                }
              }}
              fullWidth
            />
            <ColorPicker
              color={color}
              setColor={setColor}
              size={24}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCreate}
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? <CircularProgress size={16}/> : 'Create'}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default NewLabelAccordion;
