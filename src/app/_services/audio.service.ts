import {Injectable} from '@angular/core';
import {User} from '@app/_models';
import {environment} from '@environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
    private socketPortSubject: BehaviorSubject<string>;
    context: AudioContext;
    audioSource: AudioBufferSourceNode;
    constructor(private http: HttpClient) {
        this.context = new AudioContext();
    }

    getSocketFromLanguage(language: string) {
        return this.http.get<string>(`${environment.apiUrl}/audio/play/${language}`);
    }

    playSoundWithBuffer( buffer ) {
        this.audioSource = this.context.createBufferSource();
        this.audioSource.connect( this.context.destination );

        this.context.decodeAudioData(buffer).then(( res ) => {
            this.audioSource.buffer = res;
            this.audioSource.start( 0 );
        } );
    }

    stopSound() {
        this.audioSource.stop(0);
    }
}