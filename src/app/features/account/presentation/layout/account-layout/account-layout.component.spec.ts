import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AccountLayoutComponent } from './account-layout.component';
import { UserDataService } from '../../../../auth/application/services/user-data.service.js';

describe('AccountLayoutComponent', () => {
  let component: AccountLayoutComponent;
  let router: Router;
  let userDataService: UserDataService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: UserDataService,
          useValue: {
            logout: vi.fn(),
          },
        },
        {
          provide: Location,
          useValue: {
            back: vi.fn(),
          },
        },
      ],
    });

    component = TestBed.createComponent(AccountLayoutComponent).componentInstance;

    router = TestBed.inject(Router);
    userDataService = TestBed.inject(UserDataService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should logout user and navigate to auth', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.logout();

    expect(userDataService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth']);
  });

  it('should go back to previous page', () => {
    component.back();

    expect(location.back).toHaveBeenCalled();
  });
});
