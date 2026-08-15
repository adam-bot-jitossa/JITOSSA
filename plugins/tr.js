// سكريبت الترجمة V2 - خدام 100%
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

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    if (!text) return await conn.sendMessage(m.chat, {
        text: `📌 *اسـتـعـمـال الأمـر*\n\n${usedPrefix + command} <رمز_اللغة> <النص>\n\n*أمـثـلـة:*\n${usedPrefix + command} en مـرحـبـا\n${usedPrefix + command} ar Hello`,
        contextInfo: newsletter
    }, { quoted: m })

    let lang = args[0]
    let txt = args.slice(1).join(' ')

    if (!txt) return await conn.sendMessage(m.chat, {
        text: `❌ *خـصـك تـكـتـب الـنـص مـن بـعـد الـلـغـة*`,
        contextInfo: newsletter
    }, { quoted: m })

    try {
        // API خدامة بلا node-fetch
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(txt)}`
        let res = await (await fetch(url)).json()
        let translated = res[0].map(a => a[0]).join('')

        let fromLang = res[2] || 'auto'

        let result = `
🌍 *نـتـيـجـة الـتـرجـمـة*

*مـن:* ${fromLang}
*إلـى:* ${lang.toUpperCase()}

*الأصـل:*
${txt}

*الـتـرجـمـة:*
${translated}
        `.trim()

        await conn.sendMessage(m.chat, { text: result, contextInfo: newsletter }, { quoted: m })

    } catch (e) {
        console.log(e)
        await conn.sendMessage(m.chat, {
            text: `⚠️ *الـتـرجـمـة فـشـلـت*\n\nتـأكـد مـن رمـز الـلـغـة صـحـيـح.\nمـثـال: en, ar, fr`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['ترجم <لغة> <نص>']
handler.tags = ['tools']
handler.command = ['ترجم', 'translate', 'tr']
handler.limit = false

export default handler
