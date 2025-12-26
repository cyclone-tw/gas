/**
 * Main.gs
 * 主程式入口
 */

function processEmails() {
  Logger.log('開始執行 Gmail 自動歸檔...');

  try {
    // 1. 搜尋信件 (Threads)
    const threads = GmailService.searchThreads();
    Logger.log(`找到 ${threads.length} 個對話群組符合條件。`);

    if (threads.length === 0) {
      Logger.log('目前沒有需要處理的信件。');
      return;
    }

    // 2. 遍歷每一個對話串
    for (const thread of threads) {
      const messages = GmailService.getMessages(thread);
      
      // 遍歷對話串中的每一封信
      for (const message of messages) {
        // 判斷分類
        const folderPath = Classifier.classify(message);
        Logger.log(`信件 "${message.getSubject()}" 分類至 -> ${folderPath}`);

        // 取得或建立資料夾
        const folder = DriveUtils.getOrCreateFolder(folderPath);

        // 儲存 PDF
        DriveUtils.saveEmailAsPdf(folder, message);

        // 儲存附件 (選擇性)
        DriveUtils.saveAttachments(folder, message);
      }

      // 3. 處理完整個 thread 後的後續動作
      
      // 標記為已處理
      GmailService.markAsProcessed(thread);
      
      // 根據設定決定是否自動刪除
      if (CONFIG.ENABLE_AUTO_TRASH) {
        GmailService.moveToTrash(thread);
        Logger.log('已自動移至垃圾桶。');
      }
    }

    Logger.log('本批次執行完畢。');

  } catch (e) {
    Logger.log(`發生錯誤: ${e.message}`);
    console.error(e);
  }
}
