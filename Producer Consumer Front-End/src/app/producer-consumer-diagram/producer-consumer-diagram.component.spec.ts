import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProducerConsumerDiagramComponent} from './producer-consumer-diagram.component';

describe('ProducerConsumerDiagramComponent', () => {
  let component: ProducerConsumerDiagramComponent;
  let fixture: ComponentFixture<ProducerConsumerDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProducerConsumerDiagramComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerConsumerDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
