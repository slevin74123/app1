#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase din fișierul de configurare
const supabaseUrl = 'https://zugwcilkqqkyzloekddp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3djaWxrcXFreXpsb2VrZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDA3NDEsImV4cCI6MjA2Nzk3Njc0MX0.M0Qmw4NaI-1DXacU2N_eTP3YEKKEw52hmSyCAudf_fw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testare conexiune Supabase...\n');
  
  try {
    // Test 1: Verifică conectivitatea de bază
    console.log('1️⃣ Test conectivitate de bază...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Eroare conectivitate:', authError.message);
      return false;
    } else {
      console.log('✅ Conectivitate OK');
      console.log('   Sesiune:', authData.session ? 'Activă' : 'Inactivă');
    }

    // Test 2: Verifică tabelele existente
    console.log('\n2️⃣ Test tabele existente...');
    
    // Test tabela parking_spots
    const { data: parkingData, error: parkingError } = await supabase
      .from('parking_spots')
      .select('*')
      .limit(1);
    
    if (parkingError) {
      console.log('⚠️  Tabela parking_spots:', parkingError.message);
    } else {
      console.log('✅ Tabela parking_spots accesibilă');
      console.log('   Înregistrări:', parkingData?.length || 0);
    }

    // Test tabela parcari_raportate
    const { data: reportedData, error: reportedError } = await supabase
      .from('parcari_raportate')
      .select('*')
      .limit(1);
    
    if (reportedError) {
      console.log('⚠️  Tabela parcari_raportate:', reportedError.message);
    } else {
      console.log('✅ Tabela parcari_raportate accesibilă');
      console.log('   Înregistrări:', reportedData?.length || 0);
    }

    // Test 3: Verifică RLS (Row Level Security)
    console.log('\n3️⃣ Test Row Level Security...');
    
    // Încearcă să inserezi o înregistrare de test (ar trebui să eșueze fără autentificare)
    const { data: insertData, error: insertError } = await supabase
      .from('parcari_raportate')
      .insert({
        nume: 'Test Parking',
        adresa: 'Test Address',
        rating: 4.5,
        numar_recenzii: 10,
        disponibilitate: true,
        garaj: false,
        acoperit: true,
        securitate: true,
        pret_pe_ora: 10.00,
        distanta_km: 1.5,
        timp_mers_minute: 15,
        lat: 44.4268,
        lng: 26.1025
      })
      .select();

    if (insertError) {
      console.log('✅ RLS funcționează (inserarea a fost blocată)');
      console.log('   Mesaj:', insertError.message);
    } else {
      console.log('⚠️  RLS nu pare să fie configurat corect');
      console.log('   Inserare reușită:', insertData);
    }

    // Test 4: Verifică structura tabelelor
    console.log('\n4️⃣ Test structură tabele...');
    
    // Încearcă să vezi structura tabelului parcari_raportate
    const { data: structureData, error: structureError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, adresa, rating, pret_pe_ora, lat, lng, created_at')
      .limit(1);
    
    if (structureError) {
      console.log('❌ Eroare la verificarea structurii:', structureError.message);
    } else {
      console.log('✅ Structura tabelului parcari_raportate OK');
      if (structureData && structureData.length > 0) {
        console.log('   Câmpuri disponibile:', Object.keys(structureData[0]));
      }
    }

    // Test 5: Verifică performanța
    console.log('\n5️⃣ Test performanță...');
    const startTime = Date.now();
    
    const { data: perfData, error: perfError } = await supabase
      .from('parcari_raportate')
      .select('*')
      .limit(10);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (perfError) {
      console.log('❌ Eroare la testul de performanță:', perfError.message);
    } else {
      console.log('✅ Performanță OK');
      console.log(`   Timp răspuns: ${responseTime}ms`);
      console.log(`   Înregistrări returnate: ${perfData?.length || 0}`);
    }

    console.log('\n🎉 Testare completă finalizată!');
    return true;

  } catch (error) {
    console.log('❌ Eroare generală:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

// Rulează testul
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Conexiunea cu baza de date funcționează corect!');
      process.exit(0);
    } else {
      console.log('\n❌ Există probleme cu conexiunea la baza de date.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('\n💥 Eroare neașteptată:', error);
    process.exit(1);
  }); 