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

    console.log('timeseriescomponent')
    axios.get(timeSeriesCsvUrl).then(timeSeriesCsvRes => {
      console.log('axios response')
      const timeSeriesItems = this.readTimeSeriesText(timeSeriesCsvRes.data);
   
      const regressionResultItaly = this.getRegressionCurve(137, timeSeriesItems);
      const regressionCurveItaly = regressionResultItaly.curve;
      const regressionResultFrance = this.getRegressionCurve(116, timeSeriesItems);
      const regressionCurveFrance = regressionResultFrance.curve;


      // const a1 = regressionResultItaly.result.equation[0];
      // const b1 = regressionResultItaly.result.equation[1];
      // const a2= regressionResultFrance.result.equation[0];
      // const b2 = regressionResultFrance.result.equation[1];
      // const t0 = 35;
      // const te = 74;
      // console.log(`(Italy) a1: ${a1}, b1: ${b1}`);
      // console.log(`(France) a2: ${a2}, b2: ${b2}`);

      // compare with explicitly delayed curve
      const a1 = regressionResultItaly.result.equation[0];
      const b1 = regressionResultItaly.result.equation[1];
      const a2= regressionResultItaly.result.equation[0] / Math.exp(b1 * 10);
      const b2 = regressionResultItaly.result.equation[1];
      const t0 = 35;
      const te = 74;
      console.log(`(Italy) a1: ${a1}, b1: ${b1}`);
      console.log(`(Delayed) a2: ${a2}, b2: ${b2}`);

      const c = this.horizontalShiftForExponentials(a1, b1, a2, b2, t0, te);
      console.log(`c: ${c}`);


      const countries = [
        { name: 'Italy', color: 'rgba(220,20,60,1)' },
        { name: 'Japan', color: 'rgba(255, 182, 193,1)' },
        { name: 'France', color: 'rgba(65,105, 225,1)' },
        { name: 'Germany', color: 'rgba(105,105,105,1)' }
      ];

      const datasets = [];

      const refCountryIndex = this.searchCountryIndex(timeSeriesItems, countries[0].name);
      let a1, b1;

      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        
      }

      countries.forEach(country => {
        datasets.push(this.datasetFromTimeSeries(timeSeriesItems, country.name, country.color));
        const countryIndex = this.searchCountryIndex(timeSeriesItems, country.name);
        const regressionResult = this.getRegressionCurve(countryIndex, timeSeriesItems);


      })

      const datasets = [
        this.datasetFromTimeSeries(timeSeriesItems, 'Italy', 'rgba(220,20,60,1)'),
        this.datasetFromTimeSeries(timeSeriesItems, 'Japan', 'rgba(255, 182, 193,1)'),
        // this.datasetFromTimeSeries(timeSeriesItems, 'Spain', 'rgba(240,230,140,1)'),
        this.datasetFromTimeSeries(timeSeriesItems, 'France', 'rgba(65,105, 225,1)'),
        // this.datasetFromTimeSeries(timeSeriesItems, 'Germany', 'rgba(105,105,105,1)'),
        this.datasetFromCoordinates(regressionCurveItaly, 'Regression Curve of Italy', 'rgba(170,20,60,1)'),
        this.datasetFromCoordinates(regressionCurveFrance, 'Regression Curve of France', 'rgba(23,200,60,1)'),
        // this.datasetFromCoordinates(regressionResultItaly.delayed, 'Delayed Regression Curve of Italy', 'rgba(0,30,60,1)')
      ];

      // this.state = { timeSeriesItems: timeSeriesItems, datasets: datasets };
      this.setState({ timeSeriesItems: timeSeriesItems, datasets: datasets });
    });
  }

  searchCountryIndex(timeSeriesItems, countryName) {
    let index = null;
    for (let i = 0; i < timeSeriesItems.length; i++) {
      const item = timeSeriesItems[i];
      if (item['Country/Region'] === countryName && this.isEmptyString(item['Province/State']) {
        index = i;
        break;
      }
    }

    if (index == null) {
      throw new Error("Country is not found!");
    }

    return index;
  }

  // Calculate the horizontal shift c. Given this c, when the second exponential function N2(t) is shifted about t-axis like N2(t+c),
  // the residual of (N1(t)-N2(t+c))^2 for all t will become the minimum.
  horizontalShiftForExponentials(a1, b1, a2, b2, t0, te) {
    const c = 1 / b2 * Math.log(a1 / a2 * 2 * b2 / (b1 + b2) * (Math.exp((b1 + b2) * t0) - Math.exp((b1 + b2) * te)) / (Math.exp((2 * b2) * t0) - Math.exp((2 * b2) * te)));
    return c;
  }

  getRegressionCurve(countryIndex, timeSeriesItems) {
    const momentStartDate = moment(timeSeriesItems[countryIndex].timeSeries[0].date, "M/D/YYYY");
    // const totalDaysItaly = timeSeriesItems[countryIndex].timeSeries.slice(timeSeriesItems[countryIndex].timeSeries.length - 40).map(timeSeries => {
    //   const duration = moment.duration(moment(timeSeries.date, "M/D/YYYY").diff(momentStartDate));
    //   return [duration.asDays(), timeSeries.num];
    // });

    const totalDaysItaly = [];
    const timeSeries = timeSeriesItems[countryIndex].timeSeries;
    for (let i = 0; i < 40; i++) {
      const set = timeSeries[timeSeries.length - 40 + i];
      totalDaysItaly.push([i, set.num]);
    }

    console.log(totalDaysItaly);

    const result = regression.exponential(totalDaysItaly);
    const a = result.equation[0];
    const b = result.equation[1];
    console.log(`a: ${a}, b: ${b}, r2: ${result.r2}`);

    const regressionYValues = totalDaysItaly.map(set => a * Math.exp(b * set[0]));
    console.log('regressionYValues');
    console.log(regressionYValues);
    const regressionCurveItaly = [];
    for (let i = 0; i < totalDaysItaly.length; i++) {
      const asDays = totalDaysItaly[i][0];
      const date = moment(momentStartDate);
      date.add(asDays, 'days');
      // regressionCurveItaly.push({t: date, y: regressionYValues[i]});
      regressionCurveItaly.push({t: i, y: regressionYValues[i]});
    }

    const delayedRegressionCurve = [];
    const delayedRegressionYValues = totalDaysItaly.map(set => a * Math.exp(b * (set[0] - 10)));
    console.log('regressionYValues delayed');
    console.log(delayedRegressionYValues);
    for (let i = 0; i < totalDaysItaly.length; i++) {
      const asDays = totalDaysItaly[i][0];
      const date = moment(momentStartDate);
      date.add(asDays, 'days');
      delayedRegressionCurve.push({t: date, y: delayedRegressionYValues[i]});
    }

    return { result, curve: regressionCurveItaly, delayed: delayedRegressionCurve};
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

  // datasetFromTimeSeries(countryName, color) {
  //   if (!this.state) {
  //     return null;
  //   }

  //   const item = this.state.timeSeriesItems.find(x => x['Country/Region'] === countryName && this.isEmptyString(x['Province/State']));
  //   if (!item) {
  //     throw new Error('country is not found!');
  //   }

  //   const data = item.timeSeries.map(timeSeries => { return { t: timeSeries.date, y: timeSeries.num }});

  //   return this.datasetFromCoordinates(data, countryName, color);
  // }

  datasetFromTimeSeries(timeSeriesItems, countryName, color) {
    const item = timeSeriesItems.find(x => x['Country/Region'] === countryName && this.isEmptyString(x['Province/State']));
    if (!item) {
      throw new Error('country is not found!');
    }

    const data = item.timeSeries.map(timeSeries => { return { t: timeSeries.date, y: timeSeries.num }});

    return this.datasetFromCoordinates(data, countryName, color);
  }

  datasetFromCoordinates(xyData, label, color) {
    return {
      label: label,
      data: xyData,
      backgroundColor: color,
      borderColor: color,
      pointBorderColor: color,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color
    }    
  }

  render() {
    return (
      <GraphComponent datasets={this.state && this.state.datasets}></GraphComponent>
    )
  }
}