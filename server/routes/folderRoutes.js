import express from 'express'
import {createFolder,getUserFolders} from '../controller/folderController.js'
import {auth} from '../middleware/auth.js'

const FolderRoutes = express.Router();


FolderRoutes.use(auth);

FolderRoutes.post('/', createFolder);
FolderRoutes.get('/:folder_id', getUserFolders);


export default FolderRoutes;