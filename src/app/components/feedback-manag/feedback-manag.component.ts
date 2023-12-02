import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-feedback-manag',
  templateUrl: './feedback-manag.component.html',
  styleUrls: ['./feedback-manag.component.css']
})
export class FeedbackManagComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') dataTable: Table;

  feedbacks: any[];
  selectedFeedbacks: any[] = [];
  statuses!: any[];
  defaultStatus: number = 0;
  constructor(private http: HttpClient, private confirmationService: ConfirmationService,
    private messageService: MessageService,) {

  }
  ngAfterViewInit(): void {
    this.dataTable.filter(0, 'status', 'equals');
  }
  ngOnInit(): void {
    this.fetchFeedbacks();
    this.statuses = [
      { label: 'Được chấp nhận', value: 1 },
      { label: 'Từ chối', value: -1 },
      { label: 'Chờ xác nhận', value: 0 },
    ];
  }

  fetchFeedbacks() {

    this.http.get<any>('http://localhost:8088/api/feed-backs')
      .subscribe(
        (response) => {
          this.feedbacks = response
          console.log(this.feedbacks)
        },
        (error) => {
          // Xử lý lỗi ở đây
        }
      );
  }


  updateStatus(status: number, id: number) {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('status', status.toString());
    this.http.get<any>('http://localhost:8088/api/feed-backs/status-update', { params: params })
      .subscribe(
        (response) => {
          console.log(response);
          const index = this.feedbacks.findIndex(feedback => feedback.id == id);
          if (index !== -1) {
            // Cập nhật bản ghi nếu nó đã tồn tại trong danh sách
            this.feedbacks[index] = response;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Feedback updated thành công!' });
            this.dataTable.filter(status * -1, 'status', 'equals');

          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Lỗi update feedback, có người vừa update feedback này.' });
        }
      );
  }
}


