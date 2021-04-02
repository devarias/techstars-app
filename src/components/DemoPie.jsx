import React from 'react';
import { Pie } from '@ant-design/charts';

function DemoPie(props) {
  var data = [
    {
      type: 'Want Votes',
      value: props.want,
    },
    {
      type: 'Willing Votes',
      value: props.will,
    },
    {
      type: 'Wont Votes',
      value: props.wont,
    },
  ];

  var config = {
    data: data,
    angleField: 'value',
    colorField: 'type',
    color: ({ type }) => {
      if (type === 'Want Votes') {
        return '#4dad45';
      } else if (type === 'Willing Votes') {
        return '#ffa502';
      } else {
        return '#ff5938';
      }
    },
    radius: 0.6,
    innerRadius: 0.7,
    meta: {
      value: {
        formatter: function formatter(value) {
          return value;
        },
      },
    },
    legend: {
      position: 'right',
      itemName: {
        style: {
          fill: '#ffffffa9',
          fontSize: 15,
        },
      },
    },
    statistic: {
      title: {
        formatter: (value) => {
          if (!value) {
            return 'Total';
          } else {
            return value.type;
          }
        },
        style: { color: 'white' },
      },
      content: {
        style: {
          fontWeight: 'bold',
          color: '#ffffff77',
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { textAlign: 'center' },
      autoRotate: false,
      content: ({ value }) => {
        if (value) {
          return value;
        }
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
  };
  return <Pie {...config} />;
}

export default DemoPie;
