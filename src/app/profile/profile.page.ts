import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  private sub: any;
  authenticated: boolean;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.sub = this.afAuth.authState.subscribe(auth => {
      if (auth != null) {
        this.authenticated = true;
      }
    }
    )
  }


  logout() {
    this.afAuth.auth.signOut();
    this.authenticated = false;
    this.router.navigate(['./login']);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
