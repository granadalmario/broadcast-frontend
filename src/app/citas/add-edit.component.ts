import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

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
        } else {
            this.updateEmpleado();
        }
    }

    private createEmpleado() {
        this.accountService.registerEmpleado(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Empleado added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateEmpleado() {
        this.accountService.updateEmpleado(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Empleado successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}