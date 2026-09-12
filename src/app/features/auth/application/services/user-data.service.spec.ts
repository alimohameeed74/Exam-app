import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { UserDataService } from './user-data.service';

describe('UserDataService', () => {
  let service: UserDataService;

  const mockUserData = {
    token: 'test-token',
    user: {
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
      fName: 'Ali',
      lName: 'Mohamed',
    },
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        UserDataService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    service = TestBed.inject(UserDataService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set user data', () => {
    service.setUserData(mockUserData);

    expect(service._loggedUserData()).toEqual(mockUserData);
  });

  it('should store user data in localStorage when running in browser', () => {
    service.setUserData(mockUserData);

    expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockUserData));
  });

  it('should set user data to null', () => {
    service.setUserData(mockUserData);

    service.setUserData(null);

    expect(service._loggedUserData()).toBeNull();
  });

  it('should initialize user data from localStorage', () => {
    localStorage.setItem('userData', JSON.stringify(mockUserData));

    service.init();

    expect(service._loggedUserData()).toEqual(mockUserData);
  });

  it('should not change user data when localStorage has no user data', () => {
    service.init();

    expect(service._loggedUserData()).toBeNull();
  });

  it('should logout user', () => {
    service.setUserData(mockUserData);

    service.logout();

    expect(service._loggedUserData()).toBeNull();
  });

  it('should remove user data from localStorage on logout', () => {
    service.setUserData(mockUserData);

    service.logout();

    expect(localStorage.getItem('userData')).toBeNull();
  });
});

describe('UserDataService - SSR', () => {
  let service: UserDataService;

  const mockUserData = {
    token: 'test-token',
    user: {
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
      fName: 'Ali',
      lName: 'Mohamed',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserDataService,
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
      ],
    });

    service = TestBed.inject(UserDataService);
  });

  it('should not access localStorage in setUserData on server', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    service.setUserData(mockUserData);

    expect(service._loggedUserData()).toEqual(mockUserData);
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('should not access localStorage in init on server', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

    service.init();

    expect(service._loggedUserData()).toBeNull();
    expect(getItemSpy).not.toHaveBeenCalled();
  });

  it('should not access localStorage in logout on server', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    service.logout();

    expect(service._loggedUserData()).toBeNull();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});
