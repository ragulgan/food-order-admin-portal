import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import forgotPasswordReducer from './authSlice/ForgotPasswordSlice'
import updatePasswordReducer from './authSlice/resetPasswordSlice'

import merchantAddReducer from './merchantSlice/merchantAddSlice'
import merchantUpdateReducer from './merchantSlice/merchantUpdateSlice'
import merchantsReducer from './merchantSlice/merchantListSlice'
import merchantViewReducer from './merchantSlice/merchantsViewSlice'
import merchantDeleteReducer from './merchantSlice/merchantDeleteSlice'
import countryReducer from './settingSlice/countrySlice/countrySlice'
import stateReducer from './merchantSlice/stateSlice'
import cityReducer from './merchantSlice/regionSlice'

import branchAddReducer from './branchSlice/branchAddSlice'
import branchListReducer from './branchSlice/branchListSlice'
import branchUpdateReducer from './branchSlice/branchUpdateSlice'
import branchViewReducer from './branchSlice/branchViewSlice'
import branchDeleteReducer from './branchSlice/branchDeleteSlice'

import categoryAddReducer from './merchantItemSlice/category/categoryAdding'
import categoryUpdateReducer from './merchantItemSlice/category/categoryUpdateSlice'
import categoryReducer from './merchantItemSlice/category/categoryListSlice'
import categoryViewReducer from './merchantItemSlice/category/categoryViewSlice'
import categoryDeleteReducer from './merchantItemSlice/category/categoryDeleteSlice'

import subcategoryAddReducer from './merchantItemSlice/subCategory/subCategoryAddSlice'
import subcategoryUpdateReducer from './merchantItemSlice/subCategory/subCategoryUpdateSlice'
import subcategoryListReducer from './merchantItemSlice/subCategory/subCategoryListSlice'
import subcategoryViewReducer from './merchantItemSlice/subCategory/subCategoryViewSlice'
import subcategoryDeleteReducer from './merchantItemSlice/subCategory/subCategoryDeleteSlice'

import variantAddReducer from './settingSlice/variant/variantAdd'
import variantUpdateReducer from './settingSlice/variant/variantUpdateSlice'
import variantListReducer from './settingSlice/variant/variantListSlice'
import variantViewReducer from './settingSlice/variant/variantViewSlice'
import variantDeleteReducer from './settingSlice/variant/variantDeleteSlice'

import productListReducer from './merchantItemSlice/product/productListSlice'
import productAddReducer from './merchantItemSlice/product/productAddSlice'
import productUpdateReducer from './merchantItemSlice/product/productUpdateSlice'
import productViewReducer from './merchantItemSlice/product/productViewSlice'
import productDeleteReducer from './merchantItemSlice/product/productDeleteSlice'

import customersReducer from './customerSlice/customerListSlice'
import customersAddReducer from './customerSlice/customerAddSlice'
import customersUpdateReducer from './customerSlice/customerUpdateSlice'
import customersDeleteReducer from './customerSlice/customerDeleteSlice'
import customerViewReducer from './customerSlice/customerViewSlice'

import multipleFileUploadReducer from './fileupload/multipleFileUpload'
import singleFileUploadReducer from './fileupload/singleFileUpload'
import fileDeleteReducer from './fileupload/deleteFile'

import ordersReducer from './orderSlice/orderListSlice'
import orderViewReducer from './orderSlice/orderViewSlice'
import orderUpdateReducer from './orderSlice/orderUpdateSlice'

import driversReducer from './driverSlice/driverListSlice'
import driversAddReducer from './driverSlice/driverAddSlice'
import driversUpdateReducer from './driverSlice/driverUpdateSlice'
import driversDeleteReducer from './driverSlice/driverDeleteSlice'
import driverViewReducer from './driverSlice/driverViewSlice'

import rolesReducer from './settingSlice/roleSlice/roleSlice'
import rolesAddReducer from './settingSlice/roleSlice/roleAddSlice'
import roleEditReducer from './settingSlice/roleSlice/roleUpdateSlice'
import roleViewReducer from './settingSlice/roleSlice/roleViewSlice'
import configReducer from './settingSlice/roleSlice/roleConfig'
import roleDeleteReducer from './settingSlice/roleSlice/roleDeleteSlice'

import countryAddReducer from './settingSlice/countrySlice/countryAddSlice'
import countryViewReducer from './settingSlice/countrySlice/countryViewSlice'
import countryUpdateReducer from './settingSlice/countrySlice/countryUpdateSlice'
import countryDeleteReducer from './settingSlice/countrySlice/countryDeleteSlice'

import masterStateReducer from './settingSlice/stateSlice/materStateSlice'
import stateAddReducer from './settingSlice/stateSlice/stateAddSlice'
import stateUpdateReducer from './settingSlice/stateSlice/stateUpdateSlice'
import stateViewReducer from './settingSlice/stateSlice/stateViewSlice'
import stateDeleteReducer from './settingSlice/stateSlice/stateDeleteSlice'

import masterCityReducer from './settingSlice/citySlice/materCitySlice'
import cityAddReducer from './settingSlice/citySlice/cityAddSlice'
import cityUpdateReducer from './settingSlice/citySlice/cityUpdateSlice'
import cityViewReducer from './settingSlice/citySlice/cityViewSlice'
import cityDeleteReducer from './settingSlice/citySlice/cityDeleteSlice'

import cuisineListReducer from './settingSlice/categoryType/cuisineSlice'
import cuisineTypeAddReducer from './settingSlice/categoryType/cuisineAddSlice'
import cuisineUpdateReducer from './settingSlice/categoryType/cuisineUpdateSlice'
import cuisineViewReducer from './settingSlice/categoryType/cuisineViewSlice'
import cuisineDeleteReducer from './settingSlice/categoryType/cuisineDeleteSlice'

import offerAddReducer from './offerCouponSlice/offerAddSlice'
import offerDeleteReducer from './offerCouponSlice/offerDeleteSlice'
import offerListReducer from './offerCouponSlice/offerListSlice'
import offerViewReducer from './offerCouponSlice/offerViewSlice'
import offerUpdateReducer from './offerCouponSlice/offerEditSlice'

import couponListReducer from './offerCouponSlice/couponListSlice'
import couponAddReducer from './offerCouponSlice/couponAddSlice'
import couponEditReducer from './offerCouponSlice/couponEditSlice'
import couponUpdateReducer from './offerCouponSlice/couponUpdateSlice'
import couponDeleteReducer from './offerCouponSlice/couponDeleteSlice'

import configrationListReducer from './settingSlice/configration/configrationSlice'
import configrationAddReducer from './settingSlice/configration/configrationAddSlice'
import configrationUpdateReducer from './settingSlice/configration/configrationUpdateSlice'

import shiftAddReducer from './settingSlice/shiftTime/shiftAddSlice'
import shiftListReducer  from './settingSlice/shiftTime/shiftListSlice'
import shiftUpdateReducer from './settingSlice/shiftTime/shiftUpdateSlice'
import shiftViewReducer from './settingSlice/shiftTime/shiftViewSlice'
import shiftDeleteReducer from './settingSlice/shiftTime/shiftDeleteSlice'

import dashboardCardReducer from './dashboardSlice/dashboardCardSlice'

import languageListReducer from './settingSlice/language/textConfigListSlice'
import languageAddReducer from './settingSlice/language/textConfigAddSlice'
import languageUpdateReducer from './settingSlice/language/textConfigUpdate'
import languageDeleteReducer from './settingSlice/language/textConfigDeleteSlice'
import languageViewReducer from './settingSlice/language/textConfigViewSlice'

import singleJsonFileUploadReducer from './fileupload/singleFilejsonUpload'
import JsonfileDeleteReducer from './fileupload/deleteJsonFile'

import singleMobileJsonFileUploadReducer from './fileupload/singleMobileConfigFile'
import JsonMobilefileDeleteReducer from './fileupload/deleteMobileJsonFile'

import singleDriverJsonFileUploadReducer from './fileupload/singleDriverConfigFile'
import JsonDriverfileDeleteReducer from './fileupload/deleteDriverJsonFile'

export const store = configureStore({
  reducer: {
    //auth reducer
    forgotPassword: forgotPasswordReducer,
    updatePassword: updatePasswordReducer,

    //merchants reducer
    merchantAdd: merchantAddReducer,
    merchantUpdate: merchantUpdateReducer,
    merchants: merchantsReducer,
    merchantView: merchantViewReducer,
    merchantDelete: merchantDeleteReducer,
    countryDropdown: countryReducer,
    stateDropdown: stateReducer,
    cityDropdown: cityReducer,

    // branch reducer
    branchAdding: branchAddReducer,
    branchList: branchListReducer,
    branchUpdate: branchUpdateReducer,
    branchView: branchViewReducer,
    branchDelete: branchDeleteReducer,

    //merchantItems reducer (category)
    categoryAdding: categoryAddReducer,
    categoryUpdate: categoryUpdateReducer,
    categoryList: categoryReducer,
    categoryView: categoryViewReducer,
    categoryDelete: categoryDeleteReducer,

    //merchantItems reducer (subcategory)
    subCategoryAdd: subcategoryAddReducer,
    subcategoryUpdate: subcategoryUpdateReducer,
    subcategoryList: subcategoryListReducer,
    subcategoryView: subcategoryViewReducer,
    subcategoryDelete: subcategoryDeleteReducer,

    //merchantItems reducer (variant)
    variantAdd: variantAddReducer,
    variantUpdate: variantUpdateReducer,
    variantList: variantListReducer,
    variantView: variantViewReducer,
    variantDelete: variantDeleteReducer,

    // merchantItems reducer (product)
    productAdd: productAddReducer,
    productUpdate: productUpdateReducer,
    productList: productListReducer,
    productView: productViewReducer,
    productDelete: productDeleteReducer,

    //customer reducer
    customer: customersReducer,
    customerAdd: customersAddReducer,
    customerUpdate: customersUpdateReducer,
    customerDelete: customersDeleteReducer,
    customerView: customerViewReducer,

    //merchant fileupload
    multipleUpload: multipleFileUploadReducer,
    singleUpload: singleFileUploadReducer,
    fileDelete: fileDeleteReducer,

    //order reducer 
    orders: ordersReducer,
    orderView: orderViewReducer,
    orderUpdate: orderUpdateReducer,

    //driver reducer
    driver: driversReducer,
    driverAdd: driversAddReducer,
    driverUpdate: driversUpdateReducer,
    driverDelete: driversDeleteReducer,
    driverView: driverViewReducer,

    //roles reducer
    role: rolesReducer,
    roleAdd: rolesAddReducer,
    roleUpdate: roleEditReducer,
    roleView: roleViewReducer,
    roleDelete: roleDeleteReducer,
    config: configReducer,

    //country reducer
    countryAdd: countryAddReducer,
    countryView: countryViewReducer,
    countryUpdate: countryUpdateReducer,
    countryDelete: countryDeleteReducer,

    //state reducer
    stateList: masterStateReducer,
    stateAdd: stateAddReducer,
    stateUpdate: stateUpdateReducer,
    stateView: stateViewReducer,
    stateDelete: stateDeleteReducer,

    //city reducer
    cityList: masterCityReducer,
    cityAdd: cityAddReducer,
    cityUpdate: cityUpdateReducer,
    cityView: cityViewReducer,
    cityDelete: cityDeleteReducer,

    //cuisine reducer
    cuisineList: cuisineListReducer,
    cuisineAdd: cuisineTypeAddReducer,
    cuisineUpdate: cuisineUpdateReducer,
    cuisineView: cuisineViewReducer,
    cuisineDelete: cuisineDeleteReducer,

    //offer reducer
    offerList: offerListReducer,
    offerAdd: offerAddReducer,
    offerDelete: offerDeleteReducer,
    offerView: offerViewReducer,
    offerUpdate: offerUpdateReducer,

    //coupons reducer
    coupon: couponListReducer,
    couponAdd: couponAddReducer,
    couponEdit: couponEditReducer,
    couponUpdate: couponUpdateReducer,
    couponDelete: couponDeleteReducer,

    //configration reducer
    configrationList: configrationListReducer,
    configrationAdd: configrationAddReducer,
    configrationUpdate: configrationUpdateReducer,

    //admin dashboard reducer 
    dashboardCard: dashboardCardReducer,

    //shift time reducer 
    shiftAdd: shiftAddReducer, 
    shiftList: shiftListReducer,
    shiftUpdate: shiftUpdateReducer,
    shiftView: shiftViewReducer,
    shiftDelete: shiftDeleteReducer,

    //language reducer
    languageList: languageListReducer,
    languageAdd: languageAddReducer,
    languageUpdate: languageUpdateReducer,
    languageDelete: languageDeleteReducer,
    languageView: languageViewReducer,

    //json-file reducer
    singlejsonUpload: singleJsonFileUploadReducer,
    singlejsonfileDelete: JsonfileDeleteReducer,
    singleMobilejsonUpload: singleMobileJsonFileUploadReducer,
    singleMobilejsonfileDelete: JsonMobilefileDeleteReducer,
    singleDriverjsonUpload: singleDriverJsonFileUploadReducer,
    singleDriverjsonfileDelete: JsonDriverfileDeleteReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
