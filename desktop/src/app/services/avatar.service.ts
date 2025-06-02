import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private storage = getStorage();
  private avatars$: Observable<string>[] = [];

  constructor() {
    this.loadAvatars();
  }

  private loadAvatars() {
    const avatarPaths = [
      'imagens/avatar/avatar1.png',
      'imagens/avatar/avatar2.png',
      'imagens/avatar/avatar3.png',
      'imagens/avatar/avatar4.png',
      'imagens/avatar/avatar5.png'
    ];

    avatarPaths.forEach(path => {
      const imageRef = ref(this.storage, path);
      const url$ = from(getDownloadURL(imageRef));
      this.avatars$.push(url$);
    });
  }

  public getAvatars(): Observable<string>[] {
    return this.avatars$;
  }

  public getRandomAvatar(): Observable<string> {
    const randomIndex = Math.floor(Math.random() * this.avatars$.length);
    return this.avatars$[randomIndex];
  }
}
