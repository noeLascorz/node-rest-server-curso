const jwt = require('jsonwebtoken')

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
// Verfifica ADMIN_ROLE
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


module.exports = {
    verificaToken,
    verificaAdminRole
}