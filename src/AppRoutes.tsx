import React from "react";
import { createBrowserRouter, Navigate, Outlet, redirect, RouterProvider } from "react-router-dom";
import Login from './modules/auth/login/loginTab'
import ResetPassword from './modules/auth/resetPassword/resetPassword'
import PageNotFound from "./modules/errors/PageNotFound";
import AppRoot from "./root/AppRoot";
import DashboardContent from "./modules/dashboard/dashboard";
import ProductList from "./modules/merchantItems/product/productListing/productListing";
import CategoryList from "./modules/merchantItems/category/categoryList/categoryListing";
import SubCategoryList from "./modules/merchantItems/sub_category/sub_categoryList/sub_categoryLists";
import CustomerListing from "./modules/customer/customerListing/customerLists";
import MerchantList from "./modules/merchant/merchantListing/merchantLists";
import MerchantView from "./modules/merchant/merchantView/merchantView";
import ProductStepper from "./modules/merchantItems/product/productStepper/productStepper";
import DriverList from "./modules/driver/driverListing/driverLists";
import DriverAdd from "./modules/driver/driverAdding/driverAdd";
import DriverView from "./modules/driver/driverView/driverView";
import MerchantOrder from "./modules/merchantOrder/orderListing/orderLists";
import ProductVariantView from "./modules/merchantItems/product/productView/productView";
import SettingTabs from "./modules/settings/settingTabs";
import OfferList from "./modules/offerCoupons/offers/offerList/offerList";
import CouponList from "./modules/offerCoupons/coupons/couponList/couponListing";
import CouponAdd from "./modules/offerCoupons/coupons/couponAdd/couponAdding";
import OfferAdding from "./modules/offerCoupons/offers/offerAddEdit/offerAdd";
import BranchAdd from "./modules/branch/branchAdd";
import MerchantAdd from "./modules/merchant/merchantAddNew/merchantAdd";
import BranchList from "./modules/branch/branchList";
import BranchView from "./modules/branch/branchView";
import OrderView from "./modules/merchantOrder/orderView/newOrderView"

const AppRoutes: React.FC<any> = () => {

  function getTokenFromLocalStorage() {
    return new Promise(resolve => {
      setTimeout(() => {
        const token = localStorage.getItem('AUTH_TOKEN');
        resolve(token);
      }, 100);
    });
  }

  const checkLoginLoader = async () => {
    const token = await getTokenFromLocalStorage();
    if (token) {
      return true;
    }
    return redirect("/login/admin");
  }

  const checkLogin = async () => {
    const token = await getTokenFromLocalStorage();
    if (token) {
      return redirect("/dashboard");
    }
    return true;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppRoot />,
      loader: checkLoginLoader,
      errorElement: <PageNotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace={true} />,
        },
        {
          path: '/dashboard',
          element: <DashboardContent />
        },
        {
          path: '/merchants',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/merchants/list" replace={true} />,
            },
            {
              path: '/merchants/list',
              element: <MerchantList />
            },
            {
              path: '/merchants/add',
              element: <MerchantAdd />
            },
            {
              path: '/merchants/edit',
              element: <MerchantAdd />
            },
            {
              path: '/merchants/view',
              element: <MerchantView />
            },
          ]
        },
        {
          path: '/branch',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/branch/list" replace={true} />,
            },
            {
              path: '/branch/list',
              element: <BranchList />
            },
            {
              path: '/branch/add',
              element: <BranchAdd />
            },
            {
              path: '/branch/edit',
              element: <BranchAdd />
            },
            {
              path: '/branch/view',
              element: <BranchView />
            },
          ]
        },
        {
          path: '/merchant-items',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/merchant-items/category" replace={true} />,
            },
            {
              path: '/merchant-items/category',
              element: <CategoryList />
            },
            // {
            //   path: '/merchant-items/sub-category',
            //   element: <SubCategoryList />
            // },
            {
              path: '/merchant-items/product',
              element: <ProductList />
            }, {
              path: '/merchant-items/product/add',
              element: <ProductStepper />
            },
            {
              path: '/merchant-items/product/edit',
              element: <ProductStepper />
            },
            {
              path: '/merchant-items/product/view',
              element: <ProductVariantView />
            },
          ]
        },
        {
          path: '/orders',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/orders/list" replace={true} />,
            },
            {
              path: '/orders/list',
              element: <MerchantOrder />
            },
            {
              path: '/orders/view',
              element: <OrderView />
            },
          ]
        },
        {
          path: "/customers",
          element: <CustomerListing />
        },
        {
          path: '/drivers',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/drivers/list" replace={true} />,
            },
            {
              path: "/drivers/list",
              element: <DriverList />
            },
            {
              path: '/drivers/add',
              element: <DriverAdd />,
            },
            {
              path: '/drivers/edit',
              element: <DriverAdd />,
            },
            {
              path: '/drivers/view',
              element: <DriverView />,
            },
          ]
        },
        {
          path: '/settings',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/settings" replace={true} />,
            },
            {
              path: '/settings/tabs',
              element: <SettingTabs />
            },
          ]
        },

        {
          path: '/OffersCoupons',
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="/OffersCoupons" replace={true} />,
            },
            {
              path: '/OffersCoupons/offers',
              element: <OfferList />
            },
            {
              path: '/OffersCoupons/offers/add',
              element: <OfferAdding />
            },
            {
              path: '/OffersCoupons/offers/edit',
              element: <OfferAdding />
            },
            {
              path: '/OffersCoupons/coupons',
              element: <CouponList />
            },
            {
              path: '/OffersCoupons/coupons/add',
              element: <CouponAdd />
            },
            {
              path: '/OffersCoupons/coupons/edit',
              element: <CouponAdd />
            },
          ]
        },

      ]
    },
    {
      path: "/login/admin",
      element: <Login />,
      loader: checkLogin
    },
    {
      path: "/login/merchant",
      element: <Login />,
      loader: checkLogin
    },
    {
      path: "/login/branch",
      element: <Login />,
      loader: checkLogin
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    },
  ]);
  return <RouterProvider router={router} />
}

export default AppRoutes;
