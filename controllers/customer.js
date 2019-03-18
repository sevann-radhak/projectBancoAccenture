'use strict'

// Importar Schema Customer
const Customer = require('../models/customer')

// Variable para almacenar la ip del consumidor
let ip = ''
// Variable para la fecha actual
const today = new Date()
let date_today = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear()
let date_today_hour = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
// Variable String para almacenar texto de log completo
let LogText = []
// Variable String para almacenar el teto del pedido actual
let CurrentLogText = []
// Variables para otros campos del json para el log actual
let Message
let Status
// Variable para archivo File
const fs = require('fs')

// Método GET para acceder a un único cliente
function getCustomer(req, res) {
    // Se captura en variable el ID ingresado
    let customerId = req.params.customerId

    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customerId }]

    // Se realiza consulta a Base de Datos por ID ingresado
    Customer.findById(customerId, (err, customer) => {

        // Validación si el cliente ingresado por parámetro existe
        if (!customer) {
            // Variables para adjuntar información al json del log
            Message = `El cliente no existe`
            Status = 404

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customer" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)

            // Retorna estado y mensaje de error
            return res.status(404).send({ message: Message })
        }
        // Validación si hubo algún error
        if (err) {
            // Variables para adjuntar información al json del log
            Message = `Error al enviar la petición. ${err}`
            Status = 500

            // Retorna estado y mensaje de error
            return res.status(Status).send({ message: Message })
        }
        else {
            // Variables para adjuntar información al json del log
            Message = `Servicio consumido exitosamente`
            Status = 200

            // Actualizamos la variable para el Current Log 
            CurrentLogText.push(
                { document: customer.document },
                { name: customer.name },
                { last_name: customer.last_name },
                { date_of_birth: customer.date_of_birth }
            )

            // Si no hubo error
            res.status(200).send({ customer })
        }

        // Agregamos eventos ocurridos al Current Log
        CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customer" })

        // Agregacmos Current Log al Log global
        LogText.push(CurrentLogText)

        console.log(LogText)
    })
}

// Método GET para acceder a todos los clientes
function getCustomers(req, res) {

    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    Customer.find({}, (err, customers) => {
        // Se inicializa variable CurrentLogText
        CurrentLogText = [
            { ip },
            { date: date_today },
            { date_time: date_today_hour },
            { customers }]

        // Validación si hubo algún error
        if (err) {
            // Variables para adjuntar información al json del log
            Message = `Error al enviar la petición. ${err}`
            Status = 500

            // Retorna estado y mensaje de error
            return res.status(Status).send({ message: Message })
        }// Validación si el cliente ingresado por parámetro existe
        else {
            // Variables para adjuntar información al json del log
            Message = `Servicio consumido exitosamente`
            Status = 200

            // Si no hubo error
            res.status(200).send({ customers })
        }

        // Agregamos eventos ocurridos al Current Log
        CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customers" })

        // Agregacmos Current Log al Log global
        LogText.push(CurrentLogText)

        console.log(LogText)
    })
}

// Método POST
function saveCustomer(req, res) {
    // String para texto de errores de validacion
    let validationData = ''

    // Se crea el objeto para el Cliente a almacenar
    let customer = new Customer()
    customer.document = req.body.document
    customer.name = req.body.name
    customer.last_name = req.body.last_name
    customer.date_of_birth = req.body.date_of_birth

    // Iniciamos una variable para el Current Log inicializada con el requerimiento
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customer: req.body },
        { document: req.body.document },
        { name: req.body.name },
        { last_name: req.body.last_name },
        { date_of_birth: req.body.date_of_birth }
    ]

    // Se hacen las validaciones
    validationData = validationsData(req)

    // Se valida si hubo error en el envío de datos
    if (validationData != '') {
        //Se envia la respuesta
        res.status(500).send({ message: validationData })
    }
    else {
        customer.save((err, customerStored) => {
            if (err) {
                // Variables para adjuntar información al json del log
                Message = `Error al almacenar el registro en la Base de Datos. ${err}`
                Status = 500

                // Se envia la respuesta
                res.status(Status).send({ message: Message })
            }
            else {
                // Variables para adjuntar información al json del log
                Message = `Servicio consumido exitosamente`
                Status = 200

                // Se envia la respuesta
                res.status(Status).send({ customer: customerStored, message: Message })
            }

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "POST: /api/customer" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)
        })
    }
}

// Método PUT (actualizaciones)
function updateCustomer(req, res) {
    // String para texto de errores de validacion
    let validationData = ''

    // Se captura en variable el ID ingresado
    let customerId = req.params.customerId

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customer: req.body },
        { id: customerId }]

    let update = req.body

    // Se hacen las validaciones
    validationData = validationsData(req)

    // Se valida si hubo error en el envío de datos
    if (validationData != '') {
        //Se envia la respuesta
        res.status(500).send({ message: validationData })
    }
    else {
        // Actualizamos el cliente
        Customer.findOneAndUpdate(customerId, update, (err, customerUpdated) => {

            // Validación si el cliente ingresado por parámetro existe
            if (!customerUpdated) {
                // Variables para adjuntar información al json del log
                Message = `El cliente no existe o no pudo ser actualizado. Revise que haya ingresado correctamente la información. ${err}`
                Status = 404

                // Agregamos eventos ocurridos al Current Log
                CurrentLogText.push({ status: Status }, { message: Message }, { service: "PUT: /api/customer" })

                // Agregacmos Current Log al Log global
                LogText.push(CurrentLogText)

                console.log(LogText)

                // Retorna estado y mensaje de error
                return res.status(Status).send({ message: Message })
            }
            // Validación si hubo algún error
            if (err) {
                // Variables para adjuntar información al json del log
                Message = `Error al actualizar el registro en la Base de Datos. ${err}`
                Status = 500

                // Se envia la respuesta
                return res.status(Status).send({ message: Message })
            }
            else {
                // Variables para adjuntar información al json del log
                Message = `Servicio consumido exitosamente`
                Status = 200

                // Actualizamos la variable para el Current Log 
                CurrentLogText.push(
                    { document: req.body.document },
                    { name: req.body.name },
                    { last_name: req.body.last_name },
                    { date_of_birth: req.body.date_of_birth }
                )

                // Se envia la respuesta
                res.status(200).send({ customer: customerUpdated })
            }

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "PUT: /api/customer" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)
        })
    }

}

// Método DELETE
function deleteCustomer(req, res) {
    // Se captura en variable el ID ingresado
    let customerId = req.params.customerId

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customer: req.body },
        { id: customerId }]

    // Se realiza la consulta en la Base de Datos
    Customer.findById(customerId, (err, customer) => {

        // Validación si el cliente ingresado por parámetro existe
        if (!customer) {
            // Variables para adjuntar información al json del log
            Message = `El cliente no existe o no pudo ser eliminado.`
            Status = 404

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "DELETE: /api/customer" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)

            // Retorna estado y mensaje de error
            return res.status(Status).send({ message: Message })
        }
        // Validación si hubo algún error
        if (err) {
            // Variables para adjuntar información al json del log
            Message = `Error al eliminar el registro en la Base de Datos. ${err}`
            Status = 500

            // Se envia la respuesta
            return res.status(Status).send({ message: Message })
        }
        else {
            // Se elimina el registro
            customer.remove(err => {
                // Validación si hubo algún error
                if (err) {
                    // Variables para adjuntar información al json del log
                    Message = `Error al eliminar el registro en la Base de Datos. ${err}`
                    Status = 500

                    // Se envia la respuesta
                    return res.status(500).send({ message: `Error al eliminar el cliente` })
                }
                else {
                    // Variables para adjuntar información al json del log
                    Message = `Servicio consumido exitosamente`
                    Status = 200

                    // Se envia la respuesta
                    res.status(200).send({ message: `El cliente ha sido eliminado exitosamente` })
                }

            })

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "DELETE: /api/customer" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)
        }
    })
}

// Se encarga de calcular la edad a partir de fecha ingresada
function calculateAge(Fecha) {
    let fecha = new Date(Fecha)
    let hoy = new Date()
    let ed = parseInt((hoy - fecha) / 365 / 24 / 60 / 60 / 1000)

    return ed;
}

// Funcion para realizar validaciones de la Data ingresada
function validationsData(req, res) {
    // Texto error
    const error_date = `Debe ingresar una fecha válida y que corresponda a la mayoría de edad (18 años). Use formato (dd-mm-yyyy) `

    // Variables para validar datos
    let document_text
    let name_text
    let last_name_text
    let date_of_birth_text

    // Transformación de información
    if (req.body.document == null) {
        document_text = null
    }
    else {
        document_text = req.body.document.trim()
    }

    if (req.body.name == null) {
        name_text = null
    }
    else {
        name_text = req.body.name.trim()
    }

    if (req.body.last_name == null) {
        last_name_text = null
    }
    else {
        last_name_text = req.body.last_name.trim()
    }

    if (req.body.date_of_birth == null) {
        date_of_birth_text = null
    }
    else {
        date_of_birth_text = req.body.date_of_birth.trim()
    }

    // Variable para almacenar el resultado en texto de las validaciones
    let validationMessage = ''

    // Se valida si la fecha ingresada es nula
    if (date_of_birth_text == '') {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + error_date

    }
    else {
        // Calcular la edad a partir de la fecha de nacimiento ingresada
        const age = calculateAge(date_of_birth_text)

        // Se valida que valor obtenido sea un numero
        if (isNaN(age)) {
            // Variables para adjuntar información al json del log
            validationMessage = validationMessage + error_date
        }
        else {
            // Se valida que la edad resulte ser mayor a 18
            if (age < 18 || age > 100) {
                // Variables para adjuntar información al json del log
                validationMessage = validationMessage + error_date
            }
        }
    }

    // Se valida información de campo document
    if (document_text == null || document_text == '' || document_text < 1) {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un Documento válido. `
    }

    // Se valida información de campo name
    if (name_text == null || name_text == '') {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un  Nombre válido. `
    }

    // Se valida información de campo last_name
    if (last_name_text == null || last_name_text == '') {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un Apellido válido. `
    }
    // Se envia la respuesta
    return validationMessage
}

module.exports = {
    getCustomer,
    getCustomers,
    saveCustomer,
    updateCustomer,
    deleteCustomer
}