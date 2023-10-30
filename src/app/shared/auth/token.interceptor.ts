import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TokenUtils } from "../utils/token.utils";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {

  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      // decode JWT payload part.
      const payload = TokenUtils.parseJwt(token);
      if (!payload || Date.now() >= payload.exp * 1000) {
        sessionStorage.removeItem("access_token");
      } else {
        request = this.addToken(request, token);
      }
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          const serverErrorMessage =
            error.error || "Unknown server error";
          if (serverErrorMessage.message == "Error: Unauthorized") {
            this.router.navigate(['/error']);
            sessionStorage.removeItem("access_token");
          }
        } else {
        }
        return throwError(error);
      })
    );
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const TokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptorService,
  multi: true,
};
