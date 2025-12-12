# API Setup für Edelmetallpreise

## Problem: CORS-Fehler mit GoldAPI.io

GoldAPI.io blockiert möglicherweise direkte Browser-Anfragen aufgrund von CORS-Richtlinien. 

## Lösungen:

### Option 1: Metals-API.com verwenden (Empfohlen)
Metals-API.com hat bessere CORS-Unterstützung und funktioniert zuverlässig aus dem Browser.

1. Registrieren Sie sich bei [metals-api.com](https://metals-api.com)
2. Holen Sie sich Ihren API-Key
3. Fügen Sie ihn zu Ihrer `.env` Datei hinzu:
   ```
   VITE_METALS_API_KEY=your_api_key_here
   ```

### Option 2: Backend-Proxy erstellen
Erstellen Sie einen einfachen Backend-Endpoint, der die GoldAPI.io-Anfragen weiterleitet:

```javascript
// Beispiel: Express.js Proxy
app.get('/api/metals/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const response = await fetch(`https://www.goldapi.io/api/${symbol}/EUR`, {
    headers: { 'x-access-token': process.env.GOLDAPI_KEY }
  });
  const data = await response.json();
  res.json(data);
});
```

Dann ändern Sie die API-URL im PriceTicker zu `/api/metals/`.

### Option 3: Aktuelle Lösung (Dual-Source)
Die aktuelle Implementierung versucht zuerst Metals-API.com (wenn konfiguriert), dann GoldAPI.io.

## Empfehlung
Verwenden Sie **Metals-API.com** für die beste Browser-Kompatibilität und Zuverlässigkeit.

