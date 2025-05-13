import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import firebase from 'firebase/compat/app';
import { Capacitor } from '@capacitor/core'
import { firstValueFrom } from 'rxjs'; // Importa a função para converter observable em promise
import { Observable, from } from 'rxjs';
import { ApiServiceService } from './api-service.service';
import { NavController } from '@ionic/angular';
import { GoogleAuth, User, } from '@codetrix-studio/capacitor-google-auth'
import { updateProfile } from 'firebase/auth';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private api: ApiServiceService,
    private nav: NavController,
  ) {
    GoogleAuth.initialize({
      clientId: "241531833745-1pqtns7494nd9bjkptmb672bcgstvsrq.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    });

    // Definindo a persistência para 'local' (mantém a sessão ativa mesmo após recarregar a página)
    // Definindo a persistência para 'SESSION' ou 'LOCAL'
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION) // ou SESSION
      .then(() => {
        console.log('Persistência definida com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao definir persistência:', error);
      });
  }



  async googleLogin(): Promise<string | null> {
    const provider = new firebase.auth.GoogleAuthProvider();

    // Verifica se a plataforma é nativa (Android ou iOS)
    if (Capacitor.isNativePlatform()) {
      try {
        // Para Android (ou dispositivos móveis)
        var user = await GoogleAuth.signIn();

        // Usa o token de autenticação do Google para gerar a credencial no Firebase
        const credential = firebase.auth.GoogleAuthProvider.credential(user.authentication.idToken);
        // Realiza o login no Firebase com o credential gerado
        await this.afAuth.signInWithCredential(credential);

        console.log(user);
        console.log('Login com Google no Android/iOS realizado com sucesso!');

        return user.id;
      } catch (error) {
        return null;
      }
    } else {
      // Para Web
      try {
        // Realiza o login com Google usando o popup no navegador
        var u = await this.afAuth.signInWithPopup(provider);
        return u.user?.getIdToken() ?? null;
      } catch (error) {
        return null;
      }
    }
  }

  isPopupSupported(): boolean {
    // Verifica se o ambiente suporta popup (browsers desktop, por exemplo)
    return !(window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('Android'));
  }

  // Checa e-mail
  async checkEmail(email: string): Promise<boolean> {
    const auth = getAuth();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log('Métodos de login encontrados:', signInMethods);

      if (signInMethods.length > 0) {
        console.log('Email está registrado.');
        return true; // Email encontrado
      } else {
        console.log('Email não está registrado.');
        return false; // Email não encontrado
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false; // Em caso de erro, retorna false
    }
  }

  // Função de registro
  async register(email: string, password: string, displayName: string, profilePicURL: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('Registro bem-sucedido!');

      if (user) {
        await updateProfile(user, { displayName, photoURL: profilePicURL });
        console.log('Perfil atualizado com sucesso!');
      } else {
        console.error('Erro: usuário não encontrado após registro.');
      }

    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }

  async login(email: string, senha: string) {
    var e = await this.afAuth.signInWithEmailAndPassword(email, senha);
    if (e.user) this.api.registerHeader(e.user.uid);
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      console.log('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  async getAuthState(): Promise<firebase.User | null> {
    var e = await this.afAuth.currentUser;
    console.log(e);
    return e;
  }

  // Função não assíncrona para exibir o usuário autenticado no componente Tabs
  getUserLogged(): Observable<firebase.User | null> {
    return this.afAuth.authState; // Retorna um Observable do usuário autenticado
  }

  // Função para obter o token de autenticação do usuário logado
  getUserToken(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // Obtém o token de autenticação se o usuário estiver logado
          return from(user.getIdToken());
        } else {
          return from([null]);
        }
      })
    );
  }



  isSessionStorageAvailable(): boolean {
    try {
      const storage = window.sessionStorage;
      const testKey = '__test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }


  async validateAuth(): Promise<firebase.User | null> {
    try {
      // Usar o Observable para obter o estado de autenticação atualizado
      const user = await firstValueFrom(this.afAuth.user);
      if (user) {
        const idToken = await user.getIdToken();
        console.log({ idToken });
        this.api.registerHeader(idToken);
        return user;
      } else {
        // Redireciona para login se não estiver autenticado
        this.nav.navigateRoot("/login");
        return null;
      }
    } catch (error) {
      console.error('Erro ao validar auth:', error);
      return null;
    }
  }
  usuarioLogado: any = null;

  getUsuarioLogado() {
    const user = firebase.auth().currentUser;
    return user;
  }

  Logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioLogado');
  }
}


