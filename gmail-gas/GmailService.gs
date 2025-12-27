/**
 * GmailService.gs
 * 封裝 Gmail 相關操作
 */

const GmailService = {
  /**
   * 搜尋符合條件的信件
   * @returns {GoogleAppsScript.Gmail.GmailThread[]}
   */
  searchThreads: function(limit) {
    // 預設 50 筆，但允許傳入參數覆寫
    const BATCH_SIZE = limit || 50; 
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
