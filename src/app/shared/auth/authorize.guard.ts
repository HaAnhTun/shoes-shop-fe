import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

import { TokenUtils } from '../utils/token.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(): boolean {

      const token = sessionStorage.getItem("access_token");
      if (token) {
        const payload = TokenUtils.parseJwt(token); // decode JWT payload part.
        if (!payload || Date.now() >= payload.exp * 1000) { // Check token exp.
          // redirect user to login page or auto refresh user's token and then replace the expired one and continue the process.
          sessionStorage.removeItem("access_token");
        } else {
          return true;
        }
      }
      this.router.navigate(['login']);
      return false;
  }
}
