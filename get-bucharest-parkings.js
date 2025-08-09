const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

const supabase = createClient(supabaseUrl, supabaseKey);

// Zonele principale din București
const ZONE_BUCURESTI = {
  'Piața Victoriei': {
    descriere: 'Centrul administrativ al României',
    coordonate: { lat: 44.4268, lng: 26.1025 },
    raza: 0.02 // ~2km
  },
  'Piața Unirii': {
    descriere: 'Centrul istoric și comercial',
    coordonate: { lat: 44.4268, lng: 26.1025 },
    raza: 0.02
  },
  'Berceni': {
    descriere: 'Zona rezidențială din sud',
    coordonate: { lat: 44.3833, lng: 26.1167 },
    raza: 0.03
  },
  'Drumul Taberei': {
    descriere: 'Zona rezidențială din vest',
    coordonate: { lat: 44.4167, lng: 25.9667 },
    raza: 0.03
  },
  'Băneasa': {
    descriere: 'Zona rezidențială din nord',
    coordonate: { lat: 44.5167, lng: 26.0833 },
    raza: 0.03
  },
  'Pantelimon': {
    descriere: 'Zona rezidențială din est',
    coordonate: { lat: 44.4500, lng: 26.2000 },
    raza: 0.03
  },
  'Centrul Vechi': {
    descriere: 'Zona istorică și de divertisment',
    coordonate: { lat: 44.4300, lng: 26.1000 },
    raza: 0.015
  },
  'Cotroceni': {
    descriere: 'Zona rezidențială elegantă',
    coordonate: { lat: 44.4333, lng: 26.0667 },
    raza: 0.025
  },
  'Primăverii': {
    descriere: 'Zona rezidențială de lux',
    coordonate: { lat: 44.4667, lng: 26.0833 },
    raza: 0.025
  },
  'Titan': {
    descriere: 'Zona rezidențială din est',
    coordonate: { lat: 44.4500, lng: 26.1500 },
    raza: 0.03
  },
  'Militari': {
    descriere: 'Zona rezidențială din vest',
    coordonate: { lat: 44.4333, lng: 25.9500 },
    raza: 0.03
  },
  'Colentina': {
    descriere: 'Zona rezidențială din nord-est',
    coordonate: { lat: 44.4667, lng: 26.1333 },
    raza: 0.03
  }
};

// Funcție pentru calcularea distanței între două puncte
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raza Pământului în km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Funcție pentru determinarea zonei
function getZone(lat, lng) {
  let closestZone = 'Alte zone';
  let minDistance = Infinity;

  for (const [zoneName, zoneData] of Object.entries(ZONE_BUCURESTI)) {
    const distance = calculateDistance(lat, lng, zoneData.coordonate.lat, zoneData.coordonate.lng);
    if (distance < minDistance && distance <= zoneData.raza * 111) { // 111 km per grad
      minDistance = distance;
      closestZone = zoneName;
    }
  }

  return closestZone;
}

async function getBucharestParkings() {
  console.log('🚗 Extragerea parcărilor din București...\n');

  try {
    // Extrage toate parcările din ambele tabele
    const { data: parkingSpots, error: parkingError } = await supabase
      .from('parking_spots')
      .select('*');

    const { data: reportedParkings, error: reportedError } = await supabase
      .from('parcari_raportate')
      .select('*');

    if (parkingError) {
      console.error('❌ Eroare la extragerea din parking_spots:', parkingError);
    }

    if (reportedError) {
      console.error('❌ Eroare la extragerea din parcari_raportate:', reportedError);
    }

    // Combină toate parcările
    const allParkings = [
      ...(parkingSpots || []),
      ...(reportedParkings || [])
    ];

    console.log(`📊 Total parcări găsite: ${allParkings.length}\n`);

    // Organizează parcările pe zone
    const parkingsByZone = {};

    allParkings.forEach(parking => {
      const zone = getZone(parking.lat, parking.lng);
      
      if (!parkingsByZone[zone]) {
        parkingsByZone[zone] = [];
      }

      parkingsByZone[zone].push({
        nume: parking.nume || parking.name,
        adresa: parking.adresa || parking.address,
        rating: parking.rating || 0,
        pret_pe_ora: parking.pret_pe_ora || parking.price_per_hour || 'N/A',
        disponibilitate: parking.disponibilitate !== undefined ? parking.disponibilitate : true,
        tip: parking.id ? 'Raportată de utilizatori' : 'Din baza de date'
      });
    });

    // Afișează rezultatele organizate
    console.log('🗺️  PARCĂRI DIN BUCUREȘTI ORGANIZATE PE ZONE\n');
    console.log('=' .repeat(80));

    let totalParkings = 0;

    for (const [zoneName, zoneData] of Object.entries(ZONE_BUCURESTI)) {
      const parkings = parkingsByZone[zoneName] || [];
      
      if (parkings.length > 0) {
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
          console.log(`      🏷️  Tip: ${parking.tip}`);
          console.log('');
        });

        totalParkings += parkings.length;
      }
    }

    // Parcări din alte zone
    const otherParkings = parkingsByZone['Alte zone'] || [];
    if (otherParkings.length > 0) {
      console.log(`\n📍 ALTE ZONE`);
      console.log(`   Parcări disponibile: ${otherParkings.length}`);
      console.log('   ' + '-'.repeat(60));

      otherParkings.forEach((parking, index) => {
        console.log(`   ${index + 1}. ${parking.nume}`);
        console.log(`      📍 ${parking.adresa}`);
        console.log(`      ⭐ Rating: ${parking.rating}/5`);
        console.log(`      💰 Preț: ${parking.pret_pe_ora} RON/oră`);
        console.log(`      ✅ Disponibil: ${parking.disponibilitate ? 'Da' : 'Nu'}`);
        console.log(`      🏷️  Tip: ${parking.tip}`);
        console.log('');
      });

      totalParkings += otherParkings.length;
    }

    console.log('=' .repeat(80));
    console.log(`\n📈 STATISTICI TOTALE:`);
    console.log(`   • Total parcări: ${totalParkings}`);
    console.log(`   • Zone cu parcări: ${Object.keys(parkingsByZone).length}`);
    console.log(`   • Zona cu cele mai multe parcări: ${getZoneWithMostParkings(parkingsByZone)}`);

    // Salvează rezultatele într-un fișier JSON
    const fs = require('fs');
    const results = {
      totalParkings,
      zones: parkingsByZone,
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync('bucharest-parkings.json', JSON.stringify(results, null, 2));
    console.log(`\n💾 Rezultatele au fost salvate în 'bucharest-parkings.json'`);

  } catch (error) {
    console.error('❌ Eroare:', error);
  }
}

function getZoneWithMostParkings(parkingsByZone) {
  let maxZone = 'N/A';
  let maxCount = 0;

  for (const [zone, parkings] of Object.entries(parkingsByZone)) {
    if (parkings.length > maxCount) {
      maxCount = parkings.length;
      maxZone = zone;
    }
  }

  return `${maxZone} (${maxCount} parcări)`;
}

// Rulează scriptul
getBucharestParkings(); 