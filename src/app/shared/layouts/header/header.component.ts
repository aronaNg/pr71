import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  logged_in: boolean = false;
  user_role!: any;

  constructor(private router: Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

  }
  ngDoCheck() {
    this.user_role = sessionStorage.getItem("role");
    const user_sesson_id = sessionStorage.getItem("user_session_id");
    if(user_sesson_id){
      this.logged_in = true;
    }
  }
  logout(){
    sessionStorage.removeItem("user_session_id");
    sessionStorage.removeItem("role");
    this.router.navigateByUrl('/sign-in');
    location.reload();
  }
  getImagePath() {
    // Example: Assuming imagePath is dynamically set
    let imagePath = '/assets/hand3.webp';
    return this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  }
}
