import React, { Fragment } from 'react'
import { Typography, Grid, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const PageNotFound: React.FC<any> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationSegments = location.pathname.slice(1).split('/')
  locationSegments.pop()
  const locationCheck = locationSegments.join('/')

  const handleClickBack = () => {
    navigate(locationCheck)
  }

  return (
    <Fragment>
      <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
        <Grid item xs={12} textAlign={'center'}>
          <div className='error-image'></div>
          <Typography className='error-text' component="h1" variant="h6">
            404: Page not found.
          </Typography>
          <Button className='page-not-fount-go-back' variant="contained" type="submit" onClick={handleClickBack}>
            Go Back
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default PageNotFound;