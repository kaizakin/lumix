export interface ChatMessageDBRecord {
  id: string;
  sender: string;
  message: string;
  chatGroupId: string;
  createdAt: Date;
  userEmail: string;
  userAvatar: string | null;
  userId: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar?: string | undefined;
  message: string;
  pod: string;
  createdAt: string;
  user: {
    email: string;
    avatar?: string | undefined;
  };
}

export interface SendMessageData {
  sender: string;
  message: string;
  pod: string;
  createdAt?: string;
  user: {
    email: string;
    avatar?: string;
  };
}