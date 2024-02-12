//sdghdgjgfjfhj
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
const socketIo = require('socket.io');
const app = express();
const port = 3040;
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
const apiEnvioTemplates = 'https://api.gupshup.io/wa/api/v1/template/msg';
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
app.post('/sa/subir-archivo', upload.single('archivo'), (req, res) => {
  // Aquí deberías generar la URL del archivo y enviarla como respuesta al cliente
  const urlArchivo = `/w/uploads/${req.file.filename}`;
  res.json({ url: urlArchivo });
});


// Ruta para servir los archivos estáticos
app.use('/sa/uploads', express.static(directorioCargas));




// envio mensajes
app.post('/sa/api/envios', bodyParser.urlencoded({ extended: true }), async (req, res) => {
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
app.get('/sa/api/templates', async (req, res) => {
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
app.get('/sa/api/users', async (req, res) => {
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
app.post('/sa/partner/account/login', async (req, res) => {
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
app.post('/sa/createTemplates', async (req, res) => {
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

//Templates de Seetemp
async function obtenerContenidoSeetemp() {
  try {
    // Realizar la solicitud GET a la ruta
    const response = await fetch(`${process.env.DB_ROUTE}/obtener-contenido-seetemp`);

    // Verificar si la solicitud fue exitosa y si hay datos
    if (response.ok) {
      const data = await response.json();

      // Verificar si hay datos en la respuesta
      if (data && data.datos) {
        // Guardar los datos en un array
        const datosArray = data.datos;

        // Extraer los elementName y guardarlos en un array
        const elementNames = datosArray.map(item => item.elementName);

        // Retornar los datos por si quieres hacer algo más con ellos fuera de esta función
        return elementNames;
      } else {
        console.log('No se encontraron datos en la tabla Seetemp');
        return [];
      }
    } else {
      // Si la respuesta no fue exitosa, lanzar un error
      throw new Error('Error al obtener contenido en Seetemp');
    }
  } catch (error) {
    console.error('Error al obtener contenido en Seetemp:', error);
    return [];
  }
}

// Ejemplo de cómo usar la función
obtenerContenidoSeetemp()
  .then(elementNames => {
    // Hacer algo con los nombres de elementos obtenidos, si es necesario
  })
  .catch(error => {
    console.error('Error al obtener contenido en Seetemp:', error);
  });


// Ejemplo de cómo usar la función
// Get templates
app.get('/sa/gupshup-templates', async (req, res) => {
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

    // Obtener los nombres de los elementos de Seetemp
    const elementNames = await obtenerContenidoSeetemp();

    // Filtrar las plantillas por los nombres de elementos de Seetemp
    const filteredTemplates = data.templates.filter(template => elementNames.includes(template.elementName));

    res.json({ status: 'success', templates: filteredTemplates });
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//DELETE TEMPLATES
app.delete('/sa/deleteTemplate/:elementName', async (req, res) => {
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