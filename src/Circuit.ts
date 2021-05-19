import {
  add, lusolve, matrix, zeros,
} from 'mathjs';
import Component from './components/Component';

export default class Circuit {
  private components: Component[];

  public constructor(components: Component[]) {
    this.components = components;
  }

  public nodalAnalysis() {
    const originalEquationSize = this.originalEquationSize();
    const modifiedEquationSize = this.modifiedEquationSize();

    let conductanceMatrix = matrix(zeros([
      modifiedEquationSize,
      modifiedEquationSize,
    ]));

    let currentVector = matrix(zeros([modifiedEquationSize, 1]));

    let currentExtraIndex = originalEquationSize - 1;

    this.components.forEach((c) => {
      currentExtraIndex += c.addedDimensions;

      const componentConductanceMatrix = c.conductanceMatrix(
        modifiedEquationSize,
        currentExtraIndex,
        this.frequency(),
      );

      const componentCurrentVector = c.currentSourceVector(
        modifiedEquationSize,
        currentExtraIndex,
      );

      // @ts-ignore
      conductanceMatrix = add(conductanceMatrix, componentConductanceMatrix);
      // @ts-ignore
      currentVector = add(currentVector, componentCurrentVector);
    });

    return lusolve(conductanceMatrix, currentVector);
  }

  private originalEquationSize(): number {
    const nodeNumbers = new Set();

    this.components.forEach((c) => {
      c.nodes.map((n) => nodeNumbers.add(n.originalNumber));
    });

    nodeNumbers.delete(0);

    return nodeNumbers.size;
  }

  private modifiedEquationSize(): number {
    let modifiedEquationSize = this.originalEquationSize();
    this.components.forEach((c) => {
      modifiedEquationSize += c.addedDimensions;
    });

    return modifiedEquationSize;
  }

  private frequency(): number {
    let frequency = 0;
    this.components.forEach((c) => {
      if (c.source) {
        frequency = c.source.frequency;
      }
    });

    return frequency;
  }
}
