import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FamiliyLeafComponent } from '../familiy-leaf/familiy-leaf.component';
import { FamiliyTreeService } from '../familiy-tree.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../../services/auth.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { FirebaseErrorsService } from '../../../../services/firebase-errors.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { MatButton } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-familiy-tree',
  standalone: true,
  imports: [FamiliyLeafComponent, RouterLink, MatButton],
  templateUrl: './familiy-tree.component.html',
  styleUrl: './familiy-tree.component.sass'
})
export class FamiliyTreeComponent implements OnInit, OnDestroy{

  private readonly familyTreeService = inject(FamiliyTreeService);
  private readonly authService = inject(AuthService);
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly spinnerService = inject(SpinnerService);
  private readonly firebaseErrors = inject(FirebaseErrorsService);
  private readonly snackbar = inject(SnackbarService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  pigeonId: string | null = null;
  currentUser: User | null = null; 
  currentAuthSubscribe: any;
  breakpointSubscribe: any;
  arrayPigeons: any[] = [];
  numberOfparents = 15; //Debe ser un valor que cumpla (2^n - 1)
  showMessage: boolean = false;
  public isSmallScreen: boolean = false;

  

  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.pigeonId = this.activedRoute.snapshot.params['id'];
    //Si es un móvil ver sólo hasta los abuelos.
    this.breakpointSubscribe = this.breakpointObserver.observe('(max-width: 700px)').subscribe(result =>{
      this.isSmallScreen = result.matches
      this.numberOfparents = result.matches ? 7 : 15;
    });
    
    this.currentAuthSubscribe = this.authService.currentUserState.subscribe( (user) => {
      this.currentUser = user as User;
      if (this.pigeonId != null && user != null) this.familyTreeService.getParents(this.pigeonId, user.uid, this.numberOfparents).then(
        response => {
          this.arrayPigeons = response;
          this.spinnerService.stopLoading();
        }        
      ).catch(error => {
        this.spinnerService.stopLoading();
        this.showMessage = true;
        this.snackbar.showSnackBar(this.firebaseErrors.translateErrorCode(error as string),
                             'cerrar',  8,  'snackbar-error');
      });
    });
  }

  isString(value: any): boolean{
    return typeof value === 'string';

  }

   getLevel(index: number): number{
    return Math.floor(Math.log2(index + 1))
   }

   ngOnDestroy(): void {
     this.currentAuthSubscribe.unsubscribe();
     this.breakpointSubscribe.unsubscribe();
   }

}
