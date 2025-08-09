const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase
const supabaseUrl = 'https://efceqwwdfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2Vxd3dkZnIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzE5NzI5MCwiZXhwIjoyMDUyNzczMjkwfQ.efceqwwdfr';

console.log('🔍 Testare conexiune Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Testare conexiune de bază...');
    
    // Test 1: Verifică dacă poți accesa tabelul
    const { data, error } = await supabase
      .from('parcari_raportate')
      .select('id, nume')
      .limit(1);

    if (error) {
      console.log('❌ Eroare la accesarea tabelului:', error.message);
      console.log('Cod eroare:', error.code);
      console.log('Detalii:', error.details);
      console.log('Hint:', error.hint);
      return;
    }

    console.log('✅ Conexiunea funcționează!');
    console.log('Date găsite:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Exemplu parcare:', data[0]);
    }

    // Test 2: Verifică structura tabelului
    console.log('\n📋 Verificare structură tabel...');
    const { data: structureData, error: structureError } = await supabase
      .from('parcari_raportate')
      .select('*')
      .limit(1);

    if (structureError) {
      console.log('❌ Eroare la verificarea structurii:', structureError.message);
    } else {
      console.log('✅ Structura tabelului accesibilă');
      if (structureData && structureData.length > 0) {
        const columns = Object.keys(structureData[0]);
        console.log('Coloane găsite:', columns);
        
        // Verifică câmpurile noi
        const newColumns = ['locuri_disponibile', 'locuri_indisponibile', 'locuri_total'];
        const missingColumns = newColumns.filter(col => !columns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('❌ Câmpuri lipsă:', missingColumns);
        } else {
          console.log('✅ Toate câmpurile noi există!');
        }
      }
    }

    // Test 3: Încearcă o actualizare simplă
    console.log('\n🔄 Test actualizare...');
    const { data: testUpdate, error: updateError } = await supabase
      .from('parcari_raportate')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select();

    if (updateError) {
      console.log('❌ Eroare la actualizare:', updateError.message);
    } else {
      console.log('✅ Actualizarea funcționează!');
    }

  } catch (error) {
    console.error('❌ Eroare generală:', error);
    console.error('Stack:', error.stack);
  }
}

testConnection(); 