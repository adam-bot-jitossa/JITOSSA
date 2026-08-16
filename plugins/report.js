// سكريبت الابلاغ - مع صورة المستخدم + معرف القناة
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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return await conn.sendMessage(m.chat, {
    text: `📌 *نـظام الابـلاغـات*
اسـتعمل الأمـر هكذا بـاش ترسـل ابلاغ للـمطـور:

*مـثـال:*
${usedPrefix + command} البـوت ما كيحملش فيديوهات انستغرام
`,
    contextInfo: newsletter
  }, { quoted: m })

  // رقم المطور الخاص
  let developerNumber = '212698498657@s.whatsapp.net'
  
  let user = m.pushName || 'مستخدم مجهول'
  let userId = m.sender.split('@')[0]
  let chatName = m.isGroup ? (await conn.getName(m.chat)) : 'خاص'
  
  // جيب صورة البروفايل ديال المستخدم
  let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => null)
  
  let reportMsg = `
🚨 *ابــــــــلاغ جــديـــــد*

👤 *مـــن:* ${user}
📱 *رقــــم:* wa.me/${userId}
💬 *المـحادثــة:* ${chatName}
⏰ *الــــوقـــت:* ${new Date().toLocaleString('ar-MA')}

📝 *المــشــكل:*
${text}
`.trim()

  try {
    // رسالة للمطور فيها الصورة + النص + معرف القناة
    if (ppUrl) {
      await conn.sendMessage(developerNumber, { 
        image: { url: ppUrl },
        caption: reportMsg,
        contextInfo: newsletter 
      })
    } else {
      // الى ما عندوش صورة صيفط نص بوحدو
      await conn.sendMessage(developerNumber, { 
        text: reportMsg,
        contextInfo: newsletter 
      })
    }

    // رسالة للمستخدم
    await conn.sendMessage(m.chat, {
      text: `✅ *تـم إرسـال الابـلاغ بنـجـاح*\n\nشكراً على الابـلاغ، المـطـور غـادي يتوصل بالرسالة ويـشـوف المـشـكل فأقـرب وقـت.`,
      contextInfo: newsletter
    }, { quoted: m })

    console.log(`[Report] تــم إرسـال ابـلاغ من ${userId} للمـطـور`)
  } catch (e) {
    console.log('[Report Error]', e)
    await conn.sendMessage(m.chat, {
      text: `⚠️ وقـع خـطأ: ${e.message}\n\nتأكد أن البوت يقدر يصـيفط رسـائل للأرقـام الخـارجيـة.`,
      contextInfo: newsletter
    }, { quoted: m })
  }
}

handler.help = ['ابلاغ <المشكل>']
handler.tags = ['info']
handler.command = ['ابلاغ', 'report', 'إبلاغ'] // <-- تبدل هنا
handler.limit = false

export default handler
