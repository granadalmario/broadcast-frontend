import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
let AccountService = class AccountService {
    constructor(router, http) {
        this.router = router;
        this.http = http;
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.empleadoSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('empleado')));
        this.empleado = this.empleadoSubject.asObservable();
    }
    get userValue() {
        return this.userSubject.value;
    }
    get empleadoValue() {
        return this.empleadoSubject.value;
    }
    login(username, password) {
        return this.http.post(`${environment.apiUrl}/users/authenticate`, { username, password })
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
    register(user) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }
    registerEmpleado(empleado) {
        return this.http.post(`${environment.apiUrl}/empleado/register`, empleado);
    }
    getAll() {
        return this.http.get(`${environment.apiUrl}/users`);
    }
    getAllEmpleados() {
        return this.http.get(`${environment.apiUrl}/empleado`);
    }
    getById(id) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }
    getEmpleadoById(id) {
        return this.http.get(`${environment.apiUrl}/empleado/${id}`);
    }
    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
            // update stored user if the logged in user updated their own record
            if (id == this.userValue.id) {
                // update local storage
                const user = Object.assign(Object.assign({}, this.userValue), params);
                localStorage.setItem('user', JSON.stringify(user));
                // publish updated user to subscribers
                this.userSubject.next(user);
            }
            return x;
        }));
    }
    updateEmpleado(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
            // update stored user if the logged in user updated their own record
            if (id == this.userValue.id) {
                // update local storage
                const user = Object.assign(Object.assign({}, this.userValue), params);
                localStorage.setItem('user', JSON.stringify(user));
                // publish updated user to subscribers
                this.userSubject.next(user);
            }
            return x;
        }));
    }
    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
            // auto logout if the logged in user deleted their own record
            if (id == this.userValue.id) {
                this.logout();
            }
            return x;
        }));
    }
    deleteEmpleado(id) {
        return this.http.delete(`${environment.apiUrl}/empleado/${id}`)
            .pipe(map(x => {
            // auto logout if the logged in user deleted their own record
            if (id == this.userValue.id) {
                this.logout();
            }
            return x;
        }));
    }
};
AccountService = __decorate([
    Injectable({ providedIn: 'root' })
], AccountService);
export { AccountService };
//# sourceMappingURL=account.service.js.map