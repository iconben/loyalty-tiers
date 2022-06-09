import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  customerId?: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    if (this.customerId != null && this.customerId.length > 0) {
      this.router.navigate([`customers/${encodeURIComponent(this.customerId)}`]);
    }
  }

  onKeyPress(event: any) {
    // check if user pressed enter
    if (event.keyCode === 13) {
      this.onClick();
    }
  }

}
