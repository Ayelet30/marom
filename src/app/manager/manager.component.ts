import { Component } from '@angular/core';
import { ProviderTableComponent } from '../provider-table/provider-table.component'

@Component({
    selector: 'app-manager',
    standalone: true,
    imports: [ProviderTableComponent],
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

}
