import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';

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
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent implements OnInit {
  pets: any[] = [];
  selectedPet: any = null;

  constructor(private petsService: PetsService) {}

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
}
