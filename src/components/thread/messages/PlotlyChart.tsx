import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

interface PlotlyChartProps {
  data: any;
}

export function PlotlyChart({ data }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    try {
      // Parse data if it's a string
      const plotlyData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Create the plot
      Plotly.newPlot(chartRef.current, plotlyData.data, plotlyData.layout, { responsive: true });
      
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
  }, [data]);

  return <div ref={chartRef} className="w-full h-[400px]" />;
}
