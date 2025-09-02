## NCP FE

### Описание
Приложение входит в группу приложений NCP. Ссылка на [UI Production](https://b2b.tele2.kz/ncp-frontend/#/login).
Ссылка на [UI Test](https://b2b.tele2.kz/ncp-frontend-test/#/login).
Разработан в рамках проекта миграции с Angular версии 1.8 на 2-е поколение
Angular 19. Реализованы основные операции для работы с разноской платежей.
Работает на сервере b2b.tele2.kz [10.200.200.22] в Docker контейнере и маршрутизируется NGinx.
При локальной доработке чтобы не было проблем с аутентификацией (проблема порта,
чтобы принимались аут. куки) надо настроить, включить расширение proxy и запустить
Apache HTTPD с конфигом "D:\dev\apache\httpd\2.4.38\conf\extra\httpd-vhosts.conf".

В котором добавить редирект:

```
<VirtualHost *:80>

	ServerName localhost

	LogLevel debug
                                           
	ProxyPass /ncp/api http://localhost:8080/api
	ProxyPassReverse /api http://localhost:8080/api
	
	ProxyPass /ncp/ui http://localhost:4200
	ProxyPassReverse /ncp/ui http://localhost:4200
                        		
	ProxyPass /sockjs-node http://localhost:4200/sockjs-node
	ProxyPassReverse /sockjs-node http://localhost:4200/sockjs-node
                                           
</VirtualHost>
```
Соответственно контекст приложения будет "/ncp/" ("index.html") и путь к API
"http://localhost/api/v1/ncp".

### Используемые технологии:
- NodeJS
- Angular v.19
- TypeScript
- JavaScript
- Grid CSS
- Docker
- Gitlab CI/CD
- NGinx

### Сборка и публикация приложения
- Внести изменения согласно постановке задачи в ветке develop
- Протестировать локально стартовав в IDE
- Слить изменения в test
- запушить ветки в GitLab
- сборка автоматически пересоберется на сервере 
- протестировать на пользователях
- Слить изменения в master
- Одновременно пушить в тест и затем сразу пушить в мастер нельзя
- запушить ветки в GitLab
- сборка автоматически пересоберется на сервере

### Дата запуска
01.10.2020

### Примечания
Можно собрать вручную. Планируется миграция на React. 

Тест
ng build --configuration=staging

Прод
ng build --configuration=production

Прод старт
ng serve --prod
