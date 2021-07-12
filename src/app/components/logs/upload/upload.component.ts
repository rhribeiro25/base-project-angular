import { Location } from "@angular/common";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AlertModalService } from "src/app/services/alert-modal.service";
import { LogsService } from "src/app/services/logs.service";

@Component({
    selector: "app-logs-upload",
    templateUrl: "./upload.component.html",
    styleUrls: ["./upload.component.scss"]
})
export class UploadComponent implements OnInit, OnDestroy {
    files: Set<File>;
    progress: number;
    fileList: string[];
    sub: Subscription[];

    constructor(private service: LogsService, private location: Location, private modal: AlertModalService) { }

    ngOnInit() {
        this.sub = [];
        this.progress = 0;
    }

    onChange(event) {
        this.fileList = [];
        this.progress = 0;
        const selectedFiles = <FileList>event.srcElement.files;
        this.files = new Set();
        for (let i = 0; i < selectedFiles.length; i++) {
            this.fileList.push(selectedFiles[i].name);
            this.files.add(selectedFiles[i]);
        }
        this.onUpload();
    }

    onUpload() {
        if (this.files && this.files.size > 0) {
            this.files.forEach(file => {
                const formData = new FormData();
                formData.append("log", file, file.name);
                setTimeout(
                    () => this.sub.push(
                        this.service.createByBatch(formData).subscribe(
                            (event: HttpEvent<Object>) => {
                                if (event.type === HttpEventType.Response)
                                    this.modal.showAlertSuccess("O arquivo foi processado com sucesso!");
                                else if (event.type === HttpEventType.UploadProgress)
                                    this.progress = Math.round((event.loaded * 100) / event.total);
                                else if (this.progress >= 100) {
                                    setTimeout(() => { this.onCancel(); }, 1000);
                                }
                            }
                        )
                    ),
                );
            });
        }
        this.modal.showAlertWarn("o seu arquivo será processado e em breve receberá uma notificação sobre o status!");
    }

    onCancel() {
        this.location.back();
    }

    ngOnDestroy() {
        this.sub.forEach(s => s.unsubscribe());
    }
}
