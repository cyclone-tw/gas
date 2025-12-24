/**
 * 校園修繕系統 - 資料庫操作
 * SchoolFix - Database Operations
 */

// ==================== 常數設定 ====================

const SPREADSHEET_NAME = '校園修繕系統資料庫';
const SHEETS = {
  REQUESTS: '報修單',
  CATEGORIES: '修繕分類',
  SUBCATEGORIES: '修繕細項',
  LOCATIONS: '部位地點',
  UNITS: '單位',
  SETTINGS: '設定'
};

// ==================== 資料表初始化 ====================

/**
 * 取得或建立資料表
 */
function getSpreadsheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  
  // 建立新的資料表
  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  return ss;
}

/**
 * 初始化所有工作表
 */
function initializeSheets() {
  const ss = getSpreadsheet();
  
  // 報修單
  let sheet = getOrCreateSheet(ss, SHEETS.REQUESTS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '單號', '報修日期', '報修人', '所屬單位', '修繕地點',
      '修繕分類', '修繕細項', '故障描述', '緊急程度', '照片連結',
      '備註', '處理狀態', '處理人員', '處理內容', '完成時間', '結案照片'
    ]);
    sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
  }
  
  // 修繕分類
  sheet = getOrCreateSheet(ss, SHEETS.CATEGORIES);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['分類名稱', '啟用狀態']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    // 預設分類
    const defaultCategories = [
      ['教室設備', '是'],
      ['水電設施', '是'],
      ['廁所設施', '是'],
      ['電腦資訊設備', '是'],
      ['操場與運動設施', '是'],
      ['公共空間', '是'],
      ['其他', '是']
    ];
    sheet.getRange(2, 1, defaultCategories.length, 2).setValues(defaultCategories);
  }
  
  // 修繕細項
  sheet = getOrCreateSheet(ss, SHEETS.SUBCATEGORIES);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['所屬分類', '細項名稱', '啟用狀態']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    // 預設細項
    const defaultSubCategories = [
      ['教室設備', '桌椅', '是'],
      ['教室設備', '黑板', '是'],
      ['教室設備', '電風扇', '是'],
      ['教室設備', '照明', '是'],
      ['教室設備', '窗戶', '是'],
      ['教室設備', '門鎖', '是'],
      ['水電設施', '水管漏水', '是'],
      ['水電設施', '電源跳電', '是'],
      ['水電設施', '插座故障', '是'],
      ['廁所設施', '馬桶', '是'],
      ['廁所設施', '洗手台', '是'],
      ['廁所設施', '燈具', '是'],
      ['廁所設施', '通風', '是'],
      ['電腦資訊設備', '電腦', '是'],
      ['電腦資訊設備', '投影機', '是'],
      ['電腦資訊設備', '網路', '是'],
      ['電腦資訊設備', '印表機', '是'],
      ['操場與運動設施', '跑道', '是'],
      ['操場與運動設施', '球場', '是'],
      ['操場與運動設施', '籃架', '是'],
      ['操場與運動設施', '遮雨棚', '是'],
      ['公共空間', '走廊', '是'],
      ['公共空間', '樓梯', '是'],
      ['公共空間', '公告欄', '是'],
      ['公共空間', '燈具', '是']
    ];
    sheet.getRange(2, 1, defaultSubCategories.length, 3).setValues(defaultSubCategories);
  }
  
  // 部位地點
  sheet = getOrCreateSheet(ss, SHEETS.LOCATIONS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['部位名稱', '區域分組', '啟用狀態']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    // 預設地點
    const defaultLocations = [
      ['A棟1樓', 'A棟', '是'],
      ['A棟2樓', 'A棟', '是'],
      ['A棟3樓', 'A棟', '是'],
      ['B棟1樓', 'B棟', '是'],
      ['B棟2樓', 'B棟', '是'],
      ['圖書館', '公共區域', '是'],
      ['體育館', '公共區域', '是'],
      ['操場', '戶外', '是'],
      ['廁所', '公共區域', '是'],
      ['辦公室', '行政區', '是']
    ];
    sheet.getRange(2, 1, defaultLocations.length, 3).setValues(defaultLocations);
  }
  
  // 單位
  sheet = getOrCreateSheet(ss, SHEETS.UNITS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['單位名稱', '啟用狀態']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    // 預設單位
    const defaultUnits = [
      ['校長室', '是'],
      ['教務處', '是'],
      ['學務處', '是'],
      ['總務處', '是'],
      ['輔導室', '是'],
      ['一年甲班', '是'],
      ['一年乙班', '是'],
      ['二年甲班', '是'],
      ['二年乙班', '是'],
      ['三年甲班', '是'],
      ['三年乙班', '是']
    ];
    sheet.getRange(2, 1, defaultUnits.length, 2).setValues(defaultUnits);
  }
  
  // 設定
  sheet = getOrCreateSheet(ss, SHEETS.SETTINGS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['設定項目', '設定值']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
    sheet.appendRow(['通知信箱', Session.getActiveUser().getEmail()]);
    sheet.appendRow(['系統名稱', '○○國小']);
  }
}

/**
 * 取得或建立工作表
 */
function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

// ==================== 報修單操作 ====================

/**
 * 產生單號
 */
function generateTicketNumber() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.REQUESTS);
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'Asia/Taipei', 'yyyyMMdd');
  
  // 取得今日最大序號
  const data = sheet.getDataRange().getValues();
  let maxSeq = 0;
  const prefix = 'RF-' + dateStr + '-';
  
  for (let i = 1; i < data.length; i++) {
    const ticketId = data[i][0];
    if (ticketId && ticketId.startsWith(prefix)) {
      const seq = parseInt(ticketId.substring(prefix.length));
      if (seq > maxSeq) maxSeq = seq;
    }
  }
  
  return prefix + String(maxSeq + 1).padStart(3, '0');
}

/**
 * 提交報修單
 */
function submitRepairRequest(data) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(SHEETS.REQUESTS);
    
    // 如果工作表不存在，先初始化
    if (!sheet) {
      initializeSheets();
      sheet = ss.getSheetByName(SHEETS.REQUESTS);
      // 如果仍然失敗，手動建立
      if (!sheet) {
        sheet = ss.insertSheet(SHEETS.REQUESTS);
        sheet.appendRow([
          '單號', '報修日期', '報修人', '所屬單位', '修繕地點',
          '修繕分類', '修繕細項', '故障描述', '緊急程度', '照片連結',
          '備註', '處理狀態', '處理人員', '處理內容', '完成時間', '結案照片'
        ]);
        sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#4a90d9').setFontColor('#ffffff');
      }
    }
    
    const ticketId = generateTicketNumber();
    const now = new Date();
    
    sheet.appendRow([
      ticketId,
      now,
      data.reporterName,
      data.unit,
      data.location,
      data.category,
      data.subCategory || '',
      data.description,
      data.urgency,
      data.photoUrl || '',
      data.remarks || '',
      '待處理',
      '',
      '',
      '',
      ''
    ]);
    
    // 發送通知郵件（如果失敗不影響主邏輯）
    try {
      sendNewRequestNotification({
        ticketId: ticketId,
        reporterName: data.reporterName,
        unit: data.unit,
        location: data.location,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
        urgency: data.urgency
      });
    } catch (emailError) {
      Logger.log('Email notification failed: ' + emailError.message);
    }
    
    return { success: true, ticketId: ticketId };
  } catch (error) {
    Logger.log('submitRepairRequest error: ' + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 查詢報修單
 */
function getRepairRequests(filters) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.REQUESTS);
  
  // 如果工作表不存在，先初始化
  if (!sheet) {
    initializeSheets();
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const requests = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const request = {
      ticketId: row[0],
      reportDate: row[1],
      reporterName: row[2],
      unit: row[3],
      location: row[4],
      category: row[5],
      subCategory: row[6],
      description: row[7],
      urgency: row[8],
      photoUrl: row[9],
      remarks: row[10],
      status: row[11],
      handler: row[12],
      handlerContent: row[13],
      completeTime: row[14],
      completePhoto: row[15],
      rowIndex: i + 1
    };
    
    // 套用篩選條件
    if (filters) {
      if (filters.status && request.status !== filters.status) continue;
      if (filters.category && request.category !== filters.category) continue;
      if (filters.urgency && request.urgency !== filters.urgency) continue;
      if (filters.location && request.location !== filters.location) continue;
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (new Date(request.reportDate) < startDate) continue;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59);
        if (new Date(request.reportDate) > endDate) continue;
      }
    }
    
    requests.push(request);
  }
  
  // 依報修日期降序排列
  requests.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
  
  return requests;
}

/**
 * 更新報修單狀態
 */
function updateRepairStatus(ticketId, data) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.REQUESTS);
    const allData = sheet.getDataRange().getValues();
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === ticketId) {
        const rowIndex = i + 1;
        
        if (data.status) sheet.getRange(rowIndex, 12).setValue(data.status);
        if (data.handler) sheet.getRange(rowIndex, 13).setValue(data.handler);
        if (data.handlerContent) sheet.getRange(rowIndex, 14).setValue(data.handlerContent);
        if (data.status === '已結案') {
          sheet.getRange(rowIndex, 15).setValue(new Date());
        }
        if (data.completePhoto) sheet.getRange(rowIndex, 16).setValue(data.completePhoto);
        
        // 發送狀態更新通知
        if (data.status === '已結案') {
          sendCompletionNotification({
            ticketId: ticketId,
            reporterName: allData[i][2],
            description: allData[i][7],
            handlerContent: data.handlerContent
          });
        }
        
        return { success: true };
      }
    }
    
    return { success: false, error: '找不到此報修單' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== 分類管理 ====================

/**
 * 取得所有分類
 */
function getCategories() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.CATEGORIES);
  const data = sheet.getDataRange().getValues();
  
  const categories = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === '是') {
      categories.push(data[i][0]);
    }
  }
  return categories;
}

/**
 * 新增分類
 */
function addCategory(name) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.CATEGORIES);
    
    // 檢查是否已存在
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === name) {
        return { success: false, error: '此分類已存在' };
      }
    }
    
    sheet.appendRow([name, '是']);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== 細項管理 ====================

/**
 * 取得所有細項
 */
function getAllSubCategories() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.SUBCATEGORIES);
  const data = sheet.getDataRange().getValues();
  
  const subCategories = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === '是') {
      const category = data[i][0];
      const subName = data[i][1];
      if (!subCategories[category]) {
        subCategories[category] = [];
      }
      subCategories[category].push(subName);
    }
  }
  return subCategories;
}

/**
 * 取得特定分類的細項
 */
function getSubCategories(category) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.SUBCATEGORIES);
  const data = sheet.getDataRange().getValues();
  
  const subCategories = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === category && data[i][2] === '是') {
      subCategories.push(data[i][1]);
    }
  }
  return subCategories;
}

/**
 * 新增細項
 */
function addSubCategory(category, name) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.SUBCATEGORIES);
    
    // 檢查是否已存在
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === category && data[i][1] === name) {
        return { success: false, error: '此細項已存在' };
      }
    }
    
    sheet.appendRow([category, name, '是']);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== 地點管理 ====================

/**
 * 取得所有地點
 */
function getLocations() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.LOCATIONS);
  const data = sheet.getDataRange().getValues();
  
  const locations = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === '是') {
      locations.push({
        name: data[i][0],
        group: data[i][1]
      });
    }
  }
  return locations;
}

/**
 * 新增地點
 */
function addLocation(name, group) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.LOCATIONS);
    
    // 檢查是否已存在
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === name) {
        return { success: false, error: '此地點已存在' };
      }
    }
    
    sheet.appendRow([name, group || '', '是']);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== 單位管理 ====================

/**
 * 取得所有單位
 */
function getUnits() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.UNITS);
  const data = sheet.getDataRange().getValues();
  
  const units = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === '是') {
      units.push(data[i][0]);
    }
  }
  return units;
}

/**
 * 新增單位
 */
function addUnit(name) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEETS.UNITS);
    
    // 檢查是否已存在
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === name) {
        return { success: false, error: '此單位已存在' };
      }
    }
    
    sheet.appendRow([name, '是']);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
