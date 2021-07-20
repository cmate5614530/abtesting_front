import { FC } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core';

interface AudienceOverviewChartProps {
  data: any[];
  labels: string[];
}

const AudienceOverviewChart: FC<AudienceOverviewChartProps> = ({
  data: dataProp,
  labels,
  ...rest
}) => {
  const theme = useTheme();

  const data = () => {
    return {
      datasets: [
        {
          data: dataProp,
          lineTension: 0,
          borderWidth: 2,
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.light,
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ],
      labels
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    layout: {
      padding: 0
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ],
      yAxes: [
        {
          display: false
        }
      ]
    },
    tooltips: {
      enabled: false
    }
  };

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  );
};

AudienceOverviewChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired
};

export default AudienceOverviewChart;
