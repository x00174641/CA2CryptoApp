import i18n from 'i18n-js';

// Define translations
const translations = {
  en: {
    "total_assets": "Total Assets",
    "pnl_percentage": "PNL Percentage",
    "cost": "Cost",
    "pnl": "PNL",
    "add_crypto": "Add a Crypto to your Portfolio",
    "choose_crypto": "Choose a Crypto to add to your assets",
    "select_crypto": "Select a crypto",
    "enter_amount": "Enter how much",
    "cancel": "Cancel",
    "add": "Add"
  },
  zh: {
    "total_assets": "总资产",
    "pnl_percentage": "盈亏百分比",
    "cost": "成本",
    "pnl": "盈亏",
    "add_crypto": "添加加密货币到您的投资组合",
    "choose_crypto": "选择要添加到您的资产的加密货币",
    "select_crypto": "选择加密货币",
    "enter_amount": "输入数量",
    "cancel": "取消",
    "add": "添加"
  }
};

// Set translations
i18n.translations = translations;

// Set default locale
i18n.locale = 'en';

export default i18n;