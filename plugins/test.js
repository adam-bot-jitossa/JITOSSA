// سكريبت التست - فحص سرعة البوت
// ===== معرف القناة =====
const channelName = '𝗝𝗜𝗧𝗢𝗦𝗦𝗔 𝗕𝗢𝗧 🇲🇦'
const CHANNEL_ID = '120363410733859643@newsletter'

const newsletter = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: CHANNEL_ID,
        newsletterName: channelName
    }
}
// ===========================

import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    // 1. حساب البنق
    let start = new Date() * 1
    
    // رسالة مؤقتة باش نحسبو السرعة
    let testMsg = await conn.sendMessage(m.chat, {
        text: '⏳ *جـاري الفـحـص...*',
        contextInfo: newsletter
    }, { quoted: m })
    
    let end = new Date() * 1
    let ping = end - start

    // 2. وقت التشغيل
    let uptime = process.uptime()
    let h = Math.floor(uptime / 3600)
    let min = Math.floor((uptime % 3600) / 60)
    let sec = Math.floor(uptime % 60)
    let uptimeStr = `${h} س ${min} د ${sec} ث`

    // 3. الوقت والتاريخ ديال المغرب
    let date = moment().tz('Africa/Casablanca').format('DD/MM/YYYY')
    let time = moment().tz('Africa/Casablanca').format('HH:mm:ss')

    // 4. حالة الرام
    let used = process.memoryUsage()
    let ram = `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`

    let result = `
⚡ *نـتـائـج الـفـحـص*

🚀 *الـسـرعـة:* ${ping} ms
⏱️ *الـتـشـغـيـل:* ${uptimeStr}
📆 *الـتـاريـخ:* ${date}
📟 *الـوقـت:* ${time}
💾 *الـرام:* ${ram}
    `.trim()

    // مسح الرسالة المؤقتة وصيفط النتيجة
    await conn.sendMessage(m.chat, { delete: testMsg.key })
    await conn.sendMessage(m.chat, {
        text: result,
        contextInfo: newsletter
    }, { quoted: m })
}

handler.help = ['تست']
handler.tags = ['tools']
handler.command = ['تست', 'ping', 'فحص', 'test']
handler.limit = false

export default handler
