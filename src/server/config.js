const path = require('path');
const exphbs = require('express-handlebars')

const morgan = require('morgan')
const multer = require('multer')
const express = require('express')

const routes = require('../routes/index')

const errorHandler = require('errorhandler')



module.exports = app => {
    
  // Settings
  app.set('port', process.env.PORT || 5000);
  app.set('views', path.join(__dirname, '../views'));
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./helpers'),
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');



  

    //middlewares
    app.use(morgan('dev'));
    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'));//con multer signifa que cada vez que se carge una imagen lo va a cargar dentro de esa carpeta, con single significa que recibo una sola imagen de nombre 'image'
    app.use(express.urlencoded({extended: false}))//urlencoded permite recibir los datos que vienen desde formularios
    app.use(express.json());// para manejar los likes se hace con json porque express maneja ajax





    //routes
    routes(app) // le importo app a la ruta de /routes/index.js

    //static files
    app.use('/public', express.static(path.join(__dirname,'../public')));// aca indico archivos estaticos, con el primer '/public' indico que puedo acceder al archivo desde el browser

    //errorhandlers
    if('development' === app.get('env')){
        app.use(errorHandler);
    }//si la variable de entorno es development errorHandler nos devolverá el error correspondiente



    return app;
}
