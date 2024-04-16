import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../core/Model/object-model';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,DataTablesModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  all_product_data:any
  addEditProductDForm!:FormGroup;
  addEditProduct:boolean = false;
  popup_header!:string;
  add_product!:boolean;
  edit_product!:boolean;
  product_data:any;
  single_product_data:any;
  product_dto!:Product
  edit_product_id:any;
  dtOptions: any = {};
  dtTrigger:Subject<any> = new Subject();

  constructor(private fb:FormBuilder, private router:Router, private productService:ProductService){

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      paging: true,
      searching: true,
      pageLength: 10,
      dom: 'Bfrtip',
    };
    this.addEditProductDForm = this.fb.group({
      name:['',Validators.required],
      uploadPhoto:['',Validators.required],
      productDesc:['',Validators.required],
      mrp:['',Validators.required],
      dp:['',Validators.required],
      status:['',Validators.required],
    })
    this.getAllProduct()

  }
  get rf(){
    return this.addEditProductDForm.controls;
  }
  getAllProduct(){
    this.productService.allProduct().subscribe(data =>{
      this.all_product_data = data;
      console.log("My All product", this.all_product_data);
      this.dtTrigger.next(null);
    }, error =>{
      console.log("Something went wrong ", error)
    })
  }
  addProductPopup(){
    this.add_product = true;
    this.edit_product = false;
    this.popup_header = "Add new Product";
    this.addEditProductDForm.reset();
  }
  addNewProduct(){
    this.addEditProduct = true;
    if(this.addEditProductDForm.invalid){
      return;
    }
    this.product_data = this.addEditProductDForm.value;
    this.product_dto = {
      id:0,
      name:this.product_data.name,
      uploadPhoto:this.product_data.uploadPhoto,
      productDesc:this.product_data.productDesc,
      mrp:this.product_data.mrp,
      dp:this.product_data.dp,
      status:this.product_data.status,
    }
    this.productService.addNewProduct(this.product_dto).subscribe(data=>{
      console.log(data);
      this.getAllProduct();
    },error=>{
      console.log("my error", error)
    })
  }
  editProductPopup(id:any){
    this.add_product = false;
    this.edit_product = true;
    this.popup_header = "Edit Product";
    this.addEditProductDForm.reset();
    this.productService.singleProduct(id).subscribe(data=>{
      this.single_product_data = data;
      console.log("Single Data", this.single_product_data);
      this.edit_product_id = data.id;
      this.addEditProductDForm.setValue({
        name:this.single_product_data.name,
        uploadPhoto:this.single_product_data.uploadPhoto,
        productDesc:this.single_product_data.productDesc,
        mrp:this.single_product_data.mrp,
        dp:this.single_product_data.dp,
        status:this.single_product_data.status
      })
    })
  }
  updateProduct(){
    this.addEditProduct = true;
    if(this.addEditProductDForm.invalid){
      return;
    }
    this.product_data = this.addEditProductDForm.value;
    this.product_dto = {
      id:0,
      name:this.product_data.name,
      uploadPhoto:this.product_data.uploadPhoto,
      productDesc:this.product_data.productDesc,
      mrp:this.product_data.mrp,
      dp:this.product_data.dp,
      status:this.product_data.status,
    }
    this.productService.updateProduct(this.edit_product_id,this.product_dto).subscribe(data=>{
      this.getAllProduct();

    },error=>{
      console.log("my error", error)
    })
  }
  deleteProduct(id:any){
    let conf = confirm("Do you want to delete this product id:" +id);
    if(conf){
      this.productService.deleteProduct(id).subscribe(data=>{
        console.log("Deleted successfull", data);
        this.getAllProduct();
      }, err=>{
        console.log(err)
      })
    }else{
      alert("You pressed cancel !")
    }
  }
}
