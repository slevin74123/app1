#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://zugwcilkqqkyzloekddp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3djaWxrcXFreXpsb2VrZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDA3NDEsImV4cCI6MjA2Nzk3Njc0MX0.M0Qmw4NaI-1DXacU2N_eTP3YEKKEw52hmSyCAudf_fw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAddParking() {
  console.log('🧪 Test adăugare parcare...\n');
  
  try {
    // Datele pentru parcarea de test
    const parkingData = {
      nume: 'Parcare Test Piața Victoriei',
      adresa: 'Piața Victoriei, București',
      rating: 4.5,
      numar_recenzii: 10,
      disponibilitate: true,
      garaj: false,
      acoperit: true,
      securitate: true,
      pret_pe_ora: 12.0,
      distanta_km: 0.3,
      timp_mers_minute: 4,
      lat: 44.4268,
      lng: 26.1025
    };

    console.log('📝 Încerc să adaug parcarea:', parkingData.nume);
    
    const { data, error } = await supabase
      .from('parcari_raportate')
      .insert(parkingData)
      .select();

    if (error) {
      console.log('❌ Eroare la adăugare:', error.message);
      return false;
    } else {
      console.log('✅ Parcarea a fost adăugată cu succes!');
      console.log('   ID:', data[0].id);
      console.log('   Nume:', data[0].nume);
      console.log('   Disponibilitate:', data[0].disponibilitate);
      return true;
    }

  } catch (error) {
    console.log('💥 Eroare neașteptată:', error.message);
    return false;
  }
}

// Rulează testul
testAddParking()
  .then(success => {
    if (success) {
      console.log('\n🎉 Testul de adăugare parcare a reușit!');
      process.exit(0);
    } else {
      console.log('\n❌ Testul de adăugare parcare a eșuat.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('\n💥 Eroare neașteptată:', error);
    process.exit(1);
  }); 