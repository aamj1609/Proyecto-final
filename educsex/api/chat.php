<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Este servicio solo acepta mensajes POST.']);
}
if (!extension_loaded('curl')) respond(500, ['error' => 'Falta activar la extensión cURL de PHP en XAMPP.']);
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) respond(413, ['error' => 'El mensaje es demasiado largo. Intenta resumir tu pregunta.']);
$payload = json_decode($raw, true);
if (!is_array($payload) || !isset($payload['messages']) || !is_array($payload['messages'])) respond(400, ['error' => 'No pude leer el mensaje. Escríbelo de nuevo.']);

$apiKey = getenv('OPENAI_API_KEY') ?: '';
$configFile = __DIR__ . '/config.php';
if (is_file($configFile)) {
    require $configFile;
    if (defined('EDUSEX_OPENAI_API_KEY') && EDUSEX_OPENAI_API_KEY !== 'PEGA_AQUI_TU_API_KEY') $apiKey = EDUSEX_OPENAI_API_KEY;
}
if ($apiKey === '' || $apiKey === 'PEGA_AQUI_TU_API_KEY') {
    respond(503, ['error' => 'El asistente IA todavía no está configurado. Crea api/config.php a partir de api/config.example.php y agrega tu clave API. No la compartas ni la pegues en app.js.']);
}

$messages = array_slice($payload['messages'], -12);
$input = [];
foreach ($messages as $message) {
    if (!is_array($message)) continue;
    $role = $message['role'] ?? '';
    $content = trim((string)($message['content'] ?? ''));
    if (!in_array($role, ['user', 'assistant'], true) || $content === '') continue;
    if (mb_strlen($content, 'UTF-8') > 1200) $content = mb_substr($content, 0, 1200, 'UTF-8');
    $input[] = ['role' => $role, 'content' => $content];
}
if (!$input || end($input)['role'] !== 'user') respond(400, ['error' => 'Escribe una pregunta para poder ayudarte.']);

$instructions = <<<'PROMPT'
Eres el asistente educativo de EduSex, un proyecto escolar de educación sexual en México. Responde en español claro, amable, respetuoso, sin juzgar y con palabras sencillas. Puedes explicar educación sexual integral, anatomía y pubertad, consentimiento, límites, relaciones saludables, orientación sexual e identidad de género de manera informativa y apropiada para adolescentes, anticoncepción, prevención de ITS, pruebas, embarazo, menstruación, salud reproductiva y cómo buscar servicios sanitarios.
Da respuestas útiles y directas, adapta el nivel de detalle a la pregunta y define los términos médicos. No inventes datos, diagnósticos, cifras, disponibilidad de servicios ni fuentes. Si la información depende de circunstancias individuales, explica qué factores importan y recomienda hablar con personal de salud. No sustituyas una consulta médica ni prescribas tratamientos. Si hay síntomas graves, posible agresión, coerción, peligro inmediato o una emergencia, recomienda buscar ayuda inmediata de una persona adulta de confianza y servicios profesionales/locales de emergencia. Nunca culpes a la persona ni presiones a revelar detalles íntimos. No pidas nombre completo, dirección, escuela, teléfono ni otros datos identificables. No solicites ni guardes información íntima innecesaria. Mantén el contenido educativo, no erótico y apropiado para adolescentes. Si no sabes algo, dilo con honestidad y sugiere una fuente sanitaria oficial o un profesional. No afirmes ser médico ni una persona humana.
PROMPT;
$body = [
    'model' => 'gpt-4.1-mini',
    'instructions' => $instructions,
    'input' => $input,
    'max_output_tokens' => 700,
    'store' => false
];
$ch = curl_init('https://api.openai.com/v1/responses');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 45,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $apiKey],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
]);
$result = curl_exec($ch);
$curlError = curl_error($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($result === false) respond(502, ['error' => 'No se pudo conectar al servicio de IA. Revisa tu conexión a internet e inténtalo de nuevo.']);
$decoded = json_decode($result, true);
if ($status < 200 || $status >= 300) {
    // Do not expose raw provider responses, headers or credentials to the browser.
    if ($status === 401 || $status === 403) respond(502, ['error' => 'La clave API no fue aceptada. Revisa que sea correcta y que el proyecto tenga acceso a la API.']);
    if ($status === 429) respond(429, ['error' => 'El servicio de IA está temporalmente limitado o no tiene saldo disponible. Revisa el uso y la facturación de tu API.']);
    respond(502, ['error' => 'El servicio de IA respondió con un error. Inténtalo de nuevo más tarde.']);
}
$reply = '';
foreach (($decoded['output'] ?? []) as $item) {
    if (($item['type'] ?? '') !== 'message') continue;
    foreach (($item['content'] ?? []) as $part) {
        if (($part['type'] ?? '') === 'output_text') $reply .= ($reply === '' ? '' : "\n") . (string)($part['text'] ?? '');
    }
}
if ($reply === '') respond(502, ['error' => 'La IA no devolvió texto esta vez. Inténtalo de nuevo.']);
respond(200, ['reply' => $reply]);
