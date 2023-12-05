import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { SizeService } from '../../service/size.service';
import { SizeData } from 'src/app/model/Size';
import { SizeSave } from 'src/app/model/AddSize';
@Component({
  selector: 'app-Size-removed',
  templateUrl: './Size-removed.component.html',
  styleUrls: ['./Size-removed.component.css'],
  providers: [MessageService],
})
export class SizeRemovedComponent {
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


  Size: SizeData[];
  statuses: SelectItem[];
  clonedSizes: { [s: string]: SizeData } = {};
  displayConfirmDialog: boolean = false;
  selectedSizeId: number = 0;
  displayAddDialog: boolean = false;
  visible: boolean = false;


  constructor(private SizeService: SizeService, private messageService: MessageService) { }

  ngOnInit() {
    this.SizeService.getSizeRemoved().subscribe((data: any) => {
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
       this.loadSizeData();
      },
      (error) => {
        // Xử lý khi lưu không thành công
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price.' });
      }
    );
  }

  onEditSize(confirm: boolean) {
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


  

 
  hideDialog() {
    this.displayAddDialog = false;
  }
  loadSizeData() {
    this.SizeService.getSizeRemoved().subscribe((data: any) => {
      this.Size = data;
    });
  }
}
