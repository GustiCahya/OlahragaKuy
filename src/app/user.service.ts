import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';

interface user {
    email: string;
    uid: string
}

@Injectable()
export class UserService {
    
    private user:user

    constructor(private afAuth:AngularFireAuth){

    }

    setUser(user: user){
        this.user = user;
    }

    getEmail():string {
        return this.user.email
    }

    reAuth(email: string, password: string) {
        return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(email, password))
    }

    updateEmail(newemail: string){
        return this.afAuth.auth.currentUser.updateEmail(newemail);
    }

    updatePassword(newpassword: string){
        return this.afAuth.auth.currentUser.updatePassword(newpassword);
    }

    async isAuthenticated(){
        if(this.user) return true;

        const user = await this.afAuth.authState.pipe(first()).toPromise();

        if(user){
            this.setUser({
                email: user.email.split('@')[0],
                uid: user.uid
            })

            return true;
        }
        return false;
    }
    
    getUid():string{

        return this.user.uid;

    }

}
