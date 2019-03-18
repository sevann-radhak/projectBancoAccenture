'use stric'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = Schema({
    document: Number,
    name: String,
    last_name: String,
    date_of_birth: Date
})

module.exports = mongoose.model('Customer', CustomerSchema)