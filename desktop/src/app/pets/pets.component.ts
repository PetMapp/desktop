import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { ViewChild } from '@angular/core';
import { BrnDialogComponent, BrnDialogRef } from '@spartan-ng/brain/dialog';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { IconComponent } from '../components/icon-component/icon-component.component';

import { PetsService } from '../services/pets.service';

import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';

import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';

import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/brain/core';

@Component({
  selector: 'app-pets',
  imports: [
    CommonModule,
    IconComponent,
    HeaderComponent,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    MobileFooterComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent implements OnInit {
  @ViewChild(BrnDialogComponent) dialogRef?: BrnDialogComponent;

  pets: any[] = [];
  selectedPet: any = null;
  isLocationExpanded = false;

  constructor(private petsService: PetsService) { }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petsService.getPets().subscribe({
      next: (pets: any[]) => {
        this.pets = pets;
      },
      error: (err) => {
        console.error('Erro ao carregar pets:', err);
      }
    });
  }

  selectPet(pet: any): void {
    this.selectedPet = pet;
  }

  toggleLocationExpand() {
    this.isLocationExpanded = !this.isLocationExpanded;
  }

  closeDialog() {
    this.dialogRef?.close();
  }
}
