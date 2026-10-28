document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // CUESTIONARIO
  // ==============================

  const preguntas = [
    {
      pregunta: "¿Qué método ayuda a reducir el riesgo de muchas ITS?",
      opciones: [
        "Las pastillas anticonceptivas",
        "El condón",
        "El calendario menstrual"
      ],
      correcta: 1,
      explicacion:
        "El condón ayuda a prevenir embarazos y reduce el riesgo de muchas infecciones de transmisión sexual."
    },
    {
      pregunta: "¿Todos los métodos anticonceptivos protegen contra las ITS?",
      opciones: [
        "Sí, todos",
        "Solo los métodos hormonales",
        "No, el condón ayuda a reducir ese riesgo"
      ],
      correcta: 2,
      explicacion:
        "Los métodos hormonales y el DIU previenen embarazos, pero no protegen contra las ITS."
    },
    {
      pregunta: "¿Qué significa el consentimiento?",
      opciones: [
        "Aceptar porque alguien insiste",
        "Decidir libremente, sin presión ni amenazas",
        "No poder cambiar de opinión"
      ],
      correcta: 1,
      explicacion:
        "El consentimiento debe ser libre. Cualquier persona puede decir que no o cambiar de opinión."
    },
    {
      pregunta: "¿Qué debes hacer si tienes dudas sobre anticonceptivos?",
      opciones: [
        "Confiar en cualquier publicación",
        "Ignorar las dudas",
        "Consultar a personal de salud capacitado"
      ],
      correcta: 2,
      explicacion:
        "El personal de salud puede orientarte sobre los métodos disponibles y su uso."
    }
  ];

  const quizProgress = document.getElementById("quizProgress");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizResult = document.getElementById("quizResult");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");

  let preguntaActual = 0;
  let puntos = 0;
  let respondida = false;
  let cuestionarioTerminado = false;

  function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];

    quizProgress.textContent =
      `Pregunta ${preguntaActual + 1} de ${preguntas.length}`;

    quizQuestion.textContent = pregunta.pregunta;
    quizOptions.replaceChildren();
    quizFeedback.textContent = "";
    quizResult.textContent = "";

    respondida = false;
    cuestionarioTerminado = false;
    nextQuestionBtn.disabled = false;
    nextQuestionBtn.textContent = "Siguiente";

    pregunta.opciones.forEach((opcion, indice) => {
      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "opcion";
      boton.textContent = opcion;

      boton.addEventListener("click", () => {
        if (respondida || cuestionarioTerminado) return;

        respondida = true;

        const botones = quizOptions.querySelectorAll(".opcion");

        botones.forEach((elemento, i) => {
          elemento.disabled = true;

          if (i === pregunta.correcta) {
            elemento.classList.add("correcta");
          }
        });

        if (indice === pregunta.correcta) {
          puntos++;
          quizFeedback.textContent =
            "¡Correcto! " + pregunta.explicacion;
        } else {
          boton.classList.add("incorrecta");
          quizFeedback.textContent =
            "Respuesta incorrecta. " + pregunta.explicacion;
        }

        nextQuestionBtn.textContent =
          preguntaActual === preguntas.length - 1
            ? "Ver resultado"
            : "Siguiente";
      });

      quizOptions.appendChild(boton);
    });
  }

  function mostrarResultado() {
    cuestionarioTerminado = true;

    quizProgress.textContent = "Cuestionario terminado";
    quizQuestion.textContent = "¡Terminaste el cuestionario!";
    quizOptions.replaceChildren();
    quizFeedback.textContent = "";

    quizResult.textContent =
      `Tu resultado es ${puntos} de ${preguntas.length} respuestas correctas.`;

    if (puntos === preguntas.length) {
      quizFeedback.textContent =
        "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (puntos >= 2) {
      quizFeedback.textContent =
        "¡Buen trabajo! Repasa las secciones para reforzar lo aprendido.";
    } else {
      quizFeedback.textContent =
        "Puedes volver a revisar la información y repetir el cuestionario.";
    }

    nextQuestionBtn.textContent = "Volver a intentar";
  }

  nextQuestionBtn.addEventListener("click", () => {
    if (cuestionarioTerminado) {
      preguntaActual = 0;
      puntos = 0;
      mostrarPregunta();
      return;
    }

    if (!respondida) {
      quizFeedback.textContent =
        "Selecciona una respuesta antes de continuar.";
      return;
    }

    if (preguntaActual < preguntas.length - 1) {
      preguntaActual++;
      mostrarPregunta();
    } else {
      mostrarResultado();
    }
  });

  mostrarPregunta();

  // ==============================
  // CHATBOT EDUCATIVO
  // ==============================

  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const clearChat = document.getElementById("clearChat");
  const sendBtn = document.getElementById("sendBtn");

  function agregarMensaje(texto, tipo) {
    const mensaje = document.createElement("p");

    mensaje.className = `mensaje ${tipo}`;
    mensaje.textContent = texto;

    chatBox.appendChild(mensaje);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function obtenerRespuesta(pregunta) {
    const texto = pregunta
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      texto.includes("hola") ||
      texto.includes("buenas") ||
      texto.includes("saludos")
    ) {
      return "¡Hola! Bienvenido a TuEspacioSeguro. Puedes preguntarme sobre anticonceptivos, ITS, prevención, adolescencia o consentimiento.";
    }

    if (
      texto.includes("condon") ||
      texto.includes("preservativo")
    ) {
      return "El condón es un método de barrera que ayuda a prevenir embarazos y reduce el riesgo de muchas ITS cuando se usa correctamente en cada relación sexual. Revisa la fecha de caducidad y las instrucciones del producto.";
    }

    if (
      texto.includes("anticonceptivo") ||
      texto.includes("pastilla") ||
      texto.includes("implante") ||
      texto.includes("inyeccion") ||
      texto.includes("diu") ||
      texto.includes("metodo")
    ) {
      return "Existen métodos de barrera, hormonales y de larga duración, como el implante y el DIU. Su eficacia y características varían. Los métodos hormonales y el DIU no protegen contra las ITS; el personal de salud puede ayudarte a conocer tus opciones.";
    }

    if (
      texto.includes("emergencia") ||
      texto.includes("se rompio el condon") ||
      texto.includes("sin proteccion")
    ) {
      return "La anticoncepción de emergencia puede reducir el riesgo de embarazo después de una relación sin protección o una falla del método. Busca orientación médica o farmacéutica cuanto antes, ya que las opciones tienen distintos plazos de uso. No protege contra las ITS.";
    }

    if (
      texto.includes("its") ||
      texto.includes("infeccion") ||
      texto.includes("vih") ||
      texto.includes("sifilis") ||
      texto.includes("gonorrea") ||
      texto.includes("clamidia") ||
      texto.includes("vph")
    ) {
      return "Las ITS incluyen el VIH, el VPH, la sífilis, la gonorrea y la clamidia, entre otras. Algunas no presentan síntomas. El condón reduce el riesgo de muchas ITS, y las pruebas y la atención médica permiten detectarlas y tratarlas cuando corresponde.";
    }

    if (
      texto.includes("prevenir") ||
      texto.includes("prevencion") ||
      texto.includes("proteger") ||
      texto.includes("cuidarme")
    ) {
      return "Para cuidar tu salud, busca información confiable, conoce los métodos anticonceptivos, usa correctamente el condón para reducir el riesgo de muchas ITS y consulta al personal de salud sobre pruebas y vacunas. Las decisiones deben tomarse sin presión.";
    }

    if (
      texto.includes("embarazo") ||
      texto.includes("quedar embarazada")
    ) {
      return "El embarazo puede prevenirse mediante distintos métodos anticonceptivos. La elección depende de las necesidades y circunstancias de cada persona. Si hubo una relación sin protección, busca orientación cuanto antes sobre anticoncepción de emergencia.";
    }

    if (
      texto.includes("consentimiento") ||
      texto.includes("presion") ||
      texto.includes("obligar") ||
      texto.includes("violencia") ||
      texto.includes("no quiero")
    ) {
      return "El consentimiento debe ser libre, informado y sin presiones. Nadie tiene derecho a obligarte, amenazarte o manipularte. Puedes cambiar de opinión en cualquier momento. Si te sientes en peligro, busca ayuda de una persona adulta de confianza o de los servicios de emergencia.";
    }

    if (
      texto.includes("adolescencia") ||
      texto.includes("pubertad") ||
      texto.includes("cambios") ||
      texto.includes("menstruacion") ||
      texto.includes("regla")
    ) {
      return "Durante la adolescencia pueden presentarse cambios físicos, hormonales y emocionales. Cada persona se desarrolla a su propio ritmo. Si tienes dudas o algún cambio te preocupa, puedes consultar a un profesional de salud.";
    }

    if (
      texto.includes("sintoma") ||
      texto.includes("dolor") ||
      texto.includes("medico") ||
      texto.includes("doctor")
    ) {
      return "No puedo diagnosticar síntomas por chat. Si tienes molestias, preocupación por una posible ITS o una situación de riesgo, consulta a un profesional de salud. Algunas infecciones no presentan síntomas y pueden requerir pruebas.";
    }

    if (
      texto.includes("mito") ||
      texto.includes("realidad")
    ) {
      return "Un mito común es que todas las ITS producen síntomas. La realidad es que algunas pueden pasar inadvertidas. Por eso son importantes la prevención, las pruebas cuando corresponden y la orientación médica.";
    }

    return "Puedo ayudarte con información general sobre métodos anticonceptivos, ITS, prevención, consentimiento y cambios en la adolescencia. Intenta hacer tu pregunta sobre uno de esos temas. Para una situación médica personal, consulta a un profesional de salud.";
  }

  function enviarPregunta(pregunta) {
    const texto = pregunta.trim();

    if (!texto) return;

    agregarMensaje(texto, "usuario");
    agregarMensaje(obtenerRespuesta(texto), "bot");
  }

  chatForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    enviarPregunta(userInput.value);
    userInput.value = "";
    userInput.focus();
  });

  document.querySelectorAll(".quick-topic").forEach((boton) => {
    boton.addEventListener("click", () => {
      enviarPregunta(boton.dataset.question || boton.textContent);
    });
  });

  clearChat.addEventListener("click", () => {
    chatBox.replaceChildren();

    agregarMensaje(
      "¡Hola! Soy el asistente de TuEspacioSeguro. ¿Sobre qué tema te gustaría aprender?",
      "bot"
    );

    userInput.value = "";
    userInput.focus();
  });
});