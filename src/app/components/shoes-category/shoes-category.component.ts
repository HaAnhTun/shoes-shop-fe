import { Component } from '@angular/core';
import { ShoesCategory } from 'src/app/model/ShoesCategory';
import { ShoesCategoryService } from '../../service/shoes-category.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-shoes-category',
  templateUrl: './shoes-category.component.html',
  styleUrls: ['./shoes-category.component.css'],
  providers: [MessageService]
})
export class ShoesCategoryComponent {
    shoesCategoryDialog: boolean = false;

    deleteShoesCategoryDialog: boolean = false;

    deleteShoesCategoriesDialog: boolean = false;

    shoesCategories: ShoesCategory[] = [];

    shoesCategory: ShoesCategory = {};

    selectedShoesCategories: ShoesCategory[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
}
