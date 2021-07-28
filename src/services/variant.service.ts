import { HttpService } from "./base.service";

class VariantService extends HttpService {
  prefix = "template";

  // Domain Variant
  variantDetails = (domain, id) => this.get(`${this.prefix}/domain/${domain}/variant/${id}`,{});

  // Call To Action
  callToAction = (domain, id, status, data) => this.post(`${this.prefix}/domain/${domain}/variant/${id}/${status ? 1 : 0}`, data);
}

export const variantService = new VariantService();
