import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MedicinesComponent } from './medicines/medicines.component';
import { MedicinesDetailsComponent } from './medicines-details/medicines-details.component';
import { TendersComponent } from './tenders/tenders.component';
import { AuditsComponent } from './audits/audits.component';
import { authGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { MedicineOperationsComponent } from './medicine-operations/medicine-operations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { medicinesResolver } from './_resolvers/medicines.resolver';
import { usersResolver } from './_resolvers/users.resolver';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'medicines', component: MedicinesComponent, resolve: {medicines: medicinesResolver}},
            {path: 'tenders', component: TendersComponent, resolve: {medicines: medicinesResolver}},
            {path: 'audits', component: AuditsComponent,  resolve: {medicines: medicinesResolver}},
            {path: 'requests', component: MedicineOperationsComponent, resolve: {medicines: medicinesResolver, users: usersResolver}},
            {path: 'user-profile', component: UserProfileComponent},
        ]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'internal-server-error', component: InternalServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
