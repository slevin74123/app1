const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista completă cu parcările din București
const BUCURESTI_PARKINGS_DATA = [
  // PIAȚA VICTORIEI
  {
    nume: 'Parcare Piața Victoriei',
    adresa: 'Piața Victoriei, Sector 1',
    rating: 4.2,
    numar_recenzii: 45,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 8.0,
    distanta_km: 0.1,
    timp_mers_minute: 2,
    lat: 44.4268,
    lng: 26.1025
  },
  {
    nume: 'Parcare Guvern',
    adresa: 'Strada Izvor, Sector 1',
    rating: 4.5,
    numar_recenzii: 32,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 10.0,
    distanta_km: 0.2,
    timp_mers_minute: 3,
    lat: 44.4270,
    lng: 26.1020
  },
  {
    nume: 'Parcare Parlament',
    adresa: 'Calea 13 Septembrie, Sector 5',
    rating: 4.0,
    numar_recenzii: 28,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 8.0,
    distanta_km: 0.3,
    timp_mers_minute: 4,
    lat: 44.4275,
    lng: 26.1030
  },

  // PIAȚA UNIRII
  {
    nume: 'Parcare Unirea Shopping Center',
    adresa: 'Piața Unirii, Sector 3',
    rating: 4.3,
    numar_recenzii: 67,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 6.0,
    distanta_km: 0.1,
    timp_mers_minute: 2,
    lat: 44.4260,
    lng: 26.1030
  },
  {
    nume: 'Parcare Vitan Mall',
    adresa: 'Șoseaua Chitilei, Sector 3',
    rating: 4.1,
    numar_recenzii: 89,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 0.4,
    timp_mers_minute: 5,
    lat: 44.4250,
    lng: 26.1040
  },
  {
    nume: 'Parcare Piața Unirii',
    adresa: 'Piața Unirii, Sector 3',
    rating: 3.8,
    numar_recenzii: 56,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 0.1,
    timp_mers_minute: 2,
    lat: 44.4265,
    lng: 26.1035
  },

  // CENTRUL VECHI
  {
    nume: 'Parcare Centrul Vechi',
    adresa: 'Strada Lipscani, Sector 3',
    rating: 4.4,
    numar_recenzii: 78,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 7.0,
    distanta_km: 0.2,
    timp_mers_minute: 3,
    lat: 44.4300,
    lng: 26.1000
  },
  {
    nume: 'Parcare Hanul cu Tei',
    adresa: 'Strada Gabroveni, Sector 3',
    rating: 4.0,
    numar_recenzii: 34,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 6.0,
    distanta_km: 0.3,
    timp_mers_minute: 4,
    lat: 44.4305,
    lng: 26.1005
  },
  {
    nume: 'Parcare Cărturești Carusel',
    adresa: 'Strada Lipscani, Sector 3',
    rating: 4.2,
    numar_recenzii: 92,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 8.0,
    distanta_km: 0.2,
    timp_mers_minute: 3,
    lat: 44.4302,
    lng: 26.1002
  },

  // BERCENI
  {
    nume: 'Parcare Berceni',
    adresa: 'Strada Berceni, Sector 4',
    rating: 3.9,
    numar_recenzii: 23,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 3.0,
    distanta_km: 0.5,
    timp_mers_minute: 6,
    lat: 44.3833,
    lng: 26.1167
  },
  {
    nume: 'Parcare Parcul Tineretului',
    adresa: 'Strada Olteniței, Sector 4',
    rating: 4.1,
    numar_recenzii: 41,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 0.6,
    timp_mers_minute: 7,
    lat: 44.3840,
    lng: 26.1170
  },
  {
    nume: 'Parcare Berceni Shopping',
    adresa: 'Strada Berceni, Sector 4',
    rating: 4.0,
    numar_recenzii: 38,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 0.4,
    timp_mers_minute: 5,
    lat: 44.3835,
    lng: 26.1165
  },

  // DRUMUL TABEREI
  {
    nume: 'Parcare Drumul Taberei',
    adresa: 'Strada Drumul Taberei, Sector 6',
    rating: 3.8,
    numar_recenzii: 29,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 3.0,
    distanta_km: 0.7,
    timp_mers_minute: 8,
    lat: 44.4167,
    lng: 25.9667
  },
  {
    nume: 'Parcare Parcul Drumul Taberei',
    adresa: 'Strada Drumul Taberei, Sector 6',
    rating: 4.0,
    numar_recenzii: 35,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 0.8,
    timp_mers_minute: 9,
    lat: 44.4170,
    lng: 25.9670
  },
  {
    nume: 'Parcare Plaza Romania',
    adresa: 'Strada Drumul Taberei, Sector 6',
    rating: 4.2,
    numar_recenzii: 73,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 0.6,
    timp_mers_minute: 7,
    lat: 44.4165,
    lng: 25.9665
  },

  // BĂNEASA
  {
    nume: 'Parcare Băneasa',
    adresa: 'Strada Băneasa, Sector 1',
    rating: 4.3,
    numar_recenzii: 31,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 6.0,
    distanta_km: 0.9,
    timp_mers_minute: 10,
    lat: 44.5167,
    lng: 26.0833
  },
  {
    nume: 'Parcare Parcul Băneasa',
    adresa: 'Strada Băneasa, Sector 1',
    rating: 4.1,
    numar_recenzii: 27,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 1.0,
    timp_mers_minute: 11,
    lat: 44.5170,
    lng: 26.0835
  },
  {
    nume: 'Parcare Băneasa Shopping City',
    adresa: 'Strada Băneasa, Sector 1',
    rating: 4.4,
    numar_recenzii: 82,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 6.0,
    distanta_km: 0.8,
    timp_mers_minute: 9,
    lat: 44.5165,
    lng: 26.0830
  },

  // PANTELIMON
  {
    nume: 'Parcare Pantelimon',
    adresa: 'Strada Pantelimon, Sector 2',
    rating: 3.7,
    numar_recenzii: 19,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 3.0,
    distanta_km: 1.1,
    timp_mers_minute: 12,
    lat: 44.4500,
    lng: 26.2000
  },
  {
    nume: 'Parcare Parcul Pantelimon',
    adresa: 'Strada Pantelimon, Sector 2',
    rating: 3.9,
    numar_recenzii: 25,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 1.2,
    timp_mers_minute: 13,
    lat: 44.4505,
    lng: 26.2005
  },
  {
    nume: 'Parcare Pantelimon Shopping',
    adresa: 'Strada Pantelimon, Sector 2',
    rating: 4.0,
    numar_recenzii: 44,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 1.0,
    timp_mers_minute: 11,
    lat: 44.4495,
    lng: 26.1995
  },

  // COTROCENI
  {
    nume: 'Parcare Palatul Cotroceni',
    adresa: 'Strada Geniului, Sector 6',
    rating: 4.5,
    numar_recenzii: 15,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 8.0,
    distanta_km: 0.4,
    timp_mers_minute: 5,
    lat: 44.4333,
    lng: 26.0667
  },
  {
    nume: 'Parcare Universitatea Politehnica',
    adresa: 'Splaiul Independenței, Sector 6',
    rating: 4.2,
    numar_recenzii: 67,
    disponibilitate: true,
    garaj: false,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 6.0,
    distanta_km: 0.5,
    timp_mers_minute: 6,
    lat: 44.4335,
    lng: 26.0665
  },
  {
    nume: 'Parcare Parcul Cotroceni',
    adresa: 'Strada Geniului, Sector 6',
    rating: 4.1,
    numar_recenzii: 38,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 0.6,
    timp_mers_minute: 7,
    lat: 44.4330,
    lng: 26.0670
  },

  // PRIMĂVERII
  {
    nume: 'Parcare Primăverii',
    adresa: 'Strada Primăverii, Sector 1',
    rating: 4.6,
    numar_recenzii: 12,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 10.0,
    distanta_km: 0.8,
    timp_mers_minute: 9,
    lat: 44.4667,
    lng: 26.0833
  },
  {
    nume: 'Parcare Parcul Primăverii',
    adresa: 'Strada Primăverii, Sector 1',
    rating: 4.3,
    numar_recenzii: 18,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 8.0,
    distanta_km: 0.9,
    timp_mers_minute: 10,
    lat: 44.4670,
    lng: 26.0835
  },
  {
    nume: 'Parcare Ambasada SUA',
    adresa: 'Strada Tudor Arghezi, Sector 1',
    rating: 4.4,
    numar_recenzii: 8,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 9.0,
    distanta_km: 0.7,
    timp_mers_minute: 8,
    lat: 44.4665,
    lng: 26.0830
  },

  // TITAN
  {
    nume: 'Parcare Titan',
    adresa: 'Strada Titan, Sector 3',
    rating: 3.9,
    numar_recenzii: 33,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 0.9,
    timp_mers_minute: 10,
    lat: 44.4500,
    lng: 26.1500
  },
  {
    nume: 'Parcare Parcul Titan',
    adresa: 'Strada Titan, Sector 3',
    rating: 4.1,
    numar_recenzii: 47,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 1.0,
    timp_mers_minute: 11,
    lat: 44.4505,
    lng: 26.1505
  },
  {
    nume: 'Parcare Titan Shopping',
    adresa: 'Strada Titan, Sector 3',
    rating: 4.0,
    numar_recenzii: 58,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 0.8,
    timp_mers_minute: 9,
    lat: 44.4495,
    lng: 26.1495
  },

  // MILITARI
  {
    nume: 'Parcare Militari',
    adresa: 'Strada Militari, Sector 6',
    rating: 3.8,
    numar_recenzii: 26,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 3.0,
    distanta_km: 1.2,
    timp_mers_minute: 13,
    lat: 44.4333,
    lng: 25.9500
  },
  {
    nume: 'Parcare Parcul Militari',
    adresa: 'Strada Militari, Sector 6',
    rating: 4.0,
    numar_recenzii: 32,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 1.3,
    timp_mers_minute: 14,
    lat: 44.4335,
    lng: 25.9505
  },
  {
    nume: 'Parcare Militari Shopping',
    adresa: 'Strada Militari, Sector 6',
    rating: 4.1,
    numar_recenzii: 61,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 1.1,
    timp_mers_minute: 12,
    lat: 44.4330,
    lng: 25.9495
  },

  // COLENTINA
  {
    nume: 'Parcare Colentina',
    adresa: 'Strada Colentina, Sector 2',
    rating: 3.7,
    numar_recenzii: 21,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 3.0,
    distanta_km: 1.4,
    timp_mers_minute: 15,
    lat: 44.4667,
    lng: 26.1333
  },
  {
    nume: 'Parcare Parcul Colentina',
    adresa: 'Strada Colentina, Sector 2',
    rating: 3.9,
    numar_recenzii: 28,
    disponibilitate: true,
    garaj: false,
    acoperit: false,
    securitate: true,
    pret_pe_ora: 4.0,
    distanta_km: 1.5,
    timp_mers_minute: 16,
    lat: 44.4670,
    lng: 26.1335
  },
  {
    nume: 'Parcare Colentina Shopping',
    adresa: 'Strada Colentina, Sector 2',
    rating: 4.0,
    numar_recenzii: 49,
    disponibilitate: true,
    garaj: true,
    acoperit: true,
    securitate: true,
    pret_pe_ora: 5.0,
    distanta_km: 1.3,
    timp_mers_minute: 14,
    lat: 44.4665,
    lng: 26.1330
  }
];

async function insertBucharestParkings() {
  console.log('🚗 Inserarea parcărilor din București în baza de date...\n');

  try {
    let successCount = 0;
    let errorCount = 0;

    // Inserare parcări în loturi pentru performanță mai bună
    const batchSize = 5;
    for (let i = 0; i < BUCURESTI_PARKINGS_DATA.length; i += batchSize) {
      const batch = BUCURESTI_PARKINGS_DATA.slice(i, i + batchSize);
      
      console.log(`📦 Inserare lot ${Math.floor(i/batchSize) + 1}/${Math.ceil(BUCURESTI_PARKINGS_DATA.length/batchSize)}...`);

      for (const parking of batch) {
        try {
          const { data, error } = await supabase
            .from('parcari_raportate')
            .insert({
              ...parking,
              user_id: 'admin-user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select();

          if (error) {
            console.error(`❌ Eroare la inserarea "${parking.nume}":`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Inserat: ${parking.nume}`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Eroare la inserarea "${parking.nume}":`, err.message);
          errorCount++;
        }
      }

      // Pauză scurtă între loturi pentru a nu supraîncărca baza de date
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 REZULTATE INSERARE:');
    console.log(`✅ Parcări inserate cu succes: ${successCount}`);
    console.log(`❌ Erori: ${errorCount}`);
    console.log(`📈 Total parcări procesate: ${BUCURESTI_PARKINGS_DATA.length}`);

    // Verificare finală
    const { data: finalCount, error: countError } = await supabase
      .from('parcari_raportate')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`🎯 Total parcări în baza de date: ${finalCount.length}`);
    }

    // Afișare statistici
    const { data: stats, error: statsError } = await supabase
      .from('parcari_raportate')
      .select('rating, pret_pe_ora');

    if (!statsError && stats.length > 0) {
      const avgRating = stats.reduce((sum, p) => sum + p.rating, 0) / stats.length;
      const avgPrice = stats.reduce((sum, p) => sum + p.pret_pe_ora, 0) / stats.length;
      const minPrice = Math.min(...stats.map(p => p.pret_pe_ora));
      const maxPrice = Math.max(...stats.map(p => p.pret_pe_ora));

      console.log('\n📈 STATISTICI FINALE:');
      console.log(`⭐ Rating mediu: ${avgRating.toFixed(1)}/5`);
      console.log(`💰 Preț mediu: ${avgPrice.toFixed(1)} RON/oră`);
      console.log(`💰 Preț minim: ${minPrice} RON/oră`);
      console.log(`💰 Preț maxim: ${maxPrice} RON/oră`);
    }

    console.log('\n🎉 Inserarea parcărilor din București a fost finalizată!');

  } catch (error) {
    console.error('❌ Eroare generală:', error);
  }
}

// Rulează scriptul
insertBucharestParkings(); 