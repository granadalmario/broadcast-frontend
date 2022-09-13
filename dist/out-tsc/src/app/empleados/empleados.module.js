import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpleadosRoutingModule } from './empleados-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
let EmpleadosModule = class EmpleadosModule {
};
EmpleadosModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            EmpleadosRoutingModule
        ],
        declarations: [
            LayoutComponent,
            ListComponent,
            AddEditComponent
        ]
    })
], EmpleadosModule);
export { EmpleadosModule };
//# sourceMappingURL=empleados.module.js.map