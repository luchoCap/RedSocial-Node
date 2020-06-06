const {randomNumber} = require('../helpers/libs')
const path = require('path')
const fs = require('fs-extra')//para manejar archivos
const md5 = require('md5')
const ctrl = {};

const {Image, Comment} = require('../models/index')
const sidebar = require('../helpers/sidebar')


ctrl.index = async (req, res) =>{
    let viewModel = {image:{}, comment:{}}
    //con req.params puedo ver los distintos parametros y busco image_id
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})//busco solo uno, los nombres que coincidadn con la expresion regular req.params.image_id
    if(image){
        image.views = image.views + 1;
        viewModel.image = image;
        await image.save();
        const comment = await Comment.find({image_id: image._id})//trae los comentarios de la imagen que son igual a image_id
        viewModel.comment = comment;
        viewModel = await sidebar(viewModel)
        res.render('image',viewModel)
    }else{
        res.redirect('/');
    }
    
};


ctrl.create = (req, res) =>{

    const saveImage = async () => {

        const imgUrl = randomNumber()
        const images = await Image.find({ filename: imgUrl });
        console.log(images)//esto si existe significa que ya existe ese nombre
        if (images.length > 0) {
            saveImage();
        }else{
        //req.file serian los datos de la imagen
        console.log(imgUrl)
        const imageTempPath = req.file.path; //path actual
        const ext = path.extname(req.file.originalname).toLowerCase();//de esta forma siempre me quedo con la extension de la imagen, y en minusculas
        const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)//donde quiero guardar la imagen
        console.log(targetPath)
        if (ext === '.png' || ext == '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.rename(imageTempPath, targetPath);//para mover la imagen desde su ruta(de donde esta) hacia donde quiero que esté, la funcion trabaja de manera asincrona entonces le agrego async await
            const newImg = new Image({
                title: req.body.title,
                filename: imgUrl + ext,
                description: req.body.description
            })//creo el objeto para almacenarlo posteriormente en la base de datos Image
            const imageSaved = await newImg.save()//aca guardo el objeto y me lo devuelve en una consola para poder usarla
            res.redirect('/images'+ imgUrl);
        } else {
            await fs.unlink(imageTempPath);//borro la imagen si no corresponde con la extension
            res.status(500).json({ error: 'only Images are allowed' });
        }
    }
    }

    saveImage();
    
};
ctrl.like = async(req, res) =>{
    const image = await Image.findOne({filename:{$regex:req.params.image_id}})
    if(image){
        image.likes = image.likes + 1
        await image.save()
        res.json({likes: image.likes})//le paso la cantidad de likes
    }else{
        res.status(500).json({error:'Internal Error'}); 
    }
};
ctrl.comment = async (req, res) =>{
   
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if(image){
        const newComment = new Comment(req.body) 
        //md5 es para convertir el correo en un hash y poder utilizarlo
        newComment.gravatar = md5(newComment.email);//con gravatar se le asigna a cada correo un avatar
        newComment.image_id = image._id;
        await newComment.save()
        res.redirect('/images/' + image.uniqueId)
    }else{
        res.redirect('/');
    }
   
   
   
};
ctrl.remove = async (req, res) =>{
    console.log(req.params.image_id)
   const image = await Image.findOne({filename:{$regex:req.params.image_id}})
   if(image){
       await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
       await Comment.deleteOne({image_id: image._id});
       await image.remove()
       res.json(true)
   }
};

module.exports = ctrl;