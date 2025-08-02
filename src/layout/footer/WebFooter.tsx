import React, { Fragment, useState, useEffect } from 'react'
import { Typography, Zoom, Fab, Box } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Link } from "react-router-dom";

const Footer: React.FC<any> = (props: any) => {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
      setAtBottom(isAtBottom);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setAtBottom]);

  return (
    <Fragment>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Zoom in={atBottom}>
          <Fab
            size="medium"
            aria-label="scroll back to top"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            sx={{
              color: "#80dfff"
            }}
          >
            <NavigationIcon />
          </Fab>
        </Zoom>
      </Box> */}
      <Typography
        variant="body2"
        color="text.secondary"
        // align="center"
        {...props}
        sx={{
          backgroundColor: '#EBEBEB',
          display: 'flex',
          justifyContent: 'center',
        }}

      >
        {"Copyright © "}
        <Link to="https://www.shenll.com/" color="inherit">
          Food Delivery Admin App
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Fragment >
  )
}

export default Footer;
