import { Component } from '@angular/core';

import { User } from '@app/_models';
import { Empleado } from '@app/_models';

import { AccountService } from '@app/_services';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {Data} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {map} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    empleado: Empleado;
    ws = new WebSocket('ws://192.168.1.134:5000');
    audioSource: any;
    domSanitizer: DomSanitizer;

    constructor(private accountService: AccountService, private sanitizer: DomSanitizer) {
        this.user = this.accountService.userValue;
        this.empleado = this.accountService.empleadoValue;
        this.domSanitizer = sanitizer;

        this.createObservableSocket('ws://192.168.1.134:5000')
            .subscribe(
                data => {
                        console.log(data);
                        //const url = URL.createObjectURL(data);
                        //this.audioSource = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
                        //const binary = convertDataURIToBinary(data);
                        new Response(data).arrayBuffer()
                            .then((buffer) => this.createSoundWithBuffer(buffer));
                    },
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
                    observer.next(event.data);
                };
                this.ws.onerror = (event) => observer.error(event);
                this.ws.onclose = (event) => observer.complete();
                return () =>
                    this.ws.close(1000, "The user disconnected");
            }
        );
    }

    processConcatenatedFile( data ) {
        const bb = new DataView( data );
        let offset = 0;

        while( offset < bb.byteLength ) {
            const length = bb.getUint16(offset, true);
            offset += 2;
            const sound = this.extractBuffer(data, offset, length);
            offset += length;
            if (offset % 2 !== 0) { offset++; }
            this.createSoundWithBuffer(sound.buffer);
        }

    }

    extractBuffer( src, offset, length ) {
        const dstU8 = new Uint16Array( length );
        const srcU8 = new Uint16Array( src, offset, length );
        dstU8.set( srcU8 );
        return dstU8;
    }

    createSoundWithBuffer( buffer ) {
        /*
        This audio context is unprefixed!
        */

        const context = new AudioContext();
        const audioSource = context.createBufferSource();
        audioSource.connect( context.destination );

        context.decodeAudioData( buffer).then(( res ) => {
            audioSource.buffer = res;
            /*
              Do something with the sound, for instance, play it.
              Watch out: all the sounds will sound at the same time!
            */
            audioSource.start( 0 );
        } );

    }

}
