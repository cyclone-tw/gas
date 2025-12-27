/**
 * Cleaner.gs
 * 負責清理已備份的信件
 */

function trashBackedUpEmails() {
  const BATCH_SIZE = 100; // 提高單次處理量
  
  // 搜尋條件：
  // label:已備份_GAS
  // 注意：這裡只會刪除「已經備份成功」(=身上有貼標籤) 的信件
  // 這就是您的「一鍵刪除」功能，既安全 (有備份才刪) 又快速
  const query = `label:${CONFIG.PROCESSED_LABEL}`;
  
  Logger.log(`開始搜尋並刪除已備份信件 (搜尋條件: ${query})...`);

  // 持續執行直到時間快不夠或沒有信件為止
  const startTime = new Date().getTime();
  const MAX_EXECUTION_TIME = 250 * 1000; // 預留空間，避免超過 GAS 6分鐘限制

  let totalDeleted = 0;

  while (true) {
    if (new Date().getTime() - startTime > MAX_EXECUTION_TIME) {
      Logger.log('執行時間即將逾時，請再次執行此函式以繼續刪除。');
      break;
    }

    const threads = GmailApp.search(query, 0, BATCH_SIZE);
    if (threads.length === 0) {
      Logger.log('沒有找到更多已備份的信件。清理完成！');
      break;
    }

    Logger.log(`本批次找到 ${threads.length} 筆，正在移至垃圾桶...`);
    
    // 批次移至垃圾桶 (比逐筆移快)
    GmailApp.moveThreadsToTrash(threads);
    totalDeleted += threads.length;
    
    Logger.log(`目前已累積移除 ${totalDeleted} 筆。`);
  }
}
