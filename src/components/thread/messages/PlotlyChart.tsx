import { useState } from 'react';
// @ts-expect-error Plotly does not have TS definitions
import Plot from 'react-plotly.js';

interface PlotlyChartProps {
  data: any;
}

export function PlotlyChart({ data }: PlotlyChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Parse data if it's a string
  const plotlyData = typeof data === 'string' ? JSON.parse(data) : data;
  
  // Fullscreen icon path
  const fullscreenIcon = {
    'width': 512,
    'height': 512,
    'path': "M512 512v-208l-80 80-96-96-48 48 96 96-80 80z M512 0h-208l80 80-96 96 48 48 96-96 80 80z M0 512h208l-80-80 96-96-48-48-96 96-80-80z M0 0v208l80-80 96 96 48-48-96-96 80-80z"
  };
  
  // Create configuration with fullscreen button
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: [{
      name: 'Fullscreen',
      icon: fullscreenIcon,
      click: function() {
        setIsFullscreen(!isFullscreen);
      }
    }],
    modeBarButtonsToRemove: ['lasso', 'pan', 'select', 'zoomIn', 'zoomOut', 'resetScale', 'autoscale', 'zoom']
  };
  
  // Combine user layout with autosize
  const layout = {
    ...plotlyData.layout,
    autosize: true
  };
  
  return (
    <>
      <style>
        {`
        .fullscreen {
          z-index: 2147483647;
          width: 100%;
          height: 90vh !important;
          background: white;
          position: fixed;
          left: 0;
          right: 0;
          top: 5%;
          border-radius: 20px;
          border: 5px solid #e6e6e6;
          box-shadow: 0 70px 40px -20px rgba(0, 0, 0, 0.2);
          resize: both;
          overflow: auto;
        }
        
        .fullscreen::-webkit-scrollbar {
          width: 3px;
        }
        `}
      </style>
      <div className={`w-full ${isFullscreen ? 'fullscreen' : ''}`}>
        <Plot
          data={plotlyData.data}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </>
  );
}
