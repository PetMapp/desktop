import { Router } from '@angular/router';

export class Redirection {
  constructor(private router: Router) {}

  goTo(path: string | string[], params?: any, queryParams?: any): void {
    if (params !== undefined) {
      this.router.navigate([path, params], { queryParams });
    } else {
      this.router.navigate([path], { queryParams });
    }
  }
}
