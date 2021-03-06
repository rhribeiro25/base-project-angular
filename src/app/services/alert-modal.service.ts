import { Injectable } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AlertModalComponent } from "../shared/pop-up/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "../shared/pop-up/confirm-modal/confirm-modal.component";

export enum AlertTypes {
    DANGER = "danger",
    SUCCESS = "success",
    WARNING = "warning"
}

@Injectable({
    providedIn: "root"
})
export class AlertModalService {
    constructor(private modalService: BsModalService) { }

    private showAlert(message: string, type: AlertTypes, dismissTimeout?: number) {
        const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent);
        bsModalRef.content.type = type;
        bsModalRef.content.message = message;

        if (dismissTimeout) {
            setTimeout(() => bsModalRef.hide(), dismissTimeout);
        }
    }

    showAlertWarn(message: string) {
        this.showAlert(message, AlertTypes.WARNING, 5000);
    }

    showAlertDanger(message: string) {
        this.showAlert(message, AlertTypes.DANGER);
    }

    showAlertSuccess(message: string) {
        this.showAlert(message, AlertTypes.SUCCESS, 3000);
    }

    showConfirm(title: string, msg: string, okTxt?: string, cancelTxt?: string) {
        const bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent);
        bsModalRef.content.title = title;
        bsModalRef.content.msg = msg;

        if (okTxt) {
            bsModalRef.content.okTxt = okTxt;
        }

        if (cancelTxt) {
            bsModalRef.content.cancelTxt = cancelTxt;
        }

        return (<ConfirmModalComponent>bsModalRef.content).confirmResult;
    }
}
