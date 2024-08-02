import type { Plugin } from 'chart.js';

type TPlugins = {
  [key: string]: Plugin;
};

const plugins: TPlugins = {
  // chartBackgroundColor: {
  //   id: 'chartBackgroundColor',
  //   beforeDraw: (chart, args, options) => {
  //     const { ctx } = chart;
  //     ctx.save();
  //     ctx.globalCompositeOperation = 'destination-over';
  //     ctx.fillStyle = options.color || '#ffffff';
  //     ctx.fillRect(0, 0, chart.width, chart.height);
  //     ctx.restore();
  //   },
  // },
  chartAreaBackgroundColor: {
    id: 'chartAreaBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {
        ctx,
        chartArea: { left, top, right, bottom },
        scales: { y },
      } = chart;

      ctx.save();
      ctx.fillStyle = options.color || '#ffffff';
      ctx.roundRect(
        left,
        top + (options.top || 0),
        right - y.width,
        bottom + (options.bottom || 0),
        options.borderRadius || 30
      );
      ctx.fill();
      ctx.restore();
    },
  },
  // chartAreaQuadrantsBackgroundColor: {
  //   id: 'chartAreaQuadrantsBackgroundColor',
  //   beforeDraw(chart, args, options) {
  //     const {
  //       ctx,
  //       chartArea: { left, top, right, bottom },
  //       scales: { x, y },
  //     } = chart;
  //     const midX = x.getPixelForValue(0);
  //     const midY = y.getPixelForValue(0);
  //     ctx.save();
  //     ctx.fillStyle = options.topLeft;
  //     ctx.fillRect(left, top, midX - left, midY - top);
  //     ctx.fillStyle = options.topRight;
  //     ctx.fillRect(midX, top, right - midX, midY - top);
  //     ctx.fillStyle = options.bottomRight;
  //     ctx.fillRect(midX, midY, right - midX, bottom - midY);
  //     ctx.fillStyle = options.bottomLeft;
  //     ctx.fillRect(left, midY, midX - left, bottom - midY);
  //     ctx.restore();
  //   },
  // },
};

export { plugins as default };

