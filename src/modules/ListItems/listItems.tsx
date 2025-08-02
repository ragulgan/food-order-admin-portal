import React, { Fragment } from 'react'
import { Link, useNavigate } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import dashboardActive from '../../assets/images/activeDashboard.svg'
import dashboardInactive from '../../assets/images/inactiveDashboard.svg'
import customerActive from '../../assets/images/activeCustomer.svg'
import customerInactive from '../../assets/images/inactiveCustomer.svg'
import orderActive from '../../assets/images/activeOrder.svg'
import orderInactive from '../../assets/images/inactiveOrder.svg'
import merchantActive from '../../assets/images/activeMerchant.svg'
import merchantInactive from '../../assets/images/inactiveMerchant.svg'
import branchActive from '../../assets/images/activeBranch.svg'
import branchInactive from '../../assets/images/inactiveBranch.svg'
import merchantItemsActive from '../../assets/images/activeMerchantItems.svg'
import merchantItemsInactive from '../../assets/images/inactiveMerchantItems.svg'
import offerActive from '../../assets/images/activeOffer.svg'
import offerInactive from '../../assets/images/inactiveOffer.svg'
import driverActive from '../../assets/images/activeDriver.svg'
import driverInactive from '../../assets/images/inactiveDriver.svg'
import settingActive from '../../assets/images/activeSetting.svg'
import settingInactive from '../../assets/images/inactiveSetting.svg'
import inactiveSignout from '../../assets/images/InactiveSignout.svg'
import review from '../../assets/images/review.svg'
import report from '../../assets/images/report.svg'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ConfirmationModal from '../commonToast/confirmationModal'
import AppSnackbar from '../commonToast/customizeAlert';
import { Role_Types } from '../utils/constant';

const NavigationMenu: React.FC = () => {

  const activeStyle = {
    background: '#FFFFFF',
    color: '#FC8945',
  };

  const navigate = useNavigate()
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(false);
  const [showLogoutSnackbar, setShowLogoutSnackbar] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
  const [openReportMenu, setOpenReportMenu] = React.useState(false);
  const selectedItem = localStorage.getItem('SETDATA') || "0"
  // roles
  const menu = JSON.parse(localStorage.getItem("ROLES")!)
  const roleData = JSON.parse(localStorage.getItem("NEW_ROLES")!)

  const convertedData = menu?.menus?.reduce((acc: any, item: any) => {
    acc[item.name] = item;
    return acc;
  }, {});
  localStorage.setItem('NEW_ROLES', JSON.stringify(convertedData ? convertedData : null))

  const handleListItemClick = (event: any, index: any) => {
    localStorage.setItem("SETDATA", index)
  }

  const handleSignOutClick = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleCancelSignOut = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmSignOut = () => {
    if (menu?.role === Role_Types.Admin) {
      setTimeout(() => {
        navigate(`/login/admin`);
      }, 1000);
    } else if (menu?.role === Role_Types.Merchant) {
      setTimeout(() => {
        navigate(`/login/merchant`);
      }, 1000);
    }else if(menu?.role === Role_Types.Branch) {
      setTimeout(() => {
        navigate(`/login/branch`);
      }, 1000);
    }
    setIsConfirmationModalOpen(false);
    localStorage.clear()
    setShowLogoutSnackbar(true);   
  };

  const handleCloseSnackbar = () => {
    setShowLogoutSnackbar(false);
  }

  const handleSubMenuClick = (event: any, index: any) => {
    setOpenSubMenu(!openSubMenu);
    localStorage.setItem("SETDATA", index)
  };

  const handleReportMenuClick = (event: any, index: any) => {
    setOpenReportMenu(!openReportMenu);
    localStorage.setItem("SETDATA", index)
  }

  return (
    <Fragment>
      {roleData?.dashboard?.visible ?
        <Link to="/dashboard" className="page-link"
          style={{
            color: selectedItem === "0" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "0"}
            onClick={(event) => handleListItemClick(event, "0")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "0" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "0" ? <img src={dashboardActive} alt="img" /> : <img src={dashboardInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Dashboard" />
          </ListItemButton>
        </Link> : null}
      {roleData?.customers?.visible ?
        <Link to="/customers" className='page-link'
          style={{
            color: selectedItem === "7" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "7"}
            onClick={(event) => handleListItemClick(event, "7")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "7" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "7" ? <img src={customerActive} alt="img" /> : <img src={customerInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Customers" />
          </ListItemButton>
        </Link> : null}
      {roleData?.orders?.visible ?
        <Link to="/orders/list" className='page-link'
          style={{
            color: selectedItem === "6" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "6"}
            onClick={(event) => handleListItemClick(event, "6")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "6" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "6" ? <img src={orderActive} alt="img" /> : <img src={orderInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Orders" />
          </ListItemButton>
        </Link> : null}
      {roleData?.merchants?.visible ?
        <Link to="/merchants/list" className="page-link"
          style={{
            color: selectedItem === "1" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "1"}
            onClick={(event) => handleListItemClick(event, "1")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "1" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "1" ? <img src={merchantActive} alt="img" /> : <img src={merchantInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Merchants" />
          </ListItemButton>
        </Link> : null}
      {roleData?.branch?.visible ?
        <Link to="/branch/list" className="page-link"
          style={{
            color: selectedItem === "17" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "17"}
            onClick={(event) => handleListItemClick(event, "17")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "17" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "17" ? <img src={branchActive} alt="img" /> : <img src={branchInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Branch" />
          </ListItemButton>
        </Link> : null}
        {menu?.role === Role_Types.Branch ? 
        <>
        {roleData?.product?.visible ?
        <Link to="/merchant-items/product" className="page-link"
          style={{
            color: selectedItem === "20" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "20"}
            onClick={(event) => handleListItemClick(event, "20")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "20" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "20" ? <img src={merchantItemsActive} alt="img" /> : <img src={merchantItemsInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Product" />
          </ListItemButton>
        </Link> : null}
        </> : 
        <>
        {roleData?.category?.visible || roleData?.subCategory?.visible || roleData?.product?.visible ?
        <>
          <ListItemButton
            className='merchant-pad'
            sx={{
              color: (selectedItem === "2" || selectedItem === "3" || selectedItem === "4" || selectedItem === "20") ? activeStyle : '#9BA4B5',
            }}
            selected={selectedItem === "2"}
            onClick={(event) => handleSubMenuClick(event, "2")}>
            <ListItemIcon sx={{
              color: (selectedItem === "2" || selectedItem === "3" || selectedItem === "4" || selectedItem === "20") ? '#FC8945' : '#9BA4B5',
            }}
              className='nav-menu-icon'
            >
              {selectedItem === "2" || selectedItem === "3" || selectedItem === "4" || selectedItem === "20" ? <img src={merchantItemsActive} alt="img" /> : <img src={merchantItemsInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Merchant Items" />
            {openSubMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            {roleData?.category?.visible ?
              <Link
                to="/merchant-items/category"
                className="page-link"
                style={{
                  color: selectedItem === "3" ? '#FC8945' : '#9BA4B5'
                }}
              >
                <ListItemButton
                  selected={selectedItem === "3"}
                  onClick={(event) => handleListItemClick(event, "3")}
                  sx={{ listStyleType: 'none', paddingLeft: 9 }}
                  className='sub-menu'
                >
                  <ListItemIcon
                    sx={{ color: selectedItem === "3" ? '#FB640A' : '#9BA4B5' }}
                  >
                    <RemoveIcon sx={{ width: '12px', height: '12px' }} />
                  </ListItemIcon>
                  <ListItemText className='list-item-text' primary="Category" sx={{
                    color: selectedItem === "3" ? '#FB640A' : '#9BA4B5',
                    marginLeft: -4
                  }} />
                </ListItemButton>
              </Link> : null}
            {/* sunCategory menu hide start */}
            {/* {roleData?.subCategory?.visible ?
              <Link
                to="/merchant-items/sub-category"
                className="page-link"
                style={{
                  color: selectedItem === "4" ? '#FC8945' : '#9BA4B5'
                }}
              >
                <ListItemButton
                  selected={selectedItem === "4"}
                  onClick={(event) => handleListItemClick(event, "4")}
                  sx={{ listStyleType: 'none', paddingLeft: 9 }}
                  className='sub-menu'
                >
                  <ListItemIcon
                    sx={{ color: selectedItem === "4" ? '#FB640A' : '#9BA4B5' }}
                  >
                    <RemoveIcon sx={{ width: '12px', height: '12px' }} />
                  </ListItemIcon>
                  <ListItemText className='list-item-text' primary="Sub Category" sx={{
                    color: selectedItem === "4" ? '#FB640A' : '#9BA4B5',
                    marginLeft: -4
                  }} />
                </ListItemButton>
              </Link> : null} */}
            {/* sunCategory menu hide finish */}
            {roleData?.product?.visible ?
              <Link
                to="/merchant-items/product"
                className="page-link"
                style={{
                  color: selectedItem === "20" ? '#FC8945' : '#9BA4B5'
                }}
              >
                <ListItemButton
                  selected={selectedItem === "20"}
                  onClick={(event) => handleListItemClick(event, "20")}
                  sx={{ listStyleType: 'none', paddingLeft: 9 }}
                  className='sub-menu'
                >
                  <ListItemIcon
                    sx={{ color: selectedItem === "20" ? '#FB640A' : '#9BA4B5' }}
                  >
                    <RemoveIcon sx={{ width: '12px', height: '12px' }} />
                  </ListItemIcon>
                  <ListItemText className='list-item-text' primary="Product" sx={{
                    color: selectedItem === "20" ? '#FB640A' : '#9BA4B5',
                    marginLeft: -4
                  }} />
                </ListItemButton>
              </Link> : null}
          </Collapse>
        </> : null}
        </>}
        {roleData?.generalTab?.visible ?
        <Link to="/OffersCoupons/offers" className="page-link"
          style={{
            color: selectedItem === "10" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "10"}
            onClick={(event) => handleListItemClick(event, "10")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "10" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "10" ? <img src={offerActive} alt="img" /> : <img src={offerInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Offers" />
          </ListItemButton>
        </Link> : null}
      {/* coupons-offers sub-menu hide start */}
      {/* {roleData?.generalTab?.visible ?
        <>
          <ListItemButton
            className='merchant-pad'
            sx={{
              color: (selectedItem === "10" || selectedItem === "18" || selectedItem === "19") ? activeStyle : '#9BA4B5',
            }}
            selected={selectedItem === "10"}
            onClick={(event) => handleReportMenuClick(event, "10")}>
            <ListItemIcon sx={{
              color: (selectedItem === "10" || selectedItem === "18" || selectedItem === "19") ? '#FC8945' : '#9BA4B5',
            }}
              className='nav-menu-icon'
            >
              {selectedItem === "10" || selectedItem === "18" || selectedItem === "19" ? <img src={offerActive} alt="img" /> : <img src={offerInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Offers&Coupons" />
            {openReportMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openReportMenu} timeout="auto" unmountOnExit>
            <Link
              to="/OffersCoupons/offers"
              className="page-link"
              style={{
                color: selectedItem === "18" ? '#FC8945' : '#9BA4B5'
              }}
            >
              <ListItemButton
                selected={selectedItem === "18"}
                onClick={(event) => handleListItemClick(event, "18")}
                sx={{ listStyleType: 'none', paddingLeft: 9 }}
                className='sub-menu'
              >
                <ListItemIcon
                  sx={{ color: selectedItem === "18" ? '#FB640A' : '#9BA4B5' }}
                >
                  <RemoveIcon sx={{ width: '12px', height: '12px' }} />
                </ListItemIcon>
                <ListItemText className='list-item-text' primary="Offers" sx={{
                  color: selectedItem === "18" ? '#FB640A' : '#9BA4B5',
                  marginLeft: -4
                }} />
              </ListItemButton>
            </Link>
            <Link
              to="/OffersCoupons/coupons"
              className="page-link"
              style={{
                color: selectedItem === "19" ? '#FC8945' : '#9BA4B5'
              }}
            >
              <ListItemButton
                selected={selectedItem === "19"}
                onClick={(event) => handleListItemClick(event, "19")}
                sx={{ listStyleType: 'none', paddingLeft: 9 }}
                className='sub-menu'
              >
                <ListItemIcon
                  sx={{ color: selectedItem === "19" ? '#FB640A' : '#9BA4B5' }}
                >
                  <RemoveIcon sx={{ width: '12px', height: '12px' }} />
                </ListItemIcon>
                <ListItemText className='list-item-text' primary="Coupons" sx={{
                  color: selectedItem === "19" ? '#FB640A' : '#9BA4B5',
                  marginLeft: -4
                }} />
              </ListItemButton>
            </Link>
          </Collapse>
        </> : null} */}
      {/* coupons-offers sub-menu hide finish */}
      {menu?.role === Role_Types.Admin ?
        <Link to="/drivers/list" className='page-link'
          style={{
            color: selectedItem === "8" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "8"}
            onClick={(event) => handleListItemClick(event, "8")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "8" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "8" ? <img src={driverActive} alt="img" /> : <img src={driverInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Drivers" />
          </ListItemButton>
        </Link> 
        : null} 
      {roleData?.settings?.visible ?
        <Link to="/settings/tabs" className='page-link'
          style={{
            color: selectedItem === "16" ? '#FC8945' : '#9BA4B5',
          }}
        >
          <ListItemButton
            className='merchant-pad'
            selected={selectedItem === "16"}
            onClick={(event) => handleListItemClick(event, "16")}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === "16" ? '#FC8945' : '#9BA4B5',
              }}
              className='nav-menu-icon'
            >
              {selectedItem === "16" ? <img src={settingActive} alt="img" /> : <img src={settingInactive} alt="img" />}
            </ListItemIcon>
            <ListItemText className='list-item-text' primary="Settings" />
          </ListItemButton>
        </Link> : null}
      {/* ratingreview and promocode and reports sub-menu hide start */}
      {/* <Link to="/ratingreviews" className='page-link'
        style={{
          color: selectedItem === 9 ? '#FC8945' : '#9BA4B5',
        }}
      >
        <ListItemButton
          className='merchant-pad'
          selected={selectedItem === "5"}
          onClick={(event) => handleListItemClick(event, "5")}
          sx={{ listStyleType: 'none', paddingLeft: 9 }}
          selected={selectedItem === 9}
          onClick={(event) => handleListItemClick(event, 9)}
        >
          <ListItemIcon
            sx={{
              color: selectedItem === 9 ? '#FC8945' : '#9BA4B5',
            }}
            className='nav-menu-icon'
          >
            <img src={review} alt="img" />
          </ListItemIcon>
          <ListItemText primary="Rating & Reviews" />
        </ListItemButton>
      </Link>
      <Link to="/promocode" className='page-link'
        style={{
          color: selectedItem === 11 ? '#FC8945' : '#9BA4B5',
        }}
      >
        <ListItemButton
          className='merchant-pad'
          selected={selectedItem === 11}
          onClick={(event) => handleListItemClick(event, 11)}
        >
          <ListItemIcon
            sx={{
              color: selectedItem === 11 ? '#FC8945' : '#9BA4B5',
            }}
            className='nav-menu-icon'
          >
            <LocalOfferOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Promocode" />
        </ListItemButton>
      </Link>
      <Link to="" className="page-link">
        <ListItemButton
          className='merchant-pad'
          sx={{
            paddingLeft: '25px',
            paddingRight: '16px',
            color: (selectedItem === 12 || selectedItem === 13 || selectedItem === 14 || selectedItem === 15) ? activeStyle : '#9BA4B5',
          }}
          selected={selectedItem === 12}
          onClick={(event) => handleReportMenuClick(event, 12)}>
          <ListItemIcon sx={{
            color: (selectedItem === 12 || selectedItem === 13 || selectedItem === 14 || selectedItem === 15) ? '#FC8945' : '#9BA4B5',
          }}
            className='nav-menu-icon'
          >
            <img src={report} alt="img" />
          </ListItemIcon>
          <ListItemText primary="Reports" />
          {openReportMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Link>
      <Collapse in={openReportMenu} timeout="auto" unmountOnExit>
        <Link
          to="/currentmonth"
          className="page-link"
          style={{
            color: selectedItem === 13 ? '#FC8945' : '#9BA4B5'
          }}
        >
          <ListItemButton
            selected={selectedItem === 13}
            onClick={(event) => handleListItemClick(event, 13)}
            sx={{ listStyleType: 'none', paddingLeft: 9 }}
          >
            <ListItemIcon
              sx={{ color: selectedItem === 13 ? '#FB640A' : '#9BA4B5' }}
            >
              <TodayIcon sx={{ width: '12px', height: '12px' }} />
            </ListItemIcon>
            <ListItemText primary="Current month" sx={{
              color: selectedItem === 13 ? '#FB640A' : '#9BA4B5',
              marginLeft: -4
            }} />
          </ListItemButton>
        </Link>

        <Link
          to="/lastquarter"
          className="page-link"
          style={{
            color: selectedItem === 14 ? '#FC8945' : '#9BA4B5'
          }}
        >
          <ListItemButton
            selected={selectedItem === 14}
            onClick={(event) => handleListItemClick(event, 14)}
            sx={{ listStyleType: 'none', paddingLeft: 9 }}
          >
            <ListItemIcon
              sx={{ color: selectedItem === 14 ? '#FB640A' : '#9BA4B5' }}
            >
              <DateRangeIcon sx={{ width: '12px', height: '12px' }} />
            </ListItemIcon>
            <ListItemText primary="Last quarter" sx={{
              color: selectedItem === 14 ? '#FB640A' : '#9BA4B5',
              marginLeft: -4
            }} />
          </ListItemButton>
        </Link>

        <Link
          to="/yearendsale"
          className="page-link"
          style={{
            color: selectedItem === 15 ? '#FC8945' : '#9BA4B5'
          }}
        >
          <ListItemButton
            selected={selectedItem === 15}
            onClick={(event) => handleListItemClick(event, 15)}
            sx={{ listStyleType: 'none', paddingLeft: 9 }}
          >
            <ListItemIcon
              sx={{ color: selectedItem === 15 ? '#FB640A' : '#9BA4B5' }}
            >
              <CalendarMonthIcon sx={{ width: '12px', height: '12px' }} />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" sx={{
              color: selectedItem === 15 ? '#FB640A' : '#9BA4B5',
              marginLeft: -4
            }} />
          </ListItemButton>
        </Link>
      </Collapse> */}
      {/* ratingreview and promocode and reports sub-menu hide finish */}
      {/* <ListItemButton
        onClick={handleSignOutClick}
        className='merchant-pad'
      >
        <ListItemIcon
          sx={{ color: '#9BA4B5' }}
          className='nav-menu-icon'
        >
          <img src={inactiveSignout} alt="img" />
        </ListItemIcon>
        <ListItemText className='list-item-text' sx={{ color: '#9BA4B5' }} primary="Sign Out" />
      </ListItemButton> */}

      <ConfirmationModal
        open={isConfirmationModalOpen}
        onConfirm={handleConfirmSignOut}
        onClose={handleCancelSignOut}
      />
      <AppSnackbar
        showAlert={showLogoutSnackbar}
        message="Logged-out successfully"
        type="success"
        onClose={handleCloseSnackbar}
      />
    </Fragment>
  )
};
export default NavigationMenu;