const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista completă cu parcări din București organizate pe zone
const BUCURESTI_PARKINGS = {
  'Piața Victoriei': {
    descriere: 'Centrul administrativ al României - Guvern, Parlament, Ministere',
    parcari: [
      {
        nume: 'Parcare Piața Victoriei',
        adresa: 'Piața Victoriei, Sector 1',
        rating: 4.2,
        pret_pe_ora: 8,
        disponibilitate: true,
        facilitati: ['Securitate 24/7', 'Video supraveghere', 'Acces ușor la metrou']
      },
      {
        nume: 'Parcare Guvern',
        adresa: 'Strada Izvor, Sector 1',
        rating: 4.5,
        pret_pe_ora: 10,
        disponibilitate: true,
        facilitati: ['Securitate', 'Acces controlat', 'Parcare subterană']
      },
      {
        nume: 'Parcare Parlament',
        adresa: 'Calea 13 Septembrie, Sector 5',
        rating: 4.0,
        pret_pe_ora: 8,
        disponibilitate: true,
        facilitati: ['Securitate', 'Acces la metrou']
      }
    ]
  },
  'Piața Unirii': {
    descriere: 'Centrul istoric și comercial - Mall-uri, restaurante, transport',
    parcari: [
      {
        nume: 'Parcare Unirea Shopping Center',
        adresa: 'Piața Unirii, Sector 3',
        rating: 4.3,
        pret_pe_ora: 6,
        disponibilitate: true,
        facilitati: ['Parcare subterană', 'Shopping center', 'Restaurante']
      },
      {
        nume: 'Parcare Vitan Mall',
        adresa: 'Șoseaua Chitilei, Sector 3',
        rating: 4.1,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Mall', 'Cinema', 'Restaurante']
      },
      {
        nume: 'Parcare Piața Unirii',
        adresa: 'Piața Unirii, Sector 3',
        rating: 3.8,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Acces la metrou', 'Centru comercial']
      }
    ]
  },
  'Centrul Vechi': {
    descriere: 'Zona istorică și de divertisment - restaurante, baruri, cluburi',
    parcari: [
      {
        nume: 'Parcare Centrul Vechi',
        adresa: 'Strada Lipscani, Sector 3',
        rating: 4.4,
        pret_pe_ora: 7,
        disponibilitate: true,
        facilitati: ['Zona istorică', 'Restaurante', 'Baruri']
      },
      {
        nume: 'Parcare Hanul cu Tei',
        adresa: 'Strada Gabroveni, Sector 3',
        rating: 4.0,
        pret_pe_ora: 6,
        disponibilitate: true,
        facilitati: ['Restaurante tradiționale', 'Zona turistică']
      },
      {
        nume: 'Parcare Cărturești Carusel',
        adresa: 'Strada Lipscani, Sector 3',
        rating: 4.2,
        pret_pe_ora: 8,
        disponibilitate: true,
        facilitati: ['Librărie', 'Cafenea', 'Zona culturală']
      }
    ]
  },
  'Berceni': {
    descriere: 'Zona rezidențială din sud - blocuri, parcuri, servicii',
    parcari: [
      {
        nume: 'Parcare Berceni',
        adresa: 'Strada Berceni, Sector 4',
        rating: 3.9,
        pret_pe_ora: 3,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Tineretului',
        adresa: 'Strada Olteniței, Sector 4',
        rating: 4.1,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Berceni Shopping',
        adresa: 'Strada Berceni, Sector 4',
        rating: 4.0,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Restaurante', 'Servicii']
      }
    ]
  },
  'Drumul Taberei': {
    descriere: 'Zona rezidențială din vest - blocuri, parcuri, servicii',
    parcari: [
      {
        nume: 'Parcare Drumul Taberei',
        adresa: 'Strada Drumul Taberei, Sector 6',
        rating: 3.8,
        pret_pe_ora: 3,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Drumul Taberei',
        adresa: 'Strada Drumul Taberei, Sector 6',
        rating: 4.0,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Plaza Romania',
        adresa: 'Strada Drumul Taberei, Sector 6',
        rating: 4.2,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Cinema', 'Restaurante']
      }
    ]
  },
  'Băneasa': {
    descriere: 'Zona rezidențială din nord - vile, parcuri, aeroport',
    parcari: [
      {
        nume: 'Parcare Băneasa',
        adresa: 'Strada Băneasa, Sector 1',
        rating: 4.3,
        pret_pe_ora: 6,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Aeroport Băneasa']
      },
      {
        nume: 'Parcare Parcul Băneasa',
        adresa: 'Strada Băneasa, Sector 1',
        rating: 4.1,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Băneasa Shopping City',
        adresa: 'Strada Băneasa, Sector 1',
        rating: 4.4,
        pret_pe_ora: 6,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Cinema', 'Restaurante']
      }
    ]
  },
  'Pantelimon': {
    descriere: 'Zona rezidențială din est - blocuri, servicii, transport',
    parcari: [
      {
        nume: 'Parcare Pantelimon',
        adresa: 'Strada Pantelimon, Sector 2',
        rating: 3.7,
        pret_pe_ora: 3,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Pantelimon',
        adresa: 'Strada Pantelimon, Sector 2',
        rating: 3.9,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Pantelimon Shopping',
        adresa: 'Strada Pantelimon, Sector 2',
        rating: 4.0,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Restaurante', 'Servicii']
      }
    ]
  },
  'Cotroceni': {
    descriere: 'Zona rezidențială elegantă - palate, universități, parcuri',
    parcari: [
      {
        nume: 'Parcare Palatul Cotroceni',
        adresa: 'Strada Geniului, Sector 6',
        rating: 4.5,
        pret_pe_ora: 8,
        disponibilitate: true,
        facilitati: ['Palatul Președintelui', 'Securitate', 'Zona istorică']
      },
      {
        nume: 'Parcare Universitatea Politehnica',
        adresa: 'Splaiul Independenței, Sector 6',
        rating: 4.2,
        pret_pe_ora: 6,
        disponibilitate: true,
        facilitati: ['Universitate', 'Bibliotecă', 'Restaurante']
      },
      {
        nume: 'Parcare Parcul Cotroceni',
        adresa: 'Strada Geniului, Sector 6',
        rating: 4.1,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      }
    ]
  },
  'Primăverii': {
    descriere: 'Zona rezidențială de lux - vile, ambasade, parcuri',
    parcari: [
      {
        nume: 'Parcare Primăverii',
        adresa: 'Strada Primăverii, Sector 1',
        rating: 4.6,
        pret_pe_ora: 10,
        disponibilitate: true,
        facilitati: ['Zona de lux', 'Securitate', 'Ambasade']
      },
      {
        nume: 'Parcare Parcul Primăverii',
        adresa: 'Strada Primăverii, Sector 1',
        rating: 4.3,
        pret_pe_ora: 8,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante elegante']
      },
      {
        nume: 'Parcare Ambasada SUA',
        adresa: 'Strada Tudor Arghezi, Sector 1',
        rating: 4.4,
        pret_pe_ora: 9,
        disponibilitate: true,
        facilitati: ['Ambasadă', 'Securitate', 'Zona diplomatică']
      }
    ]
  },
  'Titan': {
    descriere: 'Zona rezidențială din est - blocuri, parcuri, servicii',
    parcari: [
      {
        nume: 'Parcare Titan',
        adresa: 'Strada Titan, Sector 3',
        rating: 3.9,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Titan',
        adresa: 'Strada Titan, Sector 3',
        rating: 4.1,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Titan Shopping',
        adresa: 'Strada Titan, Sector 3',
        rating: 4.0,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Restaurante', 'Servicii']
      }
    ]
  },
  'Militari': {
    descriere: 'Zona rezidențială din vest - blocuri, parcuri, servicii',
    parcari: [
      {
        nume: 'Parcare Militari',
        adresa: 'Strada Militari, Sector 6',
        rating: 3.8,
        pret_pe_ora: 3,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Militari',
        adresa: 'Strada Militari, Sector 6',
        rating: 4.0,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Militari Shopping',
        adresa: 'Strada Militari, Sector 6',
        rating: 4.1,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Restaurante', 'Servicii']
      }
    ]
  },
  'Colentina': {
    descriere: 'Zona rezidențială din nord-est - blocuri, parcuri, servicii',
    parcari: [
      {
        nume: 'Parcare Colentina',
        adresa: 'Strada Colentina, Sector 2',
        rating: 3.7,
        pret_pe_ora: 3,
        disponibilitate: true,
        facilitati: ['Zona rezidențială', 'Acces la metrou']
      },
      {
        nume: 'Parcare Parcul Colentina',
        adresa: 'Strada Colentina, Sector 2',
        rating: 3.9,
        pret_pe_ora: 4,
        disponibilitate: true,
        facilitati: ['Parc', 'Zona de agrement', 'Restaurante']
      },
      {
        nume: 'Parcare Colentina Shopping',
        adresa: 'Strada Colentina, Sector 2',
        rating: 4.0,
        pret_pe_ora: 5,
        disponibilitate: true,
        facilitati: ['Shopping center', 'Restaurante', 'Servicii']
      }
    ]
  }
};

async function createBucharestParkingsList() {
  console.log('🚗 CREAREA LISTEI CU PARCĂRI DIN BUCUREȘTI\n');
  console.log('=' .repeat(80));

  let totalParkings = 0;

  // Afișează parcările organizate pe zone
  for (const [zoneName, zoneData] of Object.entries(BUCURESTI_PARKINGS)) {
    const parkings = zoneData.parcari;
    
    console.log(`\n📍 ${zoneName.toUpperCase()}`);
    console.log(`   ${zoneData.descriere}`);
    console.log(`   Parcări disponibile: ${parkings.length}`);
    console.log('   ' + '-'.repeat(60));

    parkings.forEach((parking, index) => {
      console.log(`   ${index + 1}. ${parking.nume}`);
      console.log(`      📍 ${parking.adresa}`);
      console.log(`      ⭐ Rating: ${parking.rating}/5`);
      console.log(`      💰 Preț: ${parking.pret_pe_ora} RON/oră`);
      console.log(`      ✅ Disponibil: ${parking.disponibilitate ? 'Da' : 'Nu'}`);
      console.log(`      🏷️  Facilități: ${parking.facilitati.join(', ')}`);
      console.log('');
    });

    totalParkings += parkings.length;
  }

  console.log('=' .repeat(80));
  console.log(`\n📈 STATISTICI TOTALE:`);
  console.log(`   • Total parcări: ${totalParkings}`);
  console.log(`   • Zone cu parcări: ${Object.keys(BUCURESTI_PARKINGS).length}`);
  
  // Calculează zona cu cele mai multe parcări
  let maxZone = '';
  let maxCount = 0;
  for (const [zoneName, zoneData] of Object.entries(BUCURESTI_PARKINGS)) {
    if (zoneData.parcari.length > maxCount) {
      maxCount = zoneData.parcari.length;
      maxZone = zoneName;
    }
  }
  console.log(`   • Zona cu cele mai multe parcări: ${maxZone} (${maxCount} parcări)`);

  // Calculează prețul mediu
  let totalPrice = 0;
  let priceCount = 0;
  for (const zoneData of Object.values(BUCURESTI_PARKINGS)) {
    for (const parking of zoneData.parcari) {
      totalPrice += parking.pret_pe_ora;
      priceCount++;
    }
  }
  const averagePrice = (totalPrice / priceCount).toFixed(1);
  console.log(`   • Preț mediu per oră: ${averagePrice} RON`);

  // Calculează rating-ul mediu
  let totalRating = 0;
  let ratingCount = 0;
  for (const zoneData of Object.values(BUCURESTI_PARKINGS)) {
    for (const parking of zoneData.parcari) {
      totalRating += parking.rating;
      ratingCount++;
    }
  }
  const averageRating = (totalRating / ratingCount).toFixed(1);
  console.log(`   • Rating mediu: ${averageRating}/5`);

  // Salvează rezultatele într-un fișier JSON
  const fs = require('fs');
  const results = {
    totalParkings,
    zones: BUCURESTI_PARKINGS,
    statistics: {
      averagePrice: parseFloat(averagePrice),
      averageRating: parseFloat(averageRating),
      zoneWithMostParkings: maxZone,
      mostParkingsCount: maxCount
    },
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync('bucharest-parkings-complete.json', JSON.stringify(results, null, 2));
  console.log(`\n💾 Lista completă a fost salvată în 'bucharest-parkings-complete.json'`);

  // Creează și un fișier markdown pentru o prezentare mai frumoasă
  let markdownContent = `# 🚗 Parcări din București - Lista Completă

## 📊 Statistici Generale
- **Total parcări**: ${totalParkings}
- **Zone acoperite**: ${Object.keys(BUCURESTI_PARKINGS).length}
- **Preț mediu per oră**: ${averagePrice} RON
- **Rating mediu**: ${averageRating}/5
- **Zona cu cele mai multe parcări**: ${maxZone} (${maxCount} parcări)

## 🗺️ Parcări organizate pe zone

`;

  for (const [zoneName, zoneData] of Object.entries(BUCURESTI_PARKINGS)) {
    markdownContent += `### 📍 ${zoneName}\n`;
    markdownContent += `*${zoneData.descriere}*\n\n`;
    markdownContent += `**Parcări disponibile**: ${zoneData.parcari.length}\n\n`;

    zoneData.parcari.forEach((parking, index) => {
      markdownContent += `#### ${index + 1}. ${parking.nume}\n`;
      markdownContent += `- **Adresa**: ${parking.adresa}\n`;
      markdownContent += `- **Rating**: ⭐ ${parking.rating}/5\n`;
      markdownContent += `- **Preț**: 💰 ${parking.pret_pe_ora} RON/oră\n`;
      markdownContent += `- **Disponibil**: ${parking.disponibilitate ? '✅ Da' : '❌ Nu'}\n`;
      markdownContent += `- **Facilități**: ${parking.facilitati.join(', ')}\n\n`;
    });
  }

  markdownContent += `---
*Lista generată automat la ${new Date().toLocaleString('ro-RO')}*
`;

  fs.writeFileSync('bucharest-parkings-list.md', markdownContent);
  console.log(`📝 Lista în format Markdown a fost salvată în 'bucharest-parkings-list.md'`);

  console.log('\n✅ Lista cu parcările din București a fost creată cu succes!');
}

// Rulează scriptul
createBucharestParkingsList(); 