import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../constant/app-constants';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../service/storage.service';
import { UserService } from '../../service/user.service';
import { UserInfo } from 'src/app/model/user-info';
import { AppValidations } from 'src/app/constant/app-validations';


@Component({
  selector: 'app-login-social',
  templateUrl: './login-social.component.html',
  styleUrls: ['./login-social.component.css']
})
export class LoginSocialComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUserInfo: UserInfo = new UserInfo;
  currentUser: User = new User;
  showPassword: boolean = true;
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  githubURL = AppConstants.GITHUB_AUTH_URL;
  linkedinURL = AppConstants.LINKEDIN_AUTH_URL;

  constructor(private authService: AuthService, private storageService: StorageService,
    private userService: UserService, private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = false;
      this.currentUserInfo = this.storageService.getUser();
    }
    if (this.storageService.isPatientLoggedIn()) {
      this.isLoggedIn = false;
      this.currentUserInfo = this.storageService.getPatientUser();
    }
    if (this.storageService.isDoctorLoggedIn()) {
      this.isLoggedIn = false;
      this.currentUserInfo = this.storageService.getDoctorUser();
    }
  }
  toggleShow() {
    this.showPassword = !this.showPassword;
  }
  validateLoginForm(): boolean {
    if (this.form.username == "" || this.form.username == undefined) {
      alert('Please Enter Email');
      const element = this.renderer.selectRootElement('#username');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validateMail(this.form.username)) {
      const element = this.renderer.selectRootElement('#username');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.form.password == "" || this.form.password == undefined) {
      alert('Please Enter password');
      const element = this.renderer.selectRootElement('#password');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validatePassword(this.form.password)) {
      const element = this.renderer.selectRootElement('#password');
      setTimeout(() => element.focus(), 0);
      return false;
    } else {
      return true;
    }
  }
  onSubmit(): void {
    if (this.validateLoginForm()) {
      this.authService.loginSocial(this.form).subscribe(
        data => {
          if (data.user != null) {
            this.storageService.saveUserInfo(data.user);
            this.storageService.saveToken(data.accessToken);
            this.getUserData();
            if (data.accessToken && this.currentUser.userType == 'patient') {
              this.storageService.savePatientUserInfo(data.user);
              this.storageService.savePatientToken(data.accessToken);
              this.getPatientUserData();
              this.router.navigate(['/patientDashboard']);
            } else if (data.accessToken && this.currentUser.userType == 'doctor') {
              this.storageService.saveDoctorUserInfo(data.user);
              this.storageService.saveDoctorToken(data.accessToken);
              this.getDoctorUserData();
              this.router.navigate(['/doctorDashboard']);
            }
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
  }
  getUserData() {
    this.currentUserInfo = this.storageService.getUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getToken();
      this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
        this.currentUser = data;
      });
    }
  }
  getPatientUserData() {
    this.currentUserInfo = this.storageService.getPatientUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getPatientToken();
      this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
        this.currentUser = data;
      });
    }
  }

  getDoctorUserData() {
    this.currentUserInfo = this.storageService.getDoctorUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getDoctorToken();
      this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
        this.currentUser = data;
      });
    }
  }

  login(user: User): void {
    if (user.userType == 'patient') {
      this.storageService.savePatientUser(user);
      this.currentUser = this.storageService.getPatientUser();
    } else if (user.userType == 'doctor') {
      this.storageService.saveDoctorUser(user);
      this.currentUser = this.storageService.getDoctorUser();
    } else {
      this.storageService.saveUser(user);
      this.currentUser = this.storageService.getUser();
    }
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    window.location.reload();
  }

}