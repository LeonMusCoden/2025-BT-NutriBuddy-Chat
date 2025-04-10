import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist';

interface PlotlyChartProps {
  data: any;
}

export function PlotlyChart({ data }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    if (!chartRef.current || !data) return;
    try {
      // Parse data if it's a string
      const plotlyData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Fullscreen icon
      const fullscreenIcon = {
        'width': 512,
        'height': 512,
        'path': "M512 512v-208l-80 80-96-96-48 48 96 96-80 80z M512 0h-208l80 80-96 96 48 48 96-96 80 80z M0 512h208l-80-80 96-96-48-48-96 96-80-80z M0 0v208l80-80 96 96 48-48-96-96 80-80z"
      };
      
      // Create the plot with responsive config and fullscreen button
      Plotly.react(chartRef.current, plotlyData.data, {
        ...plotlyData.layout,
        autosize: true,
      }, {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToAdd: [{
          name: 'Fullscreen',
          icon: fullscreenIcon,
          click: function(gd) {
            const chartDiv = gd as HTMLElement;
            chartDiv.classList.toggle('fullscreen');
            setIsFullscreen(!isFullscreen);
            Plotly.Plots.resize(gd);
          }
        }],
        modeBarButtonsToRemove: ['lasso', 'pan', 'select', 'zoomIn', 'zoomOut', 'resetScale', 'autoscale', 'zoom']
      });
      
      // Ensure the plot resizes immediately after rendering
      setTimeout(() => {
        if (chartRef.current) {
          Plotly.Plots.resize(chartRef.current);
        }
      }, 100);
      
      // Handle window resize
      const handleResize = () => {
        if (chartRef.current) {
          Plotly.Plots.resize(chartRef.current);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          Plotly.purge(chartRef.current);
        }
      };
    } catch (error) {
      console.error('Error rendering Plotly chart:', error);
    }
  }, [data, isFullscreen]);
  
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
      <div 
        ref={chartRef} 
        className="w-full"
      />
    </>
  );
}
