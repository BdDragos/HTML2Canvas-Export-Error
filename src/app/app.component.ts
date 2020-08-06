import { Component, VERSION } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  toUseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187.083 67.977">
  <defs>
    <style>
      .a, .b, .c {
        fill: #eda921;
      }

      .a, .b {
        stroke: #000;
        stroke-miterlimit: 10;
      }

      .a {
        stroke-width: 9.122px;
      }

      .b {
        stroke-width: 9.122px;
      }

      .d {
        fill: #005a9c;
      }
    </style>
  </defs>
  <title>SVGlogo</title>
  <g>
    <g>
      <g>
        <path class="a" d="M13.745,30.137a5.38,5.38,0,1,0,0,7.608H54.137a5.38,5.38,0,1,0,0-7.608Z"/>
        <path class="b" d="M22.351,16.971a5.381,5.381,0,1,0-5.38,5.38L45.532,50.912a5.38,5.38,0,1,0,5.38-5.38Z"/>
        <path class="a" d="M37.745,13.745a5.38,5.38,0,1,0-7.608,0V54.137a5.38,5.38,0,1,0,7.608,0Z"/>
        <path class="b" d="M50.912,22.351a5.381,5.381,0,1,0-5.38-5.38L16.971,45.532a5.38,5.38,0,1,0,5.38,5.38Z"/>
      </g>
      <g>
        <path class="c" d="M13.745,30.137a5.38,5.38,0,1,0,0,7.608H54.137a5.38,5.38,0,1,0,0-7.608Z"/>
        <path class="c" d="M22.351,16.971a5.381,5.381,0,1,0-5.38,5.38L45.532,50.912a5.38,5.38,0,1,0,5.38-5.38Z"/>
        <path class="c" d="M37.745,13.745a5.38,5.38,0,1,0-7.608,0V54.137a5.38,5.38,0,1,0,7.608,0Z"/>
        <path class="c" d="M50.912,22.351a5.381,5.381,0,1,0-5.38-5.38L16.971,45.532a5.38,5.38,0,1,0,5.38,5.38Z"/>
      </g>
    </g>
    <g>
      <path class="d" d="M74.062,34.166a19.8,19.8,0,1,1,33.8-14h-11.6A8.2,8.2,0,1,0,82.257,25.96h0c1.485,1.49,2.722,1.921,5.8,2.409h0c5.471.569,10.419,2.219,14,5.8h0a19.8,19.8,0,1,1-33.8,14h11.6a8.2,8.2,0,1,0,14.009-5.792h-.006c-1.485-1.485-3.615-2-5.8-2.4v-.006c-5.3-.813-10.415-2.218-14-5.8Z"/>
      <path class="d" d="M147.469.367,133.462,67.976h-11.6l-14-67.609h11.6l8.208,39.6,8.2-39.6Z"/>
      <path class="d" d="M167.276,28.369h19.8v19.8h.006a19.8,19.8,0,1,1-39.607,0h0v-28h-.006a19.8,19.8,0,0,1,39.607,0h-11.6a8.2,8.2,0,1,0-16.4,0v28h0a8.2,8.2,0,0,0,16.4,0v-8.2h-8.2V28.369Z"/>
    </g>
  </g>
</svg>
`;

  @ViewChild('picContainer') picContainer: ElementRef;
  @ViewChild('gridContainer') gridContainer: ElementRef;

  name = 'Angular ' + VERSION.major;

  ngAfterViewInit() {
    this.createGridCanvas(30, 30, this.gridContainer.nativeElement);
    this.setCanvasBackground(this.toUseSvg, this.picContainer.nativeElement);
  }

  setCanvasBackground(imageSVG: string, imgDiv: HTMLElement) {
    const gotElements = imgDiv.getElementsByClassName(
      'canvas-background-heatmap'
    );

    let canvas: HTMLCanvasElement = null;
    if (gotElements.length === 0) {
      canvas = document.createElement('canvas');
      imgDiv.appendChild(canvas);
    } else {
      canvas = gotElements[0] as HTMLCanvasElement;
    }

    canvas.className = 'canvas-background-heatmap';
    canvas.id = 'canvas-id-heatmap';

    canvas.width = imgDiv.clientWidth;
    canvas.height = imgDiv.clientHeight;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const parser = new DOMParser();
    const result = parser.parseFromString(imageSVG, 'text/xml');
    const inlineSVG = result.getElementsByTagName('svg');

    inlineSVG[0].setAttribute('width', '250');
    inlineSVG[0].setAttribute('height', '150');

    // assign image to canvas
    const img = new Image();

    img.width = 250;
    img.height = 150;

    img.onload = () => {
      this.drawCanvas(canvas, img);
      // done so the garbage collector can remove the svg instance, else the unused svgs would remain in memory
      URL.revokeObjectURL(img.src);
    };

    const s = new XMLSerializer();
    // assign svg to image
    img.src = URL.createObjectURL(
      this.convertSVGToBlob(s.serializeToString(inlineSVG[0])).blob
    );
  }

  drawCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    const ratio = Math.min(
      canvas.width / (img.width + 0),
      canvas.height / (img.height + 0)
    );

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      img,
      Math.floor((canvas.width - img.width * ratio) / 2) + (0 / 2) * ratio,
      Math.floor((canvas.height - img.height * ratio) / 2) + (0 / 2) * ratio,
      Math.floor(img.width * ratio),
      Math.floor(img.height * ratio)
    );
  }

  convertSVGToBlob(svg: string) {
    // convert svg to image stored locally
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return { blob: blob };
  }

  createGridCanvas(rowSize: number, colSize: number, container: any) {
    const gotElements = container.getElementsByClassName('canvas-grid-element');

    let canvas: HTMLCanvasElement = null;
    if (gotElements.length === 0) {
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
    } else {
      canvas = gotElements[0] as HTMLCanvasElement;
    }

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;

    canvas.className = 'canvas-grid-element';
    canvas.id = 'canvas-grid-element-id';

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.8';

    canvas.width =
      container.clientWidth > 0 ? container.clientWidth * dpr : 1 * dpr;
    canvas.height =
      container.clientHeight > 0 ? container.clientHeight * dpr : 1 * dpr;

    const cw = canvas.width;
    const ch = canvas.height;

    const colSizePixel = cw / colSize;
    const rowSizePixel = ch / rowSize;

    this.drawGridLines(ctx, cw, ch, colSizePixel, rowSizePixel);

    return { canvas, colSizePixel, rowSizePixel };
  }

  drawGridLines(
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    colSizePixel: number,
    rowSizePixel: number
  ) {
    ctx.beginPath();

    for (let x = 0; x <= cw + 1; x += colSizePixel) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
    }

    for (let y = 0; y <= ch; y += rowSizePixel) {
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  toCanvas() {
    // scale attribute is used so the chart is not cut off at scallings smaller than 100%
    const clone = document.getElementById('export-canvas');

    html2canvas(clone, {
      useCORS: true,
      logging: false,
      scale:
        window.devicePixelRatio && window.devicePixelRatio >= 1
          ? window.devicePixelRatio
          : 1,
    }).then((canvas) => {
      document.body.insertBefore(canvas, document.body.firstChild);
    });
  }
}
