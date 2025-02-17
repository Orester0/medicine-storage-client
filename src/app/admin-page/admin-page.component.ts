import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnUserDTO } from '../_models/user.types';
import { AdminService } from '../_services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableAction, TableColumn, TableComponent } from '../table/table.component';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-admin-page',
  imports: [TableComponent, ReactiveFormsModule, CommonModule, UserInfoComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  users: ReturnUserDTO[] = [];
  selectedUser: ReturnUserDTO | null = null;

  rolesForm: FormGroup;
  availableRoles = ['Admin', 'Doctor', 'Manager', 'Distributor'];
  isModalOpen = false;

  showUserInfoModal = false;
  selectedUserForInfo: ReturnUserDTO | null = null;
    
  openUserInfoModal(user: ReturnUserDTO): void {
    this.selectedUserForInfo = user;
    this.showUserInfoModal = true;
  }

  closeUserInfoModal(): void {
    this.showUserInfoModal = false;
    this.selectedUserForInfo = null;
  }

  columns: TableColumn<ReturnUserDTO>[] = [
    { key: 'userName', label: 'Username' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  actions: TableAction<ReturnUserDTO>[] = [
    {
      label: 'Details',
      class: 'btn btn-outline-info btn-sm',
      onClick: (user) => this.openUserInfoModal(user)
    },    
    {
      label: 'Manage Roles',
      class: 'btn btn-outline-secondary btn-sm',
      onClick: (user) => this.openRolesModal(user)
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.users = this.route.snapshot.data['users'];
    this.rolesForm = this.fb.group({
      roles: [[], Validators.required] 
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  openRolesModal(user: ReturnUserDTO): void {
    this.selectedUser = user;
    this.rolesForm.setValue({ roles: user.roles });
    this.isModalOpen = true;
  }

  closeRolesModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  toggleRole(event: Event, role: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    const roles: string[] = this.rolesForm.value.roles || [];
  
    if (checked) {
      this.rolesForm.patchValue({ roles: [...roles, role] });
    } else {
      this.rolesForm.patchValue({ roles: roles.filter((r: string) => r !== role) });
    }
  }
  
  

  saveRoles(): void {
    if (!this.selectedUser) return;
  
    const updatedRoles: string[] = Array.isArray(this.rolesForm.value.roles)
      ? this.rolesForm.value.roles
      : [];
  
    const userId = this.selectedUser.id;
  
    this.adminService.updateRoles(userId, updatedRoles).subscribe({
      next: () => {
        this.selectedUser!.roles = updatedRoles;
        this.closeRolesModal();
      },
      error: (error) => console.error('Error updating roles:', error)
    });
  }
  
}
