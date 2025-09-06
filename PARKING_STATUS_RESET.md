# 🔄 Resetare Status Locuri Parcare

Am creat 3 scripturi SQL pentru resetarea statusului locurilor de parcare în baza ta de date Supabase.

## 📋 **Scripturile Disponibile:**

### 1. **`quick_reset_parking_status.sql`** - Resetare Rapidă
- **Ce face:** Toate locurile devin disponibile (100% libere)
- **Când să folosești:** Pentru testare sau când vrei să începi cu o stare curată
- **Rezultat:** `available_spots = total_spots`, `reserved_spots = 0`, `occupied_spots = 0`

### 2. **`realistic_parking_status.sql`** - Status Realist
- **Ce face:** Simulează situații reale cu locuri variate
- **Când să folosești:** Pentru demo-uri sau testare reală
- **Rezultat:** 60-90% disponibile, 5-15% rezervate, 5-20% ocupate

### 3. **`reset_parking_status.sql`** - Resetare Avansată
- **Ce face:** Resetare inteligentă cu verificări și corecții
- **Când să folosești:** Pentru producție sau când vrei control total
- **Rezultat:** Statusuri optimizate cu validări

## 🚀 **Cum să Rulezi Scripturile:**

### **Opțiunea 1: Supabase Dashboard (Recomandată)**
1. Deschide [Supabase Dashboard](https://supabase.com/dashboard)
2. Selectează proiectul tău
3. Mergi la **SQL Editor**
4. Copiază și lipeste unul din scripturile de mai sus
5. Apasă **Run** (▶️)

### **Opțiunea 2: Supabase CLI**
```bash
supabase db reset --db-url "your-database-url"
```

## 📊 **Ce Se Va Întâmpla:**

### **După Resetare:**
- Toate locurile de parcare vor avea statusuri actualizate
- Pinii pe hartă vor afișa statusurile corecte
- Iconițele vor fi actualizate:
  - 🟢 **Verde** (`available.ico`) - locuri disponibile
  - 🟤 **Maro** (`reserved.ico`) - locuri rezervate  
  - 🔴 **Roșu** (`occupied.ico`) - locuri ocupate

### **Exemplu "Parcare Pantelimon":**
- **Total:** 47 locuri
- **După resetare rapidă:** 47 disponibile, 0 rezervate, 0 ocupate
- **După resetare realistă:** ~35 disponibile, ~5 rezervate, ~7 ocupate

## 🔍 **Verificare Rezultat:**

După ce rulezi scriptul, vei vedea:
- Lista cu toate locurile de parcare și statusurile lor
- Statistici generale (total locuri, disponibilitate medie)
- Confirmarea că suma locurilor este corectă

## ⚠️ **Important:**

- **Backup:** Fă backup la baza de date înainte de resetare
- **Testare:** Testează mai întâi pe o bază de test
- **Verificare:** Asigură-te că scriptul s-a executat cu succes

## 🎯 **Recomandare:**

Pentru început, folosește **`quick_reset_parking_status.sql`** pentru a avea toate locurile disponibile, apoi poți trece la **`realistic_parking_status.sql`** pentru simulări mai reale.

---

**Hai să resetăm statusul locurilor de parcare! 🚗💨** 