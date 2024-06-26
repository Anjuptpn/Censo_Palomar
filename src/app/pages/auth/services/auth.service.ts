import { Injectable, inject } from '@angular/core';
import { Auth, EmailAuthProvider, User, authState, createUserWithEmailAndPassword, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from '@angular/fire/auth';
import { UserInterface } from '../../../models/user.model';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StorageService } from '../../../services-shared/storage.service';
import { FirebaseService } from '../../../services-shared/firebase.service';

interface RespuestaDeError{
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject (Auth);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private firebaseService = inject(FirebaseService);

  constructor() { }

  async userSignup(imageFile: File, userData: UserInterface, role = 'Colombófilo'): Promise<void>{
    try{
      //Aquí se extrae el objeto User del Usercredentials que devuelve.
      const { user } = await createUserWithEmailAndPassword( this.auth, userData.email, userData.password);
      if (user){
        userData.id = user.uid;
        userData.rol = role;
        userData.password = '-';
        userData.registerDate = Timestamp.fromDate(new Date());
        if (imageFile.name !== 'null.null'){
          userData.urlImage = await this.storageService.uploadImage(imageFile, 'perfiles-usuarios');
        } else {
          userData.urlImage = "https://firebasestorage.googleapis.com/v0/b/censo-palomar.appspot.com/o/perfiles-usuarios%2Fcirculo-grande-500.png?alt=media&token=5aba1c10-7acf-4da5-8b0a-72e1ac2bfe56"
        }
        //this.saveUserData(userData);
        this.firebaseService.saveInFirestore(userData, 'usuarios', user.uid);
        this.sendVerificationEmail(user);
        this.router.navigate(['/auth/email-verification']);        
      }      
    } catch (error) {
      throw(this.extractErrorCode(error));
    }
  }

  //Devuelve el estado del usuario
  get currentUserState(){
    return authState(this.auth);
  }

  async sendVerificationEmail (user: User): Promise<void>{
    try{
      await sendEmailVerification(user);
    }catch (error) {
      throw(this.extractErrorCode(error));
    }
  }

  //Inicio de Sesión
  async loginWithEmailAndPassword (email: string, password: string): Promise<void>{
    try{
      const { user } = await signInWithEmailAndPassword (this.auth, email, password);
      this.checkIfMailIsVerificated(user);
    } catch (error){
      throw(this.extractErrorCode(error));
    }
  }

  private checkIfMailIsVerificated (user: User) :void{
    const verified = user.emailVerified;
    const route = verified ? 'user/pigeon-list' : '/auth/email-verification';
    this.router.navigate([route]);
  }

  //Recuperación de contraseña
  async sendLinkToRecoveryPassword (email: string): Promise<void>{
    try{
      await sendPasswordResetEmail(this.auth, email);
    } catch (error){
      throw(this.extractErrorCode(error));
    }
  }

  //Cerrar Sesión
  async logout(){
    try {
      await this.auth.signOut();
    }catch (error){
      throw(this.extractErrorCode(error));
    }    
  }

  private extractErrorCode(error: any){
    const {code} = error as RespuestaDeError;
    return code;      
  }

  async getUserInfoFromFirebase(id: string){
    try{      
      const response = await this.firebaseService.getDocumentFromFirebase(id, 'usuarios');
      return response.data() as UserInterface;
    } catch (error){
      throw(this.extractErrorCode(error));
    }
  }

    //Pendiente (actualizar Usuario)
    async changePassword(oldPassword: string, newPassword: string, user: User): Promise<boolean>{
      if(user.email == null){
        return false;
      }
      try{
        const credentials = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credentials);
        await updatePassword(user, newPassword)
        return true;
        
      } catch (error){
        throw(this.extractErrorCode(error));
        return false;
      }
      

    }
}
