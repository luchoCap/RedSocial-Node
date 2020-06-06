const express = require('express')
const router = express.Router()

const home = require('../controllers/home')
const image = require('../controllers/image')

module.exports = app => {
    //utilizo las operaciones de los controladores
    router.get('/', home.index);
    router.get('/images/:image_id', image.index);//para acceder a una imagen
    router.post('/images', image.create);//para cargar una imagen
    router.post('/images/:image_id/like', image.like);//para intentar dar like a una imagen
    router.post('/images/:image_id/comment', image.comment);//para comentar imagenes
    router.delete('/images/:image_id', image.remove);//para borrar las imagenes
    app.use(router);
}