export class User{
  name!:string;
  password!:string;
  uploadPhoto?:string;
  role!:string;
  mobNumber!:string;
  address?:Address;
  gender?:string;
  email!:string;
  dob!:string;
  agreetc?:boolean;
}
export class Address{
  id?:number;
  addLine1?:string;
  zipCode!:number;
}
export class Product{
  id!:number;
  name!:string
  uploadPhoto!:string;
  productDesc!:string;
  mrp!:number;
  dp!:number;
  status!:boolean;
  category?:Category;
}

export class Category{
  id!:number;
  name!:string;
}

export class Order{
  id!:number;
  userId!:number;
  sellerId!:number;
  product!:Product;
  deliveryAddress!:Address;
  contact!:number;
  dateTime!:string;
}
