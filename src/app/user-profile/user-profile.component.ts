import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../core/Model/object-model';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  userProfileForm!:FormGroup;
  userProfile:boolean = false;
  user_id!:number;
  user_data:any;
  user_update_data:any;
  user_dto!:User;
  user_profile_pic:any;
  user_role:any;

  constructor(private formBuilder:FormBuilder, private router:Router,private user_Service:UserService){}

  ngOnInit(): void {
    this.user_id = Number(sessionStorage.getItem('user_session_id'));
    this.userProfileForm = this.formBuilder.group({
      gender: ['', Validators.required],
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required,]],
      password: ['', [Validators.required,]],
      addLine1: ['', Validators.required],
      zipCode: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
    })
    this.editUserData(this.user_id)
  }

  get rf(){
    return this.userProfileForm.controls;
  }
  editUserData(user_id:any){
    this.user_Service.getUserData(user_id).subscribe(data=>{
      this.user_data = data;
      this.user_profile_pic = this.user_data.uploadPhoto;
      this.user_role = this.user_data.role;
      this.userProfileForm.setValue({
        gender:this.user_data.gender,
        name:this.user_data.name,
        mobNumber:this.user_data.mobNumber,
        dob:this.user_data.dob,
        email:this.user_data.email,
        password:this.user_data.password,
        addLine1:this.user_data.address.addLine1,
        zipCode:this.user_data.address.zipCode,
        uploadPhoto:''
      })
    }, error=>{
      console.log("My error", error)
    })
  }
  updateProfile(){
    this.userProfile = true;
    if(this.userProfileForm.invalid){
      return;
    }
    this.user_update_data = this.userProfileForm.value;
    this.user_dto ={
      agreetc:this.user_update_data.agreetc,
      dob:this.user_update_data.dob,
      email:this.user_update_data.email,
      gender:this.user_update_data.gender,
      address:{
        id: 0,
        addLine1: this.user_update_data.addLine1,
        zipCode: this.user_update_data.zipCode,
      },
      mobNumber:this.user_update_data.mobNumber,
      name:this.user_update_data.name,
      password:this.user_update_data.password,
      uploadPhoto:(this.user_update_data.uploadPhoto ==""? this.user_profile_pic:this.user_update_data.uploadPhoto),
      role:this.user_update_data.role
    }
    this.user_Service.updateUserData(this.user_id, this.user_dto).subscribe(data=>{
      alert("Profile Update Successfull !");
      if(this.user_role =='admin'){
        this.router.navigateByUrl('/admin-dashboard')
      }else if(this.user_role=='seller'){
        this.router.navigateByUrl('/seller-dashboard')
      }else if(this.user_role=='buyer'){
        this.router.navigateByUrl('/buyer-dashboard')
      }
    },error=>{
      console.log("My error" , error)
    })
  }
}
