# PLAN IMPLEMENTARE FUNCȚIONALITĂȚI - APLICAȚIE PARCARE

## 📋 **OVERVIEW FUNCȚIONALITĂȚI**

### **1. Parcările Mele (My Parking Sessions)**
### **2. Comunitate (Community Feed)**
### **3. Parcări Disponibile (Available Parking)**
### **4. Chat Live (Live Chat)**
### **5. Harta Principală (Main Map)**
### **6. Raportează o Problemă (Report a Problem)**

---

## 🗄️ **BAZA DE DATE**

### **Tabele Principale:**
1. **`sesiuni_parcare`** - Sesiunile de parcare ale utilizatorilor
2. **`postari_comunitate`** - Postările din feed-ul comunității
3. **`mesaje_chat`** - Mesajele din chat-ul live
4. **`raportari_probleme`** - Raportările de probleme
5. **`statistici_utilizatori`** - Statistici pentru economii și fidelitate
6. **`promotii_economii`** - Sistemul de economii și promoții

### **Funcții Economii:**
- **Nivele de fidelitate:** Începător, Bronze, Argint, Aur, Platinum
- **Economii progresive:** 5%, 10%, 15%, 20% reducere
- **Ore gratuite** pentru utilizatori fideli
- **Cashback** pentru sesiuni lungi
- **Bonusuri** pentru raportări utile

---

## 🎯 **1. PARCĂRILE MELE (My Parking Sessions)**

### **Componente UI:**
```tsx
// src/components/MyParkingSessions.tsx
interface ParkingSession {
  id: string;
  location: string;
  status: 'activ' | 'rezervat' | 'finalizat';
  startTime: Date;
  endTime: Date;
  cost: number;
  timeRemaining?: string;
}

interface StatsCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}
```

### **Funcționalități:**
- **Statistici în timp real:** Total ore, cost, economii, sesiuni
- **Gestionare sesiuni:** Oprește, prelungește timpul
- **Calcul automat economii** bazat pe nivelul de fidelitate
- **Notificări** pentru sesiuni care expiră

### **API Endpoints:**
```typescript
// GET /api/parking-sessions - Lista sesiuni
// POST /api/parking-sessions - Creează sesiune
// PUT /api/parking-sessions/:id/stop - Oprește sesiunea
// PUT /api/parking-sessions/:id/extend - Prelungește timpul
// GET /api/parking-stats - Statistici utilizator
```

---

## 🌐 **2. COMUNITATE (Community Feed)**

### **Componente UI:**
```tsx
// src/components/CommunityFeed.tsx
interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  location?: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  type: 'general' | 'problema' | 'recomandare' | 'alerta';
}
```

### **Funcționalități:**
- **Creare postări** cu text, imagini, locație
- **Sistem de like-uri și comentarii**
- **Filtrare după tip** (general, problemă, recomandare, alertă)
- **Verificare utilizatori** pentru postări importante
- **Moderare automată** pentru conținut inadecvat

### **API Endpoints:**
```typescript
// GET /api/community-posts - Lista postări
// POST /api/community-posts - Creează postare
// POST /api/community-posts/:id/like - Like postare
// POST /api/community-posts/:id/comment - Comentează
// DELETE /api/community-posts/:id - Șterge postarea
```

---

## 🚗 **3. PARCĂRI DISPONIBILE (Available Parking)**

### **Componente UI:**
```tsx
// src/components/AvailableParking.tsx
interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  availability: 'disponibil' | 'ocupat' | 'rezervat';
  features: string[];
  pricePerHour: number;
  distance: number;
  walkingTime: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ReservationModal {
  parkingId: string;
  duration: number; // ore
  startTime: Date;
  totalCost: number;
}
```

### **Funcționalități:**
- **Filtrare și sortare** după distanță, preț, rating
- **Rezervare instantanee** cu selectare durată
- **Integrare cu harta** pentru direcții
- **Sistem de rating** și recenzii
- **Notificări** pentru locuri noi disponibile

### **API Endpoints:**
```typescript
// GET /api/available-parking - Lista parcări disponibile
// POST /api/parking-reservations - Creează rezervare
// GET /api/parking/:id/details - Detalii parcare
// POST /api/parking/:id/review - Adaugă recenzie
```

---

## 💬 **4. CHAT LIVE (Live Chat)**

### **Componente UI:**
```tsx
// src/components/LiveChat.tsx
interface ChatMessage {
  id: string;
  user: {
    name: string;
    initials: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  type: 'text' | 'image' | 'location';
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface OnlineUser {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  lastActivity: Date;
}
```

### **Funcționalități:**
- **Chat în timp real** cu WebSocket
- **Lista utilizatori online** cu status
- **Mesaje cu imagini și locații**
- **Sistem de like-uri** pentru mesaje
- **Notificări** pentru mesaje noi

### **API Endpoints:**
```typescript
// WebSocket /api/chat - Conexiune chat live
// GET /api/chat/messages - Istoric mesaje
// POST /api/chat/messages - Trimite mesaj
// POST /api/chat/messages/:id/like - Like mesaj
// GET /api/chat/online-users - Utilizatori online
```

---

## 🗺️ **5. HARTA PRINCIPALĂ (Main Map)**

### **Componente UI:**
```tsx
// src/components/MainMap.tsx
interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  viewMode: 'map' | 'satellite';
}

interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  type: 'parking' | 'user' | 'problem';
  data: ParkingSpot | UserLocation | ProblemReport;
}
```

### **Funcționalități:**
- **Harta interactivă** cu zoom și pan
- **Markere pentru parcări** cu tooltip-uri
- **Toggle între hartă și satelit**
- **Căutare pe hartă** cu autocomplete
- **Integrare cu toate funcționalitățile**

### **API Endpoints:**
```typescript
// GET /api/map/parking-spots - Parcări pentru hartă
// GET /api/map/user-location - Locația utilizatorului
// POST /api/map/nearby-parking - Parcări apropiate
```

---

## ⚠️ **6. RAPORTEAZĂ O PROBLEMĂ (Report a Problem)**

### **Componente UI:**
```tsx
// src/components/ReportProblem.tsx
interface ProblemReport {
  id: string;
  type: 'parcare_ilegala' | 'masina_abandonata' | 'contor_stricat' | 'zona_interzisa' | 'alte_probleme';
  title: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  priority: 'scazuta' | 'medie' | 'ridicata' | 'urgenta';
  status: 'nou' | 'in_procesare' | 'rezolvat' | 'respins';
}
```

### **Funcționalități:**
- **Formular de raportare** cu câmpuri obligatorii
- **Upload imagini** pentru dovezi
- **Selectare locație** pe hartă
- **Sistem de prioritate** automat
- **Urmărire status** raportare

### **API Endpoints:**
```typescript
// POST /api/problem-reports - Creează raportare
// GET /api/problem-reports - Lista raportări utilizator
// PUT /api/problem-reports/:id - Actualizează raportare
// GET /api/problem-reports/:id/status - Status raportare
```

---

## 🔧 **IMPLEMENTARE TEHNICĂ**

### **Structura Fișierelor:**
```
src/
├── components/
│   ├── MyParkingSessions/
│   ├── CommunityFeed/
│   ├── AvailableParking/
│   ├── LiveChat/
│   ├── MainMap/
│   └── ReportProblem/
├── hooks/
│   ├── useParkingSessions.ts
│   ├── useCommunityFeed.ts
│   ├── useLiveChat.ts
│   └── useMapData.ts
├── services/
│   ├── parkingService.ts
│   ├── communityService.ts
│   ├── chatService.ts
│   └── mapService.ts
├── types/
│   ├── parking.ts
│   ├── community.ts
│   └── chat.ts
└── utils/
    ├── calculations.ts
    ├── notifications.ts
    └── validations.ts
```

### **Tehnologii:**
- **Frontend:** Next.js 15, React 18, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **Maps:** Google Maps API
- **Real-time:** Supabase Realtime + WebSocket
- **State Management:** React Context + Zustand
- **UI:** Tailwind CSS + Lucide Icons

### **Securitate:**
- **Row Level Security (RLS)** pentru toate tabelele
- **Validare input** pe client și server
- **Rate limiting** pentru API-uri
- **Sanitizare date** pentru XSS protection

---

## 📱 **FLUX UTILIZATOR**

### **1. Prima utilizare:**
1. **Înregistrare/Login**
2. **Tutorial** pentru funcționalități
3. **Prima rezervare** cu bonus economii

### **2. Utilizare zilnică:**
1. **Verifică harta** pentru parcări disponibile
2. **Rezervă locul** cu durata dorită
3. **Monitorizează sesiunea** în "Parcările Mele"
4. **Interacționează** cu comunitatea

### **3. Funcții avansate:**
1. **Raportează probleme** pentru comunitate
2. **Participă la chat** pentru informații live
3. **Câștigă economii** prin fidelitate
4. **Ajută comunitatea** cu informații utile

---

## 🎯 **URMĂTORII PAȘI**

### **Faza 1 (Săptămâna 1):**
- [ ] Implementare baza de date
- [ ] Componente de bază pentru toate funcționalitățile
- [ ] Integrare cu Supabase

### **Faza 2 (Săptămâna 2):**
- [ ] Funcționalități complete pentru "Parcările Mele"
- [ ] Sistem de rezervări
- [ ] Integrare cu Google Maps

### **Faza 3 (Săptămâna 3):**
- [ ] Chat live cu WebSocket
- [ ] Feed comunitate cu moderare
- [ ] Sistem de raportări

### **Faza 4 (Săptămâna 4):**
- [ ] Sistem de economii și fidelitate
- [ ] Testare și optimizare
- [ ] Lansare beta

**Vrei să încep cu implementarea bazei de date sau cu o funcționalitate specifică?** 