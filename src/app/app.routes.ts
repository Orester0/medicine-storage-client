import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MedicinesComponent } from './medicine/medicines/medicines.component';
import { TendersComponent } from './tender/tenders/tenders.component';
import { AuditsComponent } from './audit/audits/audits.component';
import { authGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { MedicineOperationsComponent } from './medicine-request/medicine-operations/medicine-operations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { medicinesResolver } from './_resolvers/medicines.resolver';
import { usersResolver } from './_resolvers/users.resolver';
import { TendersDetailsComponent } from './tender/tenders-details/tenders-details.component';
import { tenderResolver } from './_resolvers/tender.resolver';
import { TemplateComponent as TemplateComponent } from './template/template.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

export const routes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'medicines', component: MedicinesComponent, resolve: {medicines: medicinesResolver}},
            {path: 'tenders', component: TendersComponent, resolve: {medicines: medicinesResolver}},
            {path: 'tenders/:id', component: TendersDetailsComponent, resolve: { tender: tenderResolver, medicines: medicinesResolver } },
            {path: 'audits', component: AuditsComponent,  resolve: {medicines: medicinesResolver}},
            {path: 'requests', component: MedicineOperationsComponent, resolve: {medicines: medicinesResolver, users: usersResolver}},
            {path: 'user-profile', component: UserProfileComponent},
            {path: 'templates', component: TemplateComponent, resolve: {medicines: medicinesResolver}},
            {path: 'admin', component: AdminPageComponent},
        ]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'internal-server-error', component: InternalServerErrorComponent},
    { path: '**', component: NotFoundComponent }
];
