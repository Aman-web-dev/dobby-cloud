
import Image from '../models/image.js';
import Folder from '../models/folder.js'

export const uploadImage = async (req, res) => {
  try {
    const { name, folderId ,imageUrl } = req.body;
    const userId = req.user._id;


    let folder = null;
    if (folderId && folderId!=userId) {
      folder = await Folder.findOne({ _id: folderId, user: userId });
      if (!folder) {
        return res.status(404).json({
          status: 'fail',
          message: 'Folder not found'
        });
      }
    }

    const newImage = await Image.create({
      name,
      user: userId,
      folder: folderId===userId?null:folderId,
      imageUrl
    });

    res.status(201).json({
      status: 'success',
      data: {
        image: newImage
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

export const getUserImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folder_id }=req.params;
    const images = await Image.find({ user: userId,folder:folder_id==userId?null:folder_id});

    res.status(200).json({
      status: 'success',
      results: images.length,
      data: {
        images
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

export const searchImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a search query'
      });
    }

    const images = await Image.find({
      $and: [
        { user: userId },
        { $text: { $search: query } }
      ]
    });

    res.status(200).json({
      status: 'success',
      results: images.length,
      data: {
        images
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};