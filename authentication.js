const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const secretKey = process.env.CLAVESECRETA;
app.use(cors());
app.use(express.json()); // Middleware para parsear el cuerpo de la solicitud como JSON

// Usa body-parser para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());
app.post('/login', async (req, res) => {
    

    const username = req.body.username;
    const password = req.body.password;
    const type_user = req.body.type_user;
    try {
        const usuarios = await fetch('http://localhost:3001/dbn/obtener-usuarios');
        const usuariosJson = await usuarios.json();
        console.log(usuariosJson);
        console.log(username);
        const usuario = usuariosJson.find(user => user.usuario === username && user.password === password);

        if (usuario) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            res.json({ token, username, type_user });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Ruta protegida' });
});

app.listen(3003, () => {
    console.log('Servidor iniciado en el puerto 3003');
});
