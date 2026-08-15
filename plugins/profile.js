// سكريبت جلب بروفايل برقم - نسخة نهائية V3
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

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // رسالة الاستعمال - فيها المعرف
    if (!text) return await conn.sendMessage(m.chat, {
        text: `📌 *اسـتـعـمـال الأمـر*\n\n${usedPrefix + command} 212698498657\n\n*مـثـال:*\n${usedPrefix + command} 2126xxxxxxx`,
        contextInfo: newsletter
    }, { quoted: m })

    let number = text.replace(/[^0-9]/g, '')
    
    // التحقق من الرقم - مع المعرف
    if (number.length < 10) return await conn.sendMessage(m.chat, {
        text: `❌ *الـرقـم غـيـر صـحـيـح*\n\nتـأكـد مـن الـرقـم ودخـلـو بـهـاد الـشـكـل:\n${usedPrefix + command} 2126xxxxxxx`,
        contextInfo: newsletter
    }, { quoted: m })

    let jid = number + '@s.whatsapp.net'
    
    try {
        // 1. جيب صورة البروفايل
        let pp = await conn.profilePictureUrl(jid, 'image').catch(() => 'https://i.imgur.com/whlB5rR.png')
        
        // 2. جيب الاسم - الى ما لقاهش خليه "مـسـتـخـدم واتـسـاب"
        let name = await conn.getName(jid)
        if (!name || name === number) name = 'مـسـتـخـدم واتـسـاب'

        let bio = `
👤 *بـروفـايـل الـمـسـتـخـدم*

*الاســم:* ${name}
*الـرقــم:* +${number}
        `.trim()

        // 3. زر مراسلة
        let buttons = [
            { buttonId: `https://wa.me/${number}`, buttonText: { displayText: '💬 مـراسـلـة' }, type: 1 }
        ]

        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: bio,
            footer: '𝙄𝙎𝘼𝙂𝙄 𝘽𝙊𝙏',
            buttons: buttons,
            headerType: 4,
            contextInfo: newsletter
        }, { quoted: m })

    } catch (e) {
        console.log(e)
        // الخطأ حتى هو بالمعرف
        await conn.sendMessage(m.chat, {
            text: `⚠️ *مـا قـدرتـش نـجـيـب الـبـروفـايـل*\n\nالـسـبـب: الـرقـم مـاشـي فـالـواتـسـاب او غـيـر مـوجـود`,
            contextInfo: newsletter
        }, { quoted: m })
    }
}

handler.help = ['بروفايل <رقم>']
handler.tags = ['info']
handler.command = ['بروفايل', 'profile', 'pfp']
handler.limit = false

export default handler
