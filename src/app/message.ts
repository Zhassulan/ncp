export class Message {

  static OK = {
    TRANSIT: 'Платёж успешно перенесён на тразнитный счёт',
    TRANSIT_DELETED: 'Платёж успешно удалён с транзитного счёта',
    DISTRIBUTED: 'Платёж успешно разнесён',
    MOBIPAY_CHANGED: 'Mobipay платёж изменён',
    PAYMENT_DELETED: 'Платёж успешно удалён',
    MOBIPAY_DISTR: 'Платёж Mobipay успешно разнесён',
    MOBIPAY_CANCELED: 'Платёж Mobipay успешно отменен',
    PROCESSED: 'Запрос успешно обработан',
    DEFERRED: 'Платеж успешно отложен',
    BUSY: 'Платёж в обработке',
  };

  static ERR = {
    ERR: 'Ошибка',
    ACCESS_DENIED: 'Нет доступа',
    INVALID_REGISTRY: 'Ошибочные разноски',
    SERVICE: 'Ошибка сервиса',
    NOT_FOUND: 'Ошибка данных',
    MOBIPAY_DISTRIBUTION: 'Ошибка обработки Mobipay платежа',
    CLIENT: 'Ошибка на вашем компьютере',
    AUTH: 'Ошибка входа',
    BAD_REQUEST: 'Неверный запрос',
    PROPS_LOAD: 'Ошибка загрузки номеров и счетов',
    LOAD_MIN_MAX_DATE: 'Ошибка загрузки данных'
  };

  static WAR = {
    MOBIPAY_PICK_PARTNER: 'Выберите партнера',
    INPUT_NUMBER: 'Введите сумму',
    ENTER_LOGIN_PASSWORD: 'Введите логин и пароль',
    DATA_NOT_FOUND: 'Данные не найдены',
  };

}
