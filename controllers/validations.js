'use strict'

// Se encarga de calcular la edad a partir de fecha ingresada. 
// Devuelve false si es menor de edad. Devuelve true si es mayor de edad
function validateJobTime(Fecha) {
    let fecha = new Date(Fecha)
    let hoy = new Date()
    let ed = ((hoy - fecha) / 365 / 24 / 60 / 60 / 1000)

    if (isNaN(ed)) {
        return false
    }
    if (ed < 1.5) {
        return false
    }
    else {
        return true
    }
}

// Funcion para realizar validaciones de la Data ingresada
function validationsData(req) {
    // Texto error
    const error_date = `La fecha no puede ser aceptada. Verifique que supere 1,5 años a la fecha acutal y use formato (dd-mm-yyyy). `
    // Variable para almacenar el resultado en texto de las validaciones
    let validationMessage = ''

    // Variables para validar datos
    let customer_document_text
    let company_name_text
    let company_nit_text
    let customer_salary_text
    let start_job_date_text

    // Transformación de información
    if (req.body.customer_document == null) {
        customer_document_text = null
    }
    else {
        customer_document_text = req.body.customer_document.trim()
    }

    if (req.body.company_name == null) {
        company_name_text = null
    }
    else {
        company_name_text = req.body.company_name.trim()
    }

    if (req.body.company_nit == null) {
        company_nit_text = null
    }
    else {
        company_nit_text = req.body.company_nit.trim()
    }

    if (req.body.customer_salary == null) {
        customer_salary_text = null
    }
    else {
        customer_salary_text = req.body.customer_salary.trim()
    }

    if (req.body.start_job_date == null) {
        start_job_date_text = null
    }
    else {
        start_job_date_text = req.body.start_job_date.trim()
    }

    // Se valida si la fecha ingresada es nula
    if (start_job_date_text == '') {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + error_date
    }
    else {
        // Calcular la edad a partir de la fecha de nacimiento ingresada
        const age = validateJobTime(start_job_date_text)

        // Se valida que valor obtenido sea un numero
        if (!age) {
            // Variables para adjuntar información al json del log
            validationMessage = validationMessage + error_date
        }
    }

    // Se valida información de campo document
    if (customer_document_text == null || customer_document_text == '' || customer_document_text < 1) {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un Documento válido. `
    }

    // Se valida información de campo name
    if (company_name_text == null || company_name_text == '') {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un  Nombre de Empresa válido. `
    }

    // Se valida información de campo last_name
    if (company_nit_text == null || company_nit_text == '' || company_nit_text < 1) {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un Nit de Empresa válido. `
    }

    // Se valida información de campo last_name
    if (customer_salary_text == null || customer_salary_text == '' || customer_salary_text < 1 || customer_salary_text > 99999999) {
        // Variables para adjuntar información al json del log
        validationMessage = validationMessage + `Debe ingresar un Salario válido (entre 1 y 99.999.999). `
    }

    // Se envia la respuesta
    return validationMessage
}

module.exports = { validationsData }