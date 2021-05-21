import {
  add, complex, Complex, lusolve, Matrix, matrix, zeros,
} from 'mathjs';
import Component from './components/Component';

interface NodalAnalysisResult {
  type: string,
  name: string,
  unit: string,
  value: object,
}

export default class Circuit {
  private components: Component[];

  public constructor(components: Component[]) {
    this.components = components;
  }

  public nodalAnalysis(): NodalAnalysisResult[] {
    const originalEquationSize = this.originalEquationSize();
    const modifiedEquationSize = this.modifiedEquationSize();

    let conductanceMatrix = matrix(zeros([
      modifiedEquationSize,
      modifiedEquationSize,
    ]));

    let currentVector = matrix(zeros([modifiedEquationSize, 1]));

    let currentExtraIndex = originalEquationSize - 1;

    const results = [] as NodalAnalysisResult[];
    for (let i = 1; i <= originalEquationSize; i += 1) {
      results.push({
        type: 'Node',
        name: `${i + 1}`,
        unit: 'V',
        value: complex(0, 0),
      });
    }

    this.components.forEach((c) => {
      for (let ci = 0; ci < c.addedDimensions; ci += 1) {
        results.push({
          type: 'Component',
          name: c.name,
          unit: 'A',
          value: complex(0, 0),
        });
      }

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

    const voltageVector = lusolve(conductanceMatrix, currentVector) as Matrix;

    let index = 0;
    voltageVector.forEach((vectorElement: Complex) => {
      results[index].value = {
        re: vectorElement.re,
        im: vectorElement.im,
        r: vectorElement.toPolar().r,
        phi: vectorElement.toPolar().phi,
      };
      index += 1;
    });

    return results;
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
