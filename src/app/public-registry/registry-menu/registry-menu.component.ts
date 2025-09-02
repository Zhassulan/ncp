import {Component, Input, OnInit} from '@angular/core';
import {ExcelService} from '../../excel/excel.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-registry-menu',
    templateUrl: './registry-menu.component.html',
    styleUrls: ['./registry-menu.component.scss'],
    imports: [MatIconButton, MatTooltip, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem]
})
export class RegistryMenuComponent implements OnInit {

  @Input() registry;

  constructor(private excelService: ExcelService) { }

  ngOnInit(): void {
  }

  export() {
    this.excelService.save(this.registry.details);
  }

}
