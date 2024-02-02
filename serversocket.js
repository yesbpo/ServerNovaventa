const fs = require('fs');
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
// Ruta al directorio de Let's Encrypt
const letsEncryptDir = '/etc/letsencrypt/live/novaventa.appcenteryes.com/';

// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync(`${letsEncryptDir}privkey.pem`, 'utf8');
const certificate = fs.readFileSync(`${letsEncryptDir}cert.pem`, 'utf8');
const ca = fs.readFileSync(`${letsEncryptDir}chain.pem`, 'utf8'); // Puede ser necesario incluir el archivo chain.pem

const credentials = { key: privateKey, cert: certificate, ca: ca };

  // Crea un servidor HTTPS
  const httpsServer = https.createServer(credentials, app);

  // Configura Socket.IO para trabajar con el servidor HTTPS
  const io = socketIO(httpsServer);
  app.use(cors());
  const dbConfig = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
  };
  const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();
  // Configura una ruta simple para verificar que el servidor funciona
  app.get('/socket.io/', (req, res) => {
    res.send('Servidor de Socket.IO con HTTPS funcionando');
  });

  // Manejo de conexiones de Socket.IO
  io.of('/socket.io/').on('connection', (socket) => {
  console.log('Un cliente se ha conectado a la ruta de Socket.IO');
  socket.on('message', (data)=>{
  
  console.log('Mensaje recibido:', data);

  // Guarda la información en la tabla 'Mensajes'
  const query = 'INSERT INTO Mensaje (content, type_comunication, status, number, timestamp, type_message, idMessage) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [data.content, data.type_comunication, data.status , data.number, data.timestamp, data.type_message, data.idMessage ]; // Ajusta esto según la estructura de tu tabla

  promisePool.query(query, values)
    .then((result) => {
      console.log('Mensaje guardado en la base de datos:', result);
      const fechaActual = new Date();
    const options = { timeZone: 'America/Bogota', hour12: false };
          const fechaInicio = new Date(fechaActual);
    fechaInicio.setHours(fechaInicio.getHours() - 24);
 
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
 
  promisePool.query('SELECT * FROM Mensaje WHERE timestamp >= ? AND timestamp <= ?' , [fechaInicioString, fechaFinString])
  .then(([rows, fields]) => {
    socket.emit('tablaData', rows);
  })
  .catch((err) => {
    console.error('Error al obtener datos de la tabla:', err);
  });
    })
    .catch((err) => {
      console.error('Error al guardar el mensaje en la base de datos:', err);
    })})
    const fechaActual = new Date();
    const options = { timeZone: 'America/Bogota', hour12: false };
          const fechaInicio = new Date(fechaActual);
    fechaInicio.setHours(fechaInicio.getHours() - 24);
 
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
 
  promisePool.query('SELECT * FROM Mensaje WHERE timestamp >= ? AND timestamp <= ?' , [fechaInicioString, fechaFinString])
  .then(([rows, fields]) => {
    socket.emit('tablaData', rows);
  })
  .catch((err) => {
    console.error('Error al obtener datos de la tabla:', err);
  });
  
});  // Inicia el servidor en el puerto 3000 (o el que desees)
const PORT = 3050;
httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en el puerto ${PORT}`);
});