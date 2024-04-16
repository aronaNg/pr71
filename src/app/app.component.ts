import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { FooterComponent } from './shared/layouts/footer/footer.component';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent,DataTablesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  screenHeight:any;
  screenWidth:any;
  footerMaxHeight!:number;
  title = 'Projetpr71';

  constructor(){
    this.getScreenSize(event);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event:any){
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    //console.log(this.screenHeight, this.screenWidth)
    this.footerMaxHeight = this.screenHeight -160;
  }
}
