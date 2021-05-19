import { complex, Complex } from 'mathjs';
import Source from './Source';

export default class DCSource implements Source {
  readonly amplitude: number;

  readonly frequency: number;

  readonly angle: number;

  readonly complex: Complex;

  public constructor(amplitude: number) {
    this.amplitude = amplitude;
    this.frequency = 0;
    this.angle = 0;
    this.complex = complex(amplitude, 0);
  }
}
