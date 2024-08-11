import mongoose from 'mongoose';

const Jobs = new mongoose.Schema({
  id: { type: Number },
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  jobUrl: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  currency: { type: String },
  salaryDetail: { type: String },
  postedDate: { type: String },
  workType: { type: String },
  education: { type: String },
  jobTime: { type: String },
  advertisedDate: { type: String },
  closeDate: { type: String },
  companyDetails: {
    ceoCompany: { type: String },
    founded: { type: String },
    companySize: { type: String },
    companyWebsite: { type: String },
  },
});

export default mongoose.model('Jobs', Jobs);
