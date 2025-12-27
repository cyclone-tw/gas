/**
 * Main.gs
 * 主程式入口 (Markdown 版 + 自動接續執行)
 */

function processEmails() {
  const startTime = new Date().getTime();
  // 保留一點緩衝時間 (例如設定 5 分鐘，GAS 限制 6 分鐘)
  // 300秒 = 5分鐘
  const MAX_EXECUTION_MS = 300 * 1000; 

  Logger.log('開始執行 Gmail 自動歸檔 (MD版)...');

  try {
    // 1. 搜尋信件 (Threads)
    // 這裡我們依然只抓一部分 (例如 50 筆)，處理完後如果時間還夠就再抓，
    // 但為了簡單起見，我們一次抓一批，處理完若還有剩餘時間且還有新信件，
    // 或者這批沒處理完就時間到了，都會觸發下一次執行。
    
    // 建議一次抓取數量不要太大，確保每一批都能穩穩處理
    const BATCH_SIZE = 50; 
    const threads = GmailService.searchThreads(BATCH_SIZE);
    
    Logger.log(`本批次找到 ${threads.length} 個對話群組。`);

    if (threads.length === 0) {
      Logger.log('目前沒有需要處理的信件。');
      // 如果之前有設定自動觸發器，這裡可以考慮刪除它，避免空轉
      deleteTrigger('processEmails');
      return;
    }

    // 2. 遍歷每一個對話串
    for (let i = 0; i < threads.length; i++) {
      // --- 時間檢查 ---
      const currentTime = new Date().getTime();
      if (currentTime - startTime > MAX_EXECUTION_MS) {
        Logger.log('執行時間即將逾時，設定自動觸發器以接續執行...');
        createTrigger('processEmails');
        return; // 結束本次執行
      }

      const thread = threads[i];
      const messages = GmailService.getMessages(thread);
      
      // 遍歷對話串中的每一封信
      for (const message of messages) {
        try {
          // 判斷分類
          const categoryPath = Classifier.classify(message);
          Logger.log(`(${i+1}/${threads.length}) 信件 "${message.getSubject()}" -> ${categoryPath}`);

          // 取得或建立資料夾
          const categoryFolder = DriveUtils.getOrCreateFolder(categoryPath);

          // 建立該信件的專屬資料夾
          const emailFolder = DriveUtils.createEmailFolder(categoryFolder, message);

          // 儲存內容
          DriveUtils.saveEmailAsMarkdown(emailFolder, message);

          // 儲存附件
          DriveUtils.saveAttachments(emailFolder, message);
        } catch (err) {
          Logger.log(`處理信件失敗 (Subject: ${message.getSubject()}): ${err.message}`);
          // 繼續處理下一封，不要因為一封失敗就全停
        }
      }

      // 3. 處理完整個 thread 後的後續動作
      GmailService.markAsProcessed(thread);
      
      if (CONFIG.ENABLE_AUTO_TRASH) {
        GmailService.moveToTrash(thread);
      }
    }

    // 如果這批處理完了，檢查是否還有更多信件需要處理
    // 再次搜尋看看是否還有符合條件的信件
    const remainingThreads = GmailService.searchThreads(1); // 只要看有沒有就好，取 1 筆
    if (remainingThreads.length > 0) {
      Logger.log('還有剩餘信件，設定立即接續執行...');
      createTrigger('processEmails');
    } else {
      Logger.log('恭喜！所有信件已處理完畢。');
      deleteTrigger('processEmails');
    }

  } catch (e) {
    Logger.log(`發生未預期的錯誤: ${e.message}`);
    console.error(e);
  }
}

/**
 * 建立一次性的時間觸發器 (1分鐘後執行)
 */
function createTrigger(functionName) {
  // 先檢查是否已經有觸發器，避免重複建立
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === functionName) {
      // 已經有設定了，那就不用再建 (或者是可以刪掉舊的建新的，看策略)
      // 這裡簡單策略：如果有既有的，就不建新的，讓既有的去跑
      return;
    }
  }

  ScriptApp.newTrigger(functionName)
    .timeBased()
    .after(60 * 1000) // 1分鐘後
    .create();
}

/**
 * 刪除指定函式的所有觸發器
 */
function deleteTrigger(functionName) {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}
