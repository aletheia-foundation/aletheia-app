import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubmitPaperComponent} from './components/submit-paper/submit-paper.component';
import {BecomeAReviewerComponent} from './components/become-a-reviewer/become-a-reviewer.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'submit-paper',
        component: SubmitPaperComponent
    },
    {
        path: 'become-a-reviewer',
        component: BecomeAReviewerComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
