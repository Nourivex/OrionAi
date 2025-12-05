// file: mockup_data.ts

// mockup_data: conversations, chats, characters

// --- MOCK MESSAGES ---
// file: mockup_data.ts

// --- CONVERSATIONS (structured) ---
export const conversations = [
	// Percakapan 1: Tanya jawab pembuatan proyek (teknis, panjang)
	{
		id: 21,
		title: 'Panduan Membuat Proyek Web',
		smartTags: ['project', 'web', 'tutorial'],
		isActive: false,
		lastUpdated: '2025-12-05',
		messages: [
			{
				id: 1,
				type: 'sent',
				content: '**Halo AI**, aku ingin membuat proyek web dari nol. Apa saja langkah awal yang harus aku lakukan?',
				timestamp: '09:00',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 2,
				type: 'received',
				content: 'Tentu! Berikut langkah-langkah dasar membuat proyek web dari nol:\n\n1. Tentukan tujuan dan fitur utama proyek.\n2. Pilih stack teknologi (misal: React, Node.js, dsb).\n3. Inisialisasi repository Git.\n4. Buat struktur folder proyek.\n5. Setup tool seperti ESLint, Prettier, dan package manager.\n6. Mulai koding komponen utama.\n\nMau penjelasan detail di salah satu langkah?',
				timestamp: '09:01',
				reactions: { likes: 1, dislikes: 0 }
			},
			{
				id: 3,
				type: 'sent',
				content: 'Boleh, tolong jelaskan cara setup struktur folder dan tools-nya.',
				timestamp: '09:02',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 4,
				type: 'received',
				content: 'Struktur folder umum proyek web:\n\n- src/ (kode utama)\n- public/ (aset publik)\n- package.json\n- README.md\n\nUntuk tools:\n- ESLint: linting kode\n- Prettier: formatting\n- Git: version control\n\nContoh perintah inisialisasi:\n```bash\nnpm init -y\nnpm install eslint prettier\ngit init\n```',
				timestamp: '09:03',
				reactions: { likes: 2, dislikes: 0 }
			},
			{
				id: 5,
				type: 'sent',
				content: 'Setelah itu, bagaimana cara mulai membuat komponen React?',
				timestamp: '09:04',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 6,
				type: 'received',
				content: 'Setelah setup, buat file misal src/App.tsx. Contoh komponen sederhana:\n```jsx\nfunction App() {\n  return <h1>Hello World!</h1>;\n}\nexport default App;\n```\n\nJalankan dengan Vite atau Create React App. Butuh contoh lebih lanjut?',
				timestamp: '09:05',
				reactions: { likes: 1, dislikes: 0 }
			}
		]
	},

	// Percakapan 2: Tanya jawab sehari-hari (panjang, natural)
	{
		id: 22,
		title: 'Ngobrol Santai Sehari-hari',
		smartTags: ['daily', 'casual', 'life'],
		isActive: false,
		lastUpdated: '2025-12-05',
		messages: [
			{
				id: 1,
				type: 'sent',
				content: 'Pagi AI! Hari ini cuacanya cerah banget ya.',
				timestamp: '07:10',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 2,
				type: 'received',
				content: 'Selamat pagi! Iya, cuaca cerah bisa bikin semangat. Ada rencana apa hari ini?',
				timestamp: '07:11',
				reactions: { likes: 1, dislikes: 0 }
			},
			{
				id: 3,
				type: 'sent',
				content: 'Aku mau jogging sama teman di taman. Kamu sendiri biasanya ngapain kalau pagi?',
				timestamp: '07:12',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 4,
				type: 'received',
				content: 'Kalau aku, biasanya siap-siap membantu kamu! Tapi kalau bisa, aku juga ingin coba menikmati pagi sambil baca buku atau dengar musik.',
				timestamp: '07:13',
				reactions: { likes: 2, dislikes: 0 }
			},
			{
				id: 5,
				type: 'sent',
				content: 'Wah, asik juga ya. Ada rekomendasi lagu buat pagi hari?',
				timestamp: '07:14',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 6,
				type: 'received',
				content: 'Tentu! Coba dengarkan "Here Comes The Sun" dari The Beatles atau "Walking on Sunshine" dari Katrina & The Waves. Dijamin mood jadi bagus!',
				timestamp: '07:15',
				reactions: { likes: 3, dislikes: 0 }
			}
		]
	},
	{
		id: 3,
		title: 'Debug Server Production',
		smartTags: ['node', 'memory', 'production'],
		isActive: true,
		lastUpdated: '2025-12-01',
		messages: [
			{
				id: 1,
				type: 'received',
				content: 'Hello! I\'m your AI assistant. How can I help you debug your Node.js server production issues today?',
				timestamp: '10:30 AM',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 2,
				type: 'sent',
				content: 'Hi! I\'m having trouble with my Node.js server crashing in production. The error logs show "Out of memory" but I can\'t reproduce it locally.',
				timestamp: '10:31 AM',
				reactions: { likes: 0, dislikes: 0 }
			},
			{
				id: 3,
				type: 'received',
				content: 'Here are some steps to investigate memory issues:\n\n1. Use memory profilers and heap snapshots.\n2. Inspect caches and long-lived references.\n3. Check native modules and binary addons.\n\n```javascript\n// sample monitoring snippet\nconst used = process.memoryUsage().heapUsed / 1024 / 1024;\nconsole.log(`Memory used: ${used} MB`);\n```',
				timestamp: '10:32 AM',
				reactions: { likes: 1, dislikes: 0 }
			}
		]
	},

	{
		id: 8,
		title: 'Orion Model Card (README)',
		smartTags: ['model', 'documentation', 'hf'],
		isActive: false,
		lastUpdated: '2025-12-05',
		messages: [
			{
				id: 101,
				type: 'received',
				content: 'Tentu! Berikut adalah contoh model card singkat untuk menguji rendering markdown dan blok kode.\n\n```python\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nmodel_name = "Nourivex/Orion-12B"\ntokenizer = AutoTokenizer.from_pretrained(model_name)\nmodel = AutoModelForCausalLM.from_pretrained(model_name)\n```\n\n**Contoh Bold** dan *italic* serta daftar:\n\n- Item satu\n- Item dua\n\n```bash\nhuggingface-cli download Nourivex/Orion-12B --local-dir ./Orion-12B\n```',
				timestamp: '11:05 AM',
				reactions: { likes: 3, dislikes: 0 }
			}
		]
	}
];

// Keep lightweight lists for sidebar / navigation (map to conversation ids)
export const chats = conversations.map(c => ({ id: c.id, title: c.title, isActive: c.isActive, lastUpdated: c.lastUpdated }));

export const characters = [
	{ id: 1, name: 'Sarah - AI Assistant', role: 'Professional Assistant', isActive: false, avatarGradient: 'var(--theme-primary), var(--theme-accent)' },
	{ id: 2, name: 'Max - Developer Mentor', role: 'Code Expert', isActive: true, avatarGradient: '#00B4D8, #03045E' },
	{ id: 3, name: 'Luna - Creative Writer', role: 'Storytelling Pro', isActive: false, avatarGradient: 'var(--theme-accent), #FF79C6' },
];