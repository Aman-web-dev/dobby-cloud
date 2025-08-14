import Folder from '../models/folder.js'

export const createFolder = async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;
    const userId = req.user._id;

    let path = name;
    let parentFolder = null;

    if (parentFolderId && parentFolderId!=userId) {
      parentFolder = await Folder.findOne({ _id: parentFolderId, user: userId });
      if (!parentFolder) {
        return res.status(404).json({
          status: 'fail',
          message: 'Parent folder not found'
        });
      }
      path = `${parentFolder.path}/${name}`;
    }

    // Check if folder with same name already exists in the same location
    const existingFolder = await Folder.findOne({ 
      name, 
      user: userId, 
      parentFolder: parentFolderId==userId?null:parentFolderId, 
    });

    if (existingFolder) {
      return res.status(400).json({
        status: 'fail',
        message: 'Folder with this name already exists in this location'
      });
    }

    const newFolder = await Folder.create({
      name,
      user: userId,
      parentFolder: parentFolderId || null,
      path
    });

    res.status(201).json({
      status: 'success',
      data: {
        folder: newFolder
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

export const getUserFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folder_id } = req.params;
    const folders = await Folder.find({ user: userId,parentFolder:folder_id==userId?null:folder_id});

    res.status(200).json({
      status: 'success',
      results: folders.length,
      data: {
        folders
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};