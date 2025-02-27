import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReturnUserPersonalDTO, UserParams, UserRegistrationDTO } from '../../_models/user.types';
import { AdminService } from '../../_services/admin.service';
import { TableAction, TableColumn, TableComponent } from '../../table/table.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FilterComponent, FilterConfig } from '../../filter/filter.component';
import { CreateUserFormComponent } from '../create-user-form/create-user-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    UserInfoComponent,
    PaginationComponent,
    FilterComponent,
    CreateUserFormComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private toastr = inject(ToastrService);
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  users: ReturnUserPersonalDTO[] = [];
  totalItems = 0;
  availableRoles = ['Admin', 'Doctor', 'Manager', 'Distributor'];
  
  selectedUser: ReturnUserPersonalDTO | null = null;
  selectedUserForInfo: ReturnUserPersonalDTO | null = null;
  
  isCreateUserFormVisible = false;
  isModalOpen = false;
  showUserInfoModal = false;
  
  rolesForm!: FormGroup;
  
  userParams: UserParams = {
    isDescending: false,
    pageNumber: 1,
    pageSize: 10
  };
  
  columns: TableColumn<ReturnUserPersonalDTO>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'userName', label: 'Username', sortable: true },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];
  
  actions: TableAction<ReturnUserPersonalDTO>[] = [
    {
      label: 'Details',
      icon: 'visibility',
      class: 'btn btn-outline-info btn-sm',
      onClick: (user) => this.openUserInfoModal(user)
    },    
    {
      label: 'Manage Roles',
      icon: 'manage_accounts',
      class: 'btn btn-outline-secondary btn-sm',
      onClick: (user) => this.openRolesModal(user)
    }
  ];
  
  filterConfig: FilterConfig[] = [
    { key: 'userName', label: 'Username', type: 'text', col: 3 },
    { key: 'firstName', label: 'First Name', type: 'text', col: 3 },
    { key: 'lastName', label: 'Last Name', type: 'text', col: 3 },
    { key: 'email', label: 'Email', type: 'text', col: 3 },
    { key: 'position', label: 'Position', type: 'text', col: 3 },
    { key: 'company', label: 'Company', type: 'text', col: 3 },
    { 
      key: 'roles', 
      label: 'Role', 
      type: 'select', 
      multiselect: true,
      col: 3, 
      options: this.availableRoles.map(role => ({ value: role, label: role }))
    }
  ];

  private initializeForm(){
    this.rolesForm = this.fb.group({
      roles: [[], Validators.required] 
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    // this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getUsersWithFilter(this.userParams).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalItems = response.totalCount;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  showCreateUseForm(): void {
    this.isCreateUserFormVisible = true;
  }

  onFormSubmit(formData: any): void {
    this.adminService.createUser(formData).subscribe({
      next: () => {
        this.isCreateUserFormVisible = false;
        this.toastr.success('User created successfully');
        this.loadUsers();
      },
      error: (error) => {
        console.error('CreateUser error:', error);
      }
    });
  }

  onCancel(): void {
    this.isCreateUserFormVisible = false;
  }

  openUserInfoModal(user: ReturnUserPersonalDTO): void {
    this.selectedUserForInfo = user;
    this.showUserInfoModal = true;
  }

  closeUserInfoModal(): void {
    this.showUserInfoModal = false;
    this.selectedUserForInfo = null;
  }

  openRolesModal(user: ReturnUserPersonalDTO): void {
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
        this.loadUsers();
      },
      error: (error) => console.error('Error updating roles:', error)
    });
  }

  onFilterChange(filters: Partial<UserParams>): void {
    this.userParams = { ...this.userParams, ...filters, pageNumber: 1 };
    this.loadUsers();
  }

  onSortChange(sortConfig: { key: keyof ReturnUserPersonalDTO; isDescending: boolean }): void {
    this.userParams.sortBy = sortConfig.key as string;
    this.userParams.isDescending = sortConfig.isDescending;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.userParams.pageNumber = page;
    this.loadUsers();
  }
}
