import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    empleados = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllEmpleados()
            .pipe(first())
            .subscribe(empleados => this.empleados = empleados);
    }

    deleteEmpleado(id: string) {
        const user = this.empleados.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deleteEmpleado(id)
            .pipe(first())
            .subscribe(() => {
                this.empleados = this.empleados.filter(x => x.id !== id) 
            });
    }
}