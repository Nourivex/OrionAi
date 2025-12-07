/// <reference types="vite/client" />
// api.ts - API service untuk komunikasi dengan backend OrionAI

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "127.0.0.1";
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "8000";
const BASE_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

// =====================
// CHAT API
// =====================

export interface ChatResponse {
  response: string;
}

export async function sendChat(prompt: string, model: string = "orion-12b-it:latest", convId?: number): Promise<any> {
  let url = `${BASE_URL}/chat`;
  if (convId) url += `?conv_id=${convId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}


// =====================
// MEMORY BANK API
// =====================

export interface MemoryItem {
  id: number;
  name: string;
  type: string;
  size: string;
  source: string;
  status: string;
}

export async function getMemoryItems(): Promise<MemoryItem[]> {
  const res = await fetch(`${BASE_URL}/memory`);
  if (!res.ok) throw new Error("Failed to fetch memory items");
  return res.json();
}

export async function getMemoryItem(id: number): Promise<MemoryItem> {
  const res = await fetch(`${BASE_URL}/memory/${id}`);
  if (!res.ok) throw new Error("Failed to fetch memory item");
  return res.json();
}

export async function createMemoryItem(data: Omit<MemoryItem, "id">): Promise<{ id: number }> {
  const res = await fetch(`${BASE_URL}/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create memory item");
  return res.json();
}

export async function updateMemoryItem(id: number, data: Partial<Omit<MemoryItem, "id">>): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/memory/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update memory item");
  return res.json();
}

export async function deleteMemoryItem(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/memory/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete memory item");
  return res.json();
}

// =====================
// CONVERSATIONS API
// =====================

export interface ConversationMessage {
  id: number;
  type: "sent" | "received";
  content: string;
  timestamp: string;
  reactions: { likes: number; dislikes: number };
  tool_action?: {
    type: string;
    tool: string;
    action_required?: boolean;
    message?: string;
    app_name?: string;
    result?: string;
  };
}

export interface Conversation {
  id: number;
  title: string;
  smartTags: string[];
  is_active: number;
  last_updated: string;
  messages: ConversationMessage[];
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE_URL}/conversations`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function getConversation(id: number): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

export async function createConversation(data: Omit<Conversation, "id">): Promise<{ id: number }> {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function updateConversation(id: number, data: Partial<Omit<Conversation, "id">>): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update conversation");
  return res.json();
}

export async function addMessageToConversation(convId: number, message: ConversationMessage): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/conversations/${convId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error("Failed to add message");
  return res.json();
}

export async function deleteConversation(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/conversations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
  return res.json();
}

// =====================
// CHARACTER PERSONAS API (Roleplay)
// =====================

export interface CharacterPersona {
  character_id: string;
  name: string;
  user_relationship: string;
  character_role: string;
  user_persona_nickname: string | null;
  greeting: string;
  short_description: string;
  voice_id: string | null;
  visibility: string;
  category: string;
  tags: string[];
  definition: string;
  isActive?: boolean;
}

// Legacy alias for backward compatibility
export type Character = CharacterPersona;

export async function getCharacters(): Promise<CharacterPersona[]> {
  const res = await fetch(`${BASE_URL}/character_personas`);
  if (!res.ok) throw new Error("Failed to fetch character personas");
  return res.json();
}

export async function getCharacterPersonas(): Promise<CharacterPersona[]> {
  return getCharacters();
}

export async function getCharacter(id: string): Promise<CharacterPersona> {
  const res = await fetch(`${BASE_URL}/character/${id}`);
  if (!res.ok) throw new Error("Failed to fetch character persona");
  return res.json();
}

export async function getCharacterPersona(id: string): Promise<CharacterPersona> {
  return getCharacter(id);
}

export interface CharacterPersonaCreateInput {
  name: string;
  user_relationship: string;
  character_role: string;
  user_persona_nickname?: string;
  greeting?: string;
  short_description: string;
  voice_id?: string;
  visibility?: string;
  category?: string;
  tags?: string[];
}

export async function createCharacter(data: CharacterPersonaCreateInput): Promise<CharacterPersona> {
  const res = await fetch(`${BASE_URL}/character`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create character persona");
  return res.json();
}

export async function createCharacterPersona(data: CharacterPersonaCreateInput): Promise<CharacterPersona> {
  return createCharacter(data);
}

export async function updateCharacter(id: string, data: Partial<CharacterPersona>): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/character/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update character persona");
  return res.json();
}

export async function updateCharacterPersona(id: string, data: Partial<CharacterPersona>): Promise<{ success: boolean }> {
  return updateCharacter(id, data);
}

export async function activateCharacter(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/character/${id}/activate`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to activate character persona");
  return res.json();
}

export async function activateCharacterPersona(id: string): Promise<{ success: boolean }> {
  return activateCharacter(id);
}

export async function deleteCharacter(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/character/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete character persona");
  return res.json();
}

export async function deleteCharacterPersona(id: string): Promise<{ success: boolean }> {
  return deleteCharacter(id);
}

// =====================
// TOOLS - Novel Generator
// =====================

export interface NovelGenerateInput {
  title?: string;
  genre?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
  model?: string;
  outlineOnly?: boolean;
}

export async function generateNovel(payload: NovelGenerateInput): Promise<{ novel: string }> {
  const res = await fetch(`${BASE_URL}/tools/novel/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate novel');
  return res.json();
}

export async function saveNovel(data: { title: string; folder?: string; filename?: string; content: string }): Promise<{ success: boolean; path?: string }> {
  const res = await fetch(`${BASE_URL}/tools/novel/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save novel');
  return res.json();
}

export async function listNovelFolders(): Promise<{ folders: string[] }> {
  const res = await fetch(`${BASE_URL}/tools/novel/folders`);
  if (!res.ok) throw new Error('Failed to list folders');
  return res.json();
}

// =====================
// CHARACTER CONVERSATION API
// =====================

export interface CharacterConversationMessage {
  type: 'user' | 'character';
  content: string;
  timestamp: string;
}

export interface CharacterConversation {
  character_id: string;
  messages: CharacterConversationMessage[];
  created_at?: string;
  updated_at?: string;
  exists: boolean;
}

export async function getCharacterConversation(characterId: string): Promise<CharacterConversation> {
  const res = await fetch(`${BASE_URL}/character/${characterId}/conversation`);
  if (!res.ok) throw new Error("Failed to fetch character conversation");
  return res.json();
}

export async function saveCharacterConversation(
  characterId: string, 
  messages: CharacterConversationMessage[]
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/character/${characterId}/conversation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("Failed to save character conversation");
  return res.json();
}

export async function deleteCharacterConversation(characterId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/character/${characterId}/conversation`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete character conversation");
  return res.json();
}
