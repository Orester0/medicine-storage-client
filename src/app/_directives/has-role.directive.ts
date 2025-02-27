import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  private authService = inject(AuthService); 
  private templateRef = inject(TemplateRef<any>); 
  private viewContainer = inject(ViewContainerRef); 

  private roles: string[] = [];

  @Input()
  set appHasRole(roles: string[]) { 
    this.roles = roles;
    this.updateView();
  }

  private updateView() {
    if (this.authService.userHasRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
