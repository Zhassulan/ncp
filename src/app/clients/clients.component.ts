import {Component} from '@angular/core';
import {ClientsListComponent} from './list/clients-list.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [
    ClientsListComponent
  ],
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
}
