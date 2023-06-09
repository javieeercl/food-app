/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SolicitarGarzonService } from './solicitar-garzon.service';

describe('Service: SolicitarGarzon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolicitarGarzonService]
    });
  });

  it('should ...', inject([SolicitarGarzonService], (service: SolicitarGarzonService) => {
    expect(service).toBeTruthy();
  }));
});
