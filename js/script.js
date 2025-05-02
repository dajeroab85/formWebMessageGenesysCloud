//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Variables //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var customLauncher = document.getElementById('chatForm');
var bMessengerOpened = false; // Status inicial
var url = window.location.href; // URL donde se inicia el Chat
var browserInfo='N/A'; // Informacion del navegador
var nombre;
var apellido;
var email;
var telefono;
var tipoDocumento;
var numeroDocumento;
var motivoConsulta;
var aceptoPoliticas;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Selectores para formulario /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const chatIcon = document.querySelector('.chat-icon'); // Icono de Chat
const chatForm = document.querySelector('.chat-form'); // Formulario
const minimizeIcon = document.querySelector('.minimize-icon'); // Icono de minimizar
const iniciarChatBtn = document.getElementById('custom-launcher'); // Boton disparador de conversacion
const webMessage = document.querySelector('.web-message'); // ventana provisional de Web Message
const minimizeChatBtn = document.querySelector('.minimize-chat');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chatIcon.addEventListener('click', () => {

  const isChatActive = localStorage.getItem('chatActive');

    if (isChatActive === 'true') {
        // Si la conversación está activa, abrir la ventana de Genesys
        chatIcon.style.display = 'none';
        showGenesysChat();
    } else {
        // Si no, mostrar el formulario
        chatForm.style.display = 'block';
        chatIcon.style.display = 'none';
    }
  ///////////////////////////////////////////
  
});

minimizeIcon.addEventListener('click', () => {
  chatForm.style.display = 'none';
  chatIcon.style.display = 'block';
});

// Función que se llama al hacer clic en el botón "INICIAR" del formulario
iniciarChatBtn.addEventListener('click', () => {
  chatForm.style.display = 'none';
  //chatIcon.style.display = 'none';
  console.log('LocalStorage');
  localStorage.setItem('chatActive', 'true');
  openMessenger();
});

document.addEventListener('DOMContentLoaded', function() {

  const form = document.querySelector('form');
  const customLauncher = document.getElementById('custom-launcher');
  const inputs = form.querySelectorAll('input[required], select[required]');

  // Desactivar el botón al inicio
  customLauncher.disabled = true;

  // Función para verificar si todos los campos están llenos
  function checkFormValidity() {
      // Verificar si todos los campos obligatorios
      let allFieldsFilled = true;
      
      inputs.forEach(input => {
          if (!input.value || (input.type === 'checkbox' && !input.checked)) {
              allFieldsFilled = false;
          }
      });

      // Si todos los campos están llenos, activar el botón
      customLauncher.disabled = !allFieldsFilled;
  }

  // Agregar eventos de input y change para verificar cada campo
  inputs.forEach(input => {
      input.addEventListener('input', checkFormValidity);
      input.addEventListener('change', checkFormValidity);
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SDK de Genesys web Message /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function (g, e, n, es, ys) {
	g['_genesysJs'] = e;
	g[e] = g[e] || function () {
	  (g[e].q = g[e].q || []).push(arguments)
	};
	g[e].t = 1 * new Date();
	g[e].c = es;
	ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
  })(window, 'Genesys', 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js', {
	environment: 'prod', // Este valor varía según la región donde está la organización
	deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // Asignar el valor del deploymentID
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funciones del SDK /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Suscribir al evento Messenger.ready: muestra el botón de inicio personalizado cuando Messenger esté listo
Genesys('subscribe','Messenger.ready',(e) =>{
  //customLauncher.style.display = 'block';
  browserInfo = getBrowserInfo();
});

// Suscribir al evento Database ready: Utilizado para escuchar  el envio, actualizacion y borrado de datos en el WebMessaging 
Genesys("subscribe", "Database.ready", function() {
  console.log("Database plugin is ready.");
});

// Suscribir al evento MessagingService started: Utilizado para escuchar  el envio, actualizacion y borrado de datos en el WebMessaging 
Genesys("subscribe", "MessagingService.started", function({data}){
  console.log('Evento Started')
  console.log(data)
});


// Suscribir al evento Messenger.opened: actualiza el estado de Messenger como abierto
Genesys('subscribe', 'Messenger.opened', (e) => {
  bMessengerOpened = true; // actualiza el estado a abierto
  customLauncher.style.display = 'none'; // ocultar Launcher
  localStorage.setItem('displayWindow', 'true');
  console.log(e);
});


//Suscribir al evento Messenger.closed: actualiza el estado de Messenger como cerrado
Genesys('subscribe', 'Messenger.closed', (e) => {
  bMessengerOpened = false; // actualiza el estado a cerrado
  chatIcon.style.display = 'block'; // muestra el Launcher
  localStorage.setItem('displayWindow', 'false'); // Limpiar el estado en localStorage
  console.log(e);
});

// Suscribir al evento messagesReceived y se evalua si la ventana está abierta o minimizada para enviar una notificación Audible
Genesys("subscribe", "MessagingService.messagesReceived", function({ data }) {
  obj= JSON.stringify(data);
  datos = JSON.parse(obj);
  direccion = datos.messages[0].direction;
  dispalyWindow = localStorage.getItem('displayWindow');
  console.log("Se imprime datos");
  console.log(direccion);
  if((direccion =="Outbound")&(dispalyWindow==='false')){
    playSound();
  }
});

// Suscribir al evento de limpiar conversación (Evento generado por el usuario)
Genesys("subscribe", "MessagingService.conversationCleared", function({data}){
  console.log('Clear conversation');
  console.log(data);
  localStorage.setItem('chatActive', 'false'); // Limpiar el estado en localStorage
  localStorage.setItem('displayWindow', 'false'); // Limpiar el estado de la ventana en localStorage
});

// Suscribir al evento de limpiar conversación (Evento generado por el agente)
Genesys("subscribe", "MessagingService.conversationDisconnected", function({data}){
  console.log('conversation Disconnected');
  Genesys("command", "MessagingService.clearConversation", {}, 
    function() {
    /*fulfilled callback*/
      console.log(data);
      localStorage.setItem('chatActive', 'false'); // Limpiar el estado en localStorage
      localStorage.setItem('displayWindow', 'false'); // Limpiar el estado de la ventana en localStorage
    },
    function() {
    /*rejected callback*/
  });
});


// Obtener Info del navegador
const getBrowserInfo = () => {
  var ua= navigator.userAgent, tem, 
  M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
     return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
     tem= ua.match(/\b(OPR|Edg)\/(\d+)/);
     if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
};


const playSound = ()=> {
  chatSound.play(); // Reproduce el sonido de alerta
}

// Funciones de apertura y cierre del Launch
const showGenesysChat=()=>{
  console.log('Show messenger...');
  Genesys('command', 'Messenger.open');
}

///////////////////////////////////////////////////////////////
const openMessenger = () => {
  console.log('Opening messenger...');
 
    // Capturar los valores del formulario
    nombre = document.querySelector('input[name="nombre"]').value;
    apellido = document.querySelector('input[name="apellido"]').value;
    email = document.querySelector('input[name="email"]').value;
    telefono = document.querySelector('input[name="telefono"]').value;
    motivoConsulta = document.querySelector('select[name="motivo"]').value;
    tipoDocumento = document.querySelector('select[name="tipo-id"]').value;
    numeroDocumento = document.querySelector('input[name="documento"]').value;
    aceptoPoliticas = document.querySelector('input[name="acepto"]').checked;
    nombreCompleto = nombre + " " + apellido;

    // Imprimir los valores en la consola (opcional)
    console.log("Nombre:", nombre);
    console.log("Apellido:", apellido);
    console.log("Correo:", email);
    console.log("Teléfono:", telefono);
    console.log("Motivo:", motivo);
    console.log("Tipo de ID:", tipoDocumento);
    console.log("Documento:", numeroDocumento);
    console.log("Aceptó Políticas:", aceptoPoliticas);

  //Genesys('command', 'Messenger.open');
  console.log("Atachando datos");
  // comando para adjuntar los valores a la interacciones (Valores se insertan en el participant data)
  Genesys("command", "Database.set", {
    messaging: {
      customAttributes: {
        "PageUrl": url,
        "browser": browserInfo,
        "Nombre": nombre,
        "Apellido": apellido,
        "name": nombreCompleto,
        "Email": email,
        "Telefono": telefono,
        "Tipo documento": tipoDocumento,
        "Numero documento": numeroDocumento,
        "Motivo Consulta": motivoConsulta,
        "Acepta Politicas": aceptoPoliticas 
      }
    }
  });
  console.log("datos cargados: ");
}

const closeMessenger = () => {
  console.log('Closing messenger...');
  Genesys('command', 'Messenger.close');
};

const toggleMessenger = () => {
  bMessengerOpened ? closeMessenger() : openMessenger();
};
