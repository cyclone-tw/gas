/**
 * Config.gs
 * 全域設定檔 (進階細緻分類版)
 * 
 * 邏輯說明：
 * 程式會「由上而下」檢查規則。一旦符合，就會歸檔並停止檢查。
 */

const CONFIG = {
  // 請在此填入您的 Google Drive 根目錄 ID
  ROOT_FOLDER_ID: '1s4PTt4zjHyj-NSrLzkvh5llLmC3CzrXj',

  // 1. 抓取範圍：所有信件 (排除垃圾桶)，且尚未備份過的
  // -in:trash 代表排除垃圾桶
  // -label:已備份_GAS 代表排除已經處理過的
  SEARCH_QUERY: '-in:trash -label:已備份_GAS',

  PROCESSED_LABEL: '已備份_GAS',
  ENABLE_AUTO_TRASH: false, // 建議先設 false，備份完確認沒問題再手動執行 Cleaner
  
  RULES: [
    // ==========================================
    // 0. 系統與登入通知 (全站統一)
    // ==========================================
    // 優先攔截所有看起來像登入通知的信，不管來自哪個平台
    {
      keywords: [
        'login alert', 'new login', 'sign-in', 'verification code', 'verify your account', 'security alert',
        '登入通知', '帳號安全', '驗證碼', '安全性警示', '重設密碼', 'password reset',
        'calendar-notification' // 日曆通知也放這
      ],
      folderPath: '系統通知/所有登入與安全通知'
    },

    // ==========================================
    // 1. 財務與帳單 (優先處理重要憑證)
    // ==========================================
    
    // 1-1. 財務 - 確定是「帳單/發票/扣款」的憑證
    {
      keywords: [
        '電子發票開立通知', '繳費通知', '信用卡帳單', '交易明細', '扣款成功', 'payment received',
        'e-statement', 'electronic invoice', 'bill ready'
      ],
      folderPath: '財務/帳單憑證'
    },
    // 1-2. 財務 - 廣告/貸款/活動推廣
    {
      keywords: [
        '信貸', '貸款', '額度', '專屬優惠', '好康', '權益變更', 'borrow', 'loan', 'promotion',
        'cathaylife', 'taishinbank', 'ubot'
      ],
      folderPath: '財務/一般通知與廣告'
    },
    {
      keywords: ['post.gov.tw', 'ezpay'],
      folderPath: '財務/其他通知'
    },

    // ==========================================
    // 2. 自我成長 - 線上課程
    // ==========================================
    {
      keywords: ['pressplay'],
      folderPath: '自我成長/線上課程/PressPlay'
    },
    {
      keywords: ['hahow'],
      folderPath: '自我成長/線上課程/Hahow'
    },
    {
      keywords: ['skool'],
      folderPath: '自我成長/線上課程/Skool'
    },
    {
      keywords: ['tibame'],
      folderPath: '自我成長/線上課程/Tibame'
    },
    {
      keywords: ['accupass'],
      folderPath: '自我成長/線上課程/Accupass'
    },
    {
      keywords: ['shifu'],
      folderPath: '自我成長/線上課程/Shifu'
    },
    {
      keywords: ['gaiconf'],
      folderPath: '自我成長/線上課程/Gaiconf'
    },
    {
      keywords: ['classroom.google', 'academy', 'course', '線上課程', 'webinar'],
      folderPath: '自我成長/線上課程/其他'
    },

    // ==========================================
    // 3. 自我成長 - 電子報
    // ==========================================
    {
      keywords: ['readingoutpost', '閱讀前哨站'],
      folderPath: '自我成長/電子報/閱讀前哨站'
    },
    {
      keywords: ['raymondhou', '雷蒙三十'],
      folderPath: '自我成長/電子報/雷蒙三十'
    },
    {
      keywords: ['lifehacker'],
      folderPath: '自我成長/電子報/Lifehacker'
    },
    {
      keywords: ['substack'],
      folderPath: '自我成長/電子報/Substack'
    },
    {
      keywords: ['cw.com.tw', '天下雜誌'],
      folderPath: '自我成長/電子報/天下雜誌'
    },
    {
      keywords: ['ghost.io'],
      folderPath: '自我成長/電子報/Ghost'
    },

    // ==========================================
    // 4. 工作/技術開發
    // ==========================================
    {
      keywords: ['github'],
      folderPath: '工作/技術開發/GitHub'
    },
    {
      keywords: ['notion'],
      folderPath: '工作/技術開發/Notion'
    },
    {
      keywords: ['google cloud', 'gcp'],
      folderPath: '工作/技術開發/GCP'
    },
    {
      keywords: ['setapp', 'vibe', 'coding', 'skywork'],
      folderPath: '工作/技術開發/工具軟體'
    },

    // ==========================================
    // 5. 生活/購物訂單
    // ==========================================
    
    // 5-1. 購物 - 發票
    {
      keywords: [
        '電子發票證明聯', '發票開立通知', 'invoice notification' 
      ],
      folderPath: '生活/購物訂單/發票'
    },
    
    // 5-2. 購物 - 各大平台通知
    {
      keywords: ['coupang'],
      folderPath: '生活/購物訂單/Coupang'
    },
    {
      keywords: ['books.com.tw', '博客來'],
      folderPath: '生活/購物訂單/博客來'
    },
    {
      keywords: ['shopee', '蝦皮'],
      folderPath: '生活/購物訂單/蝦皮'
    },
    {
      keywords: ['momo'],
      folderPath: '生活/購物訂單/Momo'
    },
    {
      keywords: ['pchome'],
      folderPath: '生活/購物訂單/PChome'
    },
    {
      keywords: ['order', '訂單', '出貨', '取貨'],
      folderPath: '生活/購物訂單/其他'
    },

    // ==========================================
    // 6. 其他 (原本的詳細分類，如果上面沒抓到，這邊會接住)
    // ==========================================
    {
      keywords: ['accounts.google'], // Google 帳號通知如果沒被第一項抓到，會在這裡被捕捉
      folderPath: '系統通知/Google其他'
    },

    // ==========================================
    // 7. 預設分類
    // ==========================================
    {
      keywords: [], 
      folderPath: '未分類信件'
    }
  ]
};
