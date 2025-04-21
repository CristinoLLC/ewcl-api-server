declare module '3dmol' {
  interface ViewerOptions {
    backgroundColor?: string;
    id?: string;
    antialias?: boolean;
    width?: number | string;
    height?: number | string;
  }

  interface StyleSpec {
    cartoon?: {
      color?: string;
      style?: string;
      thickness?: number;
    };
    stick?: {
      radius?: number;
      colorscheme?: string;
    };
    sphere?: {
      radius?: number;
      color?: string;
    };
    line?: {
      color?: string;
      width?: number;
    };
    surface?: {
      opacity?: number;
      color?: string;
      colorscheme?: string;
    };
  }

  interface SelectionSpec {
    model?: number;
    chain?: string;
    resi?: number | string;
    resn?: string;
    atom?: string;
    elem?: string;
    hetflag?: boolean;
    serial?: number;
    predicate?: (atom: any) => boolean;
  }

  interface Model {
    addAtoms(atoms: any[]): void;
    setStyle(selection: SelectionSpec, style: StyleSpec): void;
    addStyle(selection: SelectionSpec, style: StyleSpec): void;
    removeStyle(selection: SelectionSpec): void;
    getAtoms(selection: SelectionSpec): any[];
    addSurface(type: string, style: StyleSpec, atomsel: SelectionSpec, allsel: SelectionSpec): void;
    removeSurface(surf: any): void;
    setColorByProperty(sel: SelectionSpec, prop: string, scheme: any): void;
    setStyle(sel: SelectionSpec, style: StyleSpec): void;
  }

  interface GLViewer {
    addModel(data?: string, format?: string): Model;
    clear(): void;
    render(): void;
    zoomTo(): void;
    zoom(factor: number): void;
    center(selection: SelectionSpec): void;
    rotate(axis: number[], angle: number): void;
    setStyle(selection: SelectionSpec, style: StyleSpec): void;
    addSurface(type: string, style: StyleSpec): void;
    removeAllModels(): void;
    removeAllSurfaces(): void;
    addLabel(text: string, options: any, sel: SelectionSpec): void;
    removeAllLabels(): void;
    setBackgroundColor(color: string): void;
    setWidth(width: number | string): void;
    setHeight(height: number | string): void;
    enableFog(fog: boolean): void;
    update(): void;
    zoom(factor: number, animationDuration: number): void;
    spin(axis: string, speed: number): void;
    getCanvas(): HTMLCanvasElement;
  }

  function createViewer(element: HTMLElement, options?: ViewerOptions): GLViewer;
  function download(query: string, format?: string): string;
}