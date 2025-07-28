import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

// Firebase modular
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private apiUrl = 'http://localhost:3000/api/pet/myPets';
  private storage = getStorage();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

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
              console.log('Pet', pet);
              return pet;
            })
          )
        );
      })
    );
  }

  private async getPetPhotoUrl(petId: string): Promise<string | null> {
    const filePath = `pets/${petId}/thumb`;
    const fileRef = ref(this.storage, filePath);

    try {
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.error('Erro ao obter a URL da foto:', error);
      return null;
    }
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  registerPetFromBase64(data: {
    apelido: string;
    descricao: string;
    localizacao: string;
    coleira: boolean;
    status: string;
    imagemBase64: string; // <-- Base64 da imagem com prefixo data:image/...
  }): Observable<any> {
    const imagemFile = this.base64ToFile(data.imagemBase64, 'thumb.jpg');

    return this.registerPet({
      apelido: data.apelido,
      descricao: data.descricao,
      localizacao: data.localizacao,
      coleira: data.coleira,
      status: data.status,
      imagem: imagemFile
    });
  }

  registerPet(data: {
    apelido: string;
    descricao: string;
    localizacao: string;
    coleira: boolean;
    status: string;
    imagem: File;
    isMissing?: boolean;
    missingSince?: string | null;
    lastSeenLocation?: string | null;
  }): Observable<any> {
    const url = 'http://localhost:3000/api/pet/find/register';

    const formData = new FormData();
    formData.append('apelido', data.apelido);
    formData.append('descricao', data.descricao);
    formData.append('localizacao', data.localizacao);
    formData.append('coleira', data.coleira.toString());
    formData.append('status', data.status);
    formData.append('img', data.imagem);
    formData.append('isMissing', data.isMissing ? 'true' : 'false');

    return this.auth.getUserToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post(url, formData, { headers });
      })
    );
  }
}
