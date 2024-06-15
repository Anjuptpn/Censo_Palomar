import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserInterface } from '../../../sections/Models/user.model';
import { DocumentSnapshot, Firestore, Timestamp, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StorageService } from '../../../sections/services-shared/storage.service';

interface RespuestaDeError{
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject (Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private storageService = inject(StorageService);

  constructor() { }

  async userSignup(imageFile: File, userData: UserInterface, role = 'Colombófilo'): Promise<void>{
    try{
      //Aquí se extrae el objeto User del Usercredentials que devuelve.
      const { user } = await createUserWithEmailAndPassword( this.auth, userData.email, userData.password);
      if (user){
        userData.id = user.uid;
        userData.rol = role;
        this.saveUserData(userData, imageFile);
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

  //Guarda los datos en una coleccion de Firebase
  private async saveUserData (userData: UserInterface, imageFile: File){
    if (imageFile.name !== 'null.null'){
      userData.urlImage = await this.storageService.uploadImage(imageFile, 'perfiles-usuarios');
    }
    userData.password = '-';
    userData.registerDate = Timestamp.fromDate(new Date());
    const document = doc(this.firestore, 'usuarios', userData.id); 
    return await setDoc(document, userData);
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
    const route = verified ? 'user/pigeon-register' : '/auth/email-verification';
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

  //Pendiente (actualizar Usuario, traer información del usuario)
  async getUserInfoFromFirebase(id: string){
    try{
      const document = doc(this.firestore, 'usuarios', id);
      const response = await getDoc(document);
      return response.data() as UserInterface;

    } catch (error){
      throw(this.extractErrorCode(error));
    }
  }
}
