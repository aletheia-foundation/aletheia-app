import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BecomeAReviewerComponent} from './components/become-a-reviewer/become-a-reviewer.component';
import {HowItWorksComponent} from './components/how-it-works/how-it-works.component';
import {SubmitPaperComponent} from './components/submit-paper/submit-paper.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'become-a-reviewer',
        component: BecomeAReviewerComponent
    },
    {
        path: 'how-it-works',
        component: HowItWorksComponent
    },
    {
        path: 'submit-paper',
        component: SubmitPaperComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
