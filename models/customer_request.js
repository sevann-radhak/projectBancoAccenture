'use stric'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerRequestSchema = Schema({
    customer_document: Number,
    company_name: String,
    company_nit: Number,
    customer_salary: Number,
    start_job_date: Date,
    approved_value: Number
})

module.exports = mongoose.model('CustomerRequest', CustomerRequestSchema)