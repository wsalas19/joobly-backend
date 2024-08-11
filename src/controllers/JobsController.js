import Jobs from '../schemas/jobs.js';
import xlsx from 'xlsx';

class JobsController {
  async createJobs(req, res) {
    try {
      const jobs = await Jobs.create({
        ...req.body,
        advertisedDate: Date.now(),
      });
      res.json(jobs);
    } catch (e) {
      res.json(e);
    }
  }

  async getAllJobs(req, res) {
    try {
      const query = req.query;
      let filter = {};
      for (const key in query) {
        if (query[key]) {
          filter[key] = { $regex: new RegExp('.*' + query[key] + '.*', 'i') };
        }
      }
      const jobs = await Jobs.find(filter);
      const length = jobs.length;
      return res.json({ length, jobs });
    } catch (e) {
      res.json(e);
    }
  }

  async getJobOptions(req, res) {
    try {
      const jobs = await Jobs.find({});
      return res.json(jobs);
    } catch (e) {
      res.json(e);
    }
  }

  async getOneJob(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is not found' });
      }
      const jobs = await Jobs.findById(id);
      return res.json(jobs);
    } catch (e) {
      res.json(e);
    }
  }
  async deleteJob(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is not found' });
      }
      await Jobs.findByIdAndDelete(id);
      return res.json({ message: 'Job is deleted' });
    } catch (e) {
      res.json(e);
    }
  }

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const jobsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const newJobsData = jobsData.map((elem) => {
        const { ceoCompany, companySize, companyWebsite, founded, ...code } =
          elem;
        const companyDetails = {
          ceoCompany,
          companySize,
          companyWebsite,
          founded,
        };
        return { ...code, companyDetails };
      });

      const result = await Jobs.insertMany(newJobsData);

      res.json({ message: 'Jobs data uploaded successfully', result });
    } catch (error) {
      console.error('Error uploading jobs data:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

export default new JobsController();
