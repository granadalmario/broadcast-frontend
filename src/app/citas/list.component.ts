import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService, AlertService} from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    results = false;
    empleados = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}



    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
        });
        this.results = false;       
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
        this.searchEmpleados();
        
    }
 
    private searchEmpleados() {
        this.accountService.getEmpleadosByName(this.form.value.firstName)
        .pipe(first())
        .subscribe(empleados => this.empleados = empleados);
        if (this.empleados) this.results= true;

    }
    


}