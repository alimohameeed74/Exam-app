import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiplomasListComponent } from './diplomas-list.component';
import { DiplomaService } from '../../../application/services/diploma/diploma.service.js';
import { of } from 'rxjs';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response.js';

describe('DiplomasListComponent', () => {
  let component: DiplomasListComponent;
  let fixture: ComponentFixture<DiplomasListComponent>;
  let diplomaService: {
    getAll: ReturnType<typeof vi.fn>;
  };

  const mockDiplomas: DiplomaResponse[] = [
    {
      id: '1',
      title: 'Angular Diploma',
      description: 'Angular development diploma',
      image: 'angular.jpg',
      immutable: false,
      createdAt: '2026-09-10T10:00:00Z',
      updatedAt: '2026-09-10T10:00:00Z',
      exams: [],
    },
    {
      id: '2',
      title: 'C# Diploma',
      description: 'C# development diploma',
      image: 'csharp.jpg',
      immutable: false,
      createdAt: '2026-09-10T10:00:00Z',
      updatedAt: '2026-09-10T10:00:00Z',
      exams: [],
    },
  ];

  beforeEach(async () => {
    diplomaService = {
      getAll: vi.fn().mockReturnValue(of(mockDiplomas)),
    };

    await TestBed.configureTestingModule({
      imports: [DiplomasListComponent],
      providers: [
        {
          provide: DiplomaService,
          useValue: diplomaService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiplomasListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get diplomas on init', () => {
    fixture.detectChanges();

    expect(diplomaService.getAll).toHaveBeenCalledWith(1);
    expect(component.diplomas()).toEqual(mockDiplomas);
  });

  it('should get diplomas for the given page', () => {
    component.getDiplomas(2);

    expect(diplomaService.getAll).toHaveBeenCalledWith(2);
  });

  it('should append new diplomas to existing diplomas', () => {
    component.diplomas.set([mockDiplomas[0]]);

    component.getDiplomas(2);

    expect(component.diplomas()).toEqual([mockDiplomas[0], mockDiplomas[0], mockDiplomas[1]]);
  });

  it('should not update diplomas when response is empty', () => {
    diplomaService.getAll.mockReturnValue(of([]));

    component.diplomas.set(mockDiplomas);

    component.getDiplomas(2);

    expect(component.diplomas()).toEqual(mockDiplomas);
  });

  it('should increase page and get next diplomas when seeMore is called', () => {
    component.pages.set(1);

    component.seeMore();

    expect(component.pages()).toBe(2);
    expect(diplomaService.getAll).toHaveBeenCalledWith(2);
  });

  it('should append diplomas when seeMore is called', () => {
    component.diplomas.set([mockDiplomas[0]]);

    component.seeMore();

    expect(component.pages()).toBe(2);
    expect(component.diplomas()).toEqual([mockDiplomas[0], mockDiplomas[0], mockDiplomas[1]]);
  });
});
