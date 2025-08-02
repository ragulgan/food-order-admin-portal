export const REGEX = {
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    DOB: /^\d{2}[-/.]\d{2}[-/.]\d{4}$/,
    PHONE: /^[0][1-9]\d{9}$|^[1-9]\d{9}$/,
    NUMERIC: /^[0-9]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    PASSWORD_MIN_MAX_LENGTH: /^[a-zA-Z0-9@#^\-_$]{6,14}$/,
    TEXT: /^[a-zA-Z_ ]*$/,
    ALPHA_NUMERIC: /^[a-zA-Z0-9 /]*$/,
    ALPHA_NUMERIC_CHARS: /^[a-zA-Z0-9@#&^\-_$ /]*$/,
    ALPHA_NUMERIC_ONE_CHARS: /^[a-zA-Z0-9#]*$/,
    ALPHA_SOME_CHARS_SPACE: /^[a-zA-Z., ]*$/,
    ALPHA_NUMERIC_CHARS_SPACE: /^[a-zA-Z0-9@^\-_.,àâçéèêëîïôûùüÿñæœ +g]*$/,
    ALPHA_CHARS_SPACE: /^[a-zA-Z^-_$.,àâçéèêëîïôûùüÿñæœ +g]*$/,
    ZIP_CODE: /^([0-9]){5,6}$/,
    NUMERIC_EIGHT_DIGITS: /^([0-9]){1,8}$/,
    NUMERIC_FOUR_DIGITS: /^([0-9]){1,4}$/,
    NUMERIC_THREE_DIGITS: /^([0-9]){1,3}$/,
    SPACE: / +/g,
    WEBSITE_URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    PHONE_NUMBER_1: /^(\+\d{1,3}[- ]?)?\d{10}$/,
    PHONE_NUMBER: /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/,
    NUMERIC_CHARS: /^[0-9-_]+$/,
    ALPHA_UPPER_CASE: /^[A-Z]*$/,
    ALPHA_NUMERIC_SPECIAL_CHARS: /^[a-zA-Z0-9@^\-_:/'"{}|.,àâçéèêëîïôûùüÿñæœ +g]*$/,
    CAID_NUMBER: /^([0-9]){6,8}$/,
    BIN_NUMBER: /^([0-9]){4,6}$/,
    // NUMERIC_SIX_DIGITS: /^([0-9]{6}|[0-9]{8})$/,
    // NUMERIC_FOUR_DIGITS: /^([0-9]){4}$/,
    URL: /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,4}$/,
    URL_ONE: /^(ftp|http|https):\/\/[^ "]+$/,
    LENGTH: /^(?!.*  )(?=.*[\w-])[\w -]{50,10000}$/,
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    EDUCATION: /^[a-zA-Z., ]*$/,
    NUMERIC_DIGITS: /^[6-9]\d{0,9}$/,
    MOBILE_NUMBER_VALID: /^[6-9]\d{9}$/,
    DECIMAL_NUMERIC: /^\s*\d{0,4}(\.\d{0,3})?$/,
  }

  export const CURRENCY_SYMBOLS: any = {
    Dollar: '$',
    Euro: '€',
    PoundSterling: '£',
    Yen: '¥',
    Franc: '₣',
    Rupee: '₹',
    Dinar: 'د.ك',
    ChineseYuan: '¥',
    IndianRupee: '₹',
    RussianRuble: '₽',
    SouthKoreanWon: '₩',
    AED: 'AED'
  };
  
  export const RESTRICTED_FILE_FORMAT_TYPE = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/JPEG',
    'image/PNG',
    'image/JPG'
  ]

  export const RESTRICTED_JSON_FILE_TYPE = [
    'application/json'
  ]

  export const Role_Types: any = {
    Admin: "ROLE_ADMIN",
    Merchant: "ROLE_MERCHANT",
    Branch: "ROLE_BRANCH", 
    Other: "OTHER"
  }
// development 
export const boundary = {
  north: 13.2627,
  south: 12.7827,
  east: 80.3317,
  west: 80.1266,
}
export const boundaryPin = {
  east: {lat:13.2627,lng:80.1266},
  west: {lat:12.7827,lng:80.1266},
  north: {lat:12.7827,lng:80.3317},
  south: {lat:13.2627,lng:80.3317}
}
export const staticLocation ={ lat: 13.0404917, lng: 80.1931135 }
export const country="ind"

//Production
// export const boundary = {
//     east: 58.63769,
//     west: 55.75378,
//     north: 25.01448,
//     south: 23.64306
// }
// export const boundaryPin = {
//     east: {lat:25.01448,lng:55.75378},
//     west: {lat:23.64306,lng:55.75378},
//     north: {lat:23.64306,lng:58.63769},
//     south: {lat:25.01448,lng:58.63769}
// }
// export const staticLocation ={ lat: 24.358133529674394, lng: 56.71634383264385 }
// export const country="om"
  