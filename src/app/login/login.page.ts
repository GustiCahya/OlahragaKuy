import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async presentAlert(title: string, content: string){
      const alert = await this.alertController.create({
          header: title,
          message: content,
          buttons: ['OK']
      });
      await alert.present();
  }

  async login() {
    const { email, password } = this;

    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password);

      if (res.user) {
        this.user.setUser({
          email,
          uid: res.user.uid
        });
        this.router.navigate(['./tabs']);
      }

    } catch (err) {
      // console.dir(err)
      if (err.code == "auth/user-not-found") {
        this.presentAlert("User atau Password salah", "Silahkan periksa lagi");
      } else if (err.code == "auth/invalid-email") {
        this.presentAlert("Email tidak tepat", "Harap isi email dengan benar");
      } else if (err.code == "auth/weak-password") {
        this.presentAlert("Password terlalu lemah", "Harap isi password paling tidak 6 karakter");
      } else if (err.code == "auth/wrong-password") {
        this.presentAlert("User atau Password salah", "Silahkan periksa lagi");
      } else {
        this.presentAlert("Maaf", err.message);
      }
    }
  }

}
