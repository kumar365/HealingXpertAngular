import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppValidations } from 'src/app/constant/app-validations';
import { AmbBooking } from 'src/app/model/amb-booking';
import { Ambulance } from 'src/app/model/ambulance';
import { User } from 'src/app/model/user';
import { UserInfo } from 'src/app/model/user-info';
import { CommonService } from 'src/app/service/common.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-ambulance-booking',
  templateUrl: './ambulance-booking.component.html',
  styleUrls: ['./ambulance-booking.component.css']
})
export class AmbulanceBookingComponent implements OnInit {
  id: any;
  message: any;
  statusFlag: boolean = false;
  currentUserInfo: UserInfo = new UserInfo;
  currentUser: User = new User;
  ambulance: Ambulance = new Ambulance;
  ambBooking: AmbBooking = new AmbBooking;
  retrievedImage: any;
  currentDate: Date = new Date;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private storageService: StorageService,
    private userService: UserService, private renderer: Renderer2, private commonService: CommonService) { }

  ngOnInit(): void {
    this.currentUserInfo = this.storageService.getUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getToken();
      this.getUserData();
    }
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      if (this.id != undefined) {
        this.getAmbulanceData();
      }
    });
  }
  getUserData() {
    this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
      this.currentUser = data;
      if (this.currentUser.imageData != null && this.currentUser.imageData != undefined) {
        this.retrievedImage = 'data:image/jpeg;base64,' + this.currentUser.imageData;
      }
    });
  }
  getAmbulanceData() {
    this.commonService.getAmbulanceDetails(this.id).subscribe((data: Ambulance) => {
      this.ambulance = data;
      this.ambBooking.ambulanceType = this.ambulance.type;
    });
  }
  onSubmit() {
    if (this.validateAmbulanceBooking()) {
      this.router.navigate(['/ambCheckout', { id: this.ambulance.id }]);
    }
  }
  validateAmbulanceBooking(): boolean {
    if (this.ambBooking.bookAmbulanceFor == "" || this.ambBooking.bookAmbulanceFor == undefined) {
      alert('Please select Book ambulance for');
      return false;
    } else if (this.ambBooking.ambulanceType == "" || this.ambBooking.ambulanceType == undefined) {
      alert('Please select Type of ambulance');
      return false;
    } else if (this.ambBooking.firstName == "" || this.ambBooking.firstName == undefined) {
      alert('Please Enter First Name');
      const element = this.renderer.selectRootElement('#firstName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validateName(this.ambBooking.firstName)) {
      const element = this.renderer.selectRootElement('#firstName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.ambBooking.lastName == "" || this.ambBooking.lastName == undefined) {
      alert('Please Enter Last Name');
      return false;
    } else if (!AppValidations.validateName(this.ambBooking.lastName)) {
      const element = this.renderer.selectRootElement('#lastName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.ambBooking.email == "" || this.ambBooking.email == undefined) {
      alert('Please Enter Email');
      return false;
    } else if (!AppValidations.validateMail(this.ambBooking.email)) {
      const element = this.renderer.selectRootElement('#email');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.ambBooking.phoneNumber == "" || this.ambBooking.phoneNumber == undefined) {
      alert('Please Enter Phone Number');
      return false;
    } else if (!AppValidations.validatePhoneNumber(this.ambBooking.phoneNumber)) {
      const element = this.renderer.selectRootElement('#phoneNumber');
      setTimeout(() => element.focus(), 0);
      return false;
    } else {
      return true;
    }
  }
}
