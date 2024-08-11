import Resumes from '../schemas/resumes.js';

class ResumeController {
  async createResume(req, res) {
    const file = req.file;
    if (!file) {
      const error = new Error('Please attach a file');
      error.statusCode = 400;
      return next(error);
    }
    const resume = await Resumes.create({
      ...req.body,
      fileName: file.filename,
    });
    res.json(resume);
  }

  async getResumes(req, res) {
    try {
      const resumes = await Resumes.find({});
      return res.json(resumes);
    } catch (e) {
      res.json(e);
    }
  }
}

export default new ResumeController();
