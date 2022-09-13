import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
let ListComponent = class ListComponent {
    constructor(accountService) {
        this.accountService = accountService;
        this.empleados = null;
    }
    ngOnInit() {
        this.accountService.getAllEmpleados()
            .pipe(first())
            .subscribe(empleados => this.empleados = empleados);
    }
    deleteUser(id) {
        const user = this.empleados.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deleteEmpleado(id)
            .pipe(first())
            .subscribe(() => {
            this.empleados = this.empleados.filter(x => x.id !== id);
        });
    }
};
ListComponent = __decorate([
    Component({ templateUrl: 'list.component.html' })
], ListComponent);
export { ListComponent };
//# sourceMappingURL=list.component.js.map