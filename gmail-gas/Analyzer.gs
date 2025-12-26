/**
 * Analyzer.gs
 * 用於分析信箱習慣，協助建立分類規則
 */

function analyzeInbox() {
  const LIMIT = 500; // 使用者要求 500 則
  Logger.log(`開始分析最近 ${LIMIT} 則收件匣信件... (可能需要一點時間)`);

  // 取得收件匣中的 Threads
  // 注意：GmailApp.getInboxThreads 最多一次取 500
  const threads = GmailApp.getInboxThreads(0, LIMIT);
  
  const senderCounts = {};
  const subjectKeywords = {};
  
  // 簡單的停用詞過濾 (可依需求擴充)
  const stopWords = new Set([
    're:', 'fwd:', 'fw:', '的', '了', '是', '在', '和', '與', '或', '及', 'test', 'notification', 'alert',
    'your', 'you', 'to', 'for', 'the', 'a', 'on', 'in', 'of', 'and'
  ]);

  threads.forEach(thread => {
    // 我們只看每個對話串的第一封信 (通常最具代表性)
    const msg = thread.getFirstMessageSubject();
    const from = thread.getMessages()[0].getFrom();
    
    // 統計寄件者 (嘗試提取 email 地址)
    // From 格式通常是 "Name <email@example.com>" 或 "email@example.com"
    let email = from;
    const emailMatch = from.match(/<([^>]+)>/);
    if (emailMatch) {
      email = emailMatch[1];
    }
    email = email.toLowerCase().trim();
    senderCounts[email] = (senderCounts[email] || 0) + 1;

    // 統計主旨關鍵字
    // 移除特殊符號，轉小寫，切割
    const subject = msg || '';
    const words = subject.toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ') // 保留中英數，其他轉空白
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w)); // 過濾短字與停用詞

    words.forEach(w => {
      subjectKeywords[w] = (subjectKeywords[w] || 0) + 1;
    });
  });

  // --- 輸出結果 ---

  // 1. Top Senders
  const sortedSenders = Object.entries(senderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // 取前 30 名

  let report = '\n=== 分析報告 (前 500 則) ===\n\n';
  
  report += '--- 最常寄信給您的寄件者 (Top 30) ---\n';
  sortedSenders.forEach(([email, count]) => {
    report += `${count} 封: ${email}\n`;
  });

  // 2. Top Keywords
  const sortedKeywords = Object.entries(subjectKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // 取前 30 名

  report += '\n--- 最常出現的主旨關鍵字 (Top 30) ---\n';
  sortedKeywords.forEach(([word, count]) => {
    report += `${count} 次: ${word}\n`;
  });

  report += '\n=== 報告結束 ===\n';
  report += '請複製以上內容貼給 AI 助手。';

  Logger.log(report);
}
