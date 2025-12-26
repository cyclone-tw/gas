/**
 * DriveUtils.gs
 * 處理 Google Drive 相關操作
 */

const DriveUtils = {
  /**
   * 根據路徑取得或建立資料夾
   * @param {string} path - 相對路徑，例如 "財務/發票/2023"
   * @returns {GoogleAppsScript.Drive.Folder}
   */
  getOrCreateFolder: function(path) {
    if (!CONFIG.ROOT_FOLDER_ID || CONFIG.ROOT_FOLDER_ID === 'YOUR_FOLDER_ID_HERE') {
      throw new Error('請先在 Config.gs 設定 ROOT_FOLDER_ID');
    }

    const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);
    if (!path) return rootFolder;

    const folders = path.split('/');
    let currentFolder = rootFolder;

    for (const folderName of folders) {
      const iter = currentFolder.getFoldersByName(folderName);
      if (iter.hasNext()) {
        currentFolder = iter.next();
      } else {
        currentFolder = currentFolder.createFolder(folderName);
      }
    }
    return currentFolder;
  },

  /**
   * 將信件內容儲存為 PDF
   * @param {GoogleAppsScript.Drive.Folder} folder 
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   */
  saveEmailAsPdf: function(folder, message) {
    const subject = message.getSubject() || '(無主旨)';
    const date = message.getDate();
    const dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmm');
    // 檔名：日期_主旨 (過濾特殊字元)
    const fileName = `${dateStr}_${subject}`.replace(/[\\/:*?"<>|]/g, '_');
    
    // 取得信件 HTML
    // 注意：如果是 Thread，可能需要處理整個對話串，這裡暫時只處理單封 Message
    const body = message.getBody();
    const headers = `
      <div style="font-family: sans-serif; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <h3>${subject}</h3>
        <p><strong>From:</strong> ${message.getFrom()}</p>
        <p><strong>To:</strong> ${message.getTo()}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>
    `;
    const finalHtml = headers + body;

    // 建立 Blob 並轉換為 PDF
    const htmlBlob = Utilities.newBlob(finalHtml, 'text/html', fileName + '.html');
    const pdfBlob = htmlBlob.getAs('application/pdf');
    pdfBlob.setName(fileName + '.pdf');

    folder.createFile(pdfBlob);
  },

  /**
   * 儲存附件 (選用)
   * @param {GoogleAppsScript.Drive.Folder} folder 
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   */
  saveAttachments: function(folder, message) {
    const attachments = message.getAttachments();
    for (const attachment of attachments) {
      folder.createFile(attachment);
    }
  }
};
