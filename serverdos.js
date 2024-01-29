const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());
const PORT = process.env.PORTSERVER2;
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.options(process.env.DB_ROUTE+'2'+'/crear-datos', (req, res) => {
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

const dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();



app.get(process.env.DB_ROUTE+'2'+'/obtener-mensajes-por-fecha-y-numero', async (req, res) => {
    try {
      const { fechaInicio, fechaFin, number } = req.query; // Utiliza req.query para obtener parámetros de la URL
  
      // Validar que las fechas y el número estén presentes
      if (!fechaInicio || !fechaFin || !number) {
        return res.status(400).json({ error: 'Se requieren fechas de inicio, fin y número para obtener mensajes en un rango de fechas.' });
      }
  
      // Consultar mensajes en el rango de fechas y por número
      const [result] = await promisePool.execute(
        'SELECT * FROM Mensaje WHERE timestamp >= ? AND timestamp <= ? AND number = ?',
        [fechaInicio, fechaFin, number]
      );
  
      if (result.length > 0) {
        res.json({ mensajes: result });
      } else {
        res.json({ mensajes: [], mensaje: 'No se encontraron mensajes en el rango de fechas y número especificados.' });
      }
    } catch (error) {
      console.error('Error al obtener mensajes por fecha y número en la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  app.get(process.env.DB_ROUTE+'2'+'/obtener-mensajes/:numero', async (req, res) => {
    try {
      const numero = req.params.numero;
  
      // Ejecutar la consulta SQL para obtener mensajes según el número proporcionado
      const [rows] = await promisePool.query('SELECT * FROM Mensaje WHERE number = ?', [numero]);
  
      // Enviar los mensajes obtenidos como respuesta
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los mensajes de la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  app.get(process.env.DB_ROUTE+'2'+'/consultar-chats/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Consultar chats por userId
      const [chatsResult] = await promisePool.execute(
        'SELECT * FROM Chat WHERE userId = ?',
        [userId]
      );
  
      res.json({ chats: chatsResult });
    } catch (error) {
      console.error('Error al consultar los chats por userId:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
  });