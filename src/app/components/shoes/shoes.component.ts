import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ShoesService } from '../../service/shoes.service';
import { Shoes } from 'src/app/model/Shoes';
import { ShoesSave } from 'src/app/model/AddShoes';

@Component({
  selector: 'app-Shoes',
  templateUrl: './Shoes.component.html',
  styleUrls: ['./Shoes.component.css'],
  providers: [MessageService],
})
export class ShoesComponent implements OnInit {
  codeError: boolean = false;
  nameError: boolean = false;
  descriptionError: boolean = false;
  searchText: string = '';
  filteredShoess: Shoes[] = [];

  onSearchInputChange() {
    this.filterShoess();
  }
  
  filterShoess() {
    this.filteredShoess = this.Shoes.filter((b) => {
      return (
        b.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.name.toLowerCase().includes(this.searchText.toLowerCase()) 
      );
    });
  }
  validateField(field: string) {
    switch (field) {
      case 'code':
        this.codeError = this.newShoes.code === '' || this.newShoes.code.length > 50;
        break;
      case 'name':
        this.nameError = this.newShoes.name === '' || this.newShoes.name.length > 50;
        break;
    }
  }

  Shoes: Shoes[];
  statuses: SelectItem[];
  clonedShoess: { [s: string]: Shoes } = {};
  displayConfirmDialog: boolean = false;
  selectedShoesId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;
  newShoes: ShoesSave = { code: '', name: '' };

  constructor(private ShoesService: ShoesService, private messageService: MessageService) { }

  ngOnInit() {
    this.ShoesService.getShoes().subscribe((data: any) => {
      this.Shoes = data;
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(Shoes: Shoes) {
    this.clonedShoess[Shoes.id as number] = { ...Shoes };
  }

  onRowEditSave(Shoes: Shoes) {
    this.ShoesService.editShoes(Shoes).subscribe(
      (response: Shoes) => {
        // Xử lý khi lưu thành công
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated.' });
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onRowDeleteInit(ShoesId: number) {
    console.log('Deleting Shoes with ID:', ShoesId);
    this.selectedShoesId = ShoesId; // Lưu ID của sản phẩm cần xóa
    this.displayConfirmDialog = true; // Hiển thị hộp thoại xác nhận
  }

  onDeleteShoes(confirm: boolean) {
    this.displayConfirmDialog = false; // Tắt hộp thoại xác nhận

    if (confirm) {
      this.ShoesService.deleteShoes(this.selectedShoesId).subscribe(
        (response) => {
          this.Shoes = this.Shoes.filter((b) => b.id !== this.selectedShoesId); // Xóa sản phẩm khỏi danh sách hiển thị
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
        }
      );
    }
  }

  onRowEditCancel(Shoes: Shoes) {
    const ShoesToUpdate = this.Shoes.find((item) => item.id === Shoes.id);
    if (ShoesToUpdate) {
      ShoesToUpdate.code = this.clonedShoess[Shoes.id as number].code;
      ShoesToUpdate.name = this.clonedShoess[Shoes.id as number].name;
      ShoesToUpdate.lastModifiedBy = this.clonedShoess[Shoes.id as number].lastModifiedBy;
      ShoesToUpdate.lastModifiedDate = this.clonedShoess[Shoes.id as number].lastModifiedDate;

      // Sau khi hủy bỏ, bạn có thể xử lý messageService tại đây
    }
  }

  showDialog() {
    this.displayAddDialog = true; // Hiển thị modal form thêm mới
    // Kiểm tra xem danh sách Shoes có phần tử không
    if (this.Shoes.length > 0) {
      // Tìm độ dài của danh sách và tạo mã code mới
      const newCode = 'SZ' + (this.Shoes.length + 1).toString().padStart(3, '0');
      // Đặt giá trị mã code mới vào newShoes.code
      this.newShoes.code = newCode;
    } else {
      // Nếu danh sách Shoes rỗng, sử dụng giá trị mặc định
      this.newShoes.code = 'SZ001';
    }
  }
  

  onSaveNewShoes() {
    // Kiểm tra lỗi trước khi lưu
    this.validateField('code');
    this.validateField('name');
    this.validateField('description');

    if (this.codeError || this.nameError || this.descriptionError) {
      // Hiển thị thông báo lỗi nếu có lỗi
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors before saving.' });
    } else {
      // Nếu không có lỗi, thực hiện lưu dữ liệu
      this.ShoesService.saveShoes(this.newShoes).subscribe(
        (response: Shoes) => {
          // Xử lý khi lưu thành công
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Shoes is added.' });

          // Sau khi lưu thành công, bạn có thể thêm Shoes mới vào danh sách hiển thị hoặc làm điều gì đó tương tự.
          // Ví dụ: this.Shoes.push(response);
          this.loadShoes();
          this.hideDialog(); // Đóng modal form sau khi lưu thành công
        },
        (error) => {
          // Xử lý khi lưu không thành công
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Shoes.' });
        }
      );
    }
  }

  hideDialog() {
    this.displayAddDialog = false;
  }
  loadShoes() {
    this.ShoesService.getShoes().subscribe((data: any) => {
      this.Shoes = data;
    });
  }
}
