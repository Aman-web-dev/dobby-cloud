import mongoose from 'mongoose'


const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an image name']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: mongoose.Schema.ObjectId,
    ref: 'Folder',
    default: null
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

imageSchema.index({ name: 'text' });

const Image = mongoose.model('Image', imageSchema);
export default Image;