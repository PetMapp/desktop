import { Injectable } from '@angular/core';
import { Auth, 
         signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, 
         signOut, 
         GoogleAuthProvider, 
         signInWithPopup, 
         fetchSignInMethodsForEmail, 
         updateProfile, 
         User } from '@angular/fire/auth';

import { from, Observable, of, switchMap, firstValueFrom } from 'rxjs';
import { ApiServiceService } from './api-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private api: ApiServiceService,
    private router: Router
  ) {}

  // 🔥 Login com Google
  async googleLogin(): Promise<string | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const token = await result.user?.getIdToken() ?? null;
      if (token) {
        this.api.registerHeader(token);
      }
      return token;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return null;
    }
  }

  // ✔️ Verificar se o email já está registrado
  async checkEmail(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }

  // ✔️ Registro com nome e foto de perfil
  async register(email: string, password: string, displayName: string, profilePicURL: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName, photoURL: profilePicURL });
        const token = await user.getIdToken();
        this.api.registerHeader(token);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }

  // ✔️ Login com email e senha
  async login(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        const token = await result.user.getIdToken();
        this.api.registerHeader(token);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // ✔️ Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('usuarioLogado');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  // ✔️ Verificar estado de autenticação (Promise)
  async getAuthState(): Promise<User | null> {
    return this.auth.currentUser;
  }

  // ✔️ Observar usuário logado (Observable)
  getUserLogged(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => observer.next(user),
        (error) => observer.error(error),
        () => observer.complete()
      );
      return { unsubscribe };
    });
  }

  // ✔️ Observar token do usuário
  getUserToken(): Observable<string | null> {
    return this.getUserLogged().pipe(
      switchMap((user) => {
        if (user) {
          return from(user.getIdToken());
        } else {
          return of(null);
        }
      })
    );
  }

  // ✔️ Validar autenticação (se não tiver usuário, redireciona)
  async validateAuth(): Promise<User | null> {
    try {
      const user = await firstValueFrom(this.getUserLogged());
      if (user) {
        const token = await user.getIdToken();
        this.api.registerHeader(token);
        return user;
      } else {
        this.router.navigate(['/login']);
        return null;
      }
    } catch (error) {
      console.error('Erro ao validar auth:', error);
      return null;
    }
  }

  getUserById(id: string): Promise<any> {
    return this.api.get(`/auth/user/${id}`);
  }

  // ✔️ Obter usuário atual diretamente
  getUsuarioLogado(): User | null {
    return this.auth.currentUser;
  }
}
