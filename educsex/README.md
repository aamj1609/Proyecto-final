# EduSex — interfaces completas + chat informativo local

Prototipo escolar responsivo con logo, navegación, recursos de educación sexual y un chat que responde con información educativa predefinida. No usa API ni base de datos.

## Secciones incluidas
1. Inicio / bienvenida.
2. Mitos y realidades.
3. Búsqueda de hospitales y centros de salud con Google Maps.
4. Orientación inicial por temas.
5. Chat informativo: ofrece respuestas preparadas sobre temas básicos de educación sexual.
6. Mini prueba de conocimientos.
7. Inicio de sesión y perfil de demostración local.
8. Menú adaptable a celular y pie de página.

## Cómo abrir el proyecto
1. Descomprime el ZIP.
2. Abre `index.html` en tu navegador. El chat local funciona sin configurar una API.
3. Escribe preguntas sobre consentimiento, prevención, condón, anticonceptivos, ITS, embarazo, pubertad o centros de salud.

## Cómo funciona el chat
- Las respuestas están preparadas dentro de `app.js` y se seleccionan según palabras clave.
- No es una inteligencia artificial conectada y no puede responder cualquier pregunta; si no reconoce el tema, te sugiere temas compatibles.
- No envía los mensajes a un proveedor externo ni necesita clave privada.
- La información es general y no sustituye a personal médico. Para dudas personales de salud, consulta a un profesional.

## Google Maps
La sección de hospitales usa una búsqueda pública de Google Maps incrustada y un enlace externo. No requiere clave de API de Google Maps. Confirma horarios, servicios y dirección directamente con la institución.

## Perfil
El apartado de cuenta sigue siendo una demostración local sin base de datos ni autenticación real. No introduzcas contraseñas reales ni datos personales. La conexión de la IA no activa ni asegura las cuentas de usuario.

## Archivos principales
- `index.html`: estructura y secciones.
- `styles.css`: estilos responsivos.
- `app.js`: navegación, mapa, mini prueba, chat y perfil de demostración.
- `api/chat.php`: backend que llama a la IA.
- `api/config.example.php`: plantilla de configuración; hay que copiarla como `config.php` y añadir la clave.
- `assets/logo-edusex.svg`: logo vectorial.

## Referencia técnica
La integración usa la API Responses de OpenAI: https://developers.openai.com/api/reference/resources/responses/methods/create
