const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabaseSchema() {
  console.log('🔧 Actualizarea schemei bazei de date...\n');

  try {
    // 1. Verifică structura actuală
    console.log('📋 Verificare structură actuală...');
    const { data: currentColumns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'parcari_raportate' });

    if (columnsError) {
      console.log('Nu se poate accesa structura tabelului prin RPC, încercăm altă metodă...');
    } else {
      console.log('Coloanele actuale:');
      currentColumns?.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // 2. Verifică dacă câmpurile noi există
    console.log('\n🔍 Verificare câmpuri noi...');
    const { data: testData, error: testError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, locuri_disponibile, locuri_indisponibile, locuri_total')
      .limit(1);

    if (testError) {
      console.log('❌ Câmpurile noi nu există încă. Eroare:', testError.message);
      
      // 3. Încearcă să adauge câmpurile prin SQL raw
      console.log('\n🔧 Adăugare câmpuri noi...');
      const { error: alterError } = await supabase
        .rpc('exec_sql', {
          sql_query: `
            ALTER TABLE parcari_raportate 
            ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;
          `
        });

      if (alterError) {
        console.log('❌ Nu se pot adăuga câmpurile prin RPC. Eroare:', alterError.message);
        console.log('\n💡 SOLUȚIE MANUALĂ:');
        console.log('1. Deschide Supabase Dashboard');
        console.log('2. Mergi la SQL Editor');
        console.log('3. Rulează următoarele comenzi:');
        console.log(`
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;
        `);
      } else {
        console.log('✅ Câmpurile au fost adăugate cu succes!');
      }
    } else {
      console.log('✅ Câmpurile noi există deja!');
      console.log('Exemplu de date:', testData?.[0]);
    }

    // 4. Verifică din nou după modificări
    console.log('\n🔍 Verificare finală...');
    const { data: finalData, error: finalError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, locuri_disponibile, locuri_indisponibile, locuri_total')
      .limit(3);

    if (finalError) {
      console.log('❌ Încă sunt probleme:', finalError.message);
    } else {
      console.log('✅ Structura actualizată cu succes!');
      console.log('Exemple de date:');
      finalData?.forEach(row => {
        console.log(`  - ${row.nume}: ${row.locuri_disponibile}/${row.locuri_total} locuri libere`);
      });
    }

    // 5. Actualizează parcările existente cu valori implicite
    console.log('\n🔄 Actualizare parcări existente cu valori implicite...');
    const { data: existingParkings, error: fetchError } = await supabase
      .from('parcari_raportate')
      .select('id, nume, disponibilitate, locuri_total')
      .or('locuri_total.is.null,locuri_total.eq.0');

    if (fetchError) {
      console.log('❌ Eroare la încărcarea parcărilor:', fetchError.message);
    } else if (existingParkings && existingParkings.length > 0) {
      console.log(`📊 Găsite ${existingParkings.length} parcări care necesită actualizare`);
      
      for (const parking of existingParkings) {
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
          console.log(`✅ Actualizat: ${parking.nume}`);
        }
      }
    } else {
      console.log('✅ Toate parcările au deja valorile corecte!');
    }

  } catch (error) {
    console.error('❌ Eroare generală:', error);
  }
}

// Rulează scriptul
updateDatabaseSchema(); 