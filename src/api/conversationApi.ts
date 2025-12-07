// conversationApi.ts - API untuk conversation (recent chat) dari backend


import { MemoryItem, BASE_URL } from './api';

export interface Conversation {
  id: number;
  title: string;
  date: string;
  isActive: boolean;
}

  // Sementara: mapping dari memory bank (bisa diganti jika ada tabel khusus)
  const res = await fetch(`${BASE_URL}/memory`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  const data: MemoryItem[] = await res.json();
  // Mapping ke Conversation
  return data.map((item) => ({
    id: item.id,
    title: item.name,
    date: new Date().toISOString().split('T')[0],
    isActive: false,
  }));
}
