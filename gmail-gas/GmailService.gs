/**
 * GmailService.gs
 * 封裝 Gmail 相關操作
 */

const GmailService = {
  /**
   * 搜尋符合條件的信件
   * @returns {GoogleAppsScript.Gmail.GmailThread[]}
   */
  searchThreads: function() {
    // 限制一次處理的數量，避免執行逾時 (例如 20 筆)
    // 可以調整此數值
    const BATCH_SIZE = 20; 
    return GmailApp.search(CONFIG.SEARCH_QUERY, 0, BATCH_SIZE);
  },

  /**
   * 取得執行緒中的所有訊息
   * @param {GoogleAppsScript.Gmail.GmailThread} thread 
   * @returns {GoogleAppsScript.Gmail.GmailMessage[]}
   */
  getMessages: function(thread) {
    return thread.getMessages();
  },

  /**
   * 將信件標記為已處理
   * @param {GoogleAppsScript.Gmail.GmailThread} thread 
   */
  markAsProcessed: function(thread) {
    let label = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
    if (!label) {
      label = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
    }
    thread.addLabel(label);
  },

  /**
   * 將信件移至垃圾桶
   * @param {GoogleAppsScript.Gmail.GmailThread} thread 
   */
  moveToTrash: function(thread) {
    thread.moveToTrash();
  }
};
