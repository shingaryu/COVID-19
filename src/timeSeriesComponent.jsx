import React from 'react';
import './graphComponent.css';
import timeSeriesCsvUrl from './csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
import axios from 'axios'
import * as moment from 'moment';
import regression from 'regression';
import { GraphComponent } from './graphComponent'

export class TimeSeriesComponent extends React.Component {
  constructor(props) {
    super(props);

    axios.get(timeSeriesCsvUrl).then(timeSeriesCsvRes => {
      console.log(timeSeriesCsvRes.data.substring(0, 100));
      const timeSeriesItems = this.readTimeSeriesText(timeSeriesCsvRes.data);
      for (let i = 0; i < 10; i++) {
        console.log(timeSeriesItems[i])        
      }
      this.setState({ timeSeriesItems: timeSeriesItems});
  
      // const totalDaysItaly = timeSeriesItems[137].timeSeries.slice(timeSeriesItems[137].timeSeries.length - 30).map(timeSeries => {
      //   const momentStartDate = moment(timeSeriesItems[137].timeSeries[0].date, "M/D/YYYY");
      //   const duration = moment.duration(moment(timeSeries.date, "M/D/YYYY").diff(momentStartDate));
      //   return [duration.asDays(), parseInt(timeSeries.num)];
      // });
  
      // console.log(totalDaysItaly);
  
      // const result = regression.exponential([[0, 1], [32, 67], [12, 79]]);
      // const a = result.equation[0];
      // const b = result.equation[1];
  
      // const result = regression.exponential(totalDaysItaly);
      // const a = result.equation[0];
      // const b = result.equation[1];
      // console.log(`a: ${a}, b: ${b}, r2: ${result.r2}`);
    });
  }


  readTimeSeriesText(csvText) {
    csvText = csvText.replace('\r\n', '\n');
  
    const csvRows = csvText.split('\n');
    const columns = csvRows[0].split(',').filter(x => !this.isEmptyString(x));

    const items = [];    
    csvRows.slice(1).forEach(row => {
      if (!row) {
        return;
      }
    
      if (row.split(',').every(x => this.isEmptyString(x))) {
        return;
      }
    
      const records = row.split(',');
      const timeSeriesInfo = {};
      for (let i = 0; i < records.length; i++) {
        if (i < 4) {
          timeSeriesInfo[columns[i]] = records[i];
        } else {
          if (!timeSeriesInfo.timeSeries) {
            timeSeriesInfo['timeSeries'] = [];
          }

          timeSeriesInfo['timeSeries'].push({date: moment(columns[i], "M/D/YYYY"), num: parseInt(records[i])});
        }
      }

      items.push(timeSeriesInfo);
    });

    return items;
  }

  isEmptyString(x) {
    return (x === '' || x === '\n' || x === '\r');
  }

  datasetFromTimeSeries(countryName, color) {
    if (!this.state) {
      return null;
    }

    const item = this.state.timeSeriesItems.find(x => x['Country/Region'] === countryName && this.isEmptyString(x['Province/State']));
    if (!item) {
      throw new Error('country is not found!');
    }

    const data = item.timeSeries.map(timeSeries => { return { t: timeSeries.date, y: timeSeries.num }});

    return {
      label: countryName,
      data: data,
      backgroundColor: color,
      borderColor: color,
      pointBorderColor: color,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color
    }
  }

  render() {
    const datasets = [
      this.datasetFromTimeSeries('Italy', 'rgba(220,20,60,1)'),
      this.datasetFromTimeSeries('Japan', 'rgba(255, 182, 193,1)'),
      this.datasetFromTimeSeries('Spain', 'rgba(240,230,140,1)'),
      this.datasetFromTimeSeries('France', 'rgba(65,105, 225,1)'),
      this.datasetFromTimeSeries('Germany', 'rgba(105,105,105,1)'),
    ]

    return (
      <GraphComponent datasets={datasets}></GraphComponent>
    )
  }
}