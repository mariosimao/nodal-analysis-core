import Circuit from './Circuit';
import ComponentFactory from './components/ComponentFactory';

export default class CircuitFactory {
  public static fromNetlist(netlist: string): Circuit {
    const components = netlist.trim().split('\n').map((line) => {
      const component = ComponentFactory.fromNetlistLine(line);

      return component;
    });

    return new Circuit(components);
  }
}
