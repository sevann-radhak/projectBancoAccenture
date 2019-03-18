'use stric'

// Requerimientos - Liberías
const express = require('express')
const api = express.Router()

// Para Customer

// Vincular al controlador
const customerCtrl = require('../controllers/customer')

// Método GET para acceder a todos los clientes
api.get('/customer', customerCtrl.getCustomers)

// Método GET para acceder a un único cliente
api.get('/customer/:customerId', customerCtrl.getCustomer)

// Método POST
api.post('/customer', customerCtrl.saveCustomer)

// Método PUT (actualizaciones)
api.put('/customer/:customerId', customerCtrl.updateCustomer)

// Método DELETE
api.delete('/customer/:customerId', customerCtrl.deleteCustomer)


// Para Customer Request

// Vincular al controlador
const customerRequestCtrl = require('../controllers/customer_request')

// Método GET para acceder a una petición de un cliente
api.get('/customer_request/:customerRequestId', customerRequestCtrl.getCustomerRequest)

// Método GET para acceder a todas las peticiones de los clientes
api.get('/customer_request', customerRequestCtrl.getCustomerRequests)

// Método POST
api.post('/customer_request', customerRequestCtrl.saveCustomerRequest)

// Método PUT (actualizaciones)
api.put('/customer_request/:customerRequestId', customerRequestCtrl.updateCustomerRequest)

// Método DELETE
api.delete('/customer_request/:customerRequestId', customerRequestCtrl.deleteCustomerRequest)

module.exports = api