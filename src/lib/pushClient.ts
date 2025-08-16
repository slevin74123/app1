export async function registerAndSubscribePush(userId: string, publicKey: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  try {
    // Validare VAPID key
    if (!publicKey || publicKey === 'your-vapid-public-key' || publicKey.length < 50) {
      console.error('Invalid VAPID public key:', publicKey);
      throw new Error('VAPID public key invalidă sau lipsă');
    }

    const registration = await navigator.serviceWorker.register('/sw.js');

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const existing = await registration.pushManager.getSubscription();
    const subscription = existing || await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription, userAgent: navigator.userAgent })
    });

    return true;
  } catch (e) {
    console.error('Push subscription failed:', e);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  try {
    // Validare input
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Invalid base64 string');
    }

    // Curăță string-ul de caractere invalide
    const cleanString = base64String.trim();
    
    // Adaugă padding dacă este necesar
    const padding = '='.repeat((4 - (cleanString.length % 4)) % 4);
    const base64 = (cleanString + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    // Verifică dacă string-ul este valid Base64
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
      throw new Error('Invalid Base64 characters');
    }

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  } catch (error) {
    console.error('Error converting VAPID key:', error);
    throw new Error(`Failed to convert VAPID key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 