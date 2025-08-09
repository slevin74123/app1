#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://zugwcilkqqkyzloekddp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3djaWxrcXFreXpsb2VrZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDA3NDEsImV4cCI6MjA2Nzk3Njc0MX0.M0Qmw4NaI-1DXacU2N_eTP3YEKKEw52hmSyCAudf_fw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestParkings() {
  console.log('🚗 Adăugare parcări de test cu noul design de pinuri...\n');
  
  const testParkings = [
    {
      nume: 'Parcare Centrul Vechi',
      adresa: 'Strada Lipscani, București',
      rating: 4.2,
      numar_recenzii: 15,
      disponibilitate: true,
      garaj: false,
      acoperit: true,
      securitate: true,
      pret_pe_ora: 10.0,
      distanta_km: 0.2,
      timp_mers_minute: 3,
      lat: 44.4318,
      lng: 26.1025
    },
    {
      nume: 'Parcare Piața Unirii',
      adresa: 'Piața Unirii, București',
      rating: 3.8,
      numar_recenzii: 8,
      disponibilitate: false,
      garaj: true,
      acoperit: true,
      securitate: true,
      pret_pe_ora: 15.0,
      distanta_km: 0.8,
      timp_mers_minute: 12,
      lat: 44.4268,
      lng: 26.1025
    },
    {
      nume: 'Parcare Herăstrău',
      adresa: 'Parcul Herăstrău, București',
      rating: 4.5,
      numar_recenzii: 22,
      disponibilitate: true,
      garaj: false,
      acoperit: false,
      securitate: false,
      pret_pe_ora: 5.0,
      distanta_km: 2.1,
      timp_mers_minute: 25,
      lat: 44.4768,
      lng: 26.0825
    },
    {
      nume: 'Parcare Mall Băneasa',
      adresa: 'Șoseaua București-Ploiești, București',
      rating: 4.0,
      numar_recenzii: 12,
      disponibilitate: true,
      garaj: true,
      acoperit: true,
      securitate: true,
      pret_pe_ora: 12.0,
      distanta_km: 8.5,
      timp_mers_minute: 45,
      lat: 44.5268,
      lng: 26.0825
    },
    {
      nume: 'Parcare Gara de Nord',
      adresa: 'Gara de Nord, București',
      rating: 3.5,
      numar_recenzii: 18,
      disponibilitate: false,
      garaj: false,
      acoperit: true,
      securitate: true,
      pret_pe_ora: 8.0,
      distanta_km: 1.2,
      timp_mers_minute: 15,
      lat: 44.4468,
      lng: 26.0725
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const parking of testParkings) {
    try {
      console.log(`📝 Adaug: ${parking.nume}`);
      
      const { error } = await supabase
        .from('parcari_raportate')
        .insert(parking);

      if (error) {
        console.log(`❌ Eroare: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Adăugat cu succes!`);
        successCount++;
      }
    } catch (error) {
      console.log(`💥 Eroare neașteptată: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Rezultat final:`);
  console.log(`✅ Adăugate cu succes: ${successCount}`);
  console.log(`❌ Erori: ${errorCount}`);
  console.log(`🎯 Total parcări în baza de date: ${successCount + 4} (4 existente + ${successCount} noi)`);
}

// Rulează scriptul
addTestParkings()
  .then(() => {
    console.log('\n🎉 Scriptul de adăugare parcări de test a fost finalizat!');
    process.exit(0);
  })
  .catch(error => {
    console.log('\n💥 Eroare neașteptată:', error);
    process.exit(1);
  }); 