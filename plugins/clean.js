import fs from 'fs'
import { exec } from 'child_process'

// ===== معرف القناة فقط =====
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

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ هـاد الأمـر غـيـر لـلـمـالـك')

    await conn.sendMessage(m.chat, {
        text: `⏳ *جـاري تـنـضـيـف الـبـوت...*`,
        contextInfo: newsletter
    }, { quoted: m })

    let cleaned = []

    try {
        // 1. مسح مجلد tmp
        if (fs.existsSync('./tmp')) {
            fs.rmSync('./tmp', { recursive: true, force: true })
            fs.mkdirSync('./tmp')
            cleaned.push('✅ مـجـلـد tmp')
        }

        // 2. مسح جلسات gemini
        if (global.geminiSessions) {
            global.geminiSessions = {}
            cleaned.push('✅ جـلـسـات Gemini')
        }
        if (global.globalCookie) {
            global.globalCookie = null
            cleaned.push('✅ كـوكـي Gemini')
        }

        // 3. مسح cache ديال البوت
        if (fs.existsSync('./cache')) {
            fs.rmSync('./cache', { recursive: true, force: true })
            fs.mkdirSync('./cache')
            cleaned.push('✅ مـجـلـد cache')
        }

        // 4. مسح اللوجات
        exec('pm2 flush', () => {})
        cleaned.push('✅ الـلـوجـات')

        // 5. Garbage collector
        if (global.gc) global.gc()

        let txt = `🧹 *تـم الـتـنـضـيـف بـنـجـاح*\n\n`
        txt += cleaned.join('\n')
        txt += `\n\n💾 *الـبـوت دابـا خـفـيـف وسـريـع*`

        await conn.sendMessage(m.chat, {
            text: txt,
            contextInfo: newsletter
        }, { quoted: m })

    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `❌ *خطأ:* ${e.message}`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['تنضيف']
handler.tags = ['owner']
handler.command = /^(تنضيف|clean|تنظيف)$/i
handler.owner = true
handler.limit = false

export default handler
