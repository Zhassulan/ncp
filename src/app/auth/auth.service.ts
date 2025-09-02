import {Injectable} from '@angular/core';
import {httpHeaders, LOCAL_STORAGE_ITEMS} from '../settings';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoginRequest} from './model/login-request';
import {JwtTokenResponse} from './model/jwt-token-response';
import {Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {RefreshTokenRequest} from './model/refresh-token-request';

const LDAP_API_URL = environment.LDAP_API_URL;

enum LdapGroups {
  NCP_COMMON = 'itdev-ncp-common',
  COMMON_CLIENTS = 'itdev-ncp-client',
  MOBIPAY_LIMITS_UPDATE = 'itdev-ncp-onlinebank-acs-mobipay_update',
  USER_TELE2 = 'itdev-ncp-user-tele2',
  USER_ALTEL = 'itdev-ncp-user-altel',
  PAYMENTS_DISTRIBUTE_EXPIRED = 'itdev-ncp-client-acs-distribute_expired_payments',
  PROFILE_VIEW = 'itdev-ncp-client-acs-view_clients_profiles',
  MOBIPAY = 'itdev-ncp-client-acs-mobipay',
  PAYMENT_DELETE = 'itdev-ncp-client-acs-del_payment',
  REGIONAL_MANAGER = 'itdev-ncp-client-role-regional-manager',
  PAYMENTS_VIEW_HIDDEN = 'itdev-ncp-hide',
  ADD_B2B_CONTRACT = 'itdev-ncp-am-profile-add-b2c',
  VIEW_B2B_PAYMENTS = 'itdev-ncp-view-b2b-payments',
  READN_ONLY = 'itdev-ncp-read-only',
  COLLECTOR = 'itdev-ncp-client-acs-collectors',
}

@Injectable({providedIn: 'any'})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  setUserData(resp: JwtTokenResponse) {
    console.log('Setting user data..');
    localStorage.setItem(LOCAL_STORAGE_ITEMS.TOKEN, resp.token);
    localStorage.setItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN, resp.refreshToken);
    this.setGroups(resp.token);
  }

  setGroups(token) {
    const decodedJwt = jwtDecode(token);
    // @ts-ignore
    const groups = JSON.stringify(decodedJwt.roles);
    // if something wrong with AD, let's keep browser cache
    if (groups.length > 0) {
      console.log('Setting groups..');
      console.log(groups);
      localStorage.setItem(LOCAL_STORAGE_ITEMS.USER_GROUPS, groups);
    }
  }

  getUserGroups(): string [] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEMS.USER_GROUPS));
  }

  logout() {
    localStorage.removeItem(LOCAL_STORAGE_ITEMS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_ITEMS.USER);
    localStorage.removeItem(LOCAL_STORAGE_ITEMS.USER_GROUPS);
    localStorage.removeItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN);
  }

  setUser(user) {
    return localStorage.setItem(LOCAL_STORAGE_ITEMS.USER, user);
  }

  getUser() {
    return localStorage.getItem(LOCAL_STORAGE_ITEMS.USER);
  }

  login(req: LoginRequest): Observable<JwtTokenResponse> {
    return this.http.post<any>(LDAP_API_URL + '/login', req, {headers: httpHeaders});
  }

  isLogged() {
    const token = localStorage.getItem(LOCAL_STORAGE_ITEMS.TOKEN);
    return token !== null;
  }

  getToken() {
    return localStorage.getItem(LOCAL_STORAGE_ITEMS.TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN);
  }

  userGroupsContains(val) {
    const arr = this.getUserGroups();
    for (const index in arr) {
      if (arr[index] === val) {

        return true;
      }
    }

    return false;
  }

  hasCommonAccess(): boolean {
    return this.userGroupsContains(LdapGroups.COMMON_CLIENTS) || this.userGroupsContains(LdapGroups.NCP_COMMON) ||
      this.userGroupsContains(LdapGroups.USER_ALTEL) || this.userGroupsContains(LdapGroups.USER_TELE2);
  }

  hasHiddenRole(): boolean {
    return this.userGroupsContains(LdapGroups.PAYMENTS_VIEW_HIDDEN);
  }

  hasMobipayRole() {
    return this.userGroupsContains(LdapGroups.MOBIPAY);
  }

  hasViewB2bPaymentsRole() {
    return this.userGroupsContains(LdapGroups.VIEW_B2B_PAYMENTS);
  }

  hasAddB2BContract() {
    return this.userGroupsContains(LdapGroups.ADD_B2B_CONTRACT);
  }

  hasMobipayLimitsUpdateRole() {
    return this.userGroupsContains(LdapGroups.MOBIPAY_LIMITS_UPDATE);
  }

  hasEditPaymentRole() {
    return this.userGroupsContains(LdapGroups.REGIONAL_MANAGER);
  }

  hasViewClientProfileRole() {
    return this.userGroupsContains((LdapGroups.PROFILE_VIEW));
  }

  hasDeletePaymentRole(): boolean {
    return this.userGroupsContains(LdapGroups.PAYMENT_DELETE);
  }

  hasReadOnlyRole() {
    return this.userGroupsContains(LdapGroups.READN_ONLY);
  }

  refreshToken(refreshToken): Observable<JwtTokenResponse> {
    return this.http.post<any>(LDAP_API_URL + '/refreshToken', new RefreshTokenRequest(refreshToken),
      {headers: httpHeaders});
  }

  hasCollectorRole() {
    return this.userGroupsContains(LdapGroups.COLLECTOR);
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (Error) {
        console.error('Error decoding JWT:', Error);
        return null;
      }
    }
    return null;
  }

  getUserDetails(): any | null {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      // The payload contains the user details, e.g., 'sub' for user ID, 'name', 'email', 'roles' etc.
      // The exact keys depend on how your backend constructs the JWT.
      return {
        userId: decodedToken.sub, // 'sub' is a common claim for subject/user ID
        username: decodedToken.username,
        email: decodedToken.email,
        roles: decodedToken.roles // If roles are included
        // ... other user details
      };
    }
    return null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [{
  provide: AuthService, useClass: AuthService
}];
