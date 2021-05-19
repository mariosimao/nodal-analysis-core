import { matrix, Matrix, zeros } from 'mathjs';
import Component from './Component';
import Node from '../Node';
import MatrixHelper from '../helpers/MatrixHelper';

export default class Resistor implements Component {
  readonly name: string;

  readonly nodes: Node[];

  readonly addedDimensions = 1;

  readonly hasSource = false;

  readonly source = null;

  private positiveNode: Node;

  private negativeNode: Node;

  private resistance: number;

  constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    resistance: number,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.resistance = resistance;

    this.nodes = [positiveNode, negativeNode];
  }

  conductanceMatrix(
    equationSize: number,
    extraIndex: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive, extraIndex],
        +1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, positive],
        -1,
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative, extraIndex],
        -1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [extraIndex, negative],
        +1,
      );
    }

    MatrixHelper.addValue(
      conductanceMatrix,
      [extraIndex, extraIndex],
      this.resistance,
    );

    return conductanceMatrix;
  }

  // eslint-disable-next-line class-methods-use-this
  currentSourceVector(
    equationSize: number,
  ): Matrix {
    return matrix(zeros([equationSize, 1]));
  }
}
