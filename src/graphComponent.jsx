import React from 'react';
import './graphComponent.css';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col } from 'react-bootstrap';

export class GraphComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const defaultDatasetParams = {
      label: 'No data',
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
      data: []          
    }

    this.chartData = {
      datasets: this.props.datasets && this.props.datasets.map(dataset => ({ ...defaultDatasetParams, ...dataset }))
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