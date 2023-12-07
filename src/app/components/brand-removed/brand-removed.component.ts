import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BrandService } from '../../service/brand.service';
import { BrandData } from 'src/app/model/Brand';
import { BrandSave } from 'src/app/model/AddBrand';
@Component({
  selector: 'app-Brand-removed',
  templateUrl: './Brand-removed.component.html',
  styleUrls: ['./Brand-removed.component.css'],
  providers: [MessageService],
})
export class BrandRemovedComponent {
  codeError: boolean = false;
  nameError: boolean = false;
  descriptionError: boolean = false;
  searchText: string = '';
  filteredBrands: BrandData[] = [];

  onSearchInputChange() {
    this.filterBrands();
  }
  
  filterBrands() {
    this.filteredBrands = this.Brand.filter((b) => {
      return (
        b.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.name.toLowerCase().includes(this.searchText.toLowerCase()) 
      );
    });
  }


  Brand: BrandData[];
  statuses: SelectItem[];
  clonedBrands: { [s: string]: BrandData } = {};
  displayConfirmDialog: boolean = false;
  selectedBrandId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;


  constructor(private BrandService: BrandService, private messageService: MessageService) { }

  ngOnInit() {
    this.BrandService.getBrandRemoved().subscribe((data: any) => {
      this.Brand = data;
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(Brand: BrandData) {
    this.clonedBrands[Brand.id as number] = { ...Brand };
  }

  onRowEditSave(Brand: BrandData) {
    this.BrandService.editBrand(Brand).subscribe(
      (response: BrandData) => {
        // Xử lý khi lưu thành công
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated.' });
       this.loadBrandData();
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onEditBrand(confirm: boolean) {
    this.displayConfirmDialog = false; // Tắt hộp thoại xác nhận

    if (confirm) {
      this.BrandService.deleteBrand(this.selectedBrandId).subscribe(
        (response) => {
          this.Brand = this.Brand.filter((b) => b.id !== this.selectedBrandId); // Xóa sản phẩm khỏi danh sách hiển thị
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
        }
      );
    }
  }

  onRowEditCancel(Brand: BrandData) {
    const BrandToUpdate = this.Brand.find((item) => item.id === Brand.id);
    if (BrandToUpdate) {
      BrandToUpdate.code = this.clonedBrands[Brand.id as number].code;
      BrandToUpdate.name = this.clonedBrands[Brand.id as number].name;
      BrandToUpdate.lastModifiedBy = this.clonedBrands[Brand.id as number].lastModifiedBy;
      BrandToUpdate.lastModifiedDate = this.clonedBrands[Brand.id as number].lastModifiedDate;

      // Sau khi hủy bỏ, bạn có thể xử lý messageService tại đây
    }
  }


  

 
  hideDialog() {
    this.displayAddDialog = false;
  }
  loadBrandData() {
    this.BrandService.getBrandRemoved().subscribe((data: any) => {
      this.Brand = data;
    });
  }
}
