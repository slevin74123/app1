// Sistem de configurare automată pentru Supabase
export class SupabaseAutoConfig {
  private static instance: SupabaseAutoConfig;
  private configCache: Map<string, any> = new Map();
  private lastConfigCheck: number = 0;
  private configCheckInterval: number = 60000; // 1 minut

  private constructor() {
    this.startAutoConfig();
  }

  public static getInstance(): SupabaseAutoConfig {
    if (!SupabaseAutoConfig.instance) {
      SupabaseAutoConfig.instance = new SupabaseAutoConfig();
    }
    return SupabaseAutoConfig.instance;
  }

  private startAutoConfig() {
    // Verifică configurația la pornirea aplicației
    this.checkAndUpdateConfig();
    
    // Verifică periodic configurația
    setInterval(() => {
      this.checkAndUpdateConfig();
    }, this.configCheckInterval);

    // Verifică la focus-ul aplicației (când utilizatorul revine la tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        this.checkAndUpdateConfig();
      });
    }
  }

  private async checkAndUpdateConfig() {
    try {
      const currentTime = Date.now();
      
      // Verifică dacă trebuie să facă check-ul
      if (currentTime - this.lastConfigCheck < this.configCheckInterval) {
        return;
      }

      this.lastConfigCheck = currentTime;
      
      // Verifică dacă proiectul Supabase este disponibil
      const isAvailable = await this.checkProjectAvailability();
      
      if (isAvailable) {
        console.log('🔄 Proiect Supabase restaurat, actualizez configurația...');
        await this.updateConfiguration();
      }
    } catch (error) {
      console.warn('⚠️ Eroare la verificarea configurației automată:', error);
    }
  }

  private async checkProjectAvailability(): Promise<boolean> {
    try {
      const config = this.getCurrentConfig();
      
      // Verifică dacă endpoint-ul REST este accesibil
      const response = await fetch(`${config.url}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': config.anonKey,
          'Authorization': `Bearer ${config.anonKey}`
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  private async updateConfiguration() {
    try {
      // Actualizează cache-ul de configurație
      this.configCache.clear();
      
      // Emite un event pentru a notifica componentele
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('supabaseConfigUpdated', {
          detail: { timestamp: Date.now() }
        }));
      }

      console.log('✅ Configurația Supabase actualizată cu succes');
    } catch (error) {
      console.error('❌ Eroare la actualizarea configurației:', error);
    }
  }

  private getCurrentConfig() {
    // Import dinamic pentru a evita probleme de circular dependency
    const { getSupabaseConfig } = require('@/config/supabase');
    return getSupabaseConfig();
  }

  public getConfig(key: string): any {
    return this.configCache.get(key);
  }

  public setConfig(key: string, value: any): void {
    this.configCache.set(key, value);
  }

  public clearCache(): void {
    this.configCache.clear();
  }

  public forceConfigCheck(): void {
    this.checkAndUpdateConfig();
  }
}

// Instanță globală
export const supabaseAutoConfig = SupabaseAutoConfig.getInstance();

// Funcție helper pentru a forța verificarea configurației
export const forceSupabaseConfigCheck = () => {
  supabaseAutoConfig.forceConfigCheck();
}; 