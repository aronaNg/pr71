import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public product_url="http://localhost:3000/products/"

  constructor(private httpClient:HttpClient, private apiService:ApiService) { }
  allProduct():Observable<any>{
    return this.apiService.get(this.product_url);
  }
  addNewProduct(productDTO:any):Observable<any>{
    return this.apiService.post(this.product_url, productDTO);
  }
  singleProduct(id:any){
    return this.apiService.get(this.product_url+id);
  }
  updateProduct(id:any, productDTO:any):Observable<any>{
    return this.apiService.put(this.product_url+id, productDTO);
  }
  deleteProduct(id:any):Observable<any>{
    return this.apiService.delete(this.product_url+id);
  }
}
