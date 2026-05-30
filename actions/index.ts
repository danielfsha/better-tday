export const deleteChat = (chatId: string) => {
  return {
    type: "DELETE_CHAT",
    payload: chatId,
  };
};

export const getRecentChats = () => {
  return {
    type: "GET_RECENT_CHATS",
  };
};

export const updateChatPinned = (chatId: string, pinned: boolean) => {
  return {
    type: "UPDATE_CHAT_PINNED",
    payload: { chatId, pinned },
  };
};

export const updateChatTitle = (chatId: string, title: string) => {
  return {
    type: "UPDATE_CHAT_TITLE",
    payload: { chatId, title },
  };
};

export const updateChatVisibility = (chatId: string, visible: boolean) => {
  return {
    type: "UPDATE_CHAT_VISIBILITY",
    payload: { chatId, visible },
  };
};

export const deleteTrailingMessages = () => {
  return {
    type: "DELETE_TRAILING_MESSAGES",
  };
};
