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

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'medicines', component: MedicinesComponent},
            {path: 'tenders', component: TendersComponent},
            {path: 'audits', component: AuditsComponent},
            {path: 'requests', component: MedicineOperationsComponent},
        ]
    },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'internal-server-error', component: InternalServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
