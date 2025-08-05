export async function testTelegramConnection(): Promise<{success: boolean, message: string, chatId?: string}> {
  try {
    const botToken = '8457550350:AAHgdQajaPOKoSEYSptP0qT4t9si8XgIAXQ';
    
    // First, let's try to get bot info to verify the token works
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const botInfo = await botInfoResponse.json();
    
    if (!botInfo.ok) {
      return {
        success: false,
        message: `Bot token invalid: ${botInfo.description}`
      };
    }
    
    console.log('Bot info:', botInfo.result);
    
    // Try to send a test message to different possible chat IDs
    const possibleChatIds = [
      '8457550350', // The bot's own user ID
      '-1002439558123', // Example group ID (you'll need to replace this)
    ];
    
    for (const chatId of possibleChatIds) {
      try {
        const testMessage = {
          chat_id: chatId,
          text: `🧪 Test message from DendyFood\nTime: ${new Date().toISOString()}`,
          parse_mode: 'HTML' as const
        };

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testMessage),
        });

        const data = await response.json();
        
        if (data.ok) {
          return {
            success: true,
            message: `Message sent successfully to chat_id: ${chatId}`,
            chatId: chatId
          };
        } else {
          console.log(`Failed to send to ${chatId}:`, data.description);
        }
      } catch (error) {
        console.log(`Error sending to ${chatId}:`, error);
      }
    }
    
    return {
      success: false,
      message: 'Could not find a working chat ID. Please:\n1. Create a group with your bot\n2. Get the group chat ID\n3. Update the chatId in telegram.ts'
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Error testing Telegram: ${error}`
    };
  }
}