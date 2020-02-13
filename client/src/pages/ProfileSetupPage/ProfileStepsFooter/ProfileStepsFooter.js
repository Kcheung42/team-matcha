// importing modules
import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';

const ProfileStepsFooter = ({ buttonText, exists, step, username, handleNextStep, handleDataSubmit }) => {
    return (
    <Box className="stepsFooter">
        <Button 
            onClick={step === 3 ? handleDataSubmit : handleNextStep}
            variant="contained" 
            className="stepsFooter__btn">{buttonText}</Button>
        <p className="stepsFooter__link">&nbsp;</p>
    </Box>
    );
}

export default ProfileStepsFooter;