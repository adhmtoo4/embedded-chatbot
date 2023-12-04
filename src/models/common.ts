export interface Message {
    message_id: string;
    message_text: string;
    sender_name: string;
    timestamp?: string;
    childs?: any[];
    parent_message?: Message;
    systemPrompt?: string;
}