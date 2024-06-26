import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { User } from '../../core/Model/object-model';
import { HttpClientModule } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent implements OnInit{
  all_user_data:any;
  single_user_data:any;
  addEditUserForm!:FormGroup;
  user_dto!:User;
  user_reg_data:any;
  edit_user_id:any;
  upload_file_name!:string;
  addEditUser:boolean = false; // For Form validation
  add_user:boolean = false;
  edit_user:boolean = false;
  popup_header!:string;
  signInFormValue:any ={}
  showSuccessAlert: boolean = false;
  showSuccessUpdate: boolean = false;
  showDelete: boolean = false;

  constructor( private formBuilder:FormBuilder, private router:Router,private adminService:AdminService){}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllUser();

  }

  initializeForm(): void {
    this.addEditUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      dob: ['', [Validators.required, this.validateDob]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      uploadPhoto: [''],
      role: ['', Validators.required],
    });
  }
  validateDob(control: any): { [key: string]: boolean } | null {
    // Check if the control value is a valid date
    if (!control.value) {
      return { 'required': true };
    }
    const dob = new Date(control.value);
    const currentDate = new Date();

    if (dob >= currentDate) {
      return { 'invalidDate': true };
    }

    return null;
  }
  get formControls(){
    return this.addEditUserForm.controls;
  }

  handleError(error: any): void {
    console.error('An error occurred:', error);
  }

  onSubmit(): void {
    if (this.addEditUserForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.addEditUserForm.markAllAsTouched();
      return;
    }
    // Form is valid, proceed with submission
    this.addUser();
  }

  getAllUser(){
    this.adminService.allUser().subscribe(data =>{
      this.all_user_data = data;
    },error =>{
      console.log("My error" , error)
    })
  }


  addUserPopup(){
    this.edit_user = false;
    this.add_user = true;
    this.popup_header = "Add New User";
    this.addEditUserForm.reset();
  }


  addUser(){
    if (!this.addEditUserForm.dirty) {
      return; // Exit early if the form has not been edited
    }
    this.addEditUser = true;
    if(this.addEditUserForm.invalid){
      alert('Error!! :-)\n\n' +JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto ={
      dob:this.user_reg_data.dob,
      email:this.user_reg_data.email,
      gender:this.user_reg_data.gender,
      mobNumber:this.user_reg_data.mobNumber,
      name:this.user_reg_data.name,
      password:this.user_reg_data.password,
      uploadPhoto:this.user_reg_data.uploadPhoto,
      role:this.user_reg_data.role
    }
    this.adminService.addUser(this.user_dto).subscribe(data=>{
      this.addEditUserForm.reset();
      this.getAllUser();
      $('#addEditUserModal').modal('toggle');
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    },error=>{
      console.log("my wrong ", error);
    })
  }
  dismissAlert() {
    this.showSuccessAlert = false;
  }
  dismissUpdateAlert() {
    this.showSuccessUpdate = false;
  }
  dismissDelete() {
    this.showDelete = false;
  }
  editUserPopup(user_id:any){
    this.edit_user_id = user_id;
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = "Edit User";
    this.adminService.singleuUser(user_id).subscribe(data=>{
      this.single_user_data = data;
      this.upload_file_name = this.single_user_data.uploadPhoto;
      this.addEditUserForm.setValue({
        name:this.single_user_data.name,
        mobNumber:this.single_user_data.mobNumber,
        dob:this.single_user_data.dob,
        email:this.single_user_data.email,
        password:this.single_user_data.password,
        uploadPhoto:'',
        role:this.single_user_data.role
      });
    }, error=>{
      console.log("My error", error)
    })
  }
  updateUser(){
    if(this.addEditUserForm.invalid){
      alert('Error!! :-)\n\n' +JSON.stringify(this.addEditUserForm.value));
      return;
    }
    const formData = this.addEditUserForm.value;
    const updatedUserData: Partial<User> = {};
    if (formData.name) updatedUserData.name = formData.name;
    if (formData.mobNumber) updatedUserData.mobNumber = formData.mobNumber;
    if (formData.dob) updatedUserData.dob = formData.dob;
    if (formData.email) updatedUserData.email = formData.email;
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto ={
      dob:this.user_reg_data.dob,
      email:this.user_reg_data.email,
      mobNumber:this.user_reg_data.mobNumber,
      name:this.user_reg_data.name,
      password:this.user_reg_data.password,
      uploadPhoto:(this.user_reg_data.uploadPhoto ==""? this.upload_file_name:this.user_reg_data.uploadPhoto),
      role:this.user_reg_data.role
    }
    this.adminService.editUser(this.edit_user_id,this.user_dto).subscribe(data=>{
      this.addEditUserForm.reset()
      this.getAllUser();
      $('#addEditUserModal').modal('toggle');
      this.showSuccessUpdate = true;
      setTimeout(() => {
        this.showSuccessUpdate = false;
      }, 3000);

    },error=>{
      console.log("my wrong ", error);
    })
  }
  deleteUser(user_id:any){
    this.adminService.deleteUser(user_id).subscribe(data=>{
      this.getAllUser();
      this.showDelete = true;
      setTimeout(() => {
        this.showDelete = false;
      }, 3000);
    }, error =>{
      console.log("My error", error)
    })
  }
}


