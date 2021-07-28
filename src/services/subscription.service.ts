import { HttpService } from "./base.service";

class SubscriptionService extends HttpService {
  
    prefix = "subscription";

  /**
   * Plans
   * @param data
   */
  allPlans = () => this.get(`${this.prefix}/plans`, {});

  /**
   * Subscribe User
   * @param data
   */
  subscribeUser = (data) => this.post(`${this.prefix}/subscribe`, data);

  /**
   * Upgrade Plan
   * @param plan Plan ID
   */
  upgradePlan = (id) => this.put(`${this.prefix}/upgrade-plan/${id}`,{},{});

  /**
   * Upgrade Plan
   * @param plan Plan ID
   */
  cancelSubscription = () => this.delete(`${this.prefix}/cancel`,{},{});
}

export const subscriptionService = new SubscriptionService();
