import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import CharacterChatHeader from './CharacterChatHeader';
import CharacterChatInput from './CharacterChatInput';
import CharacterMessageList from './CharacterMessageList';
import CharacterSidePanel from './CharacterSidePanel';
import { CharacterMessage } from './CharacterMessageBubble';
import { 
  getCharacter, 
  CharacterPersona, 
  sendChat,
  getCharacterConversation,
  saveCharacterConversation,
  deleteCharacterConversation,
  CharacterConversationMessage
} from '../../api/api';
import toast from 'react-hot-toast';

const CharacterChatPage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState<CharacterPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<CharacterMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (characterId && characterId !== 'new') {
      loadCharacter();
    }
  }, [characterId]);

  // Save conversation when messages change (debounced, only if at least 1 user message)
  useEffect(() => {
    if (!characterId || !messages.some(m => m.type === 'user')) return;
    const saveTimeout = setTimeout(() => {
      const conversationMessages = messages.map(m => ({
        type: m.type,
        content: m.content,
        timestamp: m.timestamp
      }));
      saveCharacterConversation(characterId, conversationMessages as import('../../api/api').CharacterConversationMessage[]).catch(console.error);
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [messages, characterId]);

  const loadCharacter = async () => {
    setLoading(true);
    try {
      const data = await getCharacter(characterId!);
      setCharacter(data);
      
      const conversation = await getCharacterConversation(characterId!);
      
      if (conversation.exists && conversation.messages.length > 0) {
        const loadedMessages: CharacterMessage[] = conversation.messages.map((m, idx) => ({
          id: idx + 1,
          type: m.type,
          content: m.content,
          timestamp: m.timestamp
        }));
        setMessages(loadedMessages);
        setMessageCount(conversation.messages.filter(m => m.type === 'user').length);
      } else {
        if (data.greeting) {
          setMessages([{
            id: 1,
            type: 'character',
            content: data.greeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
        setMessageCount(0);
      }
    } catch (err) {
      console.error(err);
      navigate('/characters');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending || !character) return;

    const userMessage: CharacterMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageCount(prev => prev + 1);
    setInputValue('');
    setSending(true);

    try {
      const systemContext = `Kamu adalah ${character.name}. ${character.definition}\n\nPanggil user dengan sebutan "${character.user_persona_nickname || 'User'}". Hubunganmu dengan user adalah "${character.user_relationship}". Peranmu adalah "${character.character_role}".`;
      
      const recentMessages = messages.slice(-6).map(m => 
        m.type === 'user' ? `User: ${m.content}` : `${character.name}: ${m.content}`
      ).join('\n');
      
      const fullPrompt = `${systemContext}\n\n${recentMessages}\nUser: ${userMessage.content}\n\n${character.name}:`;
      
      const start = Date.now();
      const response = await sendChat(fullPrompt);
      const elapsed = Date.now() - start;
      const minDelay = 600; // ensure typing visible at least 600ms
      if (elapsed < minDelay) {
        await new Promise(res => setTimeout(res, minDelay - elapsed));
      }

      const charMessage: CharacterMessage = {
        id: messages.length + 2,
        type: 'character',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, charMessage]);
    } catch (err) {
      console.error('Failed to get response:', err);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        type: 'character',
        content: '*Maaf, aku sedang tidak bisa merespons. Coba lagi nanti.*',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setSending(false);
    }
  };

  // Regenerate last AI response (fitur opsional, backend tidak native, bisa dihapus jika tidak ingin)
  // Jika backend tidak support, hapus handleRegenerate dan prop onRegenerate di CharacterMessageList
  // const handleRegenerate = ...

  const handleNewChat = async () => {
    if (!characterId || !character) return;
    await deleteCharacterConversation(characterId);
    // Notify user and reload to reflect cleared conversation state
    try {
      // small user-visible notification
      try { toast.success('Percakapan dihapus. Memuat ulang ke keadaan New Chat.'); } catch {}
    } catch (e) {
      // ignore
    }
    // reload page so loader -> greeting appears as initial state
    window.location.reload();
  };

  // Reset chat - delete and start from greeting
  const handleResetChat = async () => {
    if (!characterId || !character) return;
    
    const confirmed = window.confirm('Reset chat? This will delete all messages and start from greeting.');
    if (!confirmed) return;
    
    await deleteCharacterConversation(characterId);
    setMessages([]);
    setMessageCount(0);
    
    if (character.greeting) {
      setMessages([{
        id: 1,
        type: 'character',
        content: character.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Delete all messages completely
  const handleDeleteChat = async () => {
    if (!characterId) return;
    
    const confirmed = window.confirm('Delete all messages? This cannot be undone.');
    if (!confirmed) return;
    
    await deleteCharacterConversation(characterId);
    setMessages([]);
    setMessageCount(0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-theme-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-theme-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex-1 flex items-center justify-center bg-theme-bg">
        <p className="text-theme-text/60">Character not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full bg-theme-bg overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <CharacterChatHeader 
          character={character} 
          onMenuClick={() => setSidePanelOpen(!sidePanelOpen)}
          onResetChat={handleResetChat}
          onDeleteChat={handleDeleteChat}
          hasMessages={messages.length > 1 || (messages.length === 1 && messages[0].type === 'user')}
        />

        {/* Character Avatar Card */}
        <div className="flex-shrink-0 flex flex-col items-center py-6 border-b border-theme-primary-dark/5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-theme-primary to-theme-accent flex items-center justify-center shadow-lg mb-3">
            <Bot size={36} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold text-theme-text">{character.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            {(Array.isArray(character.tags)
              ? character.tags
              : typeof character.tags === 'string'
                ? (() => { try { return JSON.parse(character.tags); } catch { return []; } })()
                : []
            ).slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs text-theme-primary">{tag}</span>
            ))}
          </div>
          <p className="text-xs text-theme-text/50 mt-1">By @OrionAi</p>
        </div>

        <CharacterMessageList
          messages={messages}
          characterName={character.name}
          isTyping={sending}
          messageCount={messageCount}
        />

        <CharacterChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={sending}
          characterName={character.name.split(' - ')[0]}
        />
      </div>

      {/* Side Panel */}
      <CharacterSidePanel
        character={character}
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        onNewChat={handleNewChat}
        messageCount={messageCount}
      />
    </div>
  );
};

export default CharacterChatPage;
