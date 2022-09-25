import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
    ws: WebSocket;

    createObservableSocket(socketPort: string): Observable<any> {
        this.ws = new WebSocket(environment.socketUrl + ':' + socketPort);
        return new Observable(
            observer => {
                this.ws.onopen = (event: MessageEvent) => console.log('opened');
                this.ws.onmessage = (event) => {
                    observer.next(event.data);
                };
                this.ws.onerror = (event) => observer.error(event);
                this.ws.onclose = (event) => observer.complete();
                return () =>
                    this.ws.close(1000, 'The user disconnected');
            }
        );
    }
}

