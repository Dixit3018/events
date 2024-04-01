import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/alert.service';

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
    private dataService: DataService,
    private alertService: AlertService
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
      .subscribe(
        (data: {
          message: string;
          error?: string;
          task?: { name: string; _id: string; status: string };
        }) => {
          if (data.message === 'success') {
            const oldTasks = this.dataService.tasks.getValue();
            this.dataService.tasks.next([...oldTasks, data.task]);
            this.alertService.showAlert(
              'Success',
              'Task added!',
              'success',
              'green'
            );

            this.dialogRef.close();
          } else {
            this.alertService.showAlert(
              'Oops!',
              'Something went wrong!',
              'error',
              'green'
            );
          }
        }
      );
  }
}
