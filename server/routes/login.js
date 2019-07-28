const express = require('express')
const bycript = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const Usuario = require('../models/usuario')


app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ 'email': body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bycript.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.NODE_ENV, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

module.exports = app