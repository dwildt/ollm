# Translation Guide for OLLM

This guide explains how to add new language translations to the OLLM (Ollama Chat Interface).

## File Structure

All translation files are located in `/src/i18n/locales/` with the following naming convention:
- `en.json` - English (default)
- `pt.json` - Portuguese
- `[language_code].json` - Other languages

## Adding a New Language

1. **Create the translation file:**
   Create a new JSON file in `/src/i18n/locales/` using the ISO 639-1 language code (e.g., `es.json` for Spanish, `fr.json` for French).

2. **Copy the structure:**
   Copy the content from `en.json` and translate all the values while keeping the keys unchanged.

3. **Register the language:**
   Update `/src/i18n/index.ts` to include your new language:
   ```typescript
   import esTranslations from './locales/es.json'; // Add this line

   const resources = {
     en: {
       translation: enTranslations,
     },
     pt: {
       translation: ptTranslations,
     },
     es: { // Add this block
       translation: esTranslations,
     },
   };
   ```

4. **Update the Language Switcher:**
   Modify `/src/components/LanguageSwitcher.tsx` to include your new language button.

## Translation Structure

The JSON structure contains the following sections:

### `app`
- `title`: Application title
- `welcomeTitle`: Welcome message title
- `welcomeMessage`: Welcome message content
- `ollamaDisconnected`: Error message when Ollama is not connected

### `chat`
- `model`: Label for model selector
- `noModelsAvailable`: Message when no models are found
- `clearChat`: Button text for clearing chat
- `inputPlaceholder`: Placeholder text for message input
- `send`: Send button text
- `sending`: Text shown while sending message
- `errorMessage`: Generic error message

### `status`
- `connected`: Status when connected to Ollama
- `disconnected`: Status when disconnected from Ollama
- `checking`: Status while checking connection

### `language`
- `english`: Name for English language
- `portuguese`: Name for Portuguese language
- `switchTo`: Template for language switch tooltip

## Example Translation File (Spanish)

```json
{
  "app": {
    "title": "OLLM - Interfaz de Chat Ollama",
    "welcomeTitle": "¡Bienvenido a OLLM!",
    "welcomeMessage": "Comienza una conversación escribiendo un mensaje a continuación.",
    "ollamaDisconnected": "⚠️ Ollama parece estar desconectado. Asegúrate de que Ollama esté ejecutándose en localhost:11434"
  },
  "chat": {
    "model": "Modelo:",
    "noModelsAvailable": "No hay modelos disponibles",
    "clearChat": "Limpiar Chat",
    "inputPlaceholder": "Escribe tu mensaje aquí... (Presiona Enter para enviar, Shift+Enter para nueva línea)",
    "send": "Enviar",
    "sending": "Enviando...",
    "errorMessage": "Lo siento, encontré un error. Asegúrate de que Ollama esté ejecutándose e inténtalo de nuevo."
  },
  "status": {
    "connected": "🟢 Conectado",
    "disconnected": "🔴 Desconectado",
    "checking": "🟡 Verificando..."
  },
  "language": {
    "english": "English",
    "portuguese": "Português",
    "spanish": "Español",
    "switchTo": "Cambiar a {{language}}"
  }
}
```

## Important Notes

- Always keep the JSON keys unchanged
- Use appropriate emojis that work across different platforms
- Test your translations in context to ensure they fit the UI
- Consider text length differences between languages
- Maintain consistent terminology throughout the translation

## Testing

After adding a new language:

1. Start the development server: `npm run dev`
2. Use the language switcher to test your translation
3. Verify all UI elements display correctly
4. Check that text fits properly in buttons and labels