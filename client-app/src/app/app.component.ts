import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {
    OAuthService,
    AuthConfig,
    JwksValidationHandler
} from 'angular-oauth2-oidc';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://localhost:5001',
  requireHttps: true,

  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:2020/',

  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: 'http://localhost:2020/silent-refresh.html',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'implicit',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email api',

  showDebugInformation: true,

  sessionChecksEnabled: true
};

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center">
      <h1>
        Welcome to Kris Kringle!
      </h1>
      <img width="300" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">
    </div>
    <h2>Here are some links to help you start: </h2>
    <ul>
      <li>
        <h2><a target="_blank" rel="noopener" href="https://angular.io/tutorial">Tour of Heroes</a></h2>
      </li>
      <li>
        <h2><a target="_blank" rel="noopener" href="https://github.com/angular/angular-cli/wiki">CLI Documentation</a></h2>
      </li>
      <li>
        <h2><a target="_blank" rel="noopener" href="https://blog.angular.io/">Angular blog</a></h2>
      </li>
    </ul>

  `,
  styles: []
})
export class AppComponent {
  constructor(
      private router: Router,
      @Inject(PLATFORM_ID) private platformId: Object,
      private oauthService: OAuthService
  ) {
      if (isPlatformBrowser(this.platformId)) {
          this.oauthService.configure(authConfig);
          this.oauthService.tokenValidationHandler = new JwksValidationHandler();
          this.oauthService.loadDiscoveryDocumentAndTryLogin();

          // Optional
          // this.oauthService.setupAutomaticSilentRefresh();
          this.oauthService.events.subscribe(e => {
              console.debug('oauth/oidc event', e);
          });

          this.oauthService.events.pipe(
              filter(e => e.type === 'session_terminated')
              ).subscribe(e => {
                  console.debug('Your session has been terminated!');
              });

          this.oauthService.events.pipe(
              filter(e => e.type === 'token_received')
            ).subscribe(e => {
                  // this.oauthService.loadUserProfile();
              });
      }
  }

  ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {

          this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
              if (
                  !this.oauthService.hasValidIdToken() ||
                  !this.oauthService.hasValidAccessToken()
              ) {
                  this.oauthService.initImplicitFlow('some-state');
              }
          });
      }
  }
}
