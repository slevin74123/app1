const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixDatabase() {
  console.log('🔍 Verificare structură baza de date...\n');

  try {
    // 1. Verifică dacă câmpurile noi există
    console.log('📋 Verificare câmpuri noi...');
    const { data: testData, error: testError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, locuri_disponibile, locuri_indisponibile, locuri_total')
      .limit(1);

    if (testError) {
      console.log('❌ Câmpurile noi nu există. Eroare:', testError.message);
      console.log('\n🔧 Încercare adăugare câmpuri...');
      
      // Încearcă să adauge câmpurile prin SQL direct
      const { error: alterError } = await supabase
        .rpc('exec_sql', {
          sql_query: `
            ALTER TABLE parcari_raportate 
            ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;
            
            ALTER TABLE parcari_raportate 
            ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;
            
            ALTER TABLE parcari_raportate 
            ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;
          `
        });

      if (alterError) {
        console.log('❌ Nu se pot adăuga câmpurile prin RPC. Eroare:', alterError.message);
        console.log('\n💡 SOLUȚIE MANUALĂ NECESARĂ!');
        console.log('Deschide Supabase Dashboard și rulează în SQL Editor:');
        console.log(`
ALTER TABLE parcari_raportate ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;
ALTER TABLE parcari_raportate ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;
ALTER TABLE parcari_raportate ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;
        `);
        return;
      } else {
        console.log('✅ Câmpurile au fost adăugate cu succes!');
      }
    } else {
      console.log('✅ Câmpurile noi există deja!');
    }

    // 2. Verifică parcările existente
    console.log('\n📊 Verificare parcări existente...');
    const { data: parkings, error: fetchError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, disponibilitate, locuri_disponibile, locuri_indisponibile, locuri_total')
      .limit(10);

    if (fetchError) {
      console.log('❌ Eroare la încărcarea parcărilor:', fetchError.message);
      return;
    }

    console.log(`📋 Găsite ${parkings?.length || 0} parcări:`);
    parkings?.forEach(parking => {
      console.log(`  - ${parking.nume}: ${parking.locuri_disponibile || 0}/${parking.locuri_total || 0} locuri libere`);
    });

    // 3. Actualizează parcările care nu au valori pentru câmpurile noi
    console.log('\n🔄 Actualizare parcări cu valori implicite...');
    const { data: parkingsToUpdate, error: updateCheckError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, disponibilitate, locuri_total')
      .or('locuri_total.is.null,locuri_total.eq.0');

    if (updateCheckError) {
      console.log('❌ Eroare la verificarea parcărilor de actualizat:', updateCheckError.message);
      return;
    }

    if (parkingsToUpdate && parkingsToUpdate.length > 0) {
      console.log(`📝 Găsite ${parkingsToUpdate.length} parcări care necesită actualizare`);
      
      for (const parking of parkingsToUpdate) {
        const updateData = {
          locuri_disponibile: parking.disponibilitate ? 5 : 0,
          locuri_indisponibile: parking.disponibilitate ? 0 : 5,
          locuri_total: 5,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('parcari_raportate')
          .update(updateData)
          .eq('id', parking.id);

        if (updateError) {
          console.log(`❌ Eroare la actualizarea ${parking.nume}:`, updateError.message);
        } else {
          console.log(`✅ Actualizat: ${parking.nume} - ${updateData.locuri_disponibile}/${updateData.locuri_total} locuri libere`);
        }
      }
    } else {
      console.log('✅ Toate parcările au deja valorile corecte!');
    }

    // 4. Testează o actualizare
    console.log('\n🧪 Test actualizare parcare...');
    const { data: testParking } = await supabase
      .from('parcari_raportate')
      .select('id, nume, disponibilitate, locuri_disponibile, locuri_indisponibile, locuri_total')
      .limit(1);

    if (testParking && testParking[0]) {
      const parking = testParking[0];
      console.log(`Test cu: ${parking.nume}`);
      
      const newStatus = !parking.disponibilitate;
      const updateData = {
        disponibilitate: newStatus,
        locuri_disponibile: newStatus ? parking.locuri_total : 0,
        locuri_indisponibile: newStatus ? 0 : parking.locuri_total,
        updated_at: new Date().toISOString()
      };

      const { error: testUpdateError } = await supabase
        .from('parcari_raportate')
        .update(updateData)
        .eq('id', parking.id);

      if (testUpdateError) {
        console.log('❌ Test actualizare eșuat:', testUpdateError.message);
      } else {
        console.log('✅ Test actualizare reușit!');
        console.log(`  Status schimbat de la ${parking.disponibilitate} la ${newStatus}`);
        console.log(`  Locuri: ${updateData.locuri_disponibile} libere, ${updateData.locuri_indisponibile} ocupate`);
      }
    }

  } catch (error) {
    console.error('❌ Eroare generală:', error);
  }
}

// Rulează verificarea
checkAndFixDatabase(); 