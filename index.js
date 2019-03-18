'use strict'

// Requerimientos - Liberías
const mongoose = require('mongoose')

// Importar la app
const app = require('./app')
// Importar archivo de configuración
const config = require('./config')

// Establecer la conexión a la Base de Datos
mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`Error al conectarse a la Base de Datos: ${err}`)
    }

    console.log("Conexión a la Base de Datos establecida.")

    app.listen(config.port, () => {
        console.log(`API REST corriendo en localhost ${config.port}`)
    })
})
