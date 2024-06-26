import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppValidations } from 'src/app/constant/app-validations';
import { Appointment } from 'src/app/model/appointment';
import { CardDetails } from 'src/app/model/card-details';
import { CartItems } from 'src/app/model/cart-items';
import { Medicine } from 'src/app/model/medicine';
import { ProductDetails } from 'src/app/model/product-details';
import { User } from 'src/app/model/user';
import { UserInfo } from 'src/app/model/user-info';
import { MedicineService } from 'src/app/service/medicine.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {
  id: any;
  message: any;
  statusFlag: boolean = false;
  currentUserInfo: UserInfo = new UserInfo;
  currentUser: User = new User;
  appointment: Appointment = new Appointment;
  termsAndConditionsFlag: Boolean = false;
  cartItemsList!: CartItems[];
  retrievedImage: any;
  totalCost!: number;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private storageService: StorageService,
    private userService: UserService, private medicineService: MedicineService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.totalCost = 0;
    this.currentUserInfo = this.storageService.getUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getToken();
      this.getUserData();
    }
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null && this.id != undefined) {
      this.getCartItemsData();
    }
    this.appointment.cardDetails = new CardDetails;
  }
  getUserData() {
    this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
      this.currentUser = data;
      if (this.currentUser.imageData != null && this.currentUser.imageData != undefined) {
        this.retrievedImage = 'data:image/jpeg;base64,' + this.currentUser.imageData;
      }
    });
    if (this.currentUser.firstName == "" || this.currentUser.firstName == undefined) {
      this.appointment.patientUser = new User;
    } else {
      this.appointment.patientUser = this.currentUser;
    }
  }

  getCartItemsData() {
    this.medicineService.getCartItemsData(this.id, this.currentUserInfo.token).subscribe((data: CartItems[]) => {
      this.cartItemsList = data;
      for (let index = 0; index < this.cartItemsList.length; index++) {
        if (this.cartItemsList[index].medicine != null && this.cartItemsList[index].medicine != undefined) {
          this.totalCost += this.cartItemsList[index].medicine.medicinePrice * this.cartItemsList[index].quantity;
          if (this.cartItemsList[index].medicine.productDetails == null && this.cartItemsList[index].medicine.productDetails == undefined) {
            this.cartItemsList[index].medicine.productDetails = new ProductDetails;
          }
        } else {
          this.cartItemsList[index].medicine = new Medicine;
        }
      }
    });
  }


  changeTermsAndConditions() {
    this.termsAndConditionsFlag = !this.termsAndConditionsFlag;
    if (this.termsAndConditionsFlag) {
      this.appointment.termsAndConditions = 'Y';
    } else {
      this.appointment.termsAndConditions = 'N';
    }
  }

  validateProductCheckoutDetails(): boolean {
    if (this.appointment.patientUser.firstName == "" || this.appointment.patientUser.firstName == undefined) {
      alert('Please Enter First Name');
      const element = this.renderer.selectRootElement('#firstName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validateName(this.appointment.patientUser.firstName)) {
      const element = this.renderer.selectRootElement('#firstName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.appointment.patientUser.lastName == "" || this.appointment.patientUser.lastName == undefined) {
      alert('Please Enter Last Name');
      const element = this.renderer.selectRootElement('#lastName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validateName(this.appointment.patientUser.lastName)) {
      const element = this.renderer.selectRootElement('#lastName');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.appointment.patientUser.email == "" || this.appointment.patientUser.email == undefined) {
      alert('Please Enter Email');
      const element = this.renderer.selectRootElement('#email');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validateMail(this.appointment.patientUser.email)) {
      const element = this.renderer.selectRootElement('#email');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.appointment.patientUser.phoneNumber == "" || this.appointment.patientUser.phoneNumber == undefined) {
      alert('Please Enter Phone Number');
      const element = this.renderer.selectRootElement('#phoneNumber');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (!AppValidations.validatePhoneNumber(this.appointment.patientUser.phoneNumber)) {
      const element = this.renderer.selectRootElement('#phoneNumber');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.appointment.paymentMethod == "" || this.appointment.paymentMethod == undefined) {
      alert('Please Check the paymentMethod');
      const element = this.renderer.selectRootElement('#nameOnCard');
      setTimeout(() => element.focus(), 0);
      return false;
    } else if (this.appointment.paymentMethod == "Credit card" && !this.validateCardDetails()) {
      return false;
    } else if (this.appointment.termsAndConditions == "" || this.appointment.termsAndConditions == "N" || this.appointment.termsAndConditions == undefined) {
      alert('Please Accept Terms & Conditions');
      const element = this.renderer.selectRootElement('#termsAndConditions');
      setTimeout(() => element.focus(), 0);
      return false;
    } else {
      return true;
    }
  }
  validateCardDetails(): boolean {
    if (this.appointment.paymentMethod == "Credit card") {
      if (this.appointment.cardDetails.nameOnCard == "" || this.appointment.cardDetails.nameOnCard == undefined) {
        alert('Please Enter Name on Card');
        const element = this.renderer.selectRootElement('#nameOnCard');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (!AppValidations.validateName(this.appointment.cardDetails.nameOnCard)) {
        const element = this.renderer.selectRootElement('#nameOnCard');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (this.appointment.cardDetails.cardNumber == "" || this.appointment.cardDetails.cardNumber == undefined) {
        alert('Please Enter Card Number');
        const element = this.renderer.selectRootElement('#cardNumber');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (this.appointment.cardDetails.expiryMonth == "" || this.appointment.cardDetails.expiryMonth == undefined) {
        alert('Please Enter Expiry Month');
        const element = this.renderer.selectRootElement('#expiryMonth');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (!AppValidations.validateExpiryMonth(this.appointment.cardDetails.expiryMonth)) {
        const element = this.renderer.selectRootElement('#expiryMonth');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (this.appointment.cardDetails.expiryYear == "" || this.appointment.cardDetails.expiryYear == undefined) {
        alert('Please Enter Expiry Year');
        const element = this.renderer.selectRootElement('#expiryYear');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (!AppValidations.validateExpiryYear(this.appointment.cardDetails.expiryYear)) {
        const element = this.renderer.selectRootElement('#expiryYear');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (!AppValidations.validateExpiryDate(this.appointment.cardDetails.expiryMonth, this.appointment.cardDetails.expiryYear)) {
        const element = this.renderer.selectRootElement('#expiryMonth');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (this.appointment.cardDetails.cvv == "" || this.appointment.cardDetails.cvv == undefined) {
        alert('Please Enter CVV');
        const element = this.renderer.selectRootElement('#cvv');
        setTimeout(() => element.focus(), 0);
        return false;
      } else if (!AppValidations.validateCVV(this.appointment.cardDetails.cvv)) {
        const element = this.renderer.selectRootElement('#cvv');
        setTimeout(() => element.focus(), 0);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  onSubmit() {
    if (this.validateProductCheckoutDetails()) {
      // this.userService.saveAppointment(this.appointment, this.currentUserInfo.token).subscribe((data: ApiResponse) => {
      //   this.message = data.message;
      //   if (this.message == MessageConstants.AppointmentMessage) {
      //     this.statusFlag = true;
      //     this.appointment = new Appointment;
      //     this.router.navigate(['/paymentSuccess']);
      //   }
      // });
      this.router.navigate(['/paymentSuccess']);
    }
  }
}
