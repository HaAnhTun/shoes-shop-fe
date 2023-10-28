import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BrandService } from '../../service/brand.service';
import { BrandData } from 'src/app/model/Brand';
import { BrandSave } from 'src/app/model/AddBrand';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers: [MessageService],
})
export class BrandComponent implements OnInit {
  codeError: boolean = false;
  nameError: boolean = false;
  descriptionError: boolean = false;
  validateField(field: string) {
    switch (field) {
      case 'code':
        this.codeError = this.newBrand.code === '' || this.newBrand.code.length > 50;
        break;
      case 'name':
        this.nameError = this.newBrand.name === '' || this.newBrand.name.length > 50;
        break;
      case 'description':
        this.descriptionError = this.newBrand.description === '' || this.newBrand.description.length > 50;
        break;
    }
  }

  brand: BrandData[];
  statuses: SelectItem[];
  clonedBrands: { [s: string]: BrandData } = {};
  displayConfirmDialog: boolean = false;
  selectedBrandId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;
  newBrand: BrandSave = { code: '', name: '', description: '' };

  constructor(private brandService: BrandService, private messageService: MessageService) { }

  ngOnInit() {
    this.brandService.getBrand().subscribe((data: any) => {
      this.brand = data;
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(brand: BrandData) {
    this.clonedBrands[brand.id as number] = { ...brand };
  }

  onRowEditSave(brand: BrandData) {
    this.brandService.editBrand(brand).subscribe(
      (response: BrandData) => {
        // Xử lý khi lưu thành công
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated.' });
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onRowDeleteInit(brandId: number) {
    console.log('Deleting brand with ID:', brandId);
    this.selectedBrandId = brandId; // Lưu ID của sản phẩm cần xóa
    this.displayConfirmDialog = true; // Hiển thị hộp thoại xác nhận
  }

  onDeleteBrand(confirm: boolean) {
    this.displayConfirmDialog = false; // Tắt hộp thoại xác nhận

    if (confirm) {
      this.brandService.deleteBrand(this.selectedBrandId).subscribe(
        (response) => {
          this.brand = this.brand.filter((b) => b.id !== this.selectedBrandId); // Xóa sản phẩm khỏi danh sách hiển thị
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
        }
      );
    }
  }

  onRowEditCancel(brand: BrandData) {
    const brandToUpdate = this.brand.find((item) => item.id === brand.id);
    if (brandToUpdate) {
      brandToUpdate.code = this.clonedBrands[brand.id as number].code;
      brandToUpdate.name = this.clonedBrands[brand.id as number].name;
      brandToUpdate.description = this.clonedBrands[brand.id as number].description;
      brandToUpdate.lastModifiedBy = this.clonedBrands[brand.id as number].lastModifiedBy;
      brandToUpdate.lastModifiedDate = this.clonedBrands[brand.id as number].lastModifiedDate;

      // Sau khi hủy bỏ, bạn có thể xử lý messageService tại đây
    }
  }

  showDialog() {
    this.displayAddDialog = true; // Hiển thị modal form thêm mới
    // Kiểm tra xem danh sách brand có phần tử không
    if (this.brand.length > 0) {
      // Tìm độ dài của danh sách và tạo mã code mới
      const newCode = 'BR' + (this.brand.length + 1).toString().padStart(3, '0');
      // Đặt giá trị mã code mới vào newBrand.code
      this.newBrand.code = newCode;
    } else {
      // Nếu danh sách brand rỗng, sử dụng giá trị mặc định
      this.newBrand.code = 'BR001';
    }
  }
  

  onSaveNewBrand() {
    // Kiểm tra lỗi trước khi lưu
    this.validateField('code');
    this.validateField('name');
    this.validateField('description');

    if (this.codeError || this.nameError || this.descriptionError) {
      // Hiển thị thông báo lỗi nếu có lỗi
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors before saving.' });
    } else {
      // Nếu không có lỗi, thực hiện lưu dữ liệu
      this.brandService.saveBrand(this.newBrand).subscribe(
        (response: BrandData) => {
          // Xử lý khi lưu thành công
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Brand is added.' });

          // Sau khi lưu thành công, bạn có thể thêm brand mới vào danh sách hiển thị hoặc làm điều gì đó tương tự.
          // Ví dụ: this.brand.push(response);
          this.loadBrandData();
          this.hideDialog(); // Đóng modal form sau khi lưu thành công
        },
        (error) => {
          // Xử lý khi lưu không thành công
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add brand.' });
        }
      );
    }
  }

  hideDialog() {
    this.displayAddDialog = false;
  }
  loadBrandData() {
    this.brandService.getBrand().subscribe((data: any) => {
      this.brand = data;
    });
  }
}
