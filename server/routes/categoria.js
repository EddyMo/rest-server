const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ==========================================
// Mostrar todas las categorias
// ==========================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, '_id descripcion usuario') //
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantas: conteo
                });
            })

        })
});

// ==========================================
// Mostrar una categoria por ID
// ==========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        categoriaDB.populate('usuario');
        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// ==========================================
// Crear  una nueva categoria
// ==========================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        // usuario: body.usuario
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});


// ==========================================
// Actualizar una nueva categoria
// ==========================================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});


// ==========================================
// Eliminar una nueva categoria
// ==========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
    // solo un ADMIN_ROLE puede borrar la categoria
});

module.exports = {
    app
}