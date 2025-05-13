import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private avatars$: Observable<string>[] = [];
  
  constructor(private storage: AngularFireStorage) {
    this.loadAvatars();
  }

  private loadAvatars() {
    const avatarPaths = [
      'gs://petmap-6d5f7.appspot.com/imagens/avatar/avatar1.png', // Caminhos dos avatares
      'gs://petmap-6d5f7.appspot.com/imagens/avatar/avatar2.png',
      'gs://petmap-6d5f7.appspot.com/imagens/avatar/avatar3.png',
      'gs://petmap-6d5f7.appspot.com/imagens/avatar/avatar4.png',
      'gs://petmap-6d5f7.appspot.com/imagens/avatar/avatar5.png'
    ];

    avatarPaths.forEach(path => {
      // Use refFromURL para criar a referência a partir da URL
      const imageRef = this.storage.refFromURL(path);
      this.avatars$.push(imageRef.getDownloadURL());
    });
  }

  public getAvatars(): Observable<string>[] {
    return this.avatars$;
  }

  public getRandomAvatar(): Observable<string> {
    const randomIndex = Math.floor(Math.random() * this.avatars$.length);
    return this.avatars$[randomIndex]; // Retorna um Observable da URL aleatória
  }
}
