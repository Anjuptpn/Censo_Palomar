import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../auth/services/auth.service';
import { SpinnerService } from '../../../services-shared/spinner.service';
import { UserInterface } from '../../../models/user.model';
import { SnackbarService } from '../../../sections/snackbar/snackbar.service';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [MatIcon, RouterLink, MatButton, CommonModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.sass'
})
export class ListUsersComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);
  private snackbar = inject(SnackbarService);
  userList: UserInterface[] = [];
  userObservable: any;
  
  ngOnInit(): void {
    this.spinnerService.showLoading();
    this.userObservable = this.authService.getAllUsersFromFirebase().subscribe(res => {
      if (res){
        this.userList = res;
      }
      this.spinnerService.stopLoading();
    });
  }

  ngOnDestroy(): void {
    this.userObservable.unsubscribe;
  }


}
