const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.options(process.env.DB_ROUTE+'/crear-datos', (req, res) => {
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

// Función para insertar datos en la base de datos

//crearsession
app.put(process.env.DB_ROUTE+'/actualizar/usuario', async (req, res) => {
  try {
    const {nuevoDato, usuario  } = req.body;
    // Realiza la actualización en la base de datos
    if (usuario !== undefined && nuevoDato !== undefined) {
      // Realiza la actualización en la base de datos
      const [result] = await promisePool.execute(
        'UPDATE User SET session = ? WHERE usuario = ?',
        [nuevoDato, usuario]
      );  
    // Verifica si se realizó la actualización correctamente
    if (result.affectedRows > 0) {
      
      res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
    } else {
      console.log('No se encontró el usuario para actualizar.');
      res.status(404).json({ error: 'Usuario no encontrado.' });
    }}
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
app.use(cors());
// Ruta para insertar datos
app.post(process.env.DB_ROUTE+'/crear-usuario', async (req, res) => {
  try {
    const { type_user, email, session, usuario, password, complete_name } = req.body;

    // Ejecutar la consulta SQL para insertar un nuevo usuario
    const [result] = await promisePool.execute(
      'INSERT INTO User (usuario, password, email, createdAt, updatedAt, session, type_user, complete_name) VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?)',
      [usuario, password, email, session, type_user, complete_name]
    );

    const nuevoUsuario = {
      id: result.insertId,
      type_user,
      createdAt: result.affectedRows === 1 ? new Date() : null,
      updatedAt: result.affectedRows === 1 ? new Date() : null,
      email,
      session,
      usuario,
      password,
      complete_name,
    };

    res.json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear el usuario en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// ruta actualizar usuario
app.post(process.env.DB_ROUTE + '/actualizar-usuario/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { type_user, email, session, usuario, password, complete_name } = req.body;

    // Construir la consulta SQL dinámicamente basada en los campos proporcionados
    let updateQuery = 'UPDATE User SET ';
    const updateValues = [];

    if (type_user) {
      updateQuery += 'type_user = ?, ';
      updateValues.push(type_user);
    }

    if (email) {
      updateQuery += 'email = ?, ';
      updateValues.push(email);
    }

    if (session) {
      updateQuery += 'session = ?, ';
      updateValues.push(session);
    }

    if (usuario) {
      updateQuery += 'usuario = ?, ';
      updateValues.push(usuario);
    }

    if (password) {
      updateQuery += 'password = ?, ';
      updateValues.push(password);
    }

    if (complete_name) {
      updateQuery += 'complete_name = ?, ';
      updateValues.push(complete_name);
    }

    // Eliminar la coma extra al final de la cadena de consulta
    updateQuery = updateQuery.slice(0, -2);

    // Agregar la condición WHERE para el id del usuario
    updateQuery += ' WHERE id = ?';
    updateValues.push(userId);

    // Ejecutar la consulta SQL para actualizar el usuario
    const [result] = await promisePool.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    } else {
      res.json({ mensaje: 'Usuario actualizado con éxito' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ruta de crear mensajes

app.use(process.env.DB_ROUTE+'*', cors());
app.get(process.env.DB_ROUTE+'/obtener-mensajes-por-fecha', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query; // Utiliza req.query para obtener parámetros de la URL

    // Validar que las fechas estén presentes
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Se requieren fechas de inicio y fin para obtener mensajes en un rango de fechas.' });
    }

    // Consultar mensajes en el rango de fechas
    const [result] = await promisePool.execute(
      'SELECT * FROM Mensaje WHERE timestamp >= ? AND timestamp <= ?',
      [fechaInicio, fechaFin]
    );

    if (result.length > 0) {
      res.json({ mensajes: result });
    } else {
      res.json({ mensajes: [], mensaje: 'No se encontraron mensajes en el rango de fechas especificado.' });
    }
  } catch (error) {
    console.error('Error al obtener mensajes por fecha en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//actualizar status template
// Agrega una nueva ruta para actualizar solo el status basado en el idmessageTemplate
app.put(process.env.DB_ROUTE + '/actualizar-status-template/:idmessageTemplate', async (req, res) => {
  try {
    const idmessageTemplate = req.params.idmessageTemplate;
    const { status } = req.body;

    // Validar que el campo 'status' esté presente
    if (!status) {
      return res.status(400).json({ error: 'Falta el campo "status" para la actualización.' });
    }

    // Verificar si existe un registro con el mismo idmessageTemplate
    const [existingResult] = await promisePool.execute(
      'SELECT * FROM Template WHERE idMessageTemplate = ?',
      [idmessageTemplate]
    );

    if (existingResult.length > 0) {
      // Actualizar solo el campo 'status'
      const [updateResult] = await promisePool.execute(
        'UPDATE Template SET status = ? WHERE idMessageTemplate = ?',
        [status, idmessageTemplate]
      );

      if (updateResult.affectedRows > 0) {
        res.json({ mensaje: 'Status actualizado con éxito', idmessageTemplate, status });
      } else {
        res.status(404).json({ error: 'No se encontró el registro para actualizar.' });
      }
    } else {
      res.status(404).json({ error: 'No se encontró el registro para actualizar.' });
    }
  } catch (error) {
    console.error('Error al actualizar el status en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post(process.env.DB_ROUTE+'/insertar-datos-template', async (req, res) => {
  try {
    
    const { idmessageTemplate, status, attachments, message, timestamp, campaign } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!idmessageTemplate || !status || !attachments || !message || !timestamp) {
      return res.status(400).json({ error: 'Faltan datos requeridos para insertar en la plantilla.' });
    }

    // Verificar si ya existe un registro con el mismo idMessageTemplate
    const [existingResult] = await promisePool.execute(
      'SELECT * FROM Template WHERE idMessageTemplate = ?',
      [idmessageTemplate]
    );

    if (existingResult.length > 0) {
      // Si ya existe, actualiza los demás datos
      const [updateResult] = await promisePool.execute(
        'UPDATE Template SET status = ?, attachments = ?, message = ?, timestamp = ? WHERE idMessageTemplate = ?',
        [status, attachments, message, timestamp,  campaign, idmessageTemplate]
      );

      if (updateResult.affectedRows > 0) {
        
        res.json({ mensaje: 'Registro actualizado con éxito', datos: { idmessageTemplate, status, attachments, message, timestamp, campaign } });
      } else {
        console.log('No se encontró el registro para actualizar.');
        res.status(404).json({ error: 'Registro no encontrado para actualizar.' });
      }
    } else {
      // Si no existe, inserta un nuevo registro
      const [insertResult] = await promisePool.execute(
        'INSERT INTO Template (idmessageTemplate, status, attachments, message, timestamp, campaign) VALUES (?, ?, ?, ?, ?, ?)',
        [idmessageTemplate, status, attachments, message || null, timestamp, campaign]
      );

      const nuevoRegistro = {
        idmessageTemplate, status, attachments, message, timestamp, campaign
      };

      res.json({ mensaje: 'Registro insertado con éxito', datos: nuevoRegistro });
    }
  } catch (error) {
    console.error('Error al insertar o actualizar en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//ruta informes de campañas
app.get(process.env.DB_ROUTE+'/generar-informe', async (req, res) => {
  try {
    const { campaign, fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen los parámetros necesarios
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos para generar el informe.' });
    }

    let query = 'SELECT * FROM Template WHERE timestamp BETWEEN ? AND ?';
    let queryParams = [fechaInicio, fechaFin];

    // Agregar el filtro de campaña si está presente
    if (campaign) {
      query += ' AND campaign = ?';
      queryParams.push(campaign);
    }

    // Consultar la base de datos para obtener informes según la campaña y el rango de fechas
    const [informes] = await promisePool.execute(query, queryParams);

    res.json({ informes });
  } catch (error) {
    console.error('Error al generar informes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// obtener mensajes por fecha y telefono
app.get(process.env.DB_ROUTE + '/obtener-mensajes-por-fecha-y-numero', async (req, res) => {
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

app.post(process.env.DB_ROUTE+'/guardar-mensajes', async (req, res) => {
  try {
    const { content, type_comunication, status, number, timestamp, type_message, idMessage } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!type_comunication || !status || !number || !timestamp || !type_message || !idMessage) {
      return res.status(400).json({ error: 'Faltan datos requeridos para guardar el mensaje.' });
    }

    // Verificar si ya existe un mensaje con el mismo idMessage
    const [existingResult] = await promisePool.execute(
      'SELECT * FROM Mensaje WHERE idMessage = ?',
      [idMessage]
    );
    
    if (existingResult.length > 0) {
      // Si ya existe, actualiza los demás datos
      const [updateResult] = await promisePool.execute(
        'UPDATE Mensaje SET type_comunication = ?, status = ?, number = ?, type_message = ?, content = COALESCE(?, content) WHERE idMessage = ?',
        [
          type_comunication,
          status,
          number,
          type_message,
          content || null,
          idMessage
        ]
      
      );

      if (updateResult.affectedRows > 0) {
        
        res.json({ mensaje: 'Mensaje actualizado con éxito', usuario: { idMessage, content, type_comunication, status, number, timestamp, type_message } });
      } else {
        console.log('No se encontró el mensaje para actualizar.');
        res.status(404).json({ error: 'Mensaje no encontrado para actualizar.' });
      }
    } else {
      // Si no existe, inserta un nuevo mensaje
      const [insertResult] = await promisePool.execute(
        'INSERT INTO Mensaje (idMessage, content, type_comunication, status, number, timestamp, type_message) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [idMessage, content || '', type_comunication, status, number, timestamp, type_message]
      );
      
      

      const nuevoMensaje = {
        idMessage, content, type_comunication, status, number, timestamp, type_message
      };

      res.json({ mensaje: 'Mensaje guardado con éxito', usuario: nuevoMensaje });
    }
  } catch (error) {
    console.error('Error al guardar o actualizar el mensaje en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});//obtener mensajes

app.get(process.env.DB_ROUTE+'/obtener-mensajes', async (req, res) => {
  try {
    // Ejecutar la consulta SQL para obtener todos los mensajes
    const [rows] = await promisePool.query('SELECT * FROM Mensaje');

    // Enviar los mensajes obtenidos como respuesta
    res.json( rows );
  } catch (error) {
    console.error('Error al obtener los mensajes de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// consultar mensajes por numero
app.get(process.env.DB_ROUTE + '/obtener-mensajes/:numero', async (req, res) => {
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
// crear chats 
app.post(process.env.DB_ROUTE+'/crear-chat', async (req, res) => {
  try {
    const chatsData = req.body;

    // Si chatsData no es una matriz, conviértelo en una matriz para manejar un solo objeto
    const chatsArray = Array.isArray(chatsData) ? chatsData : [chatsData];
        for (const chat of chatsArray) {
      const { assignedDate , receivedDate , resolved, status, userId, idChat2 } = chat;

      // Verificar si ya existe un chat con el mismo idChat2
      const [existingResult] = await promisePool.execute(
        'SELECT * FROM Chat WHERE idChat2 = ?',
        [idChat2]
      );

      if (existingResult.length > 0) {
        // Si ya existe, actualiza los demás datos
        
        await promisePool.execute(
          'UPDATE Chat SET  receivedDate = ?, resolved = ?, status = ?, userId = ? WHERE idChat2 = ?',
          [ receivedDate ,resolved, status, userId, idChat2]
        );
      } else {
        // Si no existe, inserta un nuevo chat
        await promisePool.execute(
          'INSERT INTO Chat (receivedDate, assignedDate, attendedDate, closedDate, resolved, status, userId, idChat2) VALUES ( ?, ?, null, null, ?, ?, ?, ?)',
          [assignedDate, receivedDate ,resolved, status, userId, idChat2]
        );
      }
    }

    res.json({ mensaje: 'Chats creados o actualizados con éxito' });
  } catch (error) {
    console.error('Error al crear o actualizar el chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// consulta de chats del dia actual 
app.get(process.env.DB_ROUTE + '/consultar-chats-hoy', async (req, res) => {
  try {
    // Obtener la fecha y hora actual con zona horaria
    const currentDateColombia = new Date();
    currentDateColombia.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // Establecer la fecha de inicio de hoy a las 00:00:00
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0);

    // Establecer la fecha de finalización de hoy a las 23:59:59
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);

    console.log(startOfDay, endOfDay);

    // Realizar la consulta para obtener los chats de hoy
    const [result] = await promisePool.execute(
      'SELECT * FROM Chat WHERE assignedDate >= ? AND assignedDate <= ?',
      [startOfDay, endOfDay]
    );

    res.json({ chats: result });
  } catch (error) {
    console.error('Error al consultar los chats de hoy:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// consultar chats ultima semana
app.get(process.env.DB_ROUTE + '/consultar-chats-mes', async (req, res) => {
  try {
    // Obtener la fecha y hora actual con zona horaria
    const currentDateColombia = new Date();
    currentDateColombia.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // Establecer la fecha de inicio de hoy a las 00:00:00
    const startOfDay = new Date();
    startOfDay.setDate(startOfDay.getDate()-30);

    // Establecer la fecha de finalización de hoy a las 23:59:59
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);

    console.log(startOfDay, endOfDay);

    // Realizar la consulta para obtener los chats de hoy
    const [result] = await promisePool.execute(
      'SELECT * FROM Chat WHERE assignedDate >= ? AND assignedDate <= ?',
      [startOfDay, endOfDay]
    );

    res.json({ chats: result });
  } catch (error) {
    console.error('Error al consultar los chats de hoy:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// consultar chats ultimo mes
app.get(process.env.DB_ROUTE + '/consultar-chats-semana', async (req, res) => {
  try {
    // Obtener la fecha y hora actual con zona horaria
    const currentDateColombia = new Date();
    currentDateColombia.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // Establecer la fecha de inicio de hoy a las 00:00:00
    const startOfDay = new Date();
    startOfDay.setDate(startOfDay.getDate()-7);

    // Establecer la fecha de finalización de hoy a las 23:59:59
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);

    console.log(startOfDay, endOfDay);

    // Realizar la consulta para obtener los chats de hoy
    const [result] = await promisePool.execute(
      'SELECT * FROM Chat WHERE assignedDate >= ? AND assignedDate <= ?',
      [startOfDay, endOfDay]
    );

    res.json({ chats: result });
  } catch (error) {
    console.error('Error al consultar los chats de hoy:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


//consulta por userid chats
app.get(process.env.DB_ROUTE+'/consultar-chats/:userId', async (req, res) => {
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
// consulta por status
app.get(process.env.DB_ROUTE + '/consultar_por_status', async (req, res) => {
  try {
    const status = req.query.status;

    // Consulta SQL para obtener registros por status
    const sql = 'SELECT * FROM Chat WHERE status = ?';

    // Ejecutar la consulta utilizando await
    const [results] = await promisePool.execute(sql, [status]);

    // Enviar resultados como JSON
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
//actualizar chat resolved 
app.put(process.env.DB_ROUTE+'/actualizar-chat/:idChat2', async (req, res) => {
  try {
    const { idChat2 } = req.params;
    const { resolved } = req.body;

    // Verificar si ya existe un chat con el mismo idChat2
    const [existingResult] = await promisePool.execute(
      'SELECT * FROM Chat WHERE idChat2 = ?',
      [idChat2]
    );

    if (existingResult.length > 0) {
      // Si existe, actualiza el dato 'resolved'
      await promisePool.execute(
        'UPDATE Chat SET resolved = ? WHERE idChat2 = ?',
        [resolved, idChat2]
      );

      res.status(200).json({ message: 'Datos actualizados correctamente.' });
    } else {
      // Si no existe un chat con el idChat2 proporcionado
      res.status(404).json({ message: 'No se encontró un chat con el idChat2 proporcionado.' });
    }
  } catch (error) {
    console.error('Error al actualizar el chat:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
// ruta para crear conversacion
app.post(process.env.DB_ROUTE + '/insertar-conversacion', async (req, res) => {
  const { idchat, asesor, conversacion, numero, calificacion, fecha_ingreso, fecha_ultimagestion, userid } = req.body;

  try {

    // Verificar si ya existe una conversación con el mismo idchat y userid diferente a cero
    const [existingConversations] = await promisePool.execute(
      'SELECT * FROM Conversation WHERE idchat = ? AND userid != 0',
      [idchat]
    );

    if (existingConversations.length > 0) {
      

      // Ya existe una conversación con el mismo idchat y userid diferente a cero
      const existingConversation = existingConversations[existingConversations.length-1];

      if (existingConversation.userid !== userid) {

        // Crear una nueva instancia ya que el userid es diferente al existente
        await promisePool.execute(
          'INSERT INTO Conversation (idchat, asesor, conversacion, numero, calificacion, fecha_ingreso, fecha_ultimagestion, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [idchat, asesor, conversacion, numero, calificacion, fecha_ingreso, fecha_ultimagestion, userid]
        );
        res.json({ mensaje: 'Datos insertados correctamente' });
      } else {
        // Agregar el nuevo dato a la conversación existente
        const validaid = existingConversation.numero == numero
        let updatedConversacion;
        const [existingPartialConversation] = await promisePool.execute(
        'SELECT * FROM Conversation WHERE idchat = ? AND conversacion LIKE ?',
        [idchat, `%${conversacion}%`]
        );
        if(existingPartialConversation.length !== 0){

          updatedConversacion = existingConversation.conversacion
          
        }else{
         updatedConversacion = existingConversation.conversacion + '\n' + conversacion;
        }
        
        const fecha_ingreso = existingConversation.fecha_ingreso
        console.log(existingConversation.conversacion)
        // Actualizar la conversación existente con la nueva información
        await promisePool.execute(
          'UPDATE Conversation SET conversacion = ?, numero =?, calificacion = ?, fecha_ingreso = ? ,fecha_ultimagestion = ? WHERE idchat = ? AND fecha_ingreso = ?',
      [updatedConversacion, numero, calificacion, idchat, fecha_ingreso, fecha_ultimagestion]
        );
        res.json({ mensaje: 'Datos actualizados correctamente' });
      }
    } else {
      // No existe una conversación con el mismo idchat y userid diferente a cero
      // Crear una nueva instancia
      await promisePool.execute(
        'INSERT INTO Conversation (idchat, asesor, conversacion, numero, calificacion, fecha_ingreso, fecha_ultimagestion, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [idchat, asesor, conversacion, numero, calificacion, fecha_ingreso, fecha_ultimagestion, userid]
      );
      res.json({ mensaje: 'Datos insertados correctamente' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// obtener conversacione por fecha 
app.get(process.env.DB_ROUTE+'/obtener-conversaciones-fecha', async (req, res) => {
  try {
    // Obtener parámetros de fecha del cuerpo de la solicitud
    const { fechaInicio, fechaFin } = req.query;

    // Validar que las fechas se proporcionen y tengan el formato adecuado (puedes agregar más validaciones según tus necesidades)
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Las fechas de inicio y fin son obligatorias' });
    }

    // Consultar las conversaciones en el rango de fechas especificado
    const [conversaciones] = await promisePool.execute(
      'SELECT * FROM Conversation WHERE fecha_ultimagestion BETWEEN ? AND ?',
      [fechaInicio, fechaFin]
    );

    res.json({ conversaciones });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// obtener conversaciones 
app.get(process.env.DB_ROUTE+'/obtener-conversaciones', async (req, res) => {
  try {
    const consultaConversaciones = 'SELECT * FROM Conversation';
    const [conversaciones, fields] = await promisePool.execute(consultaConversaciones);
    res.json({ conversaciones });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// Ruta para actualizar el userId de un chat por idChat2
app.put(process.env.DB_ROUTE+'/actualizar-usuario-chat', async (req, res) => {
  try {
    const idChat2 = req.body.idChat2; // Se espera que el idChat2 sea proporcionado en el cuerpo de la solicitud
    const nuevoUserId = req.body.nuevoUserId; // Nuevo valor de userId que se proporcionará en el cuerpo de la solicitud
    const fechaActual = new Date();
    const options = { timeZone: 'America/Bogota', hour12: false };
    const anio = fechaActual.toLocaleString('en-US', { year: 'numeric', timeZone: options.timeZone });
    const mes = fechaActual.toLocaleString('en-US', { month: '2-digit', timeZone: options.timeZone });
    const dia = fechaActual.toLocaleString('en-US', { day: '2-digit', timeZone: options.timeZone });
    const hora = fechaActual.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: options.timeZone });
    const minutos = fechaActual.toLocaleString('en-US', { minute: '2-digit', timeZone: options.timeZone });
    const segundos = fechaActual.toLocaleString('en-US', { second: '2-digit', timeZone: options.timeZone });
    const assignedDate = `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
    // Obtener el estado actual del chat
    const [chatResult] = await promisePool.execute('SELECT status FROM Chat WHERE idChat2 = ?', [idChat2]);
    if (chatResult.length === 0) {
      // Si no se encuentra el chat, devolver un mensaje de error
      res.status(404).json({ error: 'Chat no encontrado' });
      return;
    }
    const chatStatus = chatResult[0].status;
    // Validar que el estado del chat sea 'pending' antes de continuar
    

    // Realiza la consulta SQL para actualizar el userId del chat por idChat2
    const [updateResult] = await promisePool.execute('UPDATE Chat SET userId = ?, assignedDate = ? WHERE idChat2 = ?', [nuevoUserId, assignedDate, idChat2]);

    if (updateResult.affectedRows > 0) {
      // Si se actualiza con éxito, devolver una respuesta exitosa
      res.json({ success: true, message: 'Usuario del chat actualizado correctamente' });
    } else {
      // Si no se encuentra el chat, devolver un mensaje de error
      res.status(404).json({ error: 'Chat no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario del chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// actualizar estado del chat 
app.put(process.env.DB_ROUTE+'/actualizar-estado-chat', async (req, res) => {
  try {
    const idChat2 = req.body.idChat2; // Se espera que el idChat2 sea proporcionado en el cuerpo de la solicitud
    const nuevoEstado = req.body.nuevoEstado; // Nuevo valor de userId que se proporcionará en el cuerpo de la solicitud
    const nuevoUserId = req.body.nuevoUserId;
    let sqlQuery;
    let sqlParams; // Nuevo valor de userId que se proporcionará en el cuerpo de la solicitud (puede ser undefined)
    if (typeof nuevoUserId !== 'undefined') {
    // Construye la consulta SQL base sin el campo userId
   
     sqlParams = [nuevoEstado,  nuevoUserId, idChat2];

    // Verifica si se proporciona un nuevo valor para userId en la solicitud
    
      // Agrega el campo userId a la consulta SQL y los parámetros
      sqlQuery = 'UPDATE Chat SET status = ?, userId = ? WHERE idChat2 = ?';
      // Agrega nuevoUserId al principio de los parámetros
    }
else{
  sqlParams = [nuevoEstado, idChat2];
   sqlQuery = 'UPDATE Chat SET status = ? WHERE idChat2 = ?';
}
    // Realiza la consulta SQL para actualizar el userId del chat por idChat2
    const [result] = await promisePool.execute(sqlQuery, sqlParams);

    if (result.affectedRows > 0) {
      // Si se actualiza con éxito, devolver una respuesta exitosa
      res.json({ success: true, message: 'Usuario del chat actualizado correctamente' });
    } else {
      // Si no se encuentra el chat, devolver un mensaje de error
      res.status(404).json({ error: 'Chat no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario del chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// buscar chat por id 
// Supongamos que 'pool' es tu conexión a la base de datos

app.get(process.env.DB_ROUTE+'/obtener-chat-id', async (req, res) => {
  try {
    const idChat2 = req.query.idChat2;

    // Realiza la consulta SQL para obtener el chat por ID
    const [chats] = await promisePool.execute('SELECT * FROM Chat WHERE idChat2 = ?', [idChat2]);

    if (chats.length > 0) {
      // Si se encuentra el chat, devolverlo como JSON
      res.json(chats);
    } else {
      // Si no se encuentra el chat, devolver un mensaje de error
      res.status(404).json({ error: 'Chat no encontrado' });
    }
  } catch (error) {
    
    res.status(500).json({ error: 'Error al obtener el chat por ID' });
  }
});
// Ruta para obtener todos los chats
app.get(process.env.DB_ROUTE+'/obtener-chats', async (req, res) => {
  try {
    // Obtener todos los chats de la base de datos
    const [rows] = await promisePool.execute('SELECT * FROM Chat');

    if (Array.isArray(rows) && rows.length > 0) {
      res.json(rows);
    } else {
      res.json({ mensaje: 'No hay chats disponibles en la base de datos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los chats' });
  }
});

// crear mensaje rapido
app.post(process.env.DB_ROUTE + '/agregar-contenido', async (req, res) => {
  try {
    const { contentn, name } = req.body;

    // Verificar si ya existe un registro con el mismo name
    const [existingResult] = await promisePool.execute(
      'SELECT * FROM responsefast WHERE name = ?',
      [name]
    );

    if (existingResult.length > 0) {
      // Si ya existe, actualiza la fecha de actualización y el contenido
      await promisePool.execute(
        'UPDATE responsefast SET date_update = CURRENT_TIMESTAMP, contentn = ? WHERE name = ?',
        [contentn, name]
      );
    } else {
      // Si no existe, inserta un nuevo registro
      await promisePool.execute(
        'INSERT INTO responsefast (date_create, date_update, contentn, status, name) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, "Activo", ?)',
        [contentn, name]
      );
    }

    res.json({ mensaje: 'Contenido agregado o actualizado con éxito' });
  } catch (error) {
    console.error('Error al agregar contenido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// obtener respuestas rapidas
app.get(process.env.DB_ROUTE + '/obtener-nombres-contenidos', async (req, res) => {
  try {
    // Realiza una consulta para obtener solo name y contentn de la tabla responsefast
    const [result] = await promisePool.execute(
      'SELECT contentn, name FROM responsefast'
    );

    // Responde con los datos obtenidos
    res.json(result);
  } catch (error) {
    console.error('Error al obtener nombres y contenidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//  Obtener nombre de la tabla seetemp
app.get(process.env.DB_ROUTE + '/obtener-contenido-seetemp', async (req, res) => {
  try {
    // Consultar todos los datos de la tabla Seetemp
    const [results] = await promisePool.execute('SELECT * FROM Seetemp');

    // Verificar si hay datos
    if (results.length > 0) {
      res.json({ datos: results });
    } else {
      res.json({ mensaje: 'No hay datos en la tabla Seetemp' });
    }
  } catch (error) {
    console.error('Error al obtener contenido en Seetemp:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para agregar un nuevo dato a la tabla Seetemp
app.post(process.env.DB_ROUTE + '/agregar-elemento-seetemp', async (req, res) => {
  try {
    const { elementName } = req.body;

    // Verificar si el elementoName se proporcionó en la solicitud
    if (!elementName) {
      return res.status(400).json({ error: 'El elementoName es requerido' });
    }

    // Insertar el nuevo elementoName en la tabla Seetemp
    const [result] = await promisePool.execute('INSERT INTO Seetemp (elementname) VALUES (?)', [elementName]);

    if (result.affectedRows === 1) {
      res.status(201).json({ mensaje: 'Elemento insertado correctamente en Seetemp' });
    } else {
      res.status(500).json({ error: 'Error al insertar el elemento en Seetemp' });
    }
  } catch (error) {
    console.error('Error al agregar elemento a Seetemp:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// actualizar mensajes 
app.put(process.env.DB_ROUTE+'/mensajeenviado', async (req, res) => {
  try {
    const {content, idMessage} = req.body;
    // Realiza la actualización en la base de datos
    if (idMessage !== undefined && content !== undefined) {
      // Realiza la actualización en la base de datos
      const [result] = await promisePool.execute(
        'UPDATE Mensaje SET content = ? WHERE idMessage = ?',
        [content, idMessage]
      );  
    // Verifica si se realizó la actualización correctamente
    if (result.affectedRows > 0) {
    
      res.status(200).json({ mensaje: 'mensaje actualizado correctamente.' });
    } else {
    
      res.status(404).json({ error: 'mensaje no encontrado.' });
    }}
  } catch (error) {
    
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
// actualizar uusario 
app.put(process.env.DB_ROUTE+'/actualizar/usuario', async (req, res) => {
  try {
    const {nuevoDato, usuario } = req.body;
    // Realiza la actualización en la base de datos
    if (usuario !== undefined && nuevoDato !== undefined) {
      // Realiza la actualización en la base de datos
      const [result] = await promisePool.execute(
        'UPDATE User SET session = ? WHERE usuario = ?',
        [nuevoDato, usuario]
      );  
    // Verifica si se realizó la actualización correctamente
    if (result.affectedRows > 0) {
      
      res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
    } else {
      
      res.status(404).json({ error: 'Usuario no encontrado.' });
    }}
  } catch (error) {
    
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// actualizar estado del mensaje
app.put(process.env.DB_ROUTE+'/mensajestatus', async (req, res) => {
  try {
    const {status, idMessage} = req.body;
    // Realiza la actualización en la base de datos
    if (idMessage !== undefined && status !== undefined) {
      // Realiza la actualización en la base de datos
      const [result] = await promisePool.execute(
        'UPDATE Mensaje SET status = ? WHERE idMessage = ?',
        [status, idMessage]
      );  
    // Verifica si se realizó la actualización correctamente
    if (result.affectedRows > 0) {
      
      res.status(200).json({ mensaje: 'mensaje actualizado correctamente.' });
    } else {
      console.log('No se encontró el mensaje para actualizar.');
      res.status(404).json({ error: 'mensaje no encontrado.' });
    }}
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


//obtener usuaios
app.get(process.env.DB_ROUTE+'/obtener-usuarios', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM User');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
const PORT = process.env.PORTSERVER;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
//por id
app.get(process.env.DB_ROUTE+'/usuarios/:id', (req, res) => {
  const userId = req.params.id;

  // Consultar el usuario en la base de datos
  connection.query('SELECT * FROM User WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      if (results.length > 0) {
        const usuario = results[0];
        res.json(usuario);
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    }
  });
});
