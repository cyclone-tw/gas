/**
 * 校園修繕系統 - 主程式入口
 * SchoolFix - Main Entry Point
 */

// ==================== Web App 入口 ====================

/**
 * doGet - 網頁應用程式入口點
 * @param {Object} e - 事件參數
 * @returns {HtmlOutput} HTML 頁面
 */
function doGet(e) {
  try {
    // 防禦性處理 e 參數
    const page = (e && e.parameter && e.parameter.page) || 'index';
    
    // 確保資料表已初始化
    initializeSheets();
    
    let template;
    switch (page) {
      case 'form':
        template = HtmlService.createTemplateFromFile('RepairForm');
        break;
      case 'public':
        template = HtmlService.createTemplateFromFile('PublicRepairForm');
        break;
      case 'admin':
        template = HtmlService.createTemplateFromFile('AdminDashboard');
        break;
      case 'reports':
        template = HtmlService.createTemplateFromFile('Reports');
        break;
      case 'category':
        template = HtmlService.createTemplateFromFile('CategoryManagement');
        break;
      default:
        template = HtmlService.createTemplateFromFile('Index');
    }
    
    return template.evaluate()
      .setTitle('校園修繕系統')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (error) {
    // 發生錯誤時顯示錯誤訊息而非空白頁面
    return HtmlService.createHtmlOutput(
      '<html><body style="font-family: sans-serif; padding: 40px;">' +
      '<h1 style="color: #e74c3c;">❌ 系統錯誤</h1>' +
      '<p><strong>錯誤訊息：</strong>' + error.message + '</p>' +
      '<p><strong>堆疊追蹤：</strong></p>' +
      '<pre style="background: #f5f5f5; padding: 15px; overflow: auto;">' + error.stack + '</pre>' +
      '<p><a href="?">返回首頁</a></p>' +
      '</body></html>'
    ).setTitle('系統錯誤');
  }
}

/**
 * include - 引入 HTML 模組
 * @param {string} filename - 檔案名稱
 * @returns {string} HTML 內容
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ==================== 前端呼叫的 API ====================

/**
 * 取得表單初始資料（分類、地點、單位等）
 */
function getFormData() {
  return {
    categories: getCategories(),
    subCategories: getAllSubCategories(),
    locations: getLocations(),
    units: getUnits(),
    urgencyLevels: ['緊急', '一般', '非緊急']
  };
}

/**
 * 提交報修單
 */
function submitRepair(data) {
  return submitRepairRequest(data);
}

/**
 * 取得報修單列表
 */
function getRepairs(filters) {
  return getRepairRequests(filters);
}

/**
 * 更新報修單狀態
 */
function updateRepair(ticketId, data) {
  return updateRepairStatus(ticketId, data);
}

/**
 * 取得日報表
 */
function getDailyReportData(date) {
  return getDailyReport(date);
}

/**
 * 取得週報表
 */
function getWeeklyReportData(startDate, endDate) {
  return getWeeklyReport(startDate, endDate);
}

/**
 * 新增分類
 */
function addNewCategory(name) {
  return addCategory(name);
}

/**
 * 新增細項
 */
function addNewSubCategory(category, name) {
  return addSubCategory(category, name);
}

/**
 * 新增地點
 */
function addNewLocation(name, group) {
  return addLocation(name, group);
}

/**
 * 新增單位
 */
function addNewUnit(name) {
  return addUnit(name);
}

/**
 * 取得所有細項（按分類）
 */
function getSubCategoriesForCategory(category) {
  return getSubCategories(category);
}
