import { Matrix, matrix, zeros } from 'mathjs';
import MatrixHelper from '../helpers/MatrixHelper';
import Node from '../Node';
import Source from '../sources/Source';
import Component from './Component';

export default class CurrentSource implements Component {
  readonly name: string;

  readonly nodes: Node[];

  readonly addedDimensions = 0;

  readonly hasSource = true;

  readonly source: Source;

  private positiveNode: Node;

  private negativeNode: Node;

  public constructor(
    name: string,
    positiveNode: Node,
    negativeNode: Node,
    source: Source,
  ) {
    this.name = name;
    this.positiveNode = positiveNode;
    this.negativeNode = negativeNode;
    this.source = source;

    this.nodes = [positiveNode, negativeNode];
  }

  // eslint-disable-next-line class-methods-use-this
  conductanceMatrix(
    equationSize: number,
  ): Matrix {
    return matrix(zeros([equationSize, equationSize]));
  }

  currentSourceVector(
    equationSize: number,
  ): Matrix {
    const vector = matrix(zeros([equationSize, 1]));

    const positive = this.positiveNode.matrixNumber();
    const negative = this.negativeNode.matrixNumber();

    if (this.positiveNode.isNotGround()) {
      MatrixHelper.addValue(
        vector,
        [positive, 0],
        -this.source.amplitude,
      );
    }

    if (this.negativeNode.isNotGround()) {
      MatrixHelper.addValue(
        vector,
        [negative, 0],
        +this.source.amplitude,
      );
    }

    return vector;
  }
}
