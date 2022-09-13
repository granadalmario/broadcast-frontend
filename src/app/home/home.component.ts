﻿import { Component } from '@angular/core';

import { User } from '@app/_models';
import { Empleado } from '@app/_models';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    empleado: Empleado;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.empleado = this.accountService.empleadoValue;
    }
}