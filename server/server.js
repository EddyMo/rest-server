require('../server/config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

// Para obtener los datos de Form incluidos en la llamada Post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitación de la carpeta Pública
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

// Configuración Global de Rutas (Métodos)
app.use(require('./routes/index'));

// Conección a la BD
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) Error('Error: ', err);
        console.log('Base de datos ONLINE');
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    });
// mongoose.connect('mongodb://localhost/my_database', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
})