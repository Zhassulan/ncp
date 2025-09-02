import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DlgResultComponent} from './dialog-report/dlg-result.component';
import {DialogData} from './dialog-data';

@Injectable({
    providedIn: 'any',
})
export class DlgService {

    title: string = null;
    dialogData: DialogData[] = [];
    dialogRef;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        this.dialogRef = this.dialog.open(DlgResultComponent, {
            width: '60%',
            data: {
                title: this.title,
                items: this.dialogData
            },
            disableClose: true});
    }

    setTitle(title) {
        this.title = title;
    }

    addItem(msg) {
        this.dialogData.push(new DialogData(msg));
    }

    clear() {
        this.title = null;
        this.dialogData = [];
    }

}
