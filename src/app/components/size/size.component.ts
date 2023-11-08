import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { SizeService } from '../../service/size.service';
import { SizeData } from 'src/app/model/Size';
import { SizeSave } from 'src/app/model/AddSize';

@Component({
  selector: 'app-Size',
  templateUrl: './Size.component.html',
  styleUrls: ['./Size.component.css'],
  providers: [MessageService],
})
export class SizeComponent implements OnInit {
  codeError: boolean = false;
  nameError: boolean = false;
  descriptionError: boolean = false;
  searchText: string = '';
  filteredSizes: SizeData[] = [];

  onSearchInputChange() {
    this.filterSizes();
  }
  
  filterSizes() {
    this.filteredSizes = this.Size.filter((b) => {
      return (
        b.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.name.toLowerCase().includes(this.searchText.toLowerCase()) 
      );
    });
  }
  validateField(field: string) {
    switch (field) {
      case 'code':
        this.codeError = this.newSize.code === '' || this.newSize.code.length > 50;
        break;
      case 'name':
        this.nameError = this.newSize.name === '' || this.newSize.name.length > 50;
        break;
    }
  }

  Size: SizeData[];
  statuses: SelectItem[];
  clonedSizes: { [s: string]: SizeData } = {};
  displayConfirmDialog: boolean = false;
  selectedSizeId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;
  newSize: SizeSave = { code: '', name: '' };

  constructor(private SizeService: SizeService, private messageService: MessageService) { }

  ngOnInit() {
    this.SizeService.getSize().subscribe((data: any) => {
      this.Size = data;
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(Size: SizeData) {
    this.clonedSizes[Size.id as number] = { ...Size };
  }

  onRowEditSave(Size: SizeData) {
    this.SizeService.editSize(Size).subscribe(
      (response: SizeData) => {
        // Xử lý khi lưu thành công
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated.' });
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onRowDeleteInit(SizeId: number) {
    console.log('Deleting Size with ID:', SizeId);
    this.selectedSizeId = SizeId; // Lưu ID của sản phẩm cần xóa
    this.displayConfirmDialog = true; // Hiển thị hộp thoại xác nhận
  }

  onDeleteSize(confirm: boolean) {
    this.displayConfirmDialog = false; // Tắt hộp thoại xác nhận

    if (confirm) {
      this.SizeService.deleteSize(this.selectedSizeId).subscribe(
        (response) => {
          this.Size = this.Size.filter((b) => b.id !== this.selectedSizeId); // Xóa sản phẩm khỏi danh sách hiển thị
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
        }
      );
    }
  }

  onRowEditCancel(Size: SizeData) {
    const SizeToUpdate = this.Size.find((item) => item.id === Size.id);
    if (SizeToUpdate) {
      SizeToUpdate.code = this.clonedSizes[Size.id as number].code;
      SizeToUpdate.name = this.clonedSizes[Size.id as number].name;
      SizeToUpdate.lastModifiedBy = this.clonedSizes[Size.id as number].lastModifiedBy;
      SizeToUpdate.lastModifiedDate = this.clonedSizes[Size.id as number].lastModifiedDate;

      // Sau khi hủy bỏ, bạn có thể xử lý messageService tại đây
    }
  }

  showDialog() {
    this.displayAddDialog = true; // Hiển thị modal form thêm mới
    // Kiểm tra xem danh sách Size có phần tử không
    if (this.Size.length > 0) {
      // Tìm độ dài của danh sách và tạo mã code mới
      const newCode = 'SZ' + (this.Size.length + 1).toString().padStart(3, '0');
      // Đặt giá trị mã code mới vào newSize.code
      this.newSize.code = newCode;
    } else {
      // Nếu danh sách Size rỗng, sử dụng giá trị mặc định
      this.newSize.code = 'SZ001';
    }
  }
  

  onSaveNewSize() {
    // Kiểm tra lỗi trước khi lưu
    this.validateField('code');
    this.validateField('name');
    this.validateField('description');

    if (this.codeError || this.nameError || this.descriptionError) {
      // Hiển thị thông báo lỗi nếu có lỗi
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors before saving.' });
    } else {
      // Nếu không có lỗi, thực hiện lưu dữ liệu
      this.SizeService.saveSize(this.newSize).subscribe(
        (response: SizeData) => {
          // Xử lý khi lưu thành công
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Size is added.' });

          // Sau khi lưu thành công, bạn có thể thêm Size mới vào danh sách hiển thị hoặc làm điều gì đó tương tự.
          // Ví dụ: this.Size.push(response);
          this.loadSizeData();
          this.hideDialog(); // Đóng modal form sau khi lưu thành công
        },
        (error) => {
          // Xử lý khi lưu không thành công
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Size.' });
        }
      );
    }
  }

  hideDialog() {
    this.displayAddDialog = false;
  }
  loadSizeData() {
    this.SizeService.getSize().subscribe((data: any) => {
      this.Size = data;
    });
  }
}
