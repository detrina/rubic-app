import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NetworkErrorComponent } from './network-error.component';

describe('NetworkErrorComponent', () => {
  let component: NetworkErrorComponent;
  let fixture: ComponentFixture<NetworkErrorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NetworkErrorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});