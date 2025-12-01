import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberoHomeComponent } from './barbero-home.component';

describe('BarberoHomeComponent', () => {
  let component: BarberoHomeComponent;
  let fixture: ComponentFixture<BarberoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberoHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
