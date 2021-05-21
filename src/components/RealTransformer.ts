import {
  complex, matrix, Matrix, zeros,
} from 'mathjs';
import Component from './Component';
import Node from '../Node';
import MatrixHelper from '../helpers/MatrixHelper';

export default class RealTransformer implements Component {
  readonly name: string;

  readonly nodes: Node[];

  readonly addedDimensions = 2;

  readonly hasSource = false;

  readonly source = null;

  private positiveNode1: Node;

  private negativeNode1: Node;

  private inductance1: number;

  private positiveNode2: Node;

  private negativeNode2: Node;

  private inductance2: number;

  private relation: number;

  constructor(
    name: string,
    positiveNode1: Node,
    negativeNode1: Node,
    inductance1: number,
    positiveNode2: Node,
    negativeNode2: Node,
    inductance2: number,
    relation: number,
  ) {
    this.name = name;
    this.positiveNode1 = positiveNode1;
    this.negativeNode1 = negativeNode1;
    this.inductance1 = inductance1;
    this.positiveNode2 = positiveNode2;
    this.negativeNode2 = negativeNode2;
    this.inductance2 = inductance2;
    this.relation = relation;

    this.nodes = [
      positiveNode1,
      negativeNode1,
      positiveNode2,
      negativeNode2,
    ];
  }

  conductanceMatrix(
    equationSize: number,
    currentExtraIndex: number,
    frequency: number,
  ): Matrix {
    const conductanceMatrix = matrix(zeros([equationSize, equationSize]));

    const positive1 = this.positiveNode1.matrixNumber();
    const negative1 = this.negativeNode1.matrixNumber();
    const positive2 = this.positiveNode2.matrixNumber();
    const negative2 = this.negativeNode2.matrixNumber();

    if (this.positiveNode1.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive1, currentExtraIndex - 1],
        +1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex - 1, positive1],
        -1,
      );
    }

    if (this.negativeNode1.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative1, currentExtraIndex - 1],
        -1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex - 1, negative1],
        +1,
      );
    }

    if (this.positiveNode2.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [positive2, currentExtraIndex],
        +1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, positive2],
        -1,
      );
    }

    if (this.negativeNode2.isNotGround()) {
      MatrixHelper.addValue(
        conductanceMatrix,
        [negative2, currentExtraIndex],
        -1,
      );

      MatrixHelper.addValue(
        conductanceMatrix,
        [currentExtraIndex, negative2],
        +1,
      );
    }

    MatrixHelper.addValue(
      conductanceMatrix,
      [currentExtraIndex - 1, currentExtraIndex - 1],
      complex(0, frequency * this.inductance1),
    );

    MatrixHelper.addValue(
      conductanceMatrix,
      [currentExtraIndex - 1, currentExtraIndex],
      complex(0, frequency * this.relation),
    );

    MatrixHelper.addValue(
      conductanceMatrix,
      [currentExtraIndex, currentExtraIndex - 1],
      complex(0, frequency * this.relation),
    );

    MatrixHelper.addValue(
      conductanceMatrix,
      [currentExtraIndex, currentExtraIndex],
      complex(0, frequency * this.inductance2),
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
