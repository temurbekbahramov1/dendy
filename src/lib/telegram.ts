interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const botToken = '8457550350:AAHgdQajaPOKoSEYSptP0qT4t9si8XgIAXQ';
    
    // You need to replace this with your actual chat ID
    // Options:
    // 1. Your personal user ID (get it from @userinfobot)
    // 2. A group chat ID (starts with -100...)
    // 3. A channel chat ID (starts with -100...)
    const chatId = '7392334150'; // Your actual chat ID
    
    if (chatId === 'YOUR_CHAT_ID_HERE') {
      console.warn('⚠️ Please update the chatId in telegram.ts with your actual Telegram chat ID');
      console.log('💡 To get your chat ID:');
      console.log('   1. Message @userinfobot on Telegram');
      console.log('   2. It will reply with your user ID');
      console.log('   3. For groups: add the bot to the group and send /get_chat_id');
      return false;
    }
    
    const telegramMessage: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };

    console.log('📤 Sending Telegram message to chat_id:', chatId);
    console.log('📝 Message content:', message);

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramMessage),
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Telegram message sent successfully');
      console.log('📨 Message ID:', data.result.message_id);
      return true;
    } else {
      console.error('❌ Failed to send Telegram message:', data);
      console.error('Error description:', data.description);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    return false;
  }
}

export function formatOrderMessage(orderData: {
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
    item: {
      nameUz: string;
      nameRu: string;
    };
  }>;
  totalPrice: number;
  paymentMethod: string;
  customerPhone: string;
}): string {
  const itemsList = orderData.items.map(item => 
    `• ${item.item.nameUz} (${item.item.nameRu}) - ${item.quantity} x ${item.price.toLocaleString()} so'm = ${(item.quantity * item.price).toLocaleString()} so'm`
  ).join('\n');

  return `
<b>🍔 YANGI BUYURTMA!</b>

<b>📞 Telefon:</b> <code>${orderData.customerPhone}</code>
<b>💰 To'lov usuli:</b> ${orderData.paymentMethod === 'CASH' ? 'Naqd pul' : 'Karta orqali'}
<b>📊 Jami summa:</b> <b>${orderData.totalPrice.toLocaleString()} so'm</b>

<b>🛒 Buyurtma mahsulotlari:</b>
${itemsList}

<b>⏰ Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { 
  timeZone: 'Asia/Tashkent',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})}

<i>Buyurtma 30-35 daqiqa ichida yetkazib beriladi</i>
  `.trim();
}

// Helper function to get your chat ID
export async function getMyChatId(): Promise<string | null> {
  try {
    const botToken = '8457550350:AAHgdQajaPOKoSEYSptP0qT4t9si8XgIAXQ';
    
    // This won't work directly, but shows you how to get chat IDs
    console.log('💡 To get your chat ID:');
    console.log('   1. Open Telegram');
    console.log('   2. Search for @userinfobot');
    console.log('   3. Send /start to the bot');
    console.log('   4. It will show your User ID');
    console.log('   5. Replace YOUR_CHAT_ID_HERE in telegram.ts with that ID');
    
    return null;
  } catch (error) {
    console.error('Error getting chat ID:', error);
    return null;
  }
}