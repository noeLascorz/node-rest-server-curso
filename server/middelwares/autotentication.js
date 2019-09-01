const jwt = require('jsonwebtoken')

let Categoria = require('../models/categoria')

// ================
// Verificar Token
// ================

let verificaToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.NODE_ENV, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })

}


// =====================
// Verifica ADMIN_ROLE
// =====================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        })
    }
}

// ==========================
// Verifica categoria
// ==========================
let verificaCategoria = (req, res, next) => {
    let descCategoria = req.body.descCategoria

    Categoria.findOne({ descripcion: descCategoria })
        .exec((err, categoriaDB) => {
            if (err) {
                res.json({
                    ok: false,
                    err: {
                        message: 'Error al obtener las categorias'
                    }
                })
            } else if (!categoriaDB) {
                res.json({
                    ok: false,
                    err: {
                        message: `La categoria ${descCategoria} no esta definida`
                    }
                })
            } else {
                req.categoriaId = categoriaDB._id
                next();
            }
        })
}

// ==========================
// Verifica token para imagen
// ==========================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.NODE_ENV, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })

}


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaCategoria,
    verificaTokenImg
}