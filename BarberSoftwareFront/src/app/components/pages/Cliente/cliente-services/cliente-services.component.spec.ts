import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteServicesComponent } from './cliente-services.component';

describe('ClienteServicesComponent', () => {
  let component: ClienteServicesComponent;
  let fixture: ComponentFixture<ClienteServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteServicesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClienteServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
