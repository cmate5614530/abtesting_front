import { HttpService } from "./base.service";
import axios from 'axios';
import { Config } from "../environment";

class DomainService extends HttpService {
  prefix = "domain";

  /**
   * Fetch more information
   */
  fetchMoreAgainstText = (data) => axios.post(Config.MORE_TEST, data);

  /**
   * Save New Domain
   */
  fetchFromAI = (data) => axios.post(Config.AI_MODEL, data);

  /**
   * Save New Domain
   */
  fetchFromNode = (data) => this.post('scraper', data);

  /**
   * Save New Domain
   */
  saveDomain = (data) => this.post(`${this.prefix}/save`, data);

  // Save domain for logged in user
  saveDomainForUser = (data) => this.post(`${this.prefix}/user/save`, data);

  // Fetch all the users
  domainsForUser = () => this.get(`${this.prefix}/my/domains`,{});

  // Get Domain Details
  domainDetails = (id) => this.get(`${this.prefix}/my/domain/details/${id}`,{});

  // Get Domain Details
  deleteDomain = (id) => this.delete(`${this.prefix}/delete/${id}`,{},{});

  // Domain Variant
  variantDetails = (domain, id) => this.delete(`${this.prefix}/${domain}/variant/${id}/details`,{},{});

  // Deactivate Variant
  deactivateVariant = (domain, template) => this.put(`template/domain/${domain}/variant/${template}/deactivate`,{},{});

  // Activate Variant
  changeVariantStatus = (domain, templates) => this.put(`template/domain/${domain}/variant`, { templates },{});
  removeWinnerToOnlyActiveTemplates = (domain, templates) => this.put(`template/domain/${domain}/change-winners-to-active/variant`, { templates },{});

  // Activate Winner
  changeVariantWinnerStatus = (domain, data) => this.put(`template/domain/${domain}/variant/make-winner`, data,{});


  // Add More templates to this template
  addTemplatesToTemplate = (domain, template, data) => this.put(`template/${domain}/${template}/add/templates`, data,{});

  
  // View More templates from this template
  viewMoreTemplates = (domain, template) => this.get(`template/domain/${domain}/variant/${template}/templates`,{});
  
  
  // Save Template For 
  saveTemplateForDomain = (domain, template) => this.post(`${this.prefix}/${domain}/save/element`, template);
  
  // Remove all active variants which not winners
  removeActiveButNotWinner = (domain) => this.delete(`template/${domain}/remove/active/not/winner/variants`,{},{});
  
  // Make One variant Winner
  makeItWinner = (domain, variant) => this.put(`template/${domain}/make/variant/${variant}/winner`,{},{});
  
  // Delete Variant
  deleteVariant = (variant) => this.delete(`template/variant/${variant}`,{},{});
  
  // Save URL for conversions
  saveURLConversion = (domain, url) => this.put(`${this.prefix}/${domain}/url/conversion`, { url },{});
  
  // Get URL Conversions
  getURLConversions = (url) => this.get(`${this.prefix}/url/conversions`, { url });

  // Reset experiments
  resetExperiments = (domain) => this.put(`template/${domain}/reset/variants`,{},{});
  // Pause Variants
  pauseVariants = (domain, templates) => this.put(`template/${this.prefix}/${domain}/pause`, {templates},{});

  // Resume Variants
  resumeVariants = (domain, templates) => this.put(`template/${this.prefix}/${domain}/resume`, {templates},{});
}

export const domainService = new DomainService();
