import { HttpService } from "./base.service";

class ExperimentService extends HttpService {
  prefix = "experiment";

  /**
   * Create new experiment
   */
  create = (data) => this.post(`${this.prefix}/save`, data);

  /**
   * Get experiment by Id
   */
  getById = (id) => this.get(`${this.prefix}/${id}`, {});

  /**
   * Get User experiments
   */
  getUserExperiments = (domain) => this.get(`${this.prefix}/${domain}/getAll`,{});

  /**
   * Make Experiment Active
   */
  makeExperimentActive = (experimentId) => this.put(`${this.prefix}/${experimentId}/active`,{},{});
}

export const experimentService = new ExperimentService();
