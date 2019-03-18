'use strict'

// Requerimientos - Liberías
const express = require('express')
const bodyParser = require('body-parser')

// Iniciar el servidor
const app = express()
// Importar el enrutador
const api = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', api)

module.exports = app