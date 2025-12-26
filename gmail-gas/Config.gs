/**
 * Config.gs
 * 全域設定檔 (進階細緻分類版)
 * 
 * 邏輯說明：
 * 程式會「由上而下」檢查規則。一旦符合，就會歸檔並停止檢查。
 * 因此，「特定/細節」的規則 (例如：某個平台的發票) 必須放在「通用」規則 (例如：某個平台的所有信) 之前。
 */

const CONFIG = {
  // 請在此填入您的 Google Drive 根目錄 ID
  ROOT_FOLDER_ID: '1s4PTt4zjHyj-NSrLzkvh5llLmC3CzrXj',

  SEARCH_QUERY: 'is:inbox -label:已備份_GAS',
  PROCESSED_LABEL: '已備份_GAS',
  ENABLE_AUTO_TRASH: false,
  
  RULES: [
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
    // 1-2. 財務 - 廣告/貸款/活動推廣 (通常含有銀行關鍵字但非帳單)
    {
      keywords: [
        '信貸', '貸款', '額度', '專屬優惠', '好康', '權益變更', 'borrow', 'loan', 'promotion',
        'cathaylife', 'taishinbank', 'ubot' // 如果只有銀行名但沒中上面的帳單關鍵字，歸類為一般/廣告
      ],
      folderPath: '財務/一般通知與廣告'
    },
    // (補強：如果有漏網的財務關鍵字，可在此補上)
    {
      keywords: ['post.gov.tw', 'ezpay'],
      folderPath: '財務/其他通知'
    },

    // ==========================================
    // 2. 自我成長 - 線上課程 (依照平台分資料夾)
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
    // 其他未列出的課程平台
    {
      keywords: ['classroom.google', 'academy', 'course', '線上課程', 'webinar'],
      folderPath: '自我成長/線上課程/其他'
    },

    // ==========================================
    // 3. 自我成長 - 電子報 (依照發文者分資料夾)
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
    // 4. 工作/技術開發 (依照工具分資料夾)
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
    // 5. 生活/購物訂單 (區分發票與一般通知)
    // ==========================================
    
    // 5-1. 購物 - 發票 (優先抓取「購物平台」+「發票」的概念)
    // 由於我們不能寫 AND 邏輯，這裡採用「常見購物發票標題」來攔截
    {
      keywords: [
        '電子發票證明聯', '發票開立通知', 'invoice notification' 
      ],
      folderPath: '生活/購物訂單/發票'
    },
    
    // 5-2. 購物 - 各大平台通知 (出貨、抵達、訂單成立)
    // 這裡因為已經過濾掉上面的「發票」，剩下的就是一般通知
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
    // 6. 系統通知
    // ==========================================
    {
      keywords: ['calendar-notification'],
      folderPath: '系統通知/Google日曆'
    },
    {
      keywords: ['accounts.google', 'security alert'],
      folderPath: '系統通知/Google帳號安全'
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
