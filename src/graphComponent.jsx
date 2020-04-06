import React from 'react';
import './graphComponent.css';
import { Line } from 'react-chartjs-2';
import timeSeriesCsvUrl from './csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
import axios from 'axios'
import * as moment from 'moment';
import { Container, Row, Col } from 'react-bootstrap';

export class GraphComponent extends React.Component {
  constructor(props) {
    super(props);
    axios.get(timeSeriesCsvUrl).then(timeSeriesCsvRes => {
      console.log(timeSeriesCsvRes.data.substring(0, 100));
      const timeSeriesItems = this.readTimeSeriesText(timeSeriesCsvRes.data);
      for (let i = 0; i < 10; i++) {
        console.log(timeSeriesItems[i])
        
      }
      this.setState({ timeSeriesItems: timeSeriesItems})
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

          timeSeriesInfo['timeSeries'].push({date: columns[i], num: records[i]});
        }
      }

      items.push(timeSeriesInfo);
    });

    return items;
  }


  isEmptyString(x) {
    return (x === '' || x === '\n' || x === '\r');
  }

  render() {
    this.chartData = {
      datasets: [
        {
          label: 'The Number of Confirmed in Italy',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255, 182, 193,0.4)',
          borderColor: 'rgba(255, 182, 193,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255, 182, 193,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(255, 182, 193,1)',
          pointHoverBorderColor: 'rgba(255, 240, 245 ,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state && this.state.timeSeriesItems[137].timeSeries.map(timeSeries => { return { t: moment(timeSeries.date, "M/D/YYYY"), y: timeSeries.num }})
        },
        {
          label: 'The Number of Confirmed in Japan',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state && this.state.timeSeriesItems[139].timeSeries.map(timeSeries => { return { t: moment(timeSeries.date, "M/D/YYYY"), y: timeSeries.num }})
        }
      ],  
    };
  
    this.chartOptions = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            // min: this.state && this.state.timeSeriesItems[137].timeSeries[0].date,
            unit: 'day'
        }
        }]
      }
    }  

    return (
      <Container fluid>
        <Row>
          <Col>
            <div>
            <label>Total Confirmed</label>
              <Line data={this.chartData} options={this.chartOptions}/>
            </div>
            {/* <label className="mt-5">Total Confirmed (table)</label>
            <ListGroup>
              {this.state.records && this.state.records.map(record => {
                return (
                  <ListGroup.Item>
                    <span className="date">{record.date}</span>
                    <span className="balance">{record.balance}</span>
                  </ListGroup.Item> 
                )
              })}
            </ListGroup> */}
          </Col>
        </Row>
       </Container>

    );
  }
}