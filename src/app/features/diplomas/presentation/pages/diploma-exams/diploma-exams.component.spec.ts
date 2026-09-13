import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { DiplomaExamsComponent } from './diploma-exams.component';
import { DiplomaService } from '../../../application/services/diploma/diploma.service';
import { DiplomaResponse } from '../../../domain/models/response/diploma-response';

describe('DiplomaExamsComponent', () => {
  let component: DiplomaExamsComponent;
  let fixture: ComponentFixture<DiplomaExamsComponent>;

  let diplomaService: {
    getDiplomaDetails: ReturnType<typeof vi.fn>;
  };

  let location: {
    back: ReturnType<typeof vi.fn>;
  };

  const mockDiploma: DiplomaResponse = {
    id: '1',
    title: 'Angular Diploma',
    description: 'Angular development diploma',
    image: 'angular.jpg',
    immutable: false,
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
    exams: [],
  };

  beforeEach(async () => {
    diplomaService = {
      getDiplomaDetails: vi.fn().mockReturnValue(of(mockDiploma)),
    };

    location = {
      back: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DiplomaExamsComponent],
      providers: [
        {
          provide: DiplomaService,
          useValue: diplomaService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'id' ? '1' : null),
            }),
          },
        },
        {
          provide: Location,
          useValue: location,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiplomaExamsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get diploma details on init', () => {
    fixture.detectChanges();

    expect(diplomaService.getDiplomaDetails).toHaveBeenCalledWith('1');
    expect(component.diplomaDetails()).toEqual(mockDiploma);
  });

  it('should get diploma details by id', () => {
    component.getDiplomaDetails('2');

    expect(diplomaService.getDiplomaDetails).toHaveBeenCalledWith('2');
    expect(component.diplomaDetails()).toEqual(mockDiploma);
  });

  it('should go back when back is called', () => {
    component.back();

    expect(location.back).toHaveBeenCalled();
  });

  it('should not get diploma details when route has no id', () => {
    const route = TestBed.inject(ActivatedRoute);

    vi.spyOn(route.paramMap, 'subscribe').mockImplementation(() => {
      return { unsubscribe: vi.fn() } as any;
    });

    component.ngOnInit();

    expect(diplomaService.getDiplomaDetails).not.toHaveBeenCalled();
  });
});
