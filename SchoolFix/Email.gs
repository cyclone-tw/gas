/**
 * 校園修繕系統 - 郵件通知
 * SchoolFix - Email Notifications
 */

/**
 * 取得通知信箱
 */
function getNotificationEmail() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === '通知信箱') {
      return data[i][1];
    }
  }
  return Session.getActiveUser().getEmail();
}

/**
 * 取得系統名稱
 */
function getSystemName() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === '系統名稱') {
      return data[i][1];
    }
  }
  return '校園修繕系統';
}

/**
 * 發送新報修通知
 */
function sendNewRequestNotification(request) {
  try {
    const email = getNotificationEmail();
    const schoolName = getSystemName();
    
    const subject = `【${schoolName}】新報修通知 - ${request.ticketId}`;
    
    const urgencyColor = request.urgency === '緊急' ? '#e74c3c' : 
                         request.urgency === '一般' ? '#f39c12' : '#27ae60';
    
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4a90d9; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">📋 新報修通知</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">單號</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">報修人</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.reporterName} (${request.unit})</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">地點</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.location}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">分類</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.category}${request.subCategory ? ' / ' + request.subCategory : ''}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">緊急程度</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <span style="background: ${urgencyColor}; color: white; padding: 3px 10px; border-radius: 3px;">${request.urgency}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">故障描述</td>
              <td style="padding: 10px;">${request.description}</td>
            </tr>
          </table>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          此郵件由${schoolName}修繕系統自動發送
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
    
  } catch (error) {
    console.error('發送新報修通知失敗:', error);
  }
}

/**
 * 發送結案通知
 */
function sendCompletionNotification(request) {
  try {
    const schoolName = getSystemName();
    
    const subject = `【${schoolName}】維修完成通知 - ${request.ticketId}`;
    
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #27ae60; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">✅ 維修完成通知</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>您好，${request.reporterName}：</p>
          <p>您的報修案件已處理完成。</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">單號</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">故障描述</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${request.description}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">處理說明</td>
              <td style="padding: 10px;">${request.handlerContent || '已完成維修'}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">如有問題，請與總務處聯繫。</p>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          此郵件由${schoolName}修繕系統自動發送
        </div>
      </div>
    `;
    
    // 如果有報修人的 email，發送給報修人
    // 這裡暫時發送給管理員，實際使用時可以加入報修人 email 欄位
    const email = getNotificationEmail();
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
    
  } catch (error) {
    console.error('發送結案通知失敗:', error);
  }
}
