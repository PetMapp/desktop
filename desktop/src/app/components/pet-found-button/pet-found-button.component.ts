import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogTitleDirective } from '@spartan-ng/helm/dialog';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { RequestService, PetRequest } from '../../services/request.service';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../icon-component/icon-component.component';

@Component({
  selector: 'app-pet-found-button',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmLabelDirective,
    HlmInputDirective,
    IconComponent
  ],
  templateUrl: './pet-found-button.component.html',
  styleUrls: ['./pet-found-button.component.scss']
})
export class PetFoundButtonComponent {
  @Input() currentUserId!: string | null;
  @Input() petId!: string | null;
  @Input() petOwnerId!: string | null;
  @Output() requestCreated = new EventEmitter<PetRequest>();

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  message: string = '';
  selectedFile?: File;
  previewUrl?: string;
  isLoading = false;
  fileError: string | null = null;
  readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  readonly maxFileSizeBytes = 5 * 1024 * 1024;

  constructor(
    private requestService: RequestService,
    private toastService: ToastService
  ) { }

  onFileSelected(event: any) {
    this.fileError = null;
    const file: File | undefined = event?.target?.files?.[0];

    if (!file) {
      this.clearFile();
      return;
    }

    if (!this.allowedMimeTypes.includes(file.type)) {
      this.fileError = 'Formato não permitido. Envie apenas JPG, PNG ou WEBP.';
      this.clearFile();
      return;
    }

    if (file.size > this.maxFileSizeBytes) {
      const maxMb = this.maxFileSizeBytes / (1024 * 1024);
      this.fileError = `Arquivo muito grande. Máximo ${maxMb} MB.`;
      this.clearFile();
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearFile() {
    this.selectedFile = undefined;
    this.previewUrl = undefined;
    try {
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
    } catch (e) {
      console.error('Erro ao limpar input de arquivo', e);
    }
  }

  submitRequest(ctx?: any) {
    
    if (!this.currentUserId || !this.petId || !this.petOwnerId) {
      console.error('Faltam ids para criar a request');
      return;
    }

    if (this.fileError) {
      console.warn('Arquivo inválido, corrija antes de enviar');
      return;
    }

    this.isLoading = true;

    const form = new FormData();
    form.append('userId', this.currentUserId);
    form.append('petId', this.petId);
    form.append('userPetId', this.petOwnerId);
    form.append('message', this.message || '');
    if (this.selectedFile) form.append('img', this.selectedFile);

    this.requestService.createRequestFormData(form).subscribe({
      next: (created: PetRequest) => {
        this.isLoading = false;
        this.requestCreated.emit(created);
        this.toastService.show(
          'Você criou uma solicitação',
          'Aguarde a resposta do dono do pet.'
        );
        this.clearFile();
        if (ctx?.close) ctx.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.show(
          'Erro ao criar solicitação',
          'Erro ao criar solicitação. Tente novamente.'
        );
      }
    });
  }
}
