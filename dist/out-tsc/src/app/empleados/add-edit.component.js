import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
let AddEditComponent = class AddEditComponent {
    constructor(formBuilder, route, router, accountService, alertService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.alertService = alertService;
        this.loading = false;
        this.submitted = false;
    }
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', passwordValidators],
            link: ['', Validators.required],
            nacionalidad: ['', Validators.required],
            ciudad: ['', Validators.required],
            edad: ['', Validators.required],
            email: ['', Validators.required],
            movil: ['', Validators.required],
            altura: ['', Validators.required],
            peso: ['', Validators.required],
        });
        if (!this.isAddMode) {
            this.accountService.getEmpleadoById(this.id)
                .pipe(first())
                .subscribe(x => {
                this.f.firstName.setValue(x.firstName);
                this.f.lastName.setValue(x.lastName);
                this.f.username.setValue(x.username);
                this.f.link.setValue(x.link);
                this.f.nacionalidad.setValue(x.nacionalidad);
                this.f.ciudad.setValue(x.ciudad);
                this.f.edad.setValue(x.edad);
                this.f.email.setValue(x.email);
                this.f.movil.setValue(x.movil);
                this.f.altura.setValue(x.altura);
                this.f.peso.setValue(x.peso);
            });
        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        if (this.isAddMode) {
            this.createEmpleado();
        }
        else {
            this.updateEmpleado();
        }
    }
    createEmpleado() {
        this.accountService.registerEmpleado(this.form.value)
            .pipe(first())
            .subscribe(data => {
            this.alertService.success('Empleado added successfully', { keepAfterRouteChange: true });
            this.router.navigate(['.', { relativeTo: this.route }]);
        }, error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
    updateEmpleado() {
        this.accountService.updateEmpleado(this.id, this.form.value)
            .pipe(first())
            .subscribe(data => {
            this.alertService.success('Empleado successful', { keepAfterRouteChange: true });
            this.router.navigate(['..', { relativeTo: this.route }]);
        }, error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
};
AddEditComponent = __decorate([
    Component({ templateUrl: 'add-edit.component.html' })
], AddEditComponent);
export { AddEditComponent };
//# sourceMappingURL=add-edit.component.js.map