import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {environment} from '../../environments/environment';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {BreadcrumbModule} from 'xng-breadcrumb';
import {NgFor, NgIf} from '@angular/common';
import {navpath} from '../settings';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

@Component({
  selector: 'app-menu-toolbar',
  templateUrl: './menu-toolbar.component.html',
  styleUrls: ['./menu-toolbar.component.scss'],
  imports: [MatSidenavContainer, MatSidenav, MatToolbar, MatNavList, MatListItem, RouterLink, RouterLinkActive,
    MatSidenavContent, MatToolbarRow, MatIconButton, MatTooltip, MatIcon, BreadcrumbModule, RouterOutlet, NgFor, NgIf]
})
export class MenuToolbarComponent {

  routes: ROUTE[] = [
    {
      icon: 'credit_card',
      route: navpath.payments,
      title: 'Платежи',
    },
    {
      icon: 'credit_card',
      route: navpath.raw,
      title: 'Неизвестные платежи',
    },
    {
      icon: 'credit_card',
      route: navpath.auto,
      title: 'Автоматические платежи',
    },
    {
      icon: 'more_time',
      route: navpath.deferred,
      title: 'Отложенные платежи',
    },
    {
      icon: 'credit_card',
      route: navpath.b2b,
      title: 'B2B платежи',
    },
    {
      icon: 'dashboard',
      route: navpath.clients,
      title: 'Клиенты',
    },
    {
      icon: 'dashboard',
      route: navpath.mobipay,
      title: 'Mobipay',
    },
    {
      icon: 'assignment_ind',
      route: navpath.registries,
      title: 'Реестры',
    },
    {
      icon: 'hide_source',
      route: navpath.hidden,
      title: 'Скрытые платежи',
    },
    {
      icon: 'sync',
      route: navpath.import,
      title: 'Импорт',
    },
    {
      icon: 'credit_card_clock',
      route: navpath.collector,
      title: 'Справочник ЧСИ',
    },
    {
      icon: 'credit_card',
      route: navpath.collector_payments,
      title: 'Платежи ЧСИ',
    }
  ];

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authService: AuthService,
              private router: Router) {

    this.initRoutes();
  }

  logout() {
    this.authService.logout();
    this.router.navigate([navpath.login]);
  }

  getUser() {
    if (this.authService.isLogged()) {
      return this.authService.getUser();
    }

    return '';
  }

  isDevMode() {
    return !environment.production;
  }

  initRoutes() {
    if (!this.authService.hasHiddenRole()) {
      this.routes = this.removeRoute(this.routes, navpath.hidden);
    }
    if (!this.authService.hasMobipayRole()) {
      this.routes = this.removeRoute(this.routes, navpath.mobipay);
    }
    if (!this.authService.hasViewB2bPaymentsRole()) {
      this.routes = this.removeRoute(this.routes, navpath.b2b);
    }
    if (!this.authService.hasCollectorRole()) {
      this.routes = this.removeRoute(this.routes, navpath.collector);
      this.routes = this.removeRoute(this.routes, navpath.collector_payments);
    }
  }

  removeRoute(routes: ROUTE[], path: string) {
    return routes.filter((ele) => ele.route !== path);
  }

  leaveOnlyOneRoute(routes: ROUTE[], path: string) {
    return routes.filter((ele) => ele.route === path);
  }

  getColor() {
    return this.isDevMode() ? '#0db405' : '#3F51B5';
  }
}
