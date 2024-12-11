/**
 * Rectangle on a 2D-grid with an inverted y-axis. (should this be abstracted? - or is this browser only and it does not matter)
 */
export class Rectangle {
  #xMin: number;
  #xMax: number;
  #yMin: number;
  #yMax: number;

  constructor({
    xMin,
    xMax,
    yMin,
    yMax,
  }: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }) {
    this.#xMin = xMin;
    this.#xMax = xMax;
    this.#yMin = yMin;
    this.#yMax = yMax;
  }

  public get dimensions(): {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  } {
    return {
      xMin: this.#xMin,
      xMax: this.#xMax,
      yMin: this.#yMin,
      yMax: this.#yMax,
    };
  }

  /**
   * Resize the rectangle.
   */
  public resize(dimensions: {
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
  }): void {
    if (dimensions.xMin) this.#xMin = dimensions.xMin;
    if (dimensions.xMax) this.#xMax = dimensions.xMax;
    if (dimensions.yMin) this.#yMin = dimensions.yMin;
    if (dimensions.yMax) this.#yMax = dimensions.yMax;
  }

  /**
   * Determine if the rectangle is intesecting with another.
   *
   * @param other Rectangle to check if intersecting.
   *
   * @returns True if any point of the rectangles is intersecting.
   */
  public isIntersecting(other: Rectangle): boolean {
    if (
      this.#xMin > other.#xMax ||
      this.#xMax < other.#xMin ||
      this.#yMin > other.#yMax ||
      this.#yMax < other.#yMin
    )
      return false;

    return true;
  }

  /**
   * Translate the rectangle across the grid.
   */
  public translate(displacement: { x?: number; y?: number }): void {
    this.#xMin += displacement.x ?? 0;
    this.#xMax += displacement.x ?? 0;
    this.#yMin += displacement.y ?? 0;
    this.#yMax += displacement.y ?? 0;
  }

  public get width(): number {
    return this.#xMax - this.#xMin;
  }

  public get height(): number {
    return this.#yMax - this.#yMin;
  }

  public contain(other: Rectangle): void {
    // Other is wider than container
    if (other.width >= this.width) {
      other.resize({ xMin: this.#xMin, xMax: this.#xMax });
      // Other is extending beyond container to right
    } else if (other.#xMax >= this.#xMax) {
      const overflow = other.#xMax - this.#xMax;
      other.translate({ x: -overflow });
      // Other is extending beyond container to left
    } else {
      const overflow = this.#xMin - other.#xMin;
      other.translate({ x: overflow });
    }

    // Other is taller than container
    if (other.height >= this.height) {
      other.resize({ yMin: this.#xMin, yMax: this.#yMax });
      // Other is extending beyond container to top
    } else if (other.#yMax >= this.#yMax) {
      const overflow = other.#yMax - this.#yMax;
      other.translate({ y: -overflow });
      // Other is extending beyond container to bottom
    } else {
      const overflow = this.#yMin - other.#yMin;
      other.translate({ y: overflow });
    }
  }

  public stretch(
    from: Edge | Vertex,
    displacement: { x?: number; y?: number }
  ): void {
    const movingEdges: Edge[] = from.split('-') as Edge[];

    this.resize({
      xMin: movingEdges.includes('left')
        ? this.#xMin + (displacement.x ?? 0)
        : undefined,
      xMax: movingEdges.includes('right')
        ? this.#xMax + (displacement.x ?? 0)
        : undefined,
      yMin: movingEdges.includes('top')
        ? this.#yMin + (displacement.y ?? 0)
        : undefined,
      yMax: movingEdges.includes('bottom')
        ? this.#yMax + (displacement.y ?? 0)
        : undefined,
    });
  }

  public relativeScale(other: Rectangle): { x: number; y: number } {
    return { x: this.width / other.width, y: this.height / other.height };
  }

  public scaleBy(
    scale: number | { x?: number; y?: number },
    anchor: Edge | Vertex
  ): void {
    const anchoredEdges: Edge[] = anchor.split('-') as Edge[];
    const scaleX = typeof scale === 'number' ? scale : scale.x ?? 0;
    const scaleY = typeof scale === 'number' ? scale : scale.y ?? 0;

    this.resize({
      xMin: anchoredEdges.includes('left') ? undefined : this.#xMin * scaleX,
      xMax: anchoredEdges.includes('right') ? undefined : this.#xMax * scaleX,
      yMin: anchoredEdges.includes('top') ? undefined : this.#yMin * scaleY,
      yMax: anchoredEdges.includes('bottom') ? undefined : this.#yMax * scaleY,
    });
  }

  public offset(other: Rectangle, from: Edge | Vertex): { x: number; y: number } {
    const offsetEdges: Edge[] = from.split('-') as Edge[];
    let offsetX: number;
    let offsetY: number;

    if (offsetEdges.includes('left')) {
      offsetX =  
    }
  }
}

type Edge = 'left' | 'top' | 'right' | 'bottom';
type Vertex = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

export class Vector {
  public readonly x1: number;
  public readonly y1: number;
  public readonly x2: number;
  public readonly y2: number;

  constructor({
    x1 = 0,
    y1 = 0,
    x2,
    y2,
  }: {
    x1?: number;
    y1?: number;
    x2: number;
    y2: number;
  }) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}
