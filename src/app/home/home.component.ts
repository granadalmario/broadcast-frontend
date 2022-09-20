import { Component } from '@angular/core';

import { User } from '@app/_models';
import { Empleado } from '@app/_models';

import { AccountService } from '@app/_services';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {Data} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {map} from 'rxjs/operators';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    empleado: Empleado;
    ws = new WebSocket('ws://192.168.1.134:5000');

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.empleado = this.accountService.empleadoValue;

        this.createObservableSocket('ws://192.168.1.134:5000')
            .subscribe(
                data => console.log(data),
                err => console.log( 'err'),
                () =>  console.log( 'The observable stream is complete')
            );

    }
    createObservableSocket(url: string): Observable<any> {
        this.ws = new WebSocket(url);
        return new Observable(
            observer => {
                this.ws.onopen = (event: MessageEvent) => console.log('opened')
                this.ws.onmessage = (event) => {
                    console.log('recibido');
                    observer.next(event.data);
                };
                this.ws.onerror = (event) => observer.error(event);
                this.ws.onclose = (event) => observer.complete();
                return () =>
                    this.ws.close(1000, "The user disconnected");
            }
        );
    }


    play() {

        alert('dentro');
    }
}
