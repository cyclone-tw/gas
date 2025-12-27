/**
 * Main.gs
 * 主程式入口 (Markdown 版)
 */

function processEmails() {
  Logger.log('開始執行 Gmail 自動歸檔 (MD版)...');

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
        // 判斷分類，取得「分類資料夾」路徑
        const categoryPath = Classifier.classify(message);
        Logger.log(`信件 "${message.getSubject()}" 分類至 -> ${categoryPath}`);

        // 取得或建立「分類資料夾」 (例如：財務/帳單憑證)
        const categoryFolder = DriveUtils.getOrCreateFolder(categoryPath);

        // 在分類資料夾下，建立「該封信件的專屬資料夾」
        // (解決附件混亂問題，並存放 markdown)
        const emailFolder = DriveUtils.createEmailFolder(categoryFolder, message);

        // 儲存內容為 Markdown
        DriveUtils.saveEmailAsMarkdown(emailFolder, message);

        // 儲存附件 (直接存進該信件資料夾)
        DriveUtils.saveAttachments(emailFolder, message);
      }

      // 3. 處理完整個 thread 後的後續動作
      GmailService.markAsProcessed(thread);
      
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
