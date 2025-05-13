import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private apiUrl = 'http://localhost:3000/api/pet/myPets';

  constructor(private http: HttpClient, private auth: AuthService, private storage: AngularFireStorage) { }

  getPets(): Observable<any> {
    return this.auth.getUserToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(this.apiUrl, { headers });
      }),
      switchMap((response: any) => {
        return from(
          Promise.all(
            response.data.list.map(async (pet: any) => {
              pet.photoUrl = await this.getPetPhotoUrl(pet.id);
              return pet;
            })
          )
        );
      })
    );
  }

  private getPetPhotoUrl(petId: string): Promise<string | null> {
    const filePath = `pets/${petId}/thumb`;
    return this.storage.ref(filePath).getDownloadURL().toPromise()
      .then(url => {
        return url;
      })
      .catch(error => {
        console.error("Erro ao obter a URL da foto:", error);
        return null;
      });
  }
}
