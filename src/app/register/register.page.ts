import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email : string;
  password : string;
  cpassword : string;

  constructor(
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
    public router: Router,
    public afStore: AngularFirestore,
    public user: UserService
  ) { }


  ngOnInit() {
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })
    await alert.present();
  }

  async register() {
    const { email, password, cpassword } = this;
    if (password !== cpassword) {
      this.presentAlert("Password tidak sama", "Harap isi ulang kembali");
      // return console.error("Password don't match");
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

      this.afStore.doc(`users/${res.user.uid}`).set({
        email
      });

      this.user.setUser({
        email,
        uid: res.user.uid
      });
      this.presentAlert("Berhasil!", "Anda telah terdaftar! ");
      this.router.navigate(['./tabs']);

    } catch (err) {
      // console.dir(err);
      if (err.code == "auth/invalid-email" ){
          this.presentAlert("Email tidak tepat", "Harap isi email dengan benar");
      } else if (err.code == "auth/weak-password" ){
          this.presentAlert("Password terlalu lemah", "Harap isi password paling tidak 6 karakter");
      }else{
          this.presentAlert("Maaf", err.message);
      }
      
    }

  }

}
