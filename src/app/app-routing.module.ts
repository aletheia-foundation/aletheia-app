import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubmitPaperComponent} from "./components/submit-paper/submit-paper.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'submit-paper',
        component: SubmitPaperComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
