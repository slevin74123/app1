# 🔧 Ghid Complet pentru Rezolvarea Problemelor Supabase + Next.js

## 🚨 Probleme Comune și Soluții

### 1. **Proiect Supabase pus pe pauză periodic**

#### **Simptome:**
- Erori `net::ERR_NAME_NOT_RESOLVED`
- `TypeError: Failed to fetch`
- Aplicația nu se poate conecta la baza de date

#### **Soluții:**

##### **Opțiunea A: Configurare automată (Recomandată)**
```powershell
# Rulează scriptul de configurare automată
.\scripts\setup-supabase.ps1
```

##### **Opțiunea B: Configurare manuală**
1. Mergi la [supabase.com](https://supabase.com)
2. Verifică statusul proiectului
3. Dacă este pe pauză, fă restore
4. Copiază URL-ul și cheia anonimă
5. Creează fișierul `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. **Erori Next.js - Fișiere lipsă**

#### **Simptome:**
```
[Error: ENOENT: no such file or directory, open '.next\server\app\page\app-build-manifest.json']
```

#### **Soluții:**

##### **Clean Build Complet:**
```powershell
# 1. Oprește procesele Node.js
taskkill /f /im node.exe

# 2. Șterge cache-ul Next.js
Remove-Item -Recurse -Force .next

# 3. Curăță cache-ul npm
npm cache clean --force

# 4. Reinstalează dependențele
npm install

# 5. Rulează build-ul
npm run build
```

##### **Script de restart automat:**
```powershell
# Rulează monitorizarea automată
.\scripts\auto-restart.ps1
```

### 3. **Probleme de conectivitate DNS**

#### **Simptome:**
- `ping zugwcilkqqkyzloekddp.supabase.co` nu funcționează
- Erori de rezolvare nume

#### **Soluții:**

##### **Verificare DNS:**
```powershell
# Testează DNS-ul general
ping supabase.com

# Testează DNS-ul specific
nslookup zugwcilkqqkyzloekddp.supabase.co

# Flush DNS cache (Windows)
ipconfig /flushdns
```

##### **Configurare DNS alternativ:**
1. Deschide **Network & Internet Settings**
2. Click pe **Change adapter options**
3. Click dreapta pe **Wi-Fi** sau **Ethernet**
4. **Properties** → **Internet Protocol Version 4 (TCP/IPv4)**
5. **Properties** → **Use the following DNS server addresses:**
   - **Preferred DNS server:** `8.8.8.8` (Google)
   - **Alternate DNS server:** `1.1.1.1` (Cloudflare)

### 4. **Probleme de autentificare Supabase**

#### **Simptome:**
- Erori `401 Unauthorized`
- Token-uri expirate
- Probleme cu refresh-ul token-urilor

#### **Soluții:**

##### **Configurare robustă:**
```typescript
// src/lib/supabase-robust.ts
export const robustSupabase = new RobustSupabaseClient();

// Verifică statusul
if (isSupabaseOnline()) {
  // Folosește Supabase
} else {
  // Folosește fallback
}
```

##### **Configurare automată:**
```typescript
// src/lib/supabase-auto-config.ts
export const supabaseAutoConfig = SupabaseAutoConfig.getInstance();

// Forțează verificarea
forceSupabaseConfigCheck();
```

## 🛠️ Scripturi Utile

### **1. Setup Supabase Automat**
```powershell
.\scripts\setup-supabase.ps1
```
**Funcții:**
- Testează conexiunea la Supabase
- Creează fișierul `.env.local`
- Actualizează configurația
- Restart automat al aplicației

### **2. Monitorizare și Restart Automat**
```powershell
.\scripts\auto-restart.ps1
```
**Funcții:**
- Monitorizează statusul aplicației
- Detectează probleme
- Restart automat când e necesar
- Protecție împotriva restart-urilor excesive

## 📋 Pași de Urgență

### **Când proiectul Supabase este pe pauză:**

1. **Verifică statusul:**
   - Mergi la [supabase.com](https://supabase.com)
   - Verifică dashboard-ul proiectului

2. **Fă restore:**
   - Click pe **Restore Project**
   - Așteaptă să se termine procesul

3. **Configurează din nou:**
   ```powershell
   .\scripts\setup-supabase.ps1
   ```

4. **Testează conexiunea:**
   - Verifică că aplicația funcționează
   - Testează funcționalitatea "Raportează Loc Liber"

### **Când Next.js nu funcționează:**

1. **Clean build complet:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm cache clean --force
   npm install
   npm run build
   ```

2. **Restart aplicație:**
   ```powershell
   npm run dev
   ```

3. **Monitorizare automată:**
   ```powershell
   .\scripts\auto-restart.ps1
   ```

## 🔍 Debugging și Logging

### **Logs Supabase:**
```typescript
// Adaugă logging în configurație
console.log('Supabase Config:', { 
  url: config.url, 
  anonKey: config.anonKey ? '***' : 'missing' 
});
```

### **Status monitoring:**
```typescript
// Verifică statusul în timp real
setInterval(() => {
  console.log(`🔄 Status Supabase: ${isSupabaseOnline() ? 'ONLINE' : 'OFFLINE'}`);
}, 30000);
```

### **Event listeners:**
```typescript
// Ascultă pentru actualizări de configurație
window.addEventListener('supabaseConfigUpdated', (event) => {
  console.log('Configurația Supabase actualizată:', event.detail);
});
```

## 📞 Suport și Contact

### **Pentru probleme Supabase:**
- [Documentația oficială](https://supabase.com/docs)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [Discord Community](https://discord.supabase.com)

### **Pentru probleme Next.js:**
- [Documentația oficială](https://nextjs.org/docs)
- [GitHub Issues](https://github.com/vercel/next.js/issues)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## 🎯 Prevenirea Problemelor

### **1. Monitorizare automată:**
- Rulează scriptul de monitorizare
- Configurează notificări pentru probleme

### **2. Backup configurație:**
- Salvează credențialele Supabase
- Documentează pașii de configurare

### **3. Testare periodică:**
- Testează funcționalitatea săptămânal
- Verifică statusul proiectului Supabase

### **4. Fallback-uri:**
- Implementează date mock pentru dezvoltare
- Configurează servicii alternative

---

**💡 Sfat:** Rulează scripturile de configurare automată pentru a evita problemele în viitor! 