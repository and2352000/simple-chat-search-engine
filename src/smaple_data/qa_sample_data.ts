import "dotenv/config";
import { dataSource } from "../typeorm/datasource";
import { QAService } from "../service/qa";

const qaService = QAService.getInstance();

const qaData = [
    {
        question: "我可以幾天內無條件退費",
        answer: "7天內我們都可以無條件退費，超過7天走保固流程",
    },
    {
        question: "下單後多久會出貨",
        answer: "平日16:00前完成付款，當天即可出貨",
    },
    {
        question: "可以指定送達日期嗎",
        answer: "可以，在結帳備註填寫日期即可安排",
    },
    {
        question: "是否提供貨到付款",
        answer: "提供貨到付款，需加收30元手續費",
    },
    {
        question: "如何查詢訂單狀態",
        answer: "登入會員中心即可看到最新訂單進度",
    },
    {
        question: "商品有問題可以換貨嗎",
        answer: "收到商品7日內皆可申請換貨一次",
    },
    {
        question: "如何申請發票補寄",
        answer: "聯繫客服提供訂單編號即可補寄電子發票",
    },
    {
        question: "發票可以改抬頭嗎",
        answer: "開立後無法修改抬頭，請下單前確認資訊",
    },
    {
        question: "加入會員有什麼優惠",
        answer: "首次加入贈送50元購物金與專屬折扣",
    },
    {
        question: "購物金多久內要使用",
        answer: "購物金自領取日起90天內有效",
    },
    {
        question: "會員等級如何升級",
        answer: "當年度消費滿5000元即可升級銀卡會員",
    },
    {
        question: "預購商品多久到貨",
        answer: "預購商品依頁面公告時間出貨，約14-21天",
    },
    {
        question: "可以分期付款嗎",
        answer: "刷卡滿3000元可享3期零利率",
    },
    {
        question: "忘記密碼怎麼辦",
        answer: "在登入頁點選忘記密碼即可重新設定",
    },
    {
        question: "下單後可以修改地址嗎",
        answer: "請儘速聯繫客服，若未出貨可協助修改",
    },
    {
        question: "商品有保固嗎",
        answer: "電子產品享原廠一年保固",
    },
    {
        question: "保固期間壞掉怎麼處理",
        answer: "提供維修中心資訊或協助送修",
    },
    {
        question: "是否提供禮物包裝",
        answer: "提供付費禮物包裝服務，結帳時可勾選",
    },
    {
        question: "可以開立公司戶發票嗎",
        answer: "可以，請在結帳填寫統編與公司抬頭",
    },
    {
        question: "訂單可以合併出貨嗎",
        answer: "同會員未出貨訂單可申請合併一次",
    },
    {
        question: "如何使用折扣碼",
        answer: "在結帳頁輸入折扣碼即可折抵",
    },
    {
        question: "折扣碼可以重複使用嗎",
        answer: "多數折扣碼僅限使用一次，依活動為準",
    },
    {
        question: "訂閱電子報有什麼好處",
        answer: "可優先取得新品資訊與專屬折扣碼",
    },
    {
        question: "海外地區可以配送嗎",
        answer: "目前僅配送台灣本島與離島",
    },
    {
        question: "離島運費多少",
        answer: "離島單筆訂單運費為150元",
    },
    {
        question: "如何申請退貨",
        answer: "在訂單詳情點選申請退貨並依指示寄回",
    },
    {
        question: "退貨運費誰負擔",
        answer: "非瑕疵退貨需由買家自付運費",
    },
    {
        question: "退款需要多久",
        answer: "我們收到退貨後3-5個工作天內完成退款",
    },
    {
        question: "優惠券可以與購物金併用嗎",
        answer: "可以，折扣依序為優惠券後再使用購物金",
    },
    {
        question: "下單後多久會收到簡訊通知",
        answer: "系統於成功下單後5分鐘內發送簡訊",
    },
    {
        question: "是否提供企業大量採購",
        answer: "提供大量採購報價，請洽企業專線",
    },
    {
        question: "如何查詢客服聯絡方式",
        answer: "官網右下角客服中心可取得所有聯絡方式",
    },
    {
        question: "客服服務時間是什麼時候",
        answer: "週一至週五09:00-18:00提供服務",
    },
    {
        question: "可以指定物流嗎",
        answer: "目前合作黑貓宅急便與7-11超取可選",
    },
    {
        question: "門市可以自取嗎",
        answer: "目前僅提供網路購物，暫無自取服務",
    },
    {
        question: "超商取貨有免運嗎",
        answer: "訂單滿799元即可享超商取貨免運",
    },
    {
        question: "訂單可以取消嗎",
        answer: "商品未出貨前皆可於訂單頁直接取消",
    },
    {
        question: "如何追蹤物流",
        answer: "出貨後會寄送物流編號，可於官網查詢",
    },
    {
        question: "收到商品缺件怎麼辦",
        answer: "請拍照並聯繫客服，我們會補寄缺少品項",
    },
    {
        question: "預購可以提前取消嗎",
        answer: "預購商品可於出貨前隨時申請取消",
    },
    {
        question: "是否提供會員生日禮",
        answer: "生日月登入會員即可領取生日禮金100元",
    },
    {
        question: "可以開立電子發票載具嗎",
        answer: "結帳時輸入載具條碼即可上傳",
    },
    {
        question: "如何更新收件人資訊",
        answer: "在會員地址簿內新增或修改即可套用",
    },
    {
        question: "電子票券多久會寄出",
        answer: "付款後1小時內將票券以Email送達",
    },
    {
        question: "促銷活動可以叠加嗎",
        answer: "除非另有標示，活動優惠不可疊加",
    },
    {
        question: "贈品會另外寄送嗎",
        answer: "贈品與商品同箱出貨，若缺少請聯繫客服",
    },
    {
        question: "會員點數怎麼獲得",
        answer: "每消費30元可累積1點，出貨後入帳",
    },
    {
        question: "點數可以折抵多少金額",
        answer: "1點可折抵1元，下次結帳時使用",
    },
    {
        question: "是否接受無卡分期",
        answer: "目前僅提供信用卡分期，無卡分期暫不支援",
    },
    {
        question: "商品缺貨何時補貨",
        answer: "可在商品頁點選到貨通知，補貨立即通知",
    },
];
async function bootstrap() {
    await dataSource.initialize();
    await qaService.batchCreateQA(qaData);
}

bootstrap();