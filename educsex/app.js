// EduSex: navegación, búsqueda de hospitales y mini prueba.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Google Maps sin clave de API: usa la búsqueda pública de Google Maps.
const placeSearch = document.getElementById("placeSearch");
const mapFrame = document.getElementById("mapFrame");
const openGoogleMaps = document.getElementById("openGoogleMaps");
function updateMap(place) {
  const query = (place || "").trim();
  if (!query) {
    placeSearch.focus();
    return;
  }
  placeSearch.value = query;
  const encoded = encodeURIComponent("hospitales y centros de salud en " + query);
  mapFrame.src = "https://maps.google.com/maps?q=" + encoded + "&output=embed";
  openGoogleMaps.href = "https://www.google.com/maps/search/" + encodeURIComponent("hospitales y centros de salud en " + query) + "/";
  openGoogleMaps.textContent = "Abrir resultados en Google Maps ↗";
}
document.getElementById("searchMap").addEventListener("click", () => updateMap(placeSearch.value));
placeSearch.addEventListener("keydown", event => {
  if (event.key === "Enter") updateMap(placeSearch.value);
});
document.querySelectorAll("[data-place]").forEach(button => {
  button.addEventListener("click", () => updateMap(button.dataset.place));
});

// Orientación por temas.
const topicContent = {
  consentimiento: {
    title: "Consentimiento y límites", icon: "♡",
    paragraphs: [
      "El consentimiento debe ser libre, claro, informado y puede retirarse en cualquier momento. Nadie debe presionarte para hacer algo que no deseas.",
      "Si te sientes en riesgo o alguien no respeta tus límites, busca apoyo de una persona adulta de confianza o de servicios profesionales."
    ]
  },
  prevencion: {
    title: "Prevención y protección", icon: "✳",
    paragraphs: [
      "La prevención incluye informarse con fuentes confiables, conocer las opciones de protección y acudir a personal de salud para resolver dudas.",
      "Los métodos de protección no son todos iguales. Un profesional de salud puede explicar cuáles son adecuados según cada situación."
    ]
  },
  consulta: {
    title: "¿Cuándo pedir ayuda?", icon: "＋",
    paragraphs: [
      "Puedes acudir a un centro de salud cuando tengas dudas, necesites orientación, quieras información sobre pruebas o notes algún cambio que te preocupe.",
      "Si hay peligro inmediato, busca los servicios de emergencia de tu localidad o pide ayuda a una persona adulta de confianza."
    ]
  }
};
const topicAnswer = document.getElementById("topicAnswer");
document.querySelectorAll("[data-topic]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-topic]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const content = topicContent[button.dataset.topic];
    topicAnswer.innerHTML = `<div class="answer-icon">${content.icon}</div><span class="eyebrow">GUÍA BREVE</span><h3>${content.title}</h3>${content.paragraphs.map(p => `<p>${p}</p>`).join("")}`;
  });
});

// Mini prueba educativa.
const questions = [
  { q: "¿El consentimiento puede retirarse en cualquier momento?", a: ["Sí, siempre.", "No, una vez aceptado ya no se puede cambiar.", "Solo si otra persona lo permite."], correct: 0, explain: "Correcto: el consentimiento puede retirarse en cualquier momento." },
  { q: "¿Qué debes hacer si tienes dudas sobre tu salud sexual?", a: ["Confiar en cualquier publicación.", "Consultar una fuente confiable o personal de salud.", "Ignorarlas siempre."], correct: 1, explain: "Correcto: busca información confiable y orientación profesional." },
  { q: "¿Es válido pedir ayuda si alguien no respeta tus límites?", a: ["Sí, mereces apoyo y seguridad.", "No, debes resolverlo sin ayuda.", "Solo si alguien más lo autoriza."], correct: 0, explain: "Correcto: pedir apoyo es válido; tu seguridad importa." }
];
let questionIndex = 0, score = 0, answered = false;
const questionCounter = document.getElementById("questionCounter");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextQuestion = document.getElementById("nextQuestion");
const progressBar = document.getElementById("progressBar");
function renderQuestion() {
  answered = false;
  const item = questions[questionIndex];
  questionCounter.textContent = `PREGUNTA ${questionIndex + 1} DE ${questions.length}`;
  questionText.textContent = item.q;
  progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  feedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.textContent = questionIndex === questions.length - 1 ? "Ver resultado →" : "Siguiente →";
  answers.innerHTML = "";
  item.a.forEach((label, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = label;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answers.appendChild(button);
  });
}
function chooseAnswer(index, selectedButton) {
  if (answered) return;
  answered = true;
  const item = questions[questionIndex];
  [...answers.children].forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
  });
  if (index === item.correct) {
    score++;
    feedback.textContent = item.explain;
  } else {
    selectedButton.classList.add("incorrect");
    feedback.textContent = "No pasa nada. " + item.explain;
  }
  nextQuestion.disabled = false;
}
nextQuestion.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    questionCounter.textContent = "PRUEBA TERMINADA";
    questionText.textContent = `Obtuviste ${score} de ${questions.length} respuestas correctas.`;
    answers.innerHTML = "<p>Gracias por aprender con EduSex. Puedes repetir la prueba para repasar.</p>";
    feedback.textContent = score === questions.length ? "¡Excelente! Sigue consultando información confiable." : "Repasa los temas y vuelve a intentarlo cuando quieras.";
    nextQuestion.disabled = true;
    nextQuestion.textContent = "Terminada";
  }
});
document.getElementById("restartQuiz").addEventListener("click", () => {
  questionIndex = 0; score = 0; renderQuestion();
});
renderQuestion();


// Chat de orientación local: responde con información educativa preparada en este archivo.
// No requiere API, clave privada, internet ni servidor PHP para contestar.
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
let chatBusy = false;
function appendChatMessage(text, who, label) {
  const row = document.createElement("div"); row.className = "message " + (who === "user" ? "user-message" : "bot-message");
  const avatar = document.createElement("div"); avatar.className = "message-avatar"; avatar.textContent = who === "user" ? "Tú" : "E";
  const bubble = document.createElement("div"); bubble.className = "bubble";
  const p = document.createElement("p"); p.textContent = text;
  const time = document.createElement("small"); time.textContent = label || (who === "user" ? "Tú · ahora" : "EduSex · información educativa");
  bubble.append(p, time); row.append(avatar, bubble); chatMessages.appendChild(row); chatMessages.scrollTop = chatMessages.scrollHeight;
  return row;
}
function getLocalAnswer(question) {
  const q = question.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const answers = [
    { keys: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches"], text: "¡Hola! Soy el orientador informativo de EduSex. Puedo compartir información básica sobre consentimiento, prevención, métodos de protección, infecciones de transmisión sexual y cuándo acudir a un centro de salud. ¿Sobre qué tema quieres aprender?" },
    { keys: ["consentimiento", "limites", "presion", "obligar", "no quiero"], text: "El consentimiento debe ser libre, claro e informado. Puedes cambiar de opinión o retirar tu consentimiento en cualquier momento. Nadie debe presionarte ni obligarte. Si alguien no respeta tus límites, busca apoyo de una persona adulta de confianza o de personal profesional." },
    { keys: ["condon", "preservativo", "proteccion", "prevenir embarazo", "metodos anticonceptivos", "anticonceptivo"], text: "Existen distintos métodos anticonceptivos y no todos protegen contra las infecciones de transmisión sexual. El condón, usado correctamente, ayuda a reducir el riesgo de ITS y de embarazo. Para elegir un método adecuado y aprender a usarlo, consulta a personal de salud; esta información general no sustituye una consulta." },
    { keys: ["its", "infeccion", "infecciones", "transmision sexual", "vih", "sida"], text: "Las infecciones de transmisión sexual (ITS) pueden transmitirse durante el contacto sexual y algunas no causan síntomas al principio. Las pruebas y la orientación médica ayudan a detectarlas y tratarlas. El condón reduce el riesgo, aunque no elimina todos los riesgos. Si crees que pudiste exponerte, acude a un centro de salud para recibir orientación." },
    { keys: ["embarazo", "retraso", "prueba de embarazo"], text: "Si crees que puede haber un embarazo, una prueba de embarazo y la orientación de personal de salud pueden ayudarte a aclararlo. Si hubo una relación sin protección o falló un método, consulta pronto en una farmacia o centro de salud sobre las opciones disponibles y los tiempos adecuados. No puedo confirmar un embarazo por chat." },
    { keys: ["pubertad", "menstruacion", "regla", "cambios del cuerpo", "adolescencia"], text: "Durante la pubertad pueden cambiar el cuerpo, las emociones, la piel, el vello y la menstruación. El ritmo de desarrollo es diferente para cada persona. Si tienes dolor intenso, sangrado que te preocupa o alguna duda específica, habla con personal de salud o una persona adulta de confianza." },
    { keys: ["hospital", "centro de salud", "doctor", "medico", "ayuda profesional", "consulta"], text: "Puedes acudir a un centro de salud para resolver dudas, conocer métodos de protección, preguntar por pruebas de ITS o recibir atención por un cambio que te preocupe. En la sección «Hospitales» de EduSex puedes buscar servicios cercanos en Google Maps y confirmar directamente sus horarios y servicios." },
    { keys: ["mito", "realidad", "verdad"], text: "Una forma de distinguir mitos de información confiable es consultar fuentes de salud reconocidas y preguntar a personal capacitado. No todo lo que circula en redes sociales es correcto. En la sección «Mitos y realidades» de EduSex puedes revisar ejemplos y aprender a identificar información poco confiable." },
    { keys: ["abuso", "violencia", "me obligan", "me siento en peligro", "acoso"], text: "Nadie tiene derecho a obligarte, tocarte o presionarte. No es tu culpa si alguien cruza tus límites. Busca apoyo de una persona adulta de confianza y de servicios profesionales. Si estás en peligro inmediato, aléjate si puedes hacerlo con seguridad y contacta los servicios de emergencia de tu localidad." },
    { keys: ["gracias"], text: "¡De nada! Recuerda que mereces información clara, respeto y atención sin juicios. Si tu duda es médica o personal, lo más seguro es consultarla con personal de salud." }
  ];
  const match = answers.find(item => item.keys.some(key => q.includes(key)));
  if (match) return match.text;
  return "Puedo responder preguntas básicas usando la información educativa que incluye EduSex, pero no soy una IA conectada ni puedo contestar cualquier pregunta. Prueba con un tema como consentimiento, prevención, condón, anticonceptivos, ITS, embarazo, pubertad o centros de salud. Para una situación personal o médica, consulta a personal de salud.";
}
function sendChatMessage(message) {
  const clean = message.trim(); if (!clean || chatBusy) return;
  appendChatMessage(clean, "user"); chatInput.value = ""; chatBusy = true;
  const sendButton = chatForm.querySelector('button[type="submit"]');
  sendButton.disabled = true; sendButton.innerHTML = 'Respondiendo…'; chatInput.disabled = true;
  // Respuesta local inmediata, sin llamadas a servicios externos.
  const answer = getLocalAnswer(clean);
  appendChatMessage(answer, "bot");
  chatBusy = false; sendButton.disabled = false; sendButton.innerHTML = 'Enviar <span>➤</span>'; chatInput.disabled = false; chatInput.focus();
}
if (chatForm) {
  chatForm.addEventListener("submit", event => {event.preventDefault(); sendChatMessage(chatInput.value);});
  document.querySelectorAll("[data-chat-prompt]").forEach(button => button.addEventListener("click", () => sendChatMessage(button.dataset.chatPrompt)));
}

// Cuenta de demostración sin servidor ni base de datos. Nunca guarda contraseñas.
(function accountDemo(){
  const $ = id => document.getElementById(id);
  const forms = $('accountForms'), loginForm = $('loginForm'), createForm = $('createProfileForm'), profileView = $('profileView');
  if (!forms || !loginForm || !createForm || !profileView) return;
  const getProfile = () => { try { return JSON.parse(localStorage.getItem('edusex_demo_profile') || 'null'); } catch { return null; } };
  const showForm = (mode) => {
    forms.classList.remove('hidden'); profileView.classList.add('hidden');
    loginForm.classList.toggle('hidden', mode !== 'login'); createForm.classList.toggle('hidden', mode !== 'register');
    $('showLogin').classList.toggle('active', mode === 'login'); $('showRegister').classList.toggle('active', mode === 'register');
    $('loginMessage').textContent=''; $('registerMessage').textContent='';
  };
  function showProfile(profile){
    forms.classList.add('hidden'); profileView.classList.remove('hidden');
    $('profileGreeting').textContent='¡Hola, '+profile.alias+'!'; $('profileEmailText').textContent=profile.email;
    $('profileAvatar').textContent=(profile.alias.trim()[0] || 'E').toLocaleUpperCase('es'); $('profileMessage').textContent='';
  }
  $('showLogin').addEventListener('click',()=>showForm('login'));
  $('showRegister').addEventListener('click',()=>showForm('register'));
  createForm.addEventListener('submit',event=>{
    event.preventDefault(); const alias=$('profileAlias').value.trim(), email=$('profileEmail').value.trim().toLowerCase(), password=$('profilePassword').value;
    if(!alias || !email || password.length<4) return;
    const profile={alias,email};
    try { localStorage.setItem('edusex_demo_profile',JSON.stringify(profile)); sessionStorage.setItem('edusex_demo_session',email); }
    catch { $('registerMessage').textContent='No se pudo guardar el perfil en este navegador. Puedes continuar explorando sin cuenta.'; return; }
    createForm.reset(); showProfile(profile);
  });
  loginForm.addEventListener('submit',event=>{
    event.preventDefault(); const profile=getProfile(), email=$('loginEmail').value.trim().toLowerCase(), password=$('loginPassword').value;
    if(!profile || profile.email!==email){$('loginMessage').textContent='No encontramos un perfil local con ese correo. Selecciona “Crear perfil” primero.';return;}
    if(!password){$('loginMessage').textContent='Escribe una contraseña de demostración para continuar.';return;}
    sessionStorage.setItem('edusex_demo_session',email); showProfile(profile);
  });
  $('logoutProfile').addEventListener('click',()=>{sessionStorage.removeItem('edusex_demo_session');showForm('login');$('loginMessage').textContent='Has cerrado la sesión de demostración.';});
  $('editProfile').addEventListener('click',()=>{const profile=getProfile();if(!profile)return;const alias=prompt('Escribe el alias que quieres mostrar:',profile.alias);if(alias&&alias.trim()){profile.alias=alias.trim().slice(0,35);localStorage.setItem('edusex_demo_profile',JSON.stringify(profile));showProfile(profile);}});
  $('deleteProfile').addEventListener('click',()=>{if(confirm('¿Eliminar el perfil de demostración guardado en este navegador?')){localStorage.removeItem('edusex_demo_profile');sessionStorage.removeItem('edusex_demo_session');showForm('login');$('loginMessage').textContent='El perfil local se eliminó.';}});
  const profile=getProfile(), active=sessionStorage.getItem('edusex_demo_session');
  if(profile && active===profile.email) showProfile(profile); else showForm('login');
})();
