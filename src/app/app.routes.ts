import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { medicinesResolver } from './_resolvers/medicines.resolver';
import { usersResolver } from './_resolvers/users.resolver';
import { tenderInfoResolver } from './_resolvers/tender-info.resolver';
import { AuditsComponent } from './audit-page/audits/audits.component';
import { HomeComponent } from './home-page/home/home.component';
import { MedicinesComponent } from './medicine-page/medicines/medicines.component';
import { MedicineRequestComponent } from './medicine-request-page/medicine-request/medicine-request.component';
import { TemplateComponent } from './template-page/template/template.component';
import { TendersDetailsComponent } from './tender-page/tenders-details/tenders-details.component';
import { TendersComponent } from './tender-page/tenders/tenders.component';
import { ErrorTemplateComponent } from './error-template/error-template.component';
import { UsersComponent } from './admin-page/users/users.component';
import { UserProfileComponent } from './user-profile-page/user-profile/user-profile.component';
import { AdminPanelComponent } from './admin-page/admin-panel/admin-panel.component';
import { MedicineSuppliesComponent } from './admin-page/medicine-supplies/medicine-supplies.component';
import { MedicineUsagesComponent } from './admin-page/medicine-usages/medicine-usages.component';
import { tendersResolver } from './_resolvers/tenders.resolver';

export const routes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'medicines', component: MedicinesComponent, resolve: {medicines: medicinesResolver}},
            {path: 'tenders', component: TendersComponent, resolve: {medicines: medicinesResolver}},
            {path: 'tenders/:id', component: TendersDetailsComponent, resolve: { tender: tenderInfoResolver, medicines: medicinesResolver } },
            {path: 'audits', component: AuditsComponent,  resolve: {medicines: medicinesResolver, users: usersResolver}},
            {path: 'requests', component: MedicineRequestComponent, resolve: {medicines: medicinesResolver, users: usersResolver}},
            {path: 'user-profile', component: UserProfileComponent},
            {path: 'templates', component: TemplateComponent, resolve: {medicines: medicinesResolver}},
            {path: 'admin',
              component: AdminPanelComponent,
              children: [
                {
                  path: 'users',
                  component: UsersComponent
                },
                {
                  path: 'supplies',
                  component: MedicineSuppliesComponent,
                  resolve: {
                    users: usersResolver,
                    medicines: medicinesResolver,
                    tenders: tendersResolver
                  },
                },
                {
                  path: 'usages', 
                  component: MedicineUsagesComponent,
                  resolve: {
                    users: usersResolver,
                    medicines: medicinesResolver
                  },
                },
                {
                  path: '',
                  pathMatch: 'full',
                  redirectTo: 'users',
                },
              ],
            },
        ]
    },
    { 
        path: 'not-found', 
        component: ErrorTemplateComponent, 
        data: { 
          title: '404 - Not Found', 
          message: 'The requested page was not found.' 
        } 
    },
    { 
        path: 'internal-server-error', 
        component: ErrorTemplateComponent, 
        data: { 
          title: '500 - Internal Server Error', 
          message: 'Something went wrong.' 
        } 
    },
    { 
        path: '**', 
        component: ErrorTemplateComponent, 
        data: { 
          title: '404 - Not Found', 
          message: 'The requested page was not found.' 
        } 
    },
];
