import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorAdd } from './donor-add';

describe('DonorAdd', () => {
  let component: DonorAdd;
  let fixture: ComponentFixture<DonorAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(DonorAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
