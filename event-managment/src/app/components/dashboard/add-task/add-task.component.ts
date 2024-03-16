import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpService } from '../../../services/http.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpService,
    private dataService:DataService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      task: ['', [Validators.required]],
    });
  }

  onTaskAdd() {
    const task = this.taskForm.value.task;
    this.http
      .addTask(this.data.userId, task)
      .subscribe((data: { message: string; error?: string; task?:{name:string, _id:string, status:string} }) => {
        if (data.message === 'success') {
          const oldTasks = this.dataService.tasks.getValue();
          this.dataService.tasks.next([...oldTasks, data.task])
          Swal.fire({
            title: 'Success',
            text: 'Task added!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: 'green',
            confirmButtonText: 'OK',
            showClass: {
              popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `,
            },
            hideClass: {
              popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `,
            },
          });
          this.dialogRef.close();
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Something went wrong!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: 'green',
            confirmButtonText: 'OK',
            showClass: {
              popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `,
            },
            hideClass: {
              popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `,
            },
          });
        }
      });
  }
}
