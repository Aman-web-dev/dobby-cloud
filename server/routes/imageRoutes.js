import express from 'express'
import {auth} from '../middleware/auth.js'
import { uploadImage,getUserImages,searchImages } from '../controller/imageController.js';
import upload from '../middleware/upload.js';


const ImageRoutes = express.Router();

// Protect all routes after this middleware
ImageRoutes.use(auth);

ImageRoutes.post('/', upload.single('image'),uploadImage);
ImageRoutes.get('/:folder_id', getUserImages);
ImageRoutes.get('/search', searchImages);

export default  ImageRoutes;