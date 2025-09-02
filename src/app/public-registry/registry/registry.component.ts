import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCard} from '@angular/material/card';
import {RegistryMenuComponent} from '../registry-menu/registry-menu.component';
import {RegistryPropertiesComponent} from '../registry-properties/registry-properties.component';
import {RegistryDetailsComponent} from '../registry-details/registry-details.component';
import {DatePipe} from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {PublicRegistryService} from '../public-registry.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss'],
  imports: [MatCard, RegistryMenuComponent, RegistryPropertiesComponent, MatDividerModule, RegistryDetailsComponent, DatePipe]
})
export class RegistryComponent implements OnInit {

  registry;

  constructor(private registryService: PublicRegistryService,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.registryService.findById(this.route.snapshot.params['id']).subscribe({
      next: data => this.registry = data,
      error: error => {
        console.log(error);
        this.snackbar.open('Ошибка загрузки реестра', 'OK');
      }
    });
  }
}
