import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppSnackbar from "../modules/commonToast/customizeAlert";
import ConfirmationModal from "../modules/commonToast/confirmationModal";
import { ThemeProvider } from "@emotion/react";
import { Badge, Box, CssBaseline, Divider, Grid, IconButton, List, Menu, MenuItem, Toolbar, Typography, createTheme, styled, Button } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import PersonIcon from '@mui/icons-material/Person';
import logo from "../assets/images/Finallogo.svg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NavigationMenu from "../modules/ListItems/listItems";
import drawerLogo from "../assets/images/drawerlogo.svg"
// import Footer from "../layout/footer/WebFooter";
import './AppRoot.scss';
import inactiveSignout from '../assets/images/InactiveSignout.svg'
import settingInactive from '../assets/images/inactiveSetting.svg'
import Notification from "../modules/commonToast/notification";
import { fetchMerchantById, clearViewState as merchantViewClearState } from '../reduxState/merchantSlice/merchantsViewSlice'
import { fetchBranchById, clearViewState as branchViewClearState } from '../reduxState/branchSlice/branchViewSlice'
import profileimage from '../assets/images/profileimage.png'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../reduxState/store";
import { Role_Types } from "../modules/utils/constant";
import _ from "lodash";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

//app bar profile icon Button(mui) customize style
const StyledIconButton = styled(IconButton)({
  width: '40px',
  position: 'relative',
  height: '38px',
  color: '#fff',
  marginLeft: '10px',
  background: '#FC8945',
  borderRadius: '21px 10px 21px 21px'
});

//app bar mui customize style
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

//side drawer mui customize style
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const AppRoot: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentWidth, setCurrentWidth] = React.useState(window.innerWidth);
  const [screenSize, setScreenSize] = React.useState(window.innerWidth < 768 ? 'S' : 'L')
  const [open, setOpen] = React.useState(true);
  const [title, setTitle] = React.useState<any>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);
  const [imageValue, setImageValue] = React.useState<any>({})
  const [contactName, setContactName] = React.useState<any>('')
  const [branchimageValue, setBranchImageValue] = React.useState<any>([])
  const [branchcontactName, setBranchContactName] = React.useState<any>('')
  const readTaskState = useSelector((state: RootState) => state.merchantView);
  const readTaskStateBranch = useSelector((state: RootState) => state.branchView);
  // roles
  const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
  const role_id = roles_data?.id

  // Screen resize based on that drawer close (or) open automatically
  React.useEffect(() => {
    function handleResize() {
      const { innerWidth: width } = window;
      setCurrentWidth(width)
      setScreenSize(window.innerWidth < 768 ? 'S' : 'L')
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(()=> {
    <Notification />
  }, [])

  //Title of the page based on URL location
  React.useEffect(() => {
    if(roles_data?.role === Role_Types.Admin || roles_data?.role === Role_Types.Merchant){
    if (location.pathname === '/dashboard') {
      setTitle('Dashboard');
    } else if (location.pathname === '/merchant-items/category' || location.pathname === '/merchant-items/sub-category' || location.pathname === '/merchant-items/product' || location.pathname === '/OffersCoupons/offers' || location.pathname === '/OffersCoupons/coupons' || location.pathname === '/merchant-items/product/add' || location.pathname === '/merchant-items/product/edit' || location.pathname === '/merchant-items/product/view' || location.pathname === '/OffersCoupons/offers/add' || location.pathname === '/OffersCoupons/offers/edit' || location.pathname === '/OffersCoupons/coupons/add' || location.pathname === '/OffersCoupons/coupons/edit') {
      const firstSegment = location.pathname.slice(1).split('/')[1];
      const capitalizedTitle = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
      setTitle(capitalizedTitle);
    }
    else {
      const firstSegment = location.pathname.slice(1).split('/')[0];
      const capitalizedTitle = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
      setTitle(capitalizedTitle);
    }
  } else {
    setTitle(readTaskStateBranch?.data?.branchName)
  }
  }, [location.pathname, readTaskStateBranch])

  //Drawer Close
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //app bar profile menu click
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //close that app bar menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //signout confirmation modal open
  const handleSignOutClick = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleSetting= () => {
    navigate("/settings/tabs")
    localStorage.setItem("SETDATA", "16")
  }

  //signout cancel button close that confirmation modal 
  const handleCancelSignOut = () => {
    setIsConfirmationModalOpen(false);
    setAnchorEl(null);
  };

  //confirm that signout it redirect login
  const handleConfirmSignOut = () => {
    setIsConfirmationModalOpen(false);
    setContactName('')
    setBranchContactName('')
    setTitle('')
    setImageValue({})
    setBranchImageValue([])
    setAnchorEl(null);
    dispatch(merchantViewClearState())
    dispatch(branchViewClearState())
    if (roles_data?.role === Role_Types.Admin) {
      setTimeout(() => {
        navigate(`/login/admin`);
        localStorage.clear();
      }, 100);
    } else if (roles_data?.role === Role_Types.Merchant) {
      setTimeout(() => {
        navigate(`/login/merchant`);
        localStorage.clear();
      }, 100);
    }else if(roles_data?.role === Role_Types.Branch) {
      setTimeout(() => {
        navigate(`/login/branch`);
        localStorage.clear();
      }, 100);
    }else{
      return null;
    }
  };

  React.useEffect(() => {
    if (roles_data?.role === Role_Types.Merchant) {
      dispatch(fetchMerchantById(role_id))
    }else if (roles_data?.role === Role_Types.Branch){
      dispatch(fetchBranchById(role_id))
    }
  }, [roles_data?.role])

  React.useEffect(() => {
    if(readTaskState && readTaskState?.code === 200 && readTaskState && readTaskState?.data && readTaskState?.data?.id){
      setImageValue(!_.isEmpty(readTaskState?.data?.image) ? readTaskState?.data?.image: {})
      setContactName(readTaskState?.data?.contactName)
    }else if (readTaskStateBranch && readTaskStateBranch?.code === 200 && readTaskStateBranch && readTaskStateBranch?.data && readTaskStateBranch.data?.id) {
      setBranchContactName(readTaskStateBranch?.data?.contactName)
      setBranchImageValue(!_.isEmpty(readTaskStateBranch?.data?.image) ? readTaskStateBranch?.data?.image[0]: [])
    }
  }, [readTaskState, readTaskStateBranch])

  //while window close localStorage clear
  // window.onbeforeunload = () => {
  //   window.localStorage.clear()
  // }

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex", backgroundColor: "#EBEBEB" }}>
          <CssBaseline />
          {screenSize === "S" ? (<AppBar position="absolute" open={!open} className="dashboard-nav">
            <Toolbar
              sx={{
                pr: "24px",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginLeft: "-20px",
                  marginRight: "36px",
                  padding: "9px",
                  ...(!open && { display: "none" }),
                }}
              >
                <img src={drawerLogo} alt='logo' />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                className="dashboard-title"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
              <IconButton sx={{ color: '#999999' }}>
                {/* <Badge badgeContent={4} color="secondary" sx={{ color: '#FD973B' }}> */}
                {/* <MarkEmailUnreadIcon /> */}
                {/* </Badge> */}
              </IconButton>
              {roles_data?.role === Role_Types.Merchant ? 
              (<>
              <Button onClick={handleMenuOpen}>
                    {imageValue && !_.isEmpty(imageValue.id) ?
                      <img src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`} width='40px' height='40vh' style={{ borderRadius: '50px', objectFit: 'cover' }} alt="Profile picture" /> :
                      <img src={profileimage} width='40px' height='35vh' style={{ borderRadius: '21px 10px 21px 21px', objectFit: 'cover' }} alt="Profile picture" />}
                      <Typography variant="h6" align='left' className='driver-view-attachment-header app-bar-name'>{contactName ? contactName : null}</Typography>
              </Button>
              </>): roles_data?.role === Role_Types.Branch ? 
              (<>
               <Button onClick={handleMenuOpen}>
                    {!_.isEmpty(branchimageValue.id) ?
                      <img src={`${process.env.REACT_APP_API_BASE_URL}${branchimageValue.filePath}`} width='40px' height='40vh' style={{ borderRadius: '50px', objectFit: 'cover' }} alt="Profile picture" /> :
                      <img src={profileimage} width='40px' height='35vh' style={{ borderRadius: '21px 10px 21px 21px', objectFit: 'cover' }} alt="Profile picture" />}
                      <Typography variant="h6" align='left' className='driver-view-attachment-header app-bar-name'>{branchcontactName ? branchcontactName : null}</Typography>
              </Button>
              </>) :
              (<>
              <StyledIconButton onClick={handleMenuOpen} className="app-bar-profile-button">
                <PersonIcon />
              </StyledIconButton>
              </>)}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{
                  vertical: 'top', horizontal: 'right',
                }}
                className='signout-appbar'
              >
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>) :
            (<AppBar position="absolute" open={open} className="dashboard-nav">
              <Toolbar
                sx={{
                  pr: "24px",
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginLeft: "-20px",
                    marginRight: "36px",
                    padding: "9px",
                    ...(open && { display: "none" }),
                  }}
                >
                  <img src={drawerLogo} alt='logo' />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  className="dashboard-title"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  {title}
                </Typography>
                <IconButton sx={{ color: '#999999' }}>
                  {/* <Badge badgeContent={4} color="secondary" sx={{ color: '#FD973B' }}> */}
                  {/* <MarkEmailUnreadIcon /> */}
                  {/* </Badge> */}
                </IconButton>
                {roles_data?.role === Role_Types.Merchant ?
                  (<>
                    <Button onClick={handleMenuOpen}>
                      {imageValue && !_.isEmpty(imageValue?.id) ?
                        <img src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`} width='40px' height='40vh' style={{ borderRadius: '50px', objectFit: 'cover' }} alt="Profile picture" /> :
                        <img src={profileimage} width='40px' height='35vh' style={{ borderRadius: '21px 10px 21px 21px', objectFit: 'cover' }} alt="Profile picture" />}
                      <Typography variant="h6" align='left' className='driver-view-attachment-header app-bar-name'>{contactName ? contactName : null}</Typography>
                    </Button>
                  </>) : roles_data?.role === Role_Types.Branch ?
                    (<>
                      <Button onClick={handleMenuOpen}>
                        {branchimageValue && !_.isEmpty(branchimageValue?.id) ?
                          <img src={`${process.env.REACT_APP_API_BASE_URL}${branchimageValue?.filePath}`} width='40px' height='40vh' style={{ borderRadius: '50px', objectFit: 'cover' }} alt="Profile picture" /> :
                          <img src={profileimage} width='40px' height='35vh' style={{ borderRadius: '21px 10px 21px 21px', objectFit: 'cover' }} alt="Profile picture" />}
                        <Typography variant="h6" align='left' className='driver-view-attachment-header app-bar-name'>{branchcontactName ? branchcontactName : null}</Typography>
                      </Button>
                    </>) :
                    (<>
                      <StyledIconButton onClick={handleMenuOpen} className="app-bar-profile-button">
                        <PersonIcon />
                      </StyledIconButton>
                    </>)}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{
                    vertical: 'top', horizontal: 'right',
                  }}
                  className='signout-appbar'
                >
                  {roles_data?.role !== Role_Types.Branch ? 
                  <>
                  <MenuItem onClick={handleSetting}><img src={settingInactive} alt="img" style={{marginRight:'6px'}} />Settings</MenuItem>
                  <MenuItem onClick={handleSignOutClick}><img src={inactiveSignout} alt="img" style={{marginRight:'6px'}} />Sign Out</MenuItem>
                  </> : 
                  <MenuItem onClick={handleSignOutClick}><img src={inactiveSignout} alt="img" style={{marginRight:'6px'}} />Sign Out</MenuItem>
                  }
                  
                </Menu>
              </Toolbar>
            </AppBar>)}

          {screenSize === "S" ? (<Drawer variant="permanent" open={!open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <img src={logo} alt="logo" style={{ width: "160px" }} />
              <IconButton onClick={toggleDrawer} sx={{ color: '#FC8945' }}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav" className="dashboard-nav-bg">
              <NavigationMenu />
            </List>
          </Drawer>) :
            (<Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              >
                <img src={logo} alt="logo" style={{ width: "160px" }} />
                <IconButton onClick={toggleDrawer} sx={{ color: '#FD973B' }}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List component="nav" className="dashboard-nav-bg">
                <NavigationMenu />
              </List>
            </Drawer>)}


          <Box
            component="main"
            sx={{
              backgroundColor: '#EBEBEB',
              flexGrow: 1,
              height: '100vh',
              overflow: 'scroll',
            }}
          >
            <Toolbar />
            <Grid container spacing={3} columnSpacing={{ xs: 3, sm: 3 }} style={{ justifyContent: "space-between", margin: '0', width: '100%', padding: '24Px' }}>
              <Outlet />
            </Grid>
            {/* <Grid item xs={12}>
              <Footer />
            </Grid> */}
          </Box>
        </Box>
      </ThemeProvider>

      <ConfirmationModal
        open={isConfirmationModalOpen}
        onConfirm={handleConfirmSignOut}
        onClose={handleCancelSignOut}
        name={roles_data?.role === Role_Types.Merchant && !_.isEmpty(contactName) ?
          contactName : roles_data?.role === Role_Types.Branch && !_.isEmpty(branchcontactName) ?
            branchcontactName : null}
        image={roles_data?.role === Role_Types.Merchant && imageValue && !_.isEmpty(imageValue.id) ?
          <>
            <img src={`${process.env.REACT_APP_API_BASE_URL}${imageValue.filePath}`} className="logout-img" alt="Profile picture" />
          </> : roles_data?.role === Role_Types.Branch && !_.isEmpty(branchimageValue.id) ?
          <>
            <img src={`${process.env.REACT_APP_API_BASE_URL}${branchimageValue.filePath}`} className="logout-img" alt="Profile picture" />
          </> : null}
      />
    </>
  );
};

export default AppRoot;