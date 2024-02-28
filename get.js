//sdghdgjgfjfhj
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
const socketIo = require('socket.io');
const socket = require('socket.io-client');

const app = express();
const port = 8080;
const multer = require('multer');
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Reemplaza con tu dominio
    methods: ["GET", "POST"]
  }
});
const apiUrl = `https://api.gupshup.io/sm/api/v1/template/list/${process.env.APPNAME}`;
const apiUrlenvio = 'https://api.gupshup.io/sm/api/v1/msg';
const apiKey = 'thpuawjbidnbbbfrp9bw7qg03eci6rdz';
const apiUrluser = `https://api.gupshup.io/sm/api/v1/users/${process.env.APPNAME}`;
const apiUrlPartnertoken = 'https://partner.gupshup.io/partner/account/login';
const socketclient = socket(process.env.BASE+'/socket.io/')
app.use(cors({ origin: '*' }));
// conexion crud base de datos
app.options('/w/crear-datos', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir todos los orígenes (No recomendado en producción)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
const directorioCargas =   path.join(__dirname, '..', 'uploads'); // Carpeta para almacenar los archivos cargados

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directorioCargas);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Puedes ajustar la lógica del nombre de archivo según tus necesidades
  },
});

const upload = multer({ storage: storage });

// Ruta para manejar la carga de archivos desde el cliente
app.post('/w/subir-archivo', upload.single('archivo'), (req, res) => {
  // Aquí deberías generar la URL del archivo y enviarla como respuesta al cliente
  const urlArchivo = `/w/uploads/${req.file.filename}`;
  res.json({ url: urlArchivo });
});


// Ruta para servir los archivos estáticos
app.use('/w/uploads', express.static(directorioCargas));



// Ruta para recibir eventos del webhook
app.all('/w/api/index', async (req, res) => {
 
  const userAgent = req.get('User-Agent');
  // Verifica si la solicitud es del User-Agent específico
  if (userAgent) {
    try {
      var data = req.body;
      await processAsync(data);
      const fechaHoraActualColombia = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

// Parsea la fecha y hora actual de Colombia
const fechaHoraActualColombiaObj = new Date(fechaHoraActualColombia);

// Ajusta la hora a las 18:00:00 (6 PM) en la zona horaria de Colombia
fechaHoraActualColombiaObj.setHours(13, 0, 0);
        if(new Date(timestamp) >= new Date(fechaHoraActualColombiaObj)){
          res.send('Nuestos horarios de atención son de 8am a 6pm')
        } 
      


      const fechaActual = new Date();
const options = { timeZone: 'America/Bogota', hour12: false };
const anio = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
const mes = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
const dia = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
const hora = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
const minutos = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
const segundos = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
      const number = data.payload.source || data.payload.destination;
      const content = data.payload.payload.text || data.payload.payload.url ;
      const type_comunication = data.type;
      const status = data.payload.type || 'null';
      const timestamp = `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
      const type_message = data.payload.type;
      const idMessage = data.payload.gsId || data.payload.id ;
       //condicional para determinar si el idMessage ya existe
       const mensaje = {
        content, type_comunication, status, number, timestamp, type_message, idMessage
      };
      
      const enviarmensaje = (mensaje) => {
        console.log('entrando a enviar el mensaje', mensaje)
        socketclient.emit('message' , mensaje ,(respuesta) => {
        console.log(respuesta)})}
        if(mensaje.type_comunication == 'message'){
        enviarmensaje(mensaje)}
      try {
        
        
      
        const response = await fetch(process.env.BASE_DB+'/guardar-mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensaje),
      });
    
      if (!response.ok) {
        console.error('Error en la solicitud:', mensaje);
        throw new Error('Error en la solicitud');
      }
      const chateje = data.payload.source || data.payload.destination
      const responseChatExistente = await fetch(`${process.env.BASE_DB}/obtener-chat-id?idChat2=${chateje}`)
      const chats = await responseChatExistente.json();
     
      crearConversacion()
      async function crearConversacion (){
        
        

        const fechaActual = new Date();
const options = { timeZone: 'America/Bogota', hour12: false };
 const fechaInicio = new Date(fechaActual);
 fechaInicio.setMinutes(fechaInicio.getSeconds() - 2);
 
 // Formatear la fecha de inicio
 const anioInicio = fechaInicio.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
 const mesInicio = fechaInicio.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
 const diaInicio = fechaInicio.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
 const horaInicio = fechaInicio.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
 const minutosInicio = fechaInicio.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
 const segundosInicio = fechaInicio.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
 
 const fechaInicioString = `${anioInicio}-${mesInicio}-${diaInicio} ${horaInicio}:${minutosInicio}:${segundosInicio}`;
 
 // Formatear la fecha actual
 const anioFin = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
 const mesFin = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
 const diaFin = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
 const horaFin = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
 const minutosFin = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
 const segundosFin = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
 
 const fechaFinString = `${anioFin}-${mesFin}-${diaFin} ${horaFin}:${minutosFin}:${segundosFin}`;
       const response = await fetch(`${process.env.BASE_DB}/obtener-mensajes-por-fecha?fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           // Agrega cualquier otra cabecera que sea necesaria, como token de autorización, si es aplicable
         },
       });
   
       if (!response.ok) {
         throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
       }
       let constidmsj=[] ;
       const mensajes = await response.json();
       Object.values(mensajes)[0].forEach( async element => {
        
         
        const chateje = element.number;
        const responseUsuarios = await fetch(process.env.BASE_DB+'/obtener-usuarios');  
      const responseChatExistente = await fetch(`${process.env.BASE_DB}/obtener-chat-id?idChat2=${chateje}`)
      if(!responseChatExistente){

      }
      try{
        console.log('entrante')
        const responseChatExistente = await fetch(`${process.env.BASE_DB}/obtener-chat-id?idChat2=${element.number}`);
        const chats = await responseChatExistente.json();
        const responseUsuarios = await fetch(process.env.BASE_DB+'/obtener-usuarios');
        const usuarios = await responseUsuarios.json();   
        const usuariosActivos = usuarios.filter((usuario) => usuario.session === 'Activo' && usuario.type_user ==='Asesor' || usuario.session === 'Activo' && usuario.type_user ==='Asesor1');
        const idsUactivos = usuariosActivos.map(objeto => objeto.id);
        const nuevoUserId = idsUactivos[Math.floor(Math.random() * idsUactivos.length)];
        const idChat2 = element.number
        console.log(chats[0].userId)
        if(chats[0].userId == 0 && element.type_comunication == 'message' ){
        const response = await fetch(process.env.BASE_DB+'/actualizar-usuario-chat', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({idChat2, nuevoUserId}),
        });
      }
      }catch{}
      console.log('ids',constidmsj)
      const chats = await responseChatExistente.json();
      const usuariosC = await responseUsuarios.json();
      if(chats ){
        const nameuser = usuariosC.find(user => user.id === chats[0].userId).complete_name
             
        const conver = {
          idchat: chats[0].idChat2,
          asesor: nameuser,
          conversacion: "[" + element.timestamp  + (element.status === 'text' ? 'cliente: ' : nameuser + ': ') + ' ' + element.content + "]",
          numero: element.idMessage,
          calificacion: chats[0].status,
          fecha_ingreso: new Date(chats[0].receivedDate).toISOString().slice(0, 19).replace('T', ' '),
          fecha_ultimagestion: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
          userid: chats[0].userId
        }
        try {

          const response = await fetch(process.env.BASE_DB+'/insertar-conversacion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(conver)
          });
    
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          
          const data = await response.json();
          
        } catch (error) {
          console.error('Error durante la solicitud:', error.message);
        }}

    });
       

     
      }
      
      if(data.type === 'message'){

        singuardar()
        if(chats.error === undefined){if( chats[0].status === 'closed' || chats[0].status === 'expiredbyasesor'|| chats[0].status === 'expiredbyclient' ){
          const fechaActual = new Date();
          const options = { timeZone: 'America/Bogota', hour12: false };
          const anio = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
          const mes = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
          const dia = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
          const hora = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
          const minutos = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
          const segundos = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });  
          const data1 = {
            idChat2: chats[0].idChat2,
            resolved: false,
            status: 'pending',
            userId: 0,
            receivedDate: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
          };
          const response = await fetch(process.env.BASE_DB+'/crear-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data1),
          });  
          if (!response.ok) {
                  
          }
          
        }}
          
          async function engestionSinResolver(){

            if(chats.error === undefined){  
              if(chats[0].status === 'in progress' || chats[0].status ==='pending'){
              try {
                
                const idChat2 = chats[0].idChat2; // Reemplaza 'tu_id_chat2' con el valor real que deseas actualizar
                const resolvedValue = false; // Reemplaza 'nuevo_valor_resolved' con el nuevo valor para 'resolved'
              
                const response = await fetch(`${process.env.BASE_DB}/actualizar-chat/${idChat2}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ resolved: resolvedValue }),
                });
              
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
              
                const data = await response.json();
                
              } catch (error) {
                console.error('Error al actualizar el chat:', error);
              }
              
            }}
            
            if(chats.error === 'Chat no encontrado'){singuardar()}
          }
          
          async function singuardar (){
            
          if(chats.error === 'Chat no encontrado'){
            const fechaActual = new Date();
            const options = { timeZone: 'America/Bogota', hour12: false };
            const anio = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
            const mes = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
            const dia = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
            const hora = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
            const minutos = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
            const segundos = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });  
            const data5 = {
               assignedDate: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
               receivedDate: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
               resolved: false,
               status: 'pending',
               userId: 0,
               idChat2: data.payload.source,
               

             };
             const response = await fetch(process.env.BASE_DB+'/crear-chat', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(data5),
             });  
             if (!response.ok) {
               console.log('no exito')       
             }
             
             const responseData = await response.json();
              
             
          }
          if(chats.error === undefined){engestionSinResolver() }
          
         const responseData = await response.json();
        
      }}
      //chats no creados
      
      // Manejar la respuesta según tus necesidades
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
      // Manejar el error según tus necesidades
      const idmessageTemplate = data.payload.gsId || data.payload.id ;; // Reemplaza con el valor correcto
      const nuevoStatus = data.payload.type;

      const respnseweb = await fetch(process.env.BASE_DB+`/actualizar-status-template/${idmessageTemplate}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json'
           // Puedes agregar más encabezados según sea necesario
         },
        body: JSON.stringify({ status: nuevoStatus })
         
       })
       if (!respnseweb.ok) {
        console.log('no exitoso')       
      }
      
      const respnse1 = await respnseweb.json();
    
      } catch (error) {
      // Maneja cualquier error durante el procesamiento asíncrono
  
      res.status(500).send('Error interno del servidor.');
    }
    } else {
     //La solicitud no proviene de Gupshup, responde con un error
    res.status(403).send('Acceso no autorizado.');
    }
  
     //obtener mensajes
     const fechaActual = new Date();
const options = { timeZone: 'America/Bogota', hour12: false };
     const fechaInicio = new Date(fechaActual);
     fechaInicio.setMinutes(fechaInicio.getMinutes() - 5);
     
     // Formatear la fecha de inicio
     const anioInicio = fechaInicio.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
     const mesInicio = fechaInicio.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
     const diaInicio = fechaInicio.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
     const horaInicio = fechaInicio.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
     const minutosInicio = fechaInicio.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
     const segundosInicio = fechaInicio.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
     
     const fechaInicioString = `${anioInicio}-${mesInicio}-${diaInicio} ${horaInicio}:${minutosInicio}:${segundosInicio}`;
     
     // Formatear la fecha actual
     const anioFin = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
     const mesFin = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
     const diaFin = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
     const horaFin = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
     const minutosFin = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
     const segundosFin = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
     
     const fechaFinString = `${anioFin}-${mesFin}-${diaFin} ${horaFin}:${minutosFin}:${segundosFin}`;
           const response = await fetch(`${process.env.BASE_DB}/obtener-mensajes-por-fecha?fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`, {
             method: 'GET',
             headers: {
               'Content-Type': 'application/json',
               // Agrega cualquier otra cabecera que sea necesaria, como token de autorización, si es aplicable
             },
           });
       
           if (!response.ok) {
             throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
           }
       
           const mensajes = await response.json();
           console.log(Object.values(mensajes))
           // Filtra solo los usuarios activos
           const mensajesEntrantes = Object.values(mensajes)[0].filter(mensaje=> mensaje.type_comunication=='message')
           const numerosUnicos = [...new Set(mensajesEntrantes.map((mensaje) => mensaje.number))];
           
      async function normalizarNumero(numero) {
     
       
        const numeroLimpio = numero.replace(/\D/g, '');
        // Si el número tiene 10 dígitos, agregar el prefijo '57'
        const numeroNormalizado = numeroLimpio.length === 10 ? '57' + numero : numero;
       
       
        return numeroNormalizado;
      }
      const existentes = await fetch(process.env.BASE_DB+'/obtener-chats');
      let chatsvalidados =[];
      
      chatsvalidados = await existentes.json();
      
      try {
        
        const fechaActual = new Date();
        const options = { timeZone: 'America/Bogota', hour12: false };
              const fechaInicio = new Date(fechaActual);
        fechaInicio.setHours(fechaInicio.getHours() - 1);
        
        // Formatear la fecha de inicio
        const anioInicio = fechaInicio.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
        const mesInicio = fechaInicio.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
        const diaInicio = fechaInicio.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
        const horaInicio = fechaInicio.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
        const minutosInicio = fechaInicio.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
        const segundosInicio = fechaInicio.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
        
        const fechaInicioString = `${anioInicio}-${mesInicio}-${diaInicio} ${horaInicio}:${minutosInicio}:${segundosInicio}`;
        
        // Formatear la fecha actual
        const anioFin = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
        const mesFin = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
        const diaFin = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
        const horaFin = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
        const minutosFin = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
        const segundosFin = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
        
        const fechaFinString = `${anioFin}-${mesFin}-${diaFin} ${horaFin}:${minutosFin}:${segundosFin}`;
        
     //         const responsemensajes = await fetch(process.env.NEXT_PUBLIC_BASE_DB+`/obtener-mensajes-por-fecha?fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`);

              const response = await fetch(process.env.BASE_DB+`/obtener-mensajes-por-fecha?fechaInicio=${fechaInicioString}&fechaFin=${fechaFinString}`);
        if (!response.ok) { 
        }
     //   const mensajesultimodia = await responsemensajes.json();
        const chatsExistentes = await response.json();
       // console.log(mensajesultdia)
       // const mensajesultdia = mensajesultimodia.map(m => {
       //   if (m.number && m.type_comunication == 'message') {
       //     console.log('ingresa')
       //     return {
       //       number: m.number,
       //       type_comunication: m.type_comunication
       //     };
       //     
       //   }
       //   return null; // O cualquier valor que prefieras para los objetos que no cumplen la condición
       // }).filter(Boolean)
       // const numchatclient = chatsExistentes.map(c => c.idChat2)
       // const maxLength = Math.max(mensajesultdia.length, numchatclient.length);

        // Realizar la resta elemento por elemento
       // const rexpclient = [];
        //for (let i = 0; i < maxLength; i++) {
          //console.log('ingresa')
          //const mensaje = mensajesultdia[i] ? mensajesultdia[i].number : 0;
          //const numchat = numchatclient[i] ? numchatclient[i] : 0;
          //rexpclient.push({
           // idChat2: numchat,
          //  resultado: numchat - mensaje
         // });
        //} 
        //console.log('sddsgs',rexpclient)
        //rexpclient.forEach( async(chat)=>{
         // const requestBody = {
          //  idChat2: idChat2,
          //  nuevoEstado: nuevoEstado,
          //  nuevoUserId: nuevoUserId,
          //};
          
          // Realiza la solicitud PUT a la ruta
          //try {
          //  const response = await fetch(url, {
           //   method: 'PUT',
            //  headers: {
             //   'Content-Type': 'application/json',
             // },
             // body: JSON.stringify(requestBody),
            //});
          
         //   if (response.ok) {
          //    const data = await response.json();
           //   console.log(data);  // Maneja la respuesta según tus necesidades
           // } else {
            //  console.error('Error al realizar la solicitud:', response.status, response.statusText);
            //}
          //} catch (error) {
           // console.error('Error al realizar la solicitud:', error.message);
         // }
       // }
        //  )
        const chatsConUserId = chatsExistentes.filter(chat => chat.userId!== 0);
        const idsChatasignados = chatsConUserId.map(objeto => objeto.userId);
        const chatsSinUserId = chatsExistentes.filter(chat => chat.userId == 0 && chat.status == 'pending');
        const idsChatsinasignar = chatsSinUserId.map(objeto => objeto.userId);
        const idsChats =  idsChatasignados.concat(idsChatsinasignar);
        const chatsParaAsignar = idsChats.filter(value => value !== null && value !== 0);
        const responseUsuarios = await fetch(process.env.BASE_DB+'/obtener-usuarios');
        const usuarios = await responseUsuarios.json();   
        const usuariosActivos = usuarios.filter((usuario) => usuario.session === 'Activo' && usuario.type_user ==='Asesor'|| usuario.type_user === 'Asesor1' );
        const idsUactivos = usuariosActivos.map(objeto => objeto.id);
        var frecuenciaNumeros = {};
        chatsParaAsignar.forEach(numero => {
        frecuenciaNumeros[numero] = (frecuenciaNumeros[numero] || 0) + 1;
        });
        if (chatsParaAsignar.length === 0) {
        elementoSeleccionado = idsUactivos[Math.floor(Math.random() * idsUactivos.length)];
        }
        // Encuentra el valor mínimo en las frecuencias
      
      
      var elementoSeleccionado;
      // Verifica si chatsSinUserId es un array o no
if (chatsSinUserId.length>1) { 
  
        chatsSinUserId.forEach(async(chat)=>{
          async function actualizarUsuarioChat(idChat2, nuevoUserId) {
            try {
              var valoresFrecuencia = Object.keys(frecuenciaNumeros).map(Number);
        var minimoValorFrecuencia = Math.min(...valoresFrecuencia);

        // Obtén las frecuencias del valor mínimo
        var frecuenciasMinimas = frecuenciaNumeros[minimoValorFrecuencia];
        
        // Si hay más de una frecuencia mínima, selecciona un valor al azar
        let elementosSeleccionados = [];
        if (frecuenciasMinimas > 1) {
        for (const numero in frecuenciaNumeros) {
        if (frecuenciaNumeros[numero] === frecuenciasMinimas) {
            elementosSeleccionados.push(Number(numero));
            
        }
        }
        
        elementosSeleccionados = [...new Set(elementosSeleccionados.concat(idsUactivos))];
        elementosSeleccionados = elementosSeleccionados.filter((valor) => idsUactivos.includes(valor))
          var indiceAleatorio = Math.floor(Math.random() * elementosSeleccionados.length);
        elementoSeleccionado = elementosSeleccionados[indiceAleatorio];
        } else {
      elementoSeleccionado = minimoValorFrecuencia;
      }
        const response = await fetch(process.env.BASE_DB+'/actualizar-usuario-chat', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idChat2, nuevoUserId}),
              });
          
              if (!response.ok) {
              }
              
              const resultado = await response.json();
              return resultado;
            } catch (error) {
  
              // Puedes lanzar el error nuevamente o manejarlo según tus necesidades
              throw error;
            }
            
          }
          
          // Uso de la función
          const idChat2 = chat.idChat2;// Reemplaza con el idChat2 correcto
          const nuevoUserId = idsUactivos[Math.floor(Math.random() * idsUactivos.length)]; // Reemplaza con el nuevo valor de userId
          
          try {
        
            const resultadoActualizacion = await actualizarUsuarioChat(idChat2, nuevoUserId);

            // Aquí puedes manipular la información del resultado según tus necesidades
          } catch (error) {
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario
  
          }
        }
        )
    }else {
    // Lógica para un solo elemento en chatsSinUserId
  

    try{
      
    // Lógica para un solo elemento
    var indiceAleatorio = Math.floor(Math.random() * idsUactivos.length);
    elementoSeleccionado = idsUactivos[indiceAleatorio];
    
    const response = await fetch(process.env.BASE_DB+'/actualizar-usuario-chat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idChat2: chatsSinUserId[0].idChat2, nuevoUserId: elementoSeleccionado }),
    });

    if (!response.ok) {
      console.log('error')
    }

    const resultado = await response.json();
    

    // Aquí puedes manipular la información del resultado según tus necesidades
  } catch (error) {
  
    // Puedes lanzar el error nuevamente o manejarlo según tus necesidades
    throw error;
  }
}
       //obtener usuarios activos
        try {
          const response = await fetch(process.env.BASE_DB+'/obtener-usuarios', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Agrega cualquier otra cabecera que sea necesaria, como token de autorización, si es aplicable
            },
          });
          if (!response.ok) {
                      }
          const usuarios = await response.json();       
          // Filtra solo los usuarios activos
          const usuariosActivos = usuarios.filter((usuario) => usuario.session === 'Activo');
   
        } catch (error) {
  
          // Maneja el error según tus necesidades
        }

      }catch (error) {

      }
      const chatscreados = Array.isArray(chatsvalidados) ? chatsvalidados.map(chat => chat.idChat2) : [];
      var chatsparacrear = numerosUnicos.map(function (elemento, indice) {
        // Verificar si el índice existe en array2
        
        if (indice < chatscreados.length) {
            return elemento - chatscreados[indice];
        } else {
            // Si el índice no existe en array2, simplemente devolver el elemento de array1
            return elemento;
        }
    });
      //crear chats
      for (const chatparacrear of chatsparacrear) {
        const numeroNormalizado = await normalizarNumero(chatparacrear);
        const fechaActual = new Date();
            const options = { timeZone: 'America/Bogota', hour12: false };
            const anio = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
            const mes = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
            const dia = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
            const hora = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
            const minutos = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
            const segundos = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });  

       
          const data2 = {
            // Asigna el valor actual del contador y luego incrementa
           idChat2:numeroNormalizado ,
           resolved: false,
           status: "pending",
           userId: 0,
           receivedDate: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
           
         };
          const response2 = await fetch(process.env.BASE_DB+'/crear-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data2),
        });
        if (!response2.ok) {

          console.log('no exito crear chat1')       
        
        const responseData2 = await response2.json();

        }
      }
       
    
     
      //validar chats existentes para no repetirlos
      async function verificarChatExistente(numero) {
      const idChat2 = numero; // Reemplaza esto con el valor real que deseas buscar
      try {
      const responseChatExistente = await fetch(`${process.env.BASE_DB}/obtener-chat-id?idChat2=${idChat2}`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
    },
    });
  if (!responseChatExistente.ok) {
    
  }
  const chatsExistentes = await responseChatExistente.json();
  
  return chatsExistentes
  } catch (error) {
  
  }  
}
// Función para distribuir mensajes equitativamente entre usuarios 
      //obtener chats
      try {
        const response = await fetch(process.env.BASE_DB+'/obtener-chats');
        if (!response.ok) { 
        }
        const chatsExistentes = await response.json();
        const chatsConUserId = chatsExistentes.filter(chat => chat.userId!== 0);
        const idsChatasignados = chatsConUserId.map(objeto => objeto.userId);
        const chatsSinUserId = chatsExistentes.filter(chat => chat.userId == 0 && chat.status == 'pending');
        const idsChatsinasignar = chatsSinUserId.map(objeto => objeto.userId);
        const idsChats =  idsChatasignados.concat(idsChatsinasignar);
        const chatsParaAsignar = idsChats.filter(value => value !== null && value !== 0);
        const responseUsuarios = await fetch(process.env.BASE_DB+'/obtener-usuarios');
        const usuarios = await responseUsuarios.json();   
        const usuariosActivos = usuarios.filter((usuario) => usuario.session === 'Activo' && usuario.type_user ==='Asesor' || usuario.type_user ==='Asesor1');
        const idsUactivos = usuariosActivos.map(objeto => objeto.id);
        var frecuenciaNumeros = {};
        chatsParaAsignar.forEach(numero => {
        frecuenciaNumeros[numero] = (frecuenciaNumeros[numero] || 0) + 1;
        elementoSeleccionado = idsUactivos[Math.floor(Math.random() * idsUactivos.length)];
        });
        if (chatsParaAsignar.length === 0) {
        elementoSeleccionado = idsUactivos[Math.floor(Math.random() * idsUactivos.length)];
        }
        // Encuentra el valor mínimo en las frecuencias
      
      
      var elementoSeleccionado;
      // Verifica si chatsSinUserId es un array o no
if (chatsSinUserId.length>1) { 
  
        chatsSinUserId.forEach(async(chat)=>{
          async function actualizarUsuarioChat(idChat2, nuevoUserId) {
            try {
              var valoresFrecuencia = Object.keys(frecuenciaNumeros).map(Number);
        var minimoValorFrecuencia = Math.min(...valoresFrecuencia);

        // Obtén las frecuencias del valor mínimo
        var frecuenciasMinimas = frecuenciaNumeros[minimoValorFrecuencia];
      
        // Si hay más de una frecuencia mínima, selecciona un valor al azar
        let elementosSeleccionados = [];
        if (frecuenciasMinimas > 1) {
        for (const numero in frecuenciaNumeros) {
        if (frecuenciaNumeros[numero] === frecuenciasMinimas) {
            elementosSeleccionados.push(Number(numero));
            
        }
        }
        
        elementosSeleccionados = [...new Set(elementosSeleccionados.concat(idsUactivos))];
        elementosSeleccionados = elementosSeleccionados.filter((valor) => idsUactivos.includes(valor))
          var indiceAleatorio = Math.floor(Math.random() * elementosSeleccionados.length);
        elementoSeleccionado = elementosSeleccionados[indiceAleatorio];
        } else {
      elementoSeleccionado = minimoValorFrecuencia;
      }
        const response = await fetch(process.env.BASE_DB+'/actualizar-usuario-chat', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idChat2, nuevoUserId }),
              });
          
              if (!response.ok) {
              }
              
              const resultado = await response.json();
              return resultado;
            } catch (error) {
  
              // Puedes lanzar el error nuevamente o manejarlo según tus necesidades
              throw error;
            }
            
          }

          // Uso de la función
          const idChat2 = chat.idChat2;// Reemplaza con el idChat2 correcto
          const nuevoUserId = idsUactivos[Math.floor(Math.random() * idsUactivos.length)]; // Reemplaza con el nuevo valor de userId
          
          try {
            
            const resultadoActualizacion = await actualizarUsuarioChat(idChat2, nuevoUserId);
            
            // Aquí puedes manipular la información del resultado según tus necesidades
          } catch (error) {
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario
  
          }
        }
        )
    }else {
    // Lógica para un solo elemento en chatsSinUserId
  

    try{
      
    // Lógica para un solo elemento
    var indiceAleatorio = Math.floor(Math.random() * idsUactivos.length);
    elementoSeleccionado = idsUactivos[indiceAleatorio];
    
    const response = await fetch(process.env.BASE_DB+'/actualizar-usuario-chat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idChat2: chatsSinUserId[0].idChat2, nuevoUserId: elementoSeleccionado }),
    });

    if (!response.ok) {
      console.log('error')
    }

    const resultado = await response.json();
    

    // Aquí puedes manipular la información del resultado según tus necesidades
  } catch (error) {
  
    // Puedes lanzar el error nuevamente o manejarlo según tus necesidades
    throw error;
  }
}
       //obtener usuarios activos
        try {
          const response = await fetch(process.env.BASE_DB+'/obtener-usuarios', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Agrega cualquier otra cabecera que sea necesaria, como token de autorización, si es aplicable
            },
          });
          if (!response.ok) {
                      }
          const usuarios = await response.json();       
          // Filtra solo los usuarios activos
          const usuariosActivos = usuarios.filter((usuario) => usuario.session === 'Activo');
   
        } catch (error) {
  
          // Maneja el error según tus necesidades
        }

      } catch (error) {
  
      }
      //obtener activos
     
   
  }
  

);
// Función asíncrona para procesar la solicitud
async function processAsync(datas) {
  // Implementa lógica de procesamiento asíncrono aquí
  // Puedes realizar operaciones de larga duración, como llamadas a bases de datos, envío de correos electrónicos, etc.
}
// Configuración de Socket.IO

// envio mensajes
app.post('/w/api/envios', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  try {
    const url = apiUrlenvio;
    // Obtenemos la data proporcionada por el cliente
    const clientData = req.body;
    // Construimos la solicitud a la API de Gupshup
    const formData = new URLSearchParams();
    Object.entries(clientData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'apikey': apiKey,
    };
    // Hacemos la solicitud a la API de Gupshup
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    // Manejamos la respuesta del servidor Gupshup
    if (response.ok) {
      const responseData = await response.json();
    
      // Enviamos la respuesta al cliente
      res.json(responseData);
    } else {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Ruta para realizar la solicitud y devolver la respuesta al cliente de los templates
app.get('/w/api/templates', async (req, res) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Nombres a filtrar desde el entorno
    const nombresFiltrar = process.env.TEMPLATES.split(',');

    // Filtrar las plantillas por nombres
    const plantillasFiltradas = data.templates.filter(template => nombresFiltrar.includes(template.elementName));

    res.json(plantillasFiltradas); // Devolver la respuesta al cliente
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//solicitud de usuarios activos en gupshup
app.get('/w/api/users', async (req, res) => {
  try {
    const response = await fetch(apiUrluser, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    
    res.json(data); // Devolver la respuesta al cliente
  } catch (error) {
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//generar partner token
// Ruta para manejar la petición POST
app.post('/w/partner/account/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await fetch(apiUrlPartnertoken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
  // Aquí puedes realizar acciones con los datos, como autenticación y obtención del token
    // Por ahora, simplemente respondemos con los datos recibidos
    res.json({ email, password });
  } catch (error) {
    // Manejar errores aquí
    
    res.status(500).json({ error: 'Error al realizar la solicitud' });
  }
});
// Middleware para parsear el cuerpo de la solicitud como JSON
app.use(express.json());
// Ejemplo de configuración en Express
app.use((req, res, next) => {
  // Configuración de CORS en tu servidor WebSocket
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'ALL');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//Post templates
app.post('/w/createTemplates', async (req, res) => {
  try {
    const appId = process.env.APPID; // Reemplaza con tu ID de aplicación real
    const partnerAppToken = process.env.PARTNERAPPTOKEN; // Reemplaza con tu token de partner real
    const apiUrl = `https://partner.gupshup.io/partner/app/${appId}/templates`;

    const templateData = req.body; // Los datos de la plantilla provienen del cuerpo de la solicitud

    const response = await axios.post(apiUrl, templateData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'token': partnerAppToken,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get templates
app.get('/w/gupshup-templates', async (req, res) => {
  try {
    const appId = process.env.APPID;
    const partnerAppToken = process.env.PARTNERAPPTOKEN;
    const apiUrl = `https://partner.gupshup.io/partner/app/${appId}/templates`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Connection': 'keep-alive',
        'token': partnerAppToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Gupshup templates. Status: ${response.status}`);
    }

    const data = await response.json();

    // Nombres a filtrar (puedes ajustar según tus necesidades)
    const nombresFiltrar = process.env.TEMPLATES.split(',');

    // Filtrar las plantillas por nombres
    const plantillasFiltradas = data.templates.filter(template => nombresFiltrar.includes(template.elementName));

    res.json({ status: 'success', templates: plantillasFiltradas });
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//DELETE TEMPLATES
app.delete('/w/deleteTemplate/:elementName', async (req, res) => {
  try {
    const appId = process.env.APPID;
    const partnerAppToken = process.env.PARTNERAPPTOKEN;
    const elementName = req.params.elementName;

    const apiUrl = `https://partner.gupshup.io/partner/app/${appId}/template/${elementName}?id=${elementName}`;

    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: partnerAppToken,
      },
    });

    

    res.status(response.status).json(response.data);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar el servidor
server.listen(port, () => {
  
});