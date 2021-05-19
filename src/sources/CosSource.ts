import { complex, Complex } from 'mathjs';
import Source from './Source';

export default class CosSource implements Source {
  readonly amplitude: number;

  readonly frequency: number;

  readonly angle: number;

  readonly complex: Complex;

  public constructor(
    amplitude: number,
    frequency: number,
    angle: number,
  ) {
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.angle = angle;
    this.complex = complex({
      r: this.amplitude,
      phi: this.angle,
    });
  }
}
