import { HttpService } from "./base.service";

class AuthService extends HttpService {
  
    prefix = "auth";

  /**
   * Basic Authenticate User
   * @param data
   */
  login = (data) => this.post(`${this.prefix}/login`, data);

  signUp = (data) => this.post(`${this.prefix}/signup`, data);

  forgetPassword = (data) => this.post(`${this.prefix}/forget-password`, data);

  resetPassword = (data) => this.post(`${this.prefix}/reset-password`, data);

  verifyCode = (data) => this.post(`${this.prefix}/verify-code`, data);
}

export const authService = new AuthService();
