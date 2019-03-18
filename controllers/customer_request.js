'use strict'

// Importar Schema Customer Request
const CustomerRequest = require('../models/customer_request')
// Importar validaciones
const Validations = require('./validations')

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

// Método GET para acceder a un único cliente
function getCustomerRequest(req, res) {
    // Se captura en variable el ID ingresado
    let customerRequestId = req.params.customerRequestId

    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customerRequestId }]

    // Se realiza consulta a Base de Datos por ID ingresado
    CustomerRequest.findById(customerRequestId, (err, customerRequest) => {
        // Validación si el cliente ingresado por parámetro existe
        if (!customerRequest) {
            // Variables para adjuntar información al json del log
            Message = `La petición no existe`
            Status = 404

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customer_request" })

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
                { customer_document: customerRequest.customer_document },
                { company_name: customerRequest.company_name },
                { company_nit: customerRequest.company_nit },
                { customer_salary: customerRequest.customer_salary },
                { start_job_date: customerRequest.start_job_date }
            )

            // Si no hubo error
            res.status(200).send({ customerRequest })
        }

        // Agregamos eventos ocurridos al Current Log
        CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customer_request" })

        // Agregacmos Current Log al Log global
        LogText.push(CurrentLogText)

        console.log(LogText)
    })
}

// Método GET para acceder a todos los clientes
function getCustomerRequests(req, res) {

    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    CustomerRequest.find({}, (err, customerRequests) => {
        // Se inicializa variable CurrentLogText
        CurrentLogText = [
            { ip },
            { date: date_today },
            { date_time: date_today_hour },
            { customerRequests }]

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
            res.status(200).send({ customerRequests })
        }

        // Agregamos eventos ocurridos al Current Log
        CurrentLogText.push({ status: Status }, { message: Message }, { service: "GET: /api/customer_requests" })

        // Agregacmos Current Log al Log global
        LogText.push(CurrentLogText)

        console.log(LogText)
    })
}

// Método POST
function saveCustomerRequest(req, res) {
    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    // Se crea el objeto para el Cliente a almacenar
    let customerRequest = new CustomerRequest()
    customerRequest.customer_document = req.body.customer_document
    customerRequest.company_name = req.body.company_name
    customerRequest.company_nit = req.body.company_nit
    customerRequest.customer_salary = req.body.customer_salary
    customerRequest.start_job_date = req.body.start_job_date
    customerRequest.approved_value = validateSalary(req.body.customer_salary)

    let Message
    let Status

    // Capturar valor aprobado segun salario ingresado
    let approvedValue = validateSalary(req.body.customer_salary)

    // Si salario no supera 800000 no se puede actualizar el registro
    if (approvedValue == 0) {
        // Variables para adjuntar información al json del log
        Message = `El salario debe ser superior a 800.000 para que la solicitud sea aprobada. `
        Status = 500

        // Agregamos eventos ocurridos al Current Log
        CurrentLogText.push(
            { ip },
            { date: date_today },
            { date_time: date_today_hour },
            { status: Status },
            { message: Message },
            { service: "POST: /api/customer" })

        // Agregacmos Current Log al Log global
        LogText.push(CurrentLogText)

        console.log(LogText)

        // Se envia la respuesta
        return res.status(Status).send({ message: Message })
    }
    else {

        customerRequest.save((err, customerRequestStored) => {

            const errorValidation = Validations.validationsData(req)

            if (errorValidation != '') {
                res.status(500).send({ message: errorValidation })
            }
            else {
                if (err) {
                    // Variables para adjuntar información al json del log
                    Message = `Error al almacenar el registro en la Base de Datos. ${err}`
                    Status = 500

                    // Se envia la respuesta
                    res.status(Status).send({ message: Message })
                }
                else {

                    customerRequest.approved_value = approvedValue
                    console.log('valor aprobado: ' + approvedValue)


                    // Variables para adjuntar información al json del log
                    Message = `Servicio consumido exitosamente`
                    Status = 200

                    // Si no hubo error
                    res.status(200).send({ customerRequestStored })
                    //}

                    // Agregamos eventos ocurridos al Current Log
                    CurrentLogText.push({ status: Status }, { message: Message }, { service: "POST: /api/customer" })

                    // Agregacmos Current Log al Log global
                    LogText.push(CurrentLogText)

                    console.log(LogText)
                }
            }


        })

    }
}

// Método PUT (actualizaciones)
function updateCustomerRequest(req, res) {
    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    // String para texto de errores de validacion
    //let validationData = ''

    // Se captura en variable el ID ingresado
    let customerRequestId = req.params.customerRequestId

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customerRequest: req.body },
        { id: customerRequestId }]

    let update = req.body

    // Actualizamos el cliente
    CustomerRequest.findOneAndUpdate(customerRequestId, update, (err, customerRequestUpdated) => {
        // Se hacen las validaciones

        const errorValidation = Validations.validationsData(req)

        if (errorValidation != '') {
            res.status(500).send({ message: errorValidation })
        }
        else {

            // Validación si el cliente ingresado por parámetro existe
            if (!customerRequestUpdated) {
                // Variables para adjuntar información al json del log
                Message = `La petición no existe o no pudo ser actualizada. Revise que haya ingresado correctamente la información. ${err}`
                Status = 404

                // Agregamos eventos ocurridos al Current Log
                CurrentLogText.push({ status: Status }, { message: Message }, { service: "PUT: /api/customer_request" })

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
                // Capturar valor aprobado segun salario ingresado
                let approvedValue = validateSalary(req.body.customer_salary)

                // Si salario no supera 800000 no se puede actualizar el registro
                if (approvedValue == 0) {
                    // Variables para adjuntar información al json del log
                    Message = `Error al actualizar el registro en la Base de Datos. El salario debe ser superior a 800.000. `
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
                        { customer_document: req.body.customer_document },
                        { company_name: req.body.company_name },
                        { company_nit: req.body.company_nit },
                        { customer_salary: req.body.customer_salary },
                        { start_job_date: req.body.start_job_date }
                    )

                    // Se envia la respuesta
                    res.status(200).send({ customerRequest: customerRequestUpdated })

                }
            }

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "PUT: /api/customer_request" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)
        }
    })
}

// Método DELETE
function deleteCustomerRequest(req, res) {
    // Se captura en variable el ID ingresado
    let customerRequestId = req.params.customerRequestId

    // Se captura la ip del consumidor
    ip = req.connection.remoteAddress

    // Se inicializa variable CurrentLogText
    CurrentLogText = [
        { ip },
        { date: date_today },
        { date_time: date_today_hour },
        { customerRequest: req.body },
        { id: customerRequestId }]

    // Se realiza la consulta en la Base de Datos
    CustomerRequest.findById(customerRequestId, (err, customerRequest) => {

        // Validación si el cliente ingresado por parámetro existe
        if (!customerRequest) {
            // Variables para adjuntar información al json del log
            Message = `La petición no existe o no pudo ser eliminada.`
            Status = 404

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "DELETE: /api/customer_request" })

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
            customerRequest.remove(err => {
                // Validación si hubo algún error
                if (err) {
                    // Variables para adjuntar información al json del log
                    Message = `Error al eliminar el registro en la Base de Datos. ${err}`
                    Status = 500

                    // Se envia la respuesta
                    return res.status(500).send({ message: `Error al eliminar la petición` })
                }
                else {
                    // Variables para adjuntar información al json del log
                    Message = `Servicio consumido exitosamente`
                    Status = 200

                    // Se envia la respuesta
                    res.status(200).send({ message: `La petición ha sido eliminada exitosamente` })
                }

            })

            // Agregamos eventos ocurridos al Current Log
            CurrentLogText.push({ status: Status }, { message: Message }, { service: "DELETE: /api/customer_request" })

            // Agregacmos Current Log al Log global
            LogText.push(CurrentLogText)

            console.log(LogText)
        }
    })
}

// Calculamos el valor aprobado para la petición
function validateSalary(salary) {
    if (salary < 800001) return 0
    else
        if (salary < 1000001) return 5000000
        else
            if (salary < 4000001) return 20000000
            else return 50000000
}

module.exports = {
    getCustomerRequest,
    getCustomerRequests,
    saveCustomerRequest,
    updateCustomerRequest,
    deleteCustomerRequest
}