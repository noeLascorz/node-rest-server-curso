const express = require('express')

const { verificaToken, verificaCategoria } = require('../middelwares/autotentication')

let app = express()

let Producto = require('../models/producto')


//================================
// Obtener productos
//================================
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // Populate: usuarios y categoria
    // paginado
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            })

        })

})


//================================
// Obtener un productos por ID
//================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // Populate: usuarios y categoria
    let id = req.params.id
    Producto.find({ _id: id })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: false,
                producto: productoDB
            })
        })
})

//================================
// Buscar productos
//================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})

//================================
// Crear un nuevo producto
//================================
app.post('/productos', [verificaToken, verificaCategoria], (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    let body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: req.categoriaId,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

//================================
// Actualizar un nuevo producto
//================================
app.put('/productos/:id', [verificaToken, verificaCategoria], (req, res) => {
    // Grabar el usuario
    // Grabar una categoria del listado
    let id = req.params.id
    let body = req.body

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: req.categoriaId,
        usuario: req.usuario._id
    }

    Producto.findById(id, producto, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el ID del producto'
                    }
                })
            }

            productoDB.nombre = body.nombre
            producto.precioUni = body.precioUni
            producto.categoria = body.categoria
            producto.disponible = body.disponible
            producto.descripcion = body.descripcion

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    producto: productoGuardado
                })
            })
        })
})

//================================
// Borrar un producto
//================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id

    let cambiaDisponibe = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponibe, { new: true, },
        (err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            })
        })
})


module.exports = app