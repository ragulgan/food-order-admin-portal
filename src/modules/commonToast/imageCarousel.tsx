import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface ConfirmationModalProps {
  id: any;
  borderRadius?: any;
  width?: any;
  height?: any
}

const SwipeableTextMobileStepper: React.FC<ConfirmationModalProps> = ({ id, borderRadius, width, height }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = id.length ? id.length : 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {id.map((step: any, index: any) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box display={'flex'} justifyContent={'center'}>
                <Box
                  component="img"
                  sx={{
                    height: height ? height : '30vh',
                    overflow: 'hidden',
                    width: width ? width : '85%',
                    borderRadius: borderRadius ? borderRadius : '18px',
                    objectFit: 'cover',
                    background: "#FFFFFF"
                  }}
                  src={`${process.env.REACT_APP_API_BASE_URL}${step.filePath}`}
                  alt={`category ${index}`}
                />
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        sx={{ backgroundColor: '#FFFFFF' }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft color='warning' />
            ) : (
              <KeyboardArrowRight color='warning' />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight color='warning' />
            ) : (
              <KeyboardArrowLeft color='warning' />
            )}
          </Button>
        }
      />
    </Box>
  );
}

export default SwipeableTextMobileStepper;