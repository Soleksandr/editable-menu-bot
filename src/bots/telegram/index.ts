import TelegramBot from 'node-telegram-bot-api';
import { get, set } from '../../services/redis';
import { MOVE_BACK, MOVE_FORWARD, PAGINATION_STATUS } from '../../constants';
import {
  generateInlineKeyboard,
  generateInlineKeyboardAfterMoveBackAction,
  generateInlineKeyboardAfterMoveForwardAction,
} from './handlers/markup';

export const initTelegramBot = (token: string) => {
  const bot = new TelegramBot(token as string, { polling: true });

  bot.on('callback_query', async (msg) => {
    if (!msg.from.username || msg.data === PAGINATION_STATUS || !msg.data) {
      return;
    }

    const userData = await get(msg.from.username);
    if (!userData) {
      return;
    }

    if ([MOVE_FORWARD, MOVE_BACK].includes(msg.data)) {
      let inlineKeyboard = null;
      let activePage = userData.activePage;

      switch (msg.data) {
        case MOVE_BACK:
          inlineKeyboard = generateInlineKeyboardAfterMoveBackAction(userData);
          activePage -= 1;
          break;
        case MOVE_FORWARD:
          inlineKeyboard = generateInlineKeyboardAfterMoveForwardAction(userData);
          activePage += 1;
          break;
      }

      if (inlineKeyboard) {
        set(msg.from.username, { activePage });

        bot.editMessageReplyMarkup(
          {
            inline_keyboard: inlineKeyboard,
          },
          { message_id: userData.messageId, chat_id: userData.chatId }
        );
      }

      return;
    }

    bot.sendMessage(userData.chatId, msg.data || '');
  });

  bot.onText(/\/list/, async (msg) => {
    if (!msg.from?.username) {
      return;
    }

    const inlineKeyboard = await generateInlineKeyboard(msg.from.username);

    if (!inlineKeyboard) {
      return;
    }

    const messageDetails = await bot.sendMessage(msg.chat.id, 'Header', {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });

    set(msg.from.username, {
      chatId: messageDetails.chat.id,
      messageId: messageDetails.message_id,
    });
  });
};
