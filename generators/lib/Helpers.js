'use strict'

const Handlebars = require('handlebars')
const Calc = require('./Calc')
const fs = require('fs')

let BASE_DIR = ''

Handlebars.registerHelper('generatePassword', (min, max, opts) => {
    min = Number.isInteger(min) ? min : 20
    max = Number.isInteger(max) ? max : 25
    return Calc.generatePassword(min, max)
})

Handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
})

Handlebars.registerHelper('setBaseDir', function (dir) {
    BASE_DIR = dir
})

Handlebars.registerHelper('import', function(file) {
    file = BASE_DIR + file
    console.log(`Importing file content: ${file}`)
    let content = fs.readFileSync(file, {encoding: 'utf8'})
    return content;
})

Handlebars.registerHelper('concat', function (...args) {
    let str = ''
    for(let arg of args) if(typeof arg !== 'object'){
        str += arg
    }
    return str
})

Handlebars.registerHelper('sqlEscape', function (str) {
    return str.replace(/([_%])/g, '\\$1')
})