import {Component, Input, OnInit} from '@angular/core';
import {Registry} from '../model/registry';
import { NgClass, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-registry-properties',
    templateUrl: './registry-properties.component.html',
    styleUrls: ['./registry-properties.component.scss'],
    imports: [NgClass, CurrencyPipe]
})
export class RegistryPropertiesComponent implements OnInit {

    @Input() registry: Registry;

    ngOnInit() {
    }

}
