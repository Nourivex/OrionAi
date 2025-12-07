# PLAN_CharacterRoleplay.md

## Character Roleplay System - Advanced Features Roadmap

Dokumen ini berisi rencana pengembangan lanjutan untuk sistem Character Roleplay di OrionAi, agar pengalaman roleplay lebih immersive dan smart.

---

## 🎯 Vision

Membuat sistem roleplay karakter yang setara dengan Character.ai dan Chai AI, dengan fitur-fitur unik yang memanfaatkan kemampuan local LLM (Ollama) dan penyimpanan lokal untuk pengalaman yang lebih personal.

---

## 📋 Fitur Lanjutan yang Direncanakan

### 1. **Memory System (Character Memory)**

#### 1.1 Short-term Memory
- Konteks percakapan terakhir (already implemented: 6 messages)
- Emotional state tracking dalam sesi

#### 1.2 Long-term Memory
```typescript
interface CharacterMemory {
  character_id: string;
  user_facts: string[];        // Fakta tentang user yang karakter ingat
  shared_experiences: string[]; // Pengalaman bersama
  user_preferences: string[];   // Preferensi user
  important_dates: string[];    // Tanggal penting
  nicknames: string[];          // Panggilan khusus
  relationship_progress: string; // Perkembangan hubungan
}
```

#### 1.3 Memory Extraction
- Auto-extract important information dari percakapan
- LLM-based summarization untuk long conversations
- "Remember this" feature - user bisa tandai info penting

### 2. **Scene System**

#### 2.1 Scene Definition
```typescript
interface Scene {
  scene_id: string;
  name: string;
  description: string;
  location: string;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: string;
  mood: string;
  background_image?: string;
  ambient_sound?: string;
}
```

#### 2.2 Scene Features
- **Scene Selector**: Pilih setting percakapan (Cafe, Beach, Library, dll)
- **Dynamic Scene Generation**: LLM generate scene berdasarkan konteks
- **Scene Transitions**: "Let's move to..." triggers scene change
- **Scene-aware Responses**: Karakter aware dengan lokasi

#### 2.3 Pre-built Scenes
- ☕ Cozy Cafe
- 🏖️ Sunset Beach
- 📚 Quiet Library
- 🏠 Living Room
- 🌳 Park Garden
- 🌃 City Night
- 🏔️ Mountain View
- Custom scenes

### 3. **Avatar System**

#### 3.1 Character Avatar
```typescript
interface CharacterAvatar {
  character_id: string;
  avatar_url: string;
  avatar_type: 'static' | 'animated' | 'live2d';
  expressions: {
    neutral: string;
    happy: string;
    sad: string;
    angry: string;
    surprised: string;
    thinking: string;
  };
}
```

#### 3.2 Avatar Features
- **Avatar Upload**: Custom avatar untuk karakter
- **Expression Detection**: Avatar berubah sesuai mood respons
- **Avatar Generator**: AI generate avatar dari description
- **Placeholder Avatars**: Gradient-based unique avatars (current)

### 4. **Conversation Enhancement**

#### 4.1 Response Formatting
- **Narration vs Dialogue**: Pisahkan narasi (*action*) dan dialog ("speech")
- **Emotion Tags**: Deteksi emosi dari respons
- **Action Highlighting**: Bold/italic untuk actions

#### 4.2 Interactive Features
- **Quick Actions**: Tombol cepat untuk aksi umum (hug, smile, laugh)
- **Dice Roll**: Random events dalam roleplay
- **Time Skip**: "A few hours later..."

#### 4.3 Conversation Modes
```typescript
type ConversationMode = 
  | 'casual'        // Santai, friendly
  | 'roleplay'      // Full RP dengan narasi
  | 'story'         // Collaborative storytelling
  | 'adventure';    // Game-like dengan choices
```

### 5. **Character Progression**

#### 5.1 Relationship System
```typescript
interface RelationshipStatus {
  level: number;           // 1-100
  stage: 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'best_friend' | 'romantic';
  affection: number;
  trust: number;
  interactions_count: number;
  first_met: string;
  milestones: string[];
}
```

#### 5.2 Progression Features
- **Relationship Meter**: Visual progress bar
- **Milestones**: Unlock special interactions
- **Anniversary**: Karakter ingat "first meeting"
- **Mood System**: Karakter punya mood harian

### 6. **Multi-Character Chat**

#### 6.1 Group Chat
- Chat dengan multiple characters sekaligus
- Characters interact with each other
- User sebagai moderator/participant

#### 6.2 Character Relationships
- Define relationships antar karakter
- Karakter punya opini tentang karakter lain

### 7. **Voice & Audio**

#### 7.1 Text-to-Speech
- Voice output untuk karakter (future: local TTS)
- Multiple voice options per character

#### 7.2 Voice Input
- Speech-to-text untuk user input
- Natural conversation flow

### 8. **Export & Sharing**

#### 8.1 Conversation Export
- Export chat as PDF/Markdown
- Share memorable moments
- Conversation backup

#### 8.2 Character Sharing
- Export character definition
- Import shared characters
- Character marketplace (local)

---

## 🗂️ Database Schema Updates

### New Tables

```sql
-- Character Memory
CREATE TABLE character_memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    memory_type TEXT NOT NULL,  -- 'fact', 'experience', 'preference'
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 5,
    created_at TEXT,
    last_referenced TEXT,
    FOREIGN KEY (character_id) REFERENCES character_personas(character_id)
);

-- Scenes
CREATE TABLE scenes (
    scene_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    time_of_day TEXT,
    weather TEXT,
    mood TEXT,
    background_url TEXT,
    is_custom INTEGER DEFAULT 0
);

-- Character Conversation Scenes
CREATE TABLE conversation_scenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    scene_id TEXT,
    activated_at TEXT,
    FOREIGN KEY (character_id) REFERENCES character_personas(character_id),
    FOREIGN KEY (scene_id) REFERENCES scenes(scene_id)
);

-- Relationship Progress
CREATE TABLE character_relationships (
    character_id TEXT PRIMARY KEY,
    level INTEGER DEFAULT 1,
    stage TEXT DEFAULT 'stranger',
    affection INTEGER DEFAULT 0,
    trust INTEGER DEFAULT 0,
    interactions INTEGER DEFAULT 0,
    first_met TEXT,
    FOREIGN KEY (character_id) REFERENCES character_personas(character_id)
);
```

---

## 📅 Implementation Priority

### Phase 1 (Current Sprint)
- [x] Basic character chat
- [x] Conversation persistence
- [x] Side panel with menu
- [x] Character detail page
- [x] Edit character page
- [ ] Reset/Delete chat functions

### Phase 2 (Next Sprint)
- [ ] Long-term memory system
- [ ] Memory extraction from conversations
- [ ] Basic scene system (pre-built scenes)
- [ ] Scene selector UI

### Phase 3 (Future)
- [ ] Avatar system with expressions
- [ ] Relationship progression
- [ ] Advanced conversation modes
- [ ] Response formatting (narration/dialogue split)

### Phase 4 (Long-term)
- [ ] Multi-character chat
- [ ] Voice features (TTS/STT)
- [ ] Export/sharing system
- [ ] Character marketplace

---

## 🔧 Technical Considerations

### LLM Context Management
- Token limit awareness (context window)
- Smart summarization untuk long conversations
- Memory retrieval based on relevance

### Performance
- Lazy loading untuk scenes/avatars
- IndexedDB untuk offline support
- Optimistic UI updates

### Privacy
- All data stored locally
- No cloud sync (optional future feature)
- Export for backup

---

## 📝 Notes

- Prioritas fitur dapat berubah berdasarkan feedback user
- Implementasi bertahap untuk menjaga stabilitas
- Focus pada experience daripada complexity

---

*Last Updated: December 6, 2025*
