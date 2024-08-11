import mongoose from 'mongoose';

const Resumes = new mongoose.Schema({
  fileName: {
    type: String,
  },
  em: {
    type: String,
  },
  jobTitle: {
    type: String,
    // required: true
  },
  location: {
    type: String,
    // required:true
  },
});

export default mongoose.model('Resumes', Resumes);
