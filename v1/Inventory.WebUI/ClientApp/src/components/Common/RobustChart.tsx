import React, { useEffect, useRef, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";
import { Chart as ChartJS } from "chart.js";

interface RobustChartProps {
  data: ChartData<"line", number[], string>;
  options: ChartOptions<"line">;
  redrawTrigger?: string | number;
}

const RobustChart: React.FC<RobustChartProps> = ({
  data,
  options,
  redrawTrigger,
}) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    setIsChartReady(false);
  }, []);

  const updateChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.options = options;
      chartRef.current.update("none");
    }
  }, [data, options]);

  const recreateChart = useCallback(() => {
    destroyChart();

    setTimeout(() => {
      setIsChartReady(true);
    }, 10);
  }, [destroyChart]);

  useEffect(() => {
    if (redrawTrigger !== undefined) {
      console.log("Chart redraw triggered by:", redrawTrigger);
      recreateChart();
    }
  }, [redrawTrigger, recreateChart]);

  useEffect(() => {
    if (isChartReady && chartRef.current) {
      updateChart();
    }
  }, [data, options, isChartReady, updateChart]);

  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, [destroyChart]);

  const getChartRef = useCallback((chart: ChartJS<"line"> | null) => {
    chartRef.current = chart;
  }, []);

  const handleChartError = useCallback(
    (error: Error) => {
      console.error("Chart rendering error:", error);
      recreateChart();
    },
    [recreateChart]
  );

  if (!isChartReady && redrawTrigger !== undefined) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#666" }}>Updating chart...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Line
        ref={getChartRef}
        data={data}
        options={options}
        onError={handleChartError}
        redraw
      />
    </div>
  );
};

export default RobustChart;
