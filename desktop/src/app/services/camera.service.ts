import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor() { }

  async permission(): Promise<boolean> {
    var mer = await Camera.checkPermissions();
    if (mer.camera === "granted") return true;
    if (mer.camera === "denied") return false;
    if (mer.camera === "prompt") return true;
    return false;
  }


  async GetCamera(): Promise<Photo> {
    var photo = await Camera.getPhoto({
      allowEditing: false,
      quality: 50,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64
    });

    return photo;
  }
}
