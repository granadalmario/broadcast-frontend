import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, Empleado } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private empleadoSubject: BehaviorSubject<Empleado>;
    public empleado: Observable<Empleado>


    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

        this.empleadoSubject = new BehaviorSubject<Empleado>(JSON.parse(localStorage.getItem('empleado')));
        this.empleado = this.empleadoSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get empleadoValue(): Empleado {
        return this.empleadoSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    registerEmpleado(empleado: Empleado) {
        return this.http.post(`${environment.apiUrl}/empleado/register`, empleado);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getAllEmpleados() {
        return this.http.get<Empleado[]>(`${environment.apiUrl}/empleado`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getEmpleadoById(id: string) {
        return this.http.get<Empleado>(`${environment.apiUrl}/empleado/${id}`);
    }

    getEmpleadosByName(name: string) {
        return this.http.get<Empleado>(`${environment.apiUrl}/empleado/name/${name}`);

    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    updateEmpleado(id, params) {
        return this.http.put(`${environment.apiUrl}/empleado/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    deleteEmpleado(id: string) {
        return this.http.delete(`${environment.apiUrl}/empleado/${id}`);
    }

}