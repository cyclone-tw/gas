/**
 * DriveUtils.gs
 * 處理 Google Drive 相關操作 (支援 Markdown 與子資料夾結構)
 */

const DriveUtils = {
  /**
   * 根據路徑取得或建立資料夾
   * @param {string} path - 相對路徑，例如 "財務/發票"
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
   * 為單封信件建立專屬資料夾
   * 命名格式：YYYY-MM-DD_主旨
   * @param {GoogleAppsScript.Drive.Folder} parentFolder 
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   * @returns {GoogleAppsScript.Drive.Folder}
   */
  createEmailFolder: function(parentFolder, message) {
    const subject = message.getSubject() || '(無主旨)';
    const date = message.getDate();
    const dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    // 檔名消毒：移除特殊字元
    const safeSubject = subject.replace(/[\\/:*?"<>|]/g, '_').substring(0, 50); // 截斷過長的主旨
    const folderName = `${dateStr}_${safeSubject}`;

    // 避免重複建立 (雖然理論上不同信件ID不同，但如果主旨日期一樣可能會混淆，這裡簡單處理：直接建立新的)
    // 如果想要更嚴謹，可以在資料夾名稱加上 message ID 的後幾碼
    return parentFolder.createFolder(folderName);
  },

  /**
   * 將信件內容轉換為 Markdown 並儲存
   * @param {GoogleAppsScript.Drive.Folder} folder - 信件專屬資料夾
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   */
  saveEmailAsMarkdown: function(folder, message) {
    const subject = message.getSubject() || '(無主旨)';
    const from = message.getFrom();
    const to = message.getTo();
    const date = message.getDate();
    const dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    // 取得 HTML Body 並轉換為 Markdown
    const htmlBody = message.getBody();
    const markdownBody = this.htmlToMarkdown(htmlBody);

    const content = 
`# ${subject}

- **From**: ${from}
- **To**: ${to}
- **Date**: ${dateStr}

---

${markdownBody}
`;

    folder.createFile('content.md', content, 'text/markdown');
  },

  /**
   * 儲存附件
   * @param {GoogleAppsScript.Drive.Folder} folder - 信件專屬資料夾
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   */
  saveAttachments: function(folder, message) {
    const attachments = message.getAttachments();
    if (attachments.length > 0) {
      // 可以選擇建立一個 'attachments' 子資料夾，或者直接放在同一層
      // 這裡直接放在同一層，因為已經有專屬信件資料夾了
      for (const attachment of attachments) {
        folder.createFile(attachment);
      }
    }
  },

  /**
   * 簡單的 HTML 轉 Markdown 輔助函式
   * @param {string} html 
   * @returns {string}
   */
  htmlToMarkdown: function(html) {
    if (!html) return '';

    // 1. 移除 script 與 style
    let md = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                 .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");

    // 2. 處理換行 (把 <br>, <p>, <div> 換成換行符)
    md = md.replace(/<br\s*\/?>/gi, "\n")
           .replace(/<\/p>/gi, "\n\n")
           .replace(/<\/div>/gi, "\n");

    // 3. 處理標題
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gim, "# $1\n")
           .replace(/<h2[^>]*>(.*?)<\/h2>/gim, "## $1\n")
           .replace(/<h3[^>]*>(.*?)<\/h3>/gim, "### $1\n");

    // 4. 處理粗體與斜體
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gim, "**$1**")
           .replace(/<strong[^>]*>(.*?)<\/strong>/gim, "**$1**")
           .replace(/<i[^>]*>(.*?)<\/i>/gim, "*$1*")
           .replace(/<em[^>]*>(.*?)<\/em>/gim, "*$1*");

    // 5. 處理連結
    md = md.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gim, "[$2]($1)");

    // 6. 移除其他 HTML 標籤
    md = md.replace(/<[^>]+>/g, '');

    // 7. 處理 HTML Entity (簡單處理常見的)
    md = md.replace(/&nbsp;/g, ' ')
           .replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"');

    // 8. 移除過多空行
    md = md.replace(/\n\s*\n\s*\n/g, "\n\n");

    return md.trim();
  }
};
