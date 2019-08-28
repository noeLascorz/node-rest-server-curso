const express = require('express')
let { verificaToken, verificaAdminRole } = require('../middelwares/autotentication')

let app = express()

let Categoria = require('../models/categoria')

// ============================
// Mostrar todas las categorias 
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
})


// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(.....)
    let id = req.params.id
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado el Id ' + id
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


// ============================
// Crear una nueva categoria 
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// ============================
// Actualizar la categoria 
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
})

// ============================
// Borrar la categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un administrador puede borrar categorias.
    // Debe pedir el token
    // Categoria.findByIdAndRemove
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    })
})

module.exports = app