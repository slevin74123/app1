import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/config/supabase';

// Configurare robustă pentru Supabase
class RobustSupabaseClient {
  private client: SupabaseClient | null = null;
  private isOnline: boolean = false;
  private lastCheck: number = 0;
  private checkInterval: number = 30000; // 30 secunde

  constructor() {
    this.initializeClient();
    this.startHealthCheck();
  }

  private async initializeClient() {
    try {
      const config = getSupabaseConfig();
      
      // Verifică dacă URL-ul este accesibil
      if (await this.isUrlAccessible(config.url)) {
        this.client = createClient(config.url, config.anonKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
          }
        });
        this.isOnline = true;
        console.log('✅ Supabase client inițializat cu succes');
      } else {
        console.warn('⚠️ Supabase URL nu este accesibil, folosesc fallback');
        this.isOnline = false;
      }
    } catch (error) {
      console.error('❌ Eroare la inițializarea Supabase:', error);
      this.isOnline = false;
    }
  }

  private async isUrlAccessible(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': getSupabaseConfig().anonKey,
          'Authorization': `Bearer ${getSupabaseConfig().anonKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private startHealthCheck() {
    setInterval(async () => {
      if (this.client) {
        try {
          const isAccessible = await this.isUrlAccessible(getSupabaseConfig().url);
          if (isAccessible !== this.isOnline) {
            this.isOnline = isAccessible;
            console.log(`🔄 Status Supabase: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
          }
        } catch (error) {
          this.isOnline = false;
        }
      }
    }, this.checkInterval);
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isClientOnline(): boolean {
    return this.isOnline;
  }

  public async executeQuery<T>(
    queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
    fallbackData: T
  ): Promise<{ data: T | null; error: any }> {
    if (!this.client || !this.isOnline) {
      console.warn('⚠️ Supabase offline, returnez date fallback');
      return { data: fallbackData, error: { message: 'Supabase offline' } };
    }

    try {
      return await queryFn(this.client);
    } catch (error) {
      console.error('❌ Eroare la executarea query-ului:', error);
      this.isOnline = false;
      return { data: fallbackData, error };
    }
  }
}

// Instanță globală
export const robustSupabase = new RobustSupabaseClient();

// Funcție helper pentru a obține client-ul
export const getSupabaseClient = () => robustSupabase.getClient();

// Funcție helper pentru a verifica statusul
export const isSupabaseOnline = () => robustSupabase.isClientOnline(); 