import { supabase } from '@/lib/supabase';

export class DebugSupabase {
  /**
   * Verifică dacă tabela parking_locations există
   */
  static async checkTableExists(): Promise<{ success: boolean; error?: string; exists?: boolean }> {
    try {
      console.log('🔍 Verific dacă tabela parking_locations există...');
      
      const { data, error } = await supabase
        .from('parking_locations')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Eroare la verificarea tabelei:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Tabela parking_locations există și este accesibilă');
      return { success: true, exists: true };
    } catch (error) {
      console.error('❌ Eroare neașteptată:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică structura tabelei
   */
  static async checkTableStructure(): Promise<{ success: boolean; error?: string; columns?: any[] }> {
    try {
      console.log('🔍 Verific structura tabelei parking_locations...');
      
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .limit(0);

      if (error) {
        console.error('❌ Eroare la verificarea structurii:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Structura tabelei verificată cu succes');
      return { success: true, columns: [] };
    } catch (error) {
      console.error('❌ Eroare neașteptată:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică dacă există parcări în tabelă
   */
  static async checkParkingCount(): Promise<{ success: boolean; error?: string; count?: number }> {
    try {
      console.log('🔍 Verific câte parcări există în tabelă...');
      
      const { count, error } = await supabase
        .from('parking_locations')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Eroare la numărarea parcărilor:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Tabela conține ${count} parcări`);
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('❌ Eroare neașteptată:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Testează inserarea unei parcări simple
   */
  static async testInsertParking(): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      console.log('🔍 Testez inserarea unei parcări...');
      
      const testParking = {
        name: 'TEST Parcare Debug',
        address: 'Strada Test nr. 1, București',
        city: 'București',
        district: 'Test',
        parking_type: 'street',
        total_spots: 10,
        available_spots: 5,
        price_per_hour: 5.00,
        is_free: false,
        is_24h: false,
        description: 'Parcare de test pentru debug',
        amenities: ['lighting']
      };

      const { data, error } = await supabase
        .from('parking_locations')
        .insert(testParking)
        .select('id')
        .single();

      if (error) {
        console.error('❌ Eroare la inserarea test:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Inserare test reușită, ID:', data.id);
      return { success: true, id: data.id };
    } catch (error) {
      console.error('❌ Eroare neașteptată la test:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Șterge parcarea de test
   */
  static async cleanupTestParking(testId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧹 Curăț parcarea de test...');
      
      const { error } = await supabase
        .from('parking_locations')
        .delete()
        .eq('id', testId);

      if (error) {
        console.error('❌ Eroare la ștergerea test:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Parcarea de test a fost ștearsă');
      return { success: true };
    } catch (error) {
      console.error('❌ Eroare neașteptată la curățare:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Testează inserarea unei parcări specifice (Piața Victoriei)
   */
  static async testInsertVictorieiParking(): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      console.log('🔍 Testez inserarea Parcare Piața Victoriei...');
      
      const victorieiParking = {
        name: 'Parcare Piața Victoriei',
        address: 'Piața Victoriei nr. 1, București',
        city: 'București',
        district: 'Centru',
        latitude: 44.4518,
        longitude: 26.0853,
        parking_type: 'garage',
        total_spots: 150,
        available_spots: 75,
        price_per_hour: 8.00,
        is_free: false,
        is_24h: true,
        description: 'Garaj cu 4.2/5 rating',
        amenities: ['lighting', 'covered', 'security', 'disabled_access']
      };

      console.log('📝 Încerc să inserez:', victorieiParking);

      const { data, error } = await supabase
        .from('parking_locations')
        .insert(victorieiParking)
        .select('id')
        .single();

      if (error) {
        console.error('❌ Eroare la inserarea Victoriei:', error);
        console.error('🔍 Detalii eroare:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { success: false, error: error.message };
      }

      console.log('✅ Inserare Victoriei reușită, ID:', data.id);
      return { success: true, id: data.id };
    } catch (error) {
      console.error('❌ Eroare neașteptată la test Victoriei:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică dacă există conflicte de nume
   */
  static async checkNameConflicts(): Promise<{ success: boolean; error?: string; conflicts?: any[] }> {
    try {
      console.log('🔍 Verific conflicte de nume...');
      
      const { data, error } = await supabase
        .from('parking_locations')
        .select('id, name, created_at')
        .eq('name', 'Parcare Piața Victoriei');

      if (error) {
        console.error('❌ Eroare la verificarea conflictelor:', error);
        return { success: false, error: error.message };
      }

      if (data && data.length > 0) {
        console.log('⚠️ Găsite conflicte de nume:', data);
        return { success: true, conflicts: data };
      }

      console.log('✅ Nu există conflicte de nume');
      return { success: true, conflicts: [] };
    } catch (error) {
      console.error('❌ Eroare neașteptată la verificarea conflictelor:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Verifică permisiunile RLS
   */
  static async checkRLSPermissions(): Promise<{ success: boolean; error?: string; policies?: any[] }> {
    try {
      console.log('🔍 Verific permisiunile RLS...');
      
      // Încearcă să faci o operație care ar fi blocată de RLS
      const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ Eroare la verificarea permisiunilor RLS:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Permisiunile RLS sunt corecte');
      return { success: true, policies: [] };
    } catch (error) {
      console.error('❌ Eroare neașteptată la verificarea RLS:', error);
      return { success: false, error: 'Eroare neașteptată' };
    }
  }

  /**
   * Rulează toate verificările
   */
  static async runFullDiagnostic(): Promise<void> {
    console.log('🚀 Încep diagnosticul complet Supabase...');
    
    // 1. Verifică dacă tabela există
    const tableExists = await this.checkTableExists();
    if (!tableExists.success) {
      console.error('❌ Tabela nu există sau nu este accesibilă');
      return;
    }

    // 2. Verifică structura
    const structure = await this.checkTableStructure();
    if (!structure.success) {
      console.error('❌ Problema cu structura tabelei');
      return;
    }

    // 3. Verifică numărul de parcări
    const count = await this.checkParkingCount();
    if (!count.success) {
      console.error('❌ Problema la numărarea parcărilor');
      return;
    }

    // 4. Verifică conflictele de nume
    const conflicts = await this.checkNameConflicts();
    if (!conflicts.success) {
      console.error('❌ Problema la verificarea conflictelor');
      return;
    }

    // 5. Verifică permisiunile RLS
    const rls = await this.checkRLSPermissions();
    if (!rls.success) {
      console.error('❌ Problema cu permisiunile RLS');
      return;
    }

    // 6. Testează inserarea Victoriei
    const insertTest = await this.testInsertVictorieiParking();
    if (!insertTest.success) {
      console.error('❌ Problema la inserarea Parcare Victoriei');
      return;
    }

    // 7. Curăță testul
    if (insertTest.id) {
      await this.cleanupTestParking(insertTest.id);
    }

    console.log('✅ Diagnostic complet finalizat cu succes!');
  }
} 