import React, { useState } from 'react';
import { MapPin, MessageSquare, Search, Plus, AlertTriangle, Users, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AppFunctionsSidebar: React.FC = () => {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  // State pentru formularul de raportare
  const [reportLocation, setReportLocation] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  const mainFunctions = [{
    id: 'report',
    icon: Plus,
    title: 'Raportează Loc Liber',
    description: 'Ajută comunitatea raportând parcări disponibile',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  }, {
    id: 'inform',
    icon: MessageSquare,
    title: 'Informează Comunitatea',
    description: 'Împărtășește actualizări despre condițiile de parcare',
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  }, {
    id: 'find',
    icon: Search,
    title: 'Găsește un Loc',
    description: 'Primește recomandări personalizate de parcare',
    color: 'bg-purple-500',
    textColor: 'text-purple-600'
  }] as unknown as { id: string; icon: React.ElementType; title: string; description: string; color: string; textColor: string }[];
  const quickActions = [{
    icon: AlertTriangle,
    title: 'Raportează Problemă',
    description: 'Raportează încălcări sau probleme de parcare',
    count: null
  }, {
    icon: Users,
    title: 'Feed Comunitate',
    description: 'Vezi ce împărtășesc alții',
    count: 12
  }, {
    icon: TrendingUp,
    title: 'Ore de Vârf',
    description: 'Vezi orele aglomerate de parcare',
    count: null
  }] as unknown as { icon: React.ElementType; title: string; description: string; count: number | null }[];
  const recentActivity = [{
    action: 'Loc nou raportat',
    location: 'Piața Victoriei',
    time: 'acum 2 min',
    type: 'report'
  }, {
    action: 'Actualizare comunitate',
    location: 'Centrul Vechi',
    time: 'acum 5 min',
    type: 'update'
  }, {
    action: 'Loc rezervat',
    location: 'Herastrau',
    time: 'acum 8 min',
    type: 'reservation'
  }] as unknown as { action: string; location: string; time: string; type: string }[];
  const handleFunctionClick = (functionId: string) => {
    setActiveFunction(activeFunction === functionId ? null : functionId);
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <Plus size={12} className="text-green-600" />;
      case 'update':
        return <MessageSquare size={12} className="text-blue-600" />;
      case 'reservation':
        return <Clock size={12} className="text-purple-600" />;
      default:
        return <MapPin size={12} className="text-muted-foreground" />;
    }
  };

  // Functia de trimitere raport
  const handleReportFreeSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation.trim()) {
      toast.error('Te rugăm să introduci locația sau adresa!');
      return;
    }
    setReportLoading(true);
    // Opțional: poți adăuga și lat/lng dacă ai geocodare sau selectezi pe hartă
    const reportData: Record<string, any> = {
      description: `Loc liber raportat: ${reportLocation}${reportDetails ? ' | Detalii: ' + reportDetails : ''}`,
      status: 'free_spot',
      created_at: new Date().toISOString()
    };
    // Dacă ai coordonate, adaugă-le aici (ex: reportData.lat = ..., reportData.lng = ...)
    const { error, data } = await supabase.from('problems_reports').insert(reportData).select();
    setReportLoading(false);
    if (error) {
      toast.error('Eroare la trimiterea raportului: ' + error.message);
    } else {
      toast.success('Mulțumim! Raportul a fost trimis către comunitate.');
      setReportLocation('');
      setReportDetails('');
      // Emit eveniment custom pentru a adăuga pinul pe hartă
      if (data && data[0]) {
        window.dispatchEvent(new CustomEvent('free-spot-reported', { detail: data[0] }));
      }
    }
  };

  return <div className="h-full flex flex-col bg-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Acțiuni Rapide</h2>
        <p className="text-sm text-muted-foreground">Ajută să îmbunătățim parcarea pentru toți</p>
      </div>

      {/* Main Functions */}
      <div className="p-4 space-y-3">
        {mainFunctions.map(func => <div key={func.id} className="space-y-2">
            <button onClick={() => handleFunctionClick(func.id)} className={`w-full p-4 rounded-lg border transition-all duration-200 ${activeFunction === func.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${func.color} text-white`}>
                  <func.icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-foreground">{func.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{func.description}</p>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {activeFunction === func.id && <div className="ml-4 p-3 bg-muted/30 rounded-lg border-l-2 border-primary">
                {func.id === 'report' && <form className="space-y-3" onSubmit={handleReportFreeSpot}>
                    <input
                      type="text"
                      placeholder="Introdu locația sau adresa"
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={reportLocation}
                      onChange={e => setReportLocation(e.target.value)}
                      disabled={reportLoading}
                    />
                    <textarea
                      placeholder="Detalii suplimentare (opțional)"
                      rows={2}
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      value={reportDetails}
                      onChange={e => setReportDetails(e.target.value)}
                      disabled={reportLoading}
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-60"
                      disabled={reportLoading}
                    >
                      {reportLoading ? 'Se trimite...' : 'Trimite Raport'}
                    </button>
                  </form>}
                {func.id === 'inform' && <div className="space-y-3">
                    <select className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Selectează tipul actualizării</option>
                      <option>Alertă Construcții</option>
                      <option>Parcare Eveniment</option>
                      <option>Schimbare Preț</option>
                      <option>Altele</option>
                    </select>
                    <textarea placeholder="Împărtășește actualizarea cu comunitatea" rows={3} className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      Împărtășește Actualizarea
                    </button>
                  </div>}
                {func.id === 'find' && <div className="space-y-3">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Destinația" className="flex-1 px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      <button className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors">
                        <MapPin size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Durata</option>
                        <option>30 minute</option>
                        <option>1 oră</option>
                        <option>2 ore</option>
                        <option>Toată ziua</option>
                      </select>
                      <select className="flex-1 px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Preț maxim</option>
                        <option>10 RON/oră</option>
                        <option>20 RON/oră</option>
                        <option>30 RON/oră</option>
                        <option>Fără limită</option>
                      </select>
                    </div>
                    <button className="w-full bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700 transition-colors">
                      Găsește Cele Mai Bune Locuri
                    </button>
                  </div>}
              </div>}
          </div>)}
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Mai Multe Acțiuni
        </h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => <button key={index} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                <action.icon size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{action.title}</span>
                  {action.count && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      {action.count}
                    </span>}
                </div>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </button>)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Activitate Recentă
        </h3>
        <div className="space-y-2 overflow-y-auto">
          {recentActivity.map((activity, index) => <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default AppFunctionsSidebar;