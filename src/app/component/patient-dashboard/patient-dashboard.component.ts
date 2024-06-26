
import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/model/appointment';
import { Bill } from 'src/app/model/bill';
import { User } from 'src/app/model/user';
import { MedicalRecords } from 'src/app/model/medical-records';
import { Prescription } from 'src/app/model/prescription';
import { UserInfo } from 'src/app/model/user-info';
import { CommonService } from 'src/app/service/common.service';
import { PaymentService } from 'src/app/service/payment.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  id: any;
  currentUserInfo: UserInfo = new UserInfo;
  currentUser: User = new User;
  doctor: User = new User;
  appointmentList: Appointment[] = [];
  prescriptionList: Prescription[] = [];
  medicalRecordsList: MedicalRecords[] = [];
  billList: Bill[] = [];
  retrievedImage: any;
  constructor(private storageService: StorageService, private userService: UserService,
    private paymentService: PaymentService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.currentUserInfo = this.storageService.getUser();
    if (this.currentUserInfo != null) {
      this.currentUserInfo.token = this.storageService.getToken();
      this.getUserData();
      this.getAppointmentList();
      this.getPrescriptionList();
      this.getMedicalRecordsList();
      this.getBillList();
    }
  }
  getUserData() {
    this.userService.getUser(this.currentUserInfo).subscribe((data: User) => {
      this.currentUser = data;
      if (this.currentUser.imageData != null && this.currentUser.imageData != undefined) {
        this.retrievedImage = 'data:image/jpeg;base64,' + this.currentUser.imageData;
      }
    });
  }
  getDoctorData() {
    this.commonService.getDoctorById(this.id).subscribe((data: User) => {
      this.doctor = data;
    });
  }
  getAppointmentList() {
    this.userService.getPatientAppointmentList(this.currentUser.id, this.currentUserInfo.token).subscribe((data: Appointment[]) => {
      this.appointmentList = data;
    });
  }
  getPrescriptionList() {
    this.userService.getPrescriptionList(this.currentUser.id, this.currentUserInfo.token).subscribe((data: Prescription[]) => {
      this.prescriptionList = data;
    });
  }
  getMedicalRecordsList() {
    this.userService.getMedicalRecordsList(this.currentUser.id, this.currentUserInfo.token).subscribe((data: MedicalRecords[]) => {
      this.medicalRecordsList = data;
    });
  }
  getBillList() {
    this.paymentService.getBillList(this.currentUser.id, this.currentUserInfo.token).subscribe((data: Bill[]) => {
      this.billList = data;
    });
  }
}
