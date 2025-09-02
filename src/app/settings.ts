import {HttpHeaders} from '@angular/common/http';
import {Routes} from '@angular/router';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {PaymentsComponent} from './payments/payments.component';
import {AuthGuard} from './auth/auth-guard.service';
import {RawPaymentsComponent} from './raw-payments/raw-payments.component';
import {AutoPaymentsComponent} from './auto-payments/auto-payments.component';
import {B2bPaymentsComponent} from './b2b-payments/b2b-payments.component';
import {PaymentComponent} from './payment/payment.component';
import {ClientsComponent} from './clients/clients.component';
import {MobipayComponent} from './mobipay/mobipay.component';
import {ClientPaymentsComponent} from './clients/payments/client-payments.component';
import {RegistriesComponent} from './public-registry/registries/registries.component';
import {RegistryComponent} from './public-registry/registry/registry.component';
import {TemplatesComponent} from './template/templates/templates.component';
import {TemplateComponent} from './template/template/template.component';
import {EditClientProfileComponent} from './clients/profile/edit-client-profile/edit-client-profile.component';
import {NoAccessComponent} from './auth/no-access/no-access.component';
import {DeferredPaymentsComponent} from './deferred/deferred-payments/deferred-payments.component';
import {HiddenPaymentsComponent} from './hidden/hidden-payments/hidden-payments.component';
import {ImportComponent} from './import/import.component';
import {CollectorComponent} from './collector/collector/collector.component';
import {CollectorPaymentsComponent} from './collector/collector-payments/collector-payments.component';
import {AddCollectorComponent} from './collector/add-collector/add-collector.component';

export enum navpath {
  payments = 'payments',
  hidden = 'hidden',
  mobipay = 'mobipay',
  b2b = 'b2b',
  raw = 'raw',
  auto = 'auto',
  clients = 'clients',
  registries = 'registries',
  deferred = 'deferred',
  import = 'import',
  collector = 'collector',
  login = 'login',
  collector_payments = 'collector-payments',
  collector_add = 'collector-add'
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: navpath.payments,
    pathMatch: 'full'
  },
  {
    path: navpath.login,
    component: LoginPageComponent,
    data: {
      breadcrumb: 'Логин'
    }
  },
  {
    path: navpath.payments,
    component: PaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Платежи',
    data: {
      breadcrumb: 'Платежи'
    },
  },
  {
    path: navpath.raw,
    component: RawPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Неизвестные платежи',
    data: {
      breadcrumb: 'Неизвестные платежи'
    }
  },
  {
    path: navpath.auto,
    component: AutoPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Автоматические платежи',
    data: {
      breadcrumb: 'Автоматические платежи'
    }
  },
  {
    path: navpath.b2b,
    component: B2bPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'B2B платежи',
    data: {
      breadcrumb: 'B2B платежи'
    }
  },
  {
    path: 'payments/:id',
    component: PaymentComponent,
    canActivate: [AuthGuard],
    title: 'Платеж',
    data: {
      breadcrumb: 'Платеж'
    }
  },
  {
    path: navpath.clients,
    component: ClientsComponent,
    canActivate: [AuthGuard],
    title: 'Клиенты',
    data: {
      breadcrumb: 'Клиенты'
    }
  },
  {
    path: navpath.mobipay,
    component: MobipayComponent,
    canActivate: [AuthGuard],
    title: 'Мобипей',
    data: {
      breadcrumb: 'Мобипей'
    }
  },
  {
    path: 'clients/:id/payments',
    component: ClientPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Платежи клиента',
    data: {
      breadcrumb: 'Платежи клиента'
    }
  },
  {
    path: navpath.registries,
    component: RegistriesComponent,
    canActivate: [AuthGuard],
    title: 'Публичные электронные реестры',
    data: {
      breadcrumb: 'Публичные электронные реестры'
    }
  },
  {
    path: 'registries/:id',
    component: RegistryComponent,
    canActivate: [AuthGuard],
    title: 'Публичный электронный реестр',
    data: {
      breadcrumb: 'Публичный электронный реестр'
    }
  },
  {
    path: 'company/:id/templates',
    component: TemplatesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Шаблоны'
    }
  },
  {
    path: 'templates/:id',
    component: TemplateComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Шаблон'
    }
  },
  {
    path: 'profile/:id',
    component: EditClientProfileComponent,
    canActivate: [AuthGuard],
    title: 'Профиль клиента',
    data: {
      breadcrumb: 'Профиль клиента'
    }
  },
  {
    path: 'no-access',
    component: NoAccessComponent,
    title: 'Нет доступа'
  },
  {
    path: navpath.deferred,
    component: DeferredPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Отложенные платежи',
    data: {
      breadcrumb: 'Отложенные платежи'
    }
  },
  {
    path: navpath.hidden,
    component: HiddenPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Скрытые платежи',
    data: {
      breadcrumb: 'Скрытые платежи'
    }
  },
  {
    path: navpath.import,
    component: ImportComponent,
    canActivate: [AuthGuard],
    title: 'Импорт банковских платежей',
    data: {
      breadcrumb: 'Импорт банковских платежей'
    }
  },
  {
    path: navpath.collector,
    component: CollectorComponent,
    canActivate: [AuthGuard],
    title: 'Справочник ЧСИ',
    data: {
      breadcrumb: 'Справочник ЧСИ'
    }
  },
  {
    path: navpath.collector_payments,
    component: CollectorPaymentsComponent,
    canActivate: [AuthGuard],
    title: 'Платежи ЧСИ',
    data: {
      breadcrumb: 'Платежи ЧСИ'
    }
  },
  {
    path: navpath.collector_add,
    component: AddCollectorComponent,
    canActivate: [AuthGuard],
    title: 'Добавить в справочник ЧСИ',
    data: {
      breadcrumb: 'Добавить в справочник ЧСИ'
    }
  },
  // Внимание! Этот маршрут должен быть самым последним
  {
    path: '**',
    redirectTo: ''
  }];

export enum PaymentStatus {
  NEW = 0,
  DISTRIBUTED = 1,
  ERR = 2,
  EXPIRED = 3,
  CANCELLED = 4,
  SCHEDULED = 5,
  TRANSIT = 6,
  TRANSIT_DISTRIBUTED = 7,
  TRANSIT_CANCELLED = 8,
  TRANSIT_ERR = 9,
  DEFERRED = 10,
  BLOCKED = 11
}

export enum PaymentStatusRu {
  'Новый',
  'Разнесён',
  'Ошибка',
  'Просрочен',
  'Удалён',
  'Запланирован',
  'На транзитном счёте',
  'Разнесён с транзитного счёта',
  'Удалён с транзитного счёта',
  'Ошибка разнесения с тразитного счёта',
  'Отложен',
  'Блокирован'
}

export const httpHeaders = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

export enum LOCAL_STORAGE_ITEMS {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
  USER = 'username',
  USER_GROUPS = 'groups'
}

export const msisdnLength = 10;
export const msisdnLengthCity = 11;

/**
 * Меню платежа
 */
export enum PaymentMenuItems {
  LOAD_EQUIPMENT,
  DISTRIBUTE,
  REGISTRY,
  DEFER,
  DEL_TRANSIT,
  TRANSIT,
  DEL,
  TEMPLATE,
  CANCEL_DEFERRED,
  CANCEL_MOBIPAY,
  DOWNLOAD_REGISTRY,
  DISTRIBUTE_MOBIPAY
}

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const REGISTRY_LENGTH = 20;

export const DETAILS_NUMBER_FOR_ASYNC_DISTRIBUTION = 20;

/**
 * Константы и настройки приложения
 */
export class Settings {
}


