/**
 * 校園修繕系統 - 報表功能
 * SchoolFix - Reports
 */

/**
 * 取得日報表資料
 */
function getDailyReport(dateStr) {
  try {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const allRequests = getRepairRequests({}) || [];
    
    // 取得目標日期的 YYYY-MM-DD 格式（台北時區）
    const targetDateStr = Utilities.formatDate(targetDate, 'Asia/Taipei', 'yyyy-MM-dd');
    
    // 當日報修：將 UTC 時間轉換為台北時間後比較
    const todayRequests = allRequests.filter(r => {
      if (!r || !r.reportDate) return false;
      // reportDate 是 ISO 字串（UTC），需轉換為台北時間
      const utcDate = new Date(r.reportDate);
      const reportDateStr = Utilities.formatDate(utcDate, 'Asia/Taipei', 'yyyy-MM-dd');
      return reportDateStr === targetDateStr;
    });
    
    // 各狀態統計
    const allPending = allRequests.filter(r => r && r.status === '待處理');
    const allInProgress = allRequests.filter(r => r && r.status === '處理中');
    const todayCompleted = todayRequests.filter(r => r && r.status === '已結案');
    
    // 依分類統計（當日）
    const categoryStats = {};
    todayRequests.forEach(r => {
      if (r && r.category) {
        if (!categoryStats[r.category]) {
          categoryStats[r.category] = 0;
        }
        categoryStats[r.category]++;
      }
    });
    
    // 緊急案件
    const urgentCases = allPending.filter(r => r && r.urgency === '緊急');
    
    return {
      date: Utilities.formatDate(targetDate, 'Asia/Taipei', 'yyyy-MM-dd'),
      summary: {
        todayNew: todayRequests.length,
        todayCompleted: todayCompleted.length,
        totalPending: allPending.length,
        totalInProgress: allInProgress.length,
        urgentCases: urgentCases.length
      },
      categoryStats: categoryStats,
      urgentRequests: urgentCases.slice(0, 10),
      pendingRequests: allPending.slice(0, 20)
    };
  } catch (error) {
    Logger.log('getDailyReport error: ' + error.message);
    return {
      date: Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd'),
      summary: {
        todayNew: 0,
        todayCompleted: 0,
        totalPending: 0,
        totalInProgress: 0,
        urgentCases: 0
      },
      categoryStats: {},
      urgentRequests: [],
      pendingRequests: []
    };
  }
}

/**
 * 取得週報表資料
 */
function getWeeklyReport(startDateStr, endDateStr) {
  try {
    let startDate, endDate;
    
    if (startDateStr && endDateStr) {
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);
    } else {
      // 預設為本週
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    // 轉換為字串格式用於比較（台北時區）
    const startDateStr = Utilities.formatDate(startDate, 'Asia/Taipei', 'yyyy-MM-dd');
    const endDateStr = Utilities.formatDate(endDate, 'Asia/Taipei', 'yyyy-MM-dd');
    
    const allRequests = getRepairRequests({}) || [];
    
    // 本週報修：使用字串比較避免時區問題
    const weekRequests = allRequests.filter(r => {
      if (!r || !r.reportDate) return false;
      const utcDate = new Date(r.reportDate);
      const reportDateStr = Utilities.formatDate(utcDate, 'Asia/Taipei', 'yyyy-MM-dd');
      return reportDateStr >= startDateStr && reportDateStr <= endDateStr;
    });
    
    // 本週結案
    const weekCompleted = weekRequests.filter(r => r && r.status === '已結案');
    
    // 完成率
    const completionRate = weekRequests.length > 0 
      ? Math.round((weekCompleted.length / weekRequests.length) * 100) 
      : 0;
    
    // 依分類統計
    const categoryStats = {};
    weekRequests.forEach(r => {
      if (r && r.category) {
        if (!categoryStats[r.category]) {
          categoryStats[r.category] = { total: 0, completed: 0 };
        }
        categoryStats[r.category].total++;
        if (r.status === '已結案') {
          categoryStats[r.category].completed++;
        }
      }
    });
    
    // 依地點統計
    const locationStats = {};
    weekRequests.forEach(r => {
      if (r && r.location) {
        if (!locationStats[r.location]) {
          locationStats[r.location] = 0;
        }
        locationStats[r.location]++;
      }
    });
    
    // 每日趨勢
    const dailyTrend = [];
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      const dayDateStr = Utilities.formatDate(tempDate, 'Asia/Taipei', 'yyyy-MM-dd');
      
      const dayRequests = weekRequests.filter(r => {
        if (!r || !r.reportDate) return false;
        const utcDate = new Date(r.reportDate);
        const reportDateStr = Utilities.formatDate(utcDate, 'Asia/Taipei', 'yyyy-MM-dd');
        return reportDateStr === dayDateStr;
      });
      
      dailyTrend.push({
        date: Utilities.formatDate(tempDate, 'Asia/Taipei', 'MM/dd'),
        count: dayRequests.length
      });
      
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    // 未結案清單
    const unclosed = allRequests.filter(r => r && r.status !== '已結案');
    
    return {
      period: {
        start: Utilities.formatDate(startDate, 'Asia/Taipei', 'yyyy-MM-dd'),
        end: Utilities.formatDate(endDate, 'Asia/Taipei', 'yyyy-MM-dd')
      },
      summary: {
        totalNew: weekRequests.length,
        totalCompleted: weekCompleted.length,
        completionRate: completionRate,
        totalUnclosed: unclosed.length
      },
      categoryStats: categoryStats,
      locationStats: locationStats,
      dailyTrend: dailyTrend,
      unclosedRequests: unclosed.slice(0, 30)
    };
  } catch (error) {
    Logger.log('getWeeklyReport error: ' + error.message);
    return {
      period: {
        start: '',
        end: ''
      },
      summary: {
        totalNew: 0,
        totalCompleted: 0,
        completionRate: 0,
        totalUnclosed: 0
      },
      categoryStats: {},
      locationStats: {},
      dailyTrend: [],
      unclosedRequests: []
    };
  }
}

/**
 * 匯出報表至新的工作表
 */
function exportReport(reportType, params) {
  try {
    const ss = getSpreadsheet();
    const now = new Date();
    const timestamp = Utilities.formatDate(now, 'Asia/Taipei', 'yyyyMMdd_HHmmss');
    const sheetName = `報表_${reportType}_${timestamp}`;
    
    let sheet = ss.insertSheet(sheetName);
    
    if (reportType === 'daily') {
      const report = getDailyReport(params.date);
      
      sheet.appendRow(['日報表', report.date]);
      sheet.appendRow([]);
      sheet.appendRow(['統計摘要']);
      sheet.appendRow(['當日新增', report.summary.todayNew]);
      sheet.appendRow(['當日結案', report.summary.todayCompleted]);
      sheet.appendRow(['總待處理', report.summary.totalPending]);
      sheet.appendRow(['總處理中', report.summary.totalInProgress]);
      sheet.appendRow(['緊急案件', report.summary.urgentCases]);
      
    } else if (reportType === 'weekly') {
      const report = getWeeklyReport(params.startDate, params.endDate);
      
      sheet.appendRow(['週報表', report.period.start + ' 至 ' + report.period.end]);
      sheet.appendRow([]);
      sheet.appendRow(['統計摘要']);
      sheet.appendRow(['本週新增', report.summary.totalNew]);
      sheet.appendRow(['本週結案', report.summary.totalCompleted]);
      sheet.appendRow(['完成率', report.summary.completionRate + '%']);
      sheet.appendRow(['未結案總數', report.summary.totalUnclosed]);
    }
    
    return { success: true, sheetName: sheetName };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
