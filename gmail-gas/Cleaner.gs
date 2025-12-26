/**
 * Cleaner.gs
 * 負責清理已備份的信件
 */

function trashBackedUpEmails() {
  const BATCH_SIZE = 50; // 批次刪除的數量
  
  // 搜尋帶有「已備份」標籤的信件
  const query = `label:${CONFIG.PROCESSED_LABEL}`;
  const threads = GmailApp.search(query, 0, BATCH_SIZE);

  if (threads.length === 0) {
    Logger.log('沒有找到已備份且需要刪除的信件。');
    return;
  }

  Logger.log(`找到 ${threads.length} 筆已備份信件，準備移至垃圾桶...`);

  const ui = SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp.getUi() : null;
  // 如果是在試算表容器綁定腳本中運行，可以跳出確認框
  // 但這裡是單獨 GAS 專案，通常直接執行 LOG

  for (const thread of threads) {
    try {
      thread.moveToTrash();
      Logger.log(`已刪除: ${thread.getFirstMessageSubject()}`);
    } catch (e) {
      Logger.log(`刪除失敗: ${thread.getFirstMessageSubject()} / ${e.message}`);
    }
  }

  Logger.log('清理完成。如果有更多信件請再次執行此功能。');
}
