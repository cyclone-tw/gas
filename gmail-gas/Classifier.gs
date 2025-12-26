/**
 * Classifier.gs
 * 信件分類邏輯
 */

const Classifier = {
  /**
   * 根據規則判斷信件應該去的資料夾路徑
   * @param {GoogleAppsScript.Gmail.GmailMessage} message 
   * @returns {string} folderPath
   */
  classify: function(message) {
    const subject = message.getSubject().toLowerCase();
    const body = message.getPlainBody().toLowerCase(); // 使用純文字內容加快搜尋
    const sender = message.getFrom().toLowerCase();
    
    // 遍歷所有規則
    for (const rule of CONFIG.RULES) {
      // 如果 keywords 為空，視為預設規則 (catch-all)
      if (!rule.keywords || rule.keywords.length === 0) {
        return rule.folderPath;
      }

      // 檢查是否有任何關鍵字匹配
      const isMatch = rule.keywords.some(keyword => {
        const k = keyword.toLowerCase();
        return subject.includes(k) || sender.includes(k) || body.includes(k);
      });

      if (isMatch) {
        return rule.folderPath;
      }
    }

    // 萬一沒有任何規則匹配 (連預設都沒有)，回傳根目錄或其他預設字串
    return '未分類';
  }
};
