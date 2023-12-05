import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColorService } from '../../service/color.service';
import { ColorData } from 'src/app/model/Color';
import { ColorSave } from 'src/app/model/AddColor';
@Component({
  selector: 'app-color-removed',
  templateUrl: './color-removed.component.html',
  styleUrls: ['./color-removed.component.css'],
  providers: [MessageService],
})
export class ColorRemovedComponent {
  codeError: boolean = false;
  nameError: boolean = false;
  descriptionError: boolean = false;
  searchText: string = '';
  filteredColors: ColorData[] = [];

  onSearchInputChange() {
    this.filterColors();
  }
  
  filterColors() {
    this.filteredColors = this.Color.filter((b) => {
      return (
        b.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.name.toLowerCase().includes(this.searchText.toLowerCase()) 
      );
    });
  }
  validateField(field: string) {
    switch (field) {
      case 'code':
        this.codeError = this.newColor.code === '' || this.newColor.code.length > 50;
        break;
      case 'name':
        this.nameError = this.newColor.name === '' || this.newColor.name.length > 50;
        break;
    }
  }

  Color: ColorData[];
  statuses: SelectItem[];
  clonedColors: { [s: string]: ColorData } = {};
  displayConfirmDialog: boolean = false;
  selectedColorId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;
  newColor: ColorSave = { code: '', name: '' };

  constructor(private ColorService: ColorService, private messageService: MessageService) { }

  ngOnInit() {
    this.ColorService.getColorRemoved().subscribe((data: any) => {
      this.Color = data;
    });

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(Color: ColorData) {
    this.clonedColors[Color.id as number] = { ...Color };
  }

  onRowEditSave(Color: ColorData) {
    this.ColorService.editColor(Color).subscribe(
      (response: ColorData) => {
        // Xử lý khi lưu thành công
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated.' });
       this.loadColorData();
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onEditColor(confirm: boolean) {
    this.displayConfirmDialog = false; // Tắt hộp thoại xác nhận

    if (confirm) {
      this.ColorService.deleteColor(this.selectedColorId).subscribe(
        (response) => {
          this.Color = this.Color.filter((b) => b.id !== this.selectedColorId); // Xóa sản phẩm khỏi danh sách hiển thị
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is deleted.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product.' });
        }
      );
    }
  }

  onRowEditCancel(Color: ColorData) {
    const ColorToUpdate = this.Color.find((item) => item.id === Color.id);
    if (ColorToUpdate) {
      ColorToUpdate.code = this.clonedColors[Color.id as number].code;
      ColorToUpdate.name = this.clonedColors[Color.id as number].name;
      ColorToUpdate.lastModifiedBy = this.clonedColors[Color.id as number].lastModifiedBy;
      ColorToUpdate.lastModifiedDate = this.clonedColors[Color.id as number].lastModifiedDate;

      // Sau khi hủy bỏ, bạn có thể xử lý messageService tại đây
    }
  }

  showDialog() {
    this.displayAddDialog = true; // Hiển thị modal form thêm mới
    // Kiểm tra xem danh sách Color có phần tử không
    if (this.Color.length > 0) {
      // Tìm độ dài của danh sách và tạo mã code mới
      const newCode = 'CL' + (this.Color.length + 1).toString().padStart(3, '0');
      // Đặt giá trị mã code mới vào newColor.code
      this.newColor.code = newCode;
    } else {
      // Nếu danh sách Color rỗng, sử dụng giá trị mặc định
      this.newColor.code = 'CL001';
    }
  }
  

  onSaveNewColor() {
    // Kiểm tra lỗi trước khi lưu
    this.validateField('code');
    this.validateField('name');
    this.validateField('description');

    if (this.codeError || this.nameError || this.descriptionError) {
      // Hiển thị thông báo lỗi nếu có lỗi
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors before saving.' });
    } else {
      // Nếu không có lỗi, thực hiện lưu dữ liệu
      this.ColorService.saveColor(this.newColor).subscribe(
        (response: ColorData) => {
          // Xử lý khi lưu thành công
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Color is added.' });

          // Sau khi lưu thành công, bạn có thể thêm Color mới vào danh sách hiển thị hoặc làm điều gì đó tương tự.
          // Ví dụ: this.Color.push(response);
          this.loadColorData();
          this.hideDialog(); // Đóng modal form sau khi lưu thành công
        },
        (error) => {
          // Xử lý khi lưu không thành công
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Color.' });
        }
      );
    }
  }

  hideDialog() {
    this.displayAddDialog = false;
  }
  loadColorData() {
    this.ColorService.getColorRemoved().subscribe((data: any) => {
      this.Color = data;
    });
  }
}
