import { Component } from '@angular/core';

import { User } from '@app/_models';
import { Empleado } from '@app/_models';

import {AccountService, WebsocketService} from '@app/_services';
import {AudioService} from '@app/_services/audio.service';
import {Subscription} from 'rxjs';
import {first, map} from 'rxjs/operators';


@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.scss'] })
export class HomeComponent {
    user: User;
    empleado: Empleado;
    websocket: Subscription;
    selectedLanguage: string;
    statusText: string;

    constructor(private accountService: AccountService, private websocketService: WebsocketService, private audioService: AudioService) {
        this.user = this.accountService.userValue;
        this.empleado = this.accountService.empleadoValue;
        this.setStatusText();
    }

    play_stop(language: string) {
        if (language !== this.selectedLanguage) {
            this.stop();
            this.selectedLanguage = language;
            this.audioService.getSocketFromLanguage(language).subscribe(socketPort => {
                this.playSoundFromSocket(socketPort);
            });
        }
        else {
            this.stop();
        }
        this.setStatusText();
    }

    stop() {
        if (this.websocket) {
            this.websocket.unsubscribe();
            this.websocket = null;
            this.selectedLanguage = null;
            this.audioService.stopSound();
        }
    }

    private playSoundFromSocket(socketPort: string) {
        this.websocket = this.websocketService.createObservableSocket(socketPort).subscribe(data => {
                console.log(data);
                new Response(data).arrayBuffer()
                    .then((buffer) => this.audioService.playSoundWithBuffer(buffer));

            },
            err => console.log( 'err'),
            () =>  console.log( 'The observable stream is complete')
        );
    }

    private setStatusText() {
        switch (this.selectedLanguage) {
            case 'ct': {
                this.statusText = 'Reproduint en Català, premi un altre cop per aturar-ho o una altra bandera per canviar d\'idioma';
                break;
            }
            case 'es': {
                this.statusText = 'Reproduciendo en castellano, pulse de nuevo para detenerlo u otra bandera para cambiar de idioma';
                break;
            }
            case 'en': {
                this.statusText = 'Playing english, press again to pause or other flag to change the language';
                break;
            }
            case 'fr': {
                this.statusText = 'Lecture en français, appuyez à nouveau pour mettre en pause ou autre drapeau pour changer de langue';
                break;
            }
            case 'de': {
                this.statusText = 'Wenn Sie auf Deutsch spielen, drücken Sie erneut, um es anzuhalten, oder eine andere Flagge, um die Sprache zu ändern';
                break;
            }
            case 'it': {
                this.statusText = 'Giocando in italiano, premi di nuovo per metterlo in pausa o un\'altra bandiera per cambiare lingua';
                break;
            }
            case 'pt': {
                this.statusText = 'Jogando em português, pressione novamente para pausar ou outra bandeira para mudar o idioma';
                break;
            }
            case 'nl': {
                this.statusText = 'Spelen in het Nederlands, druk nogmaals om het te pauzeren of een andere vlag om van taal te veranderen';
                break;
            }
            case 'se': {
                this.statusText = 'Spelar svenska, tryck igen för att pausa eller en annan flagga för att byta språk';
                break;
            }
            case 'no': {
                this.statusText = 'Når du spiller på norsk, trykk på nytt for å sette det på pause eller et annet flagg for å endre språk';
                break;
            }
            case 'ru': {
                this.statusText = 'Играя на норвежском языке, нажмите еще раз, чтобы приостановить его, или другой флажок, чтобы изменить язык.';
                break;
            }
            case 'jp': {
                this.statusText = 'ノルウェー語で再生中。もう一度押すと一時停止、別のフラグを押すと言語が変わります';
                break;
            }
            case 'zh': {
                this.statusText = '用挪威语播放，再按一下暂停或另一个标志更改语言';
                break;
            }
            case 'sa': {
                this.statusText = 'Reproduint en Català, premi un altre cop per aturar-ho o una altra bandera per canviar d\'idioma';
                break;
            }
            case 'il': {
                this.statusText = 'לשנות שפה משחק בעברית, לחץ שוב כדי להשהות אותו או דגל אחר כדי';
                break;
            }
            case 'tr': {
                this.statusText = 'Türkçe oynarken, duraklatmak için tekrar basın veya dili değiştirmek için başka bir bayrağa basın';
                break;
            }
            default: {
                this.statusText = 'Select the audio';
                break;
            }
        }
    }

}
