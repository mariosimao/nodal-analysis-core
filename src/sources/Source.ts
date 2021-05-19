import { Complex } from 'mathjs';

export default interface Source {
  amplitude: number;
  frequency: number;
  angle: number;
  complex: Complex;
}
