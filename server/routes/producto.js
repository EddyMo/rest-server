const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// ==========================================
// Obtener productos
// ==========================================
app.get('/Productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 4;
    limite = Number(limite);

    Producto.find({ disponible: true }) //, 'nombre email role estado google'
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            })

        });

});


// ==========================================
// Obtener un producto por ID
// ==========================================
app.get('/Productos/:id', (req, res) => {
    // populate usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };
            return res.json({
                ok: true,
                producto: productoDB
            });
        });

});

// ==========================================
// Crear un producto por ID
// ==========================================
app.post('/Productos', verificaToken, (req, res) => {
    // grabar el usuario 
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});

// ==========================================
// Actualizar un producto por ID
// ==========================================
app.put('/Productos/:id', (req, res) => {
    // grabar el usuario 
    // grabar una categoria del listado
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    })

});

// ==========================================
// Corrar un producto por ID
// ==========================================
app.delete('/Productos/:id', (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { disponible: false }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {
        // Usuario.findByIdAndUpdate(id, body, {}, (err, usuarioDB1) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

// ==========================================
// Buscar productos
// ==========================================
app.get('/Productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i')

    Producto.find({ nombre: regexp })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});



module.exports = {
    app
}