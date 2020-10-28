import { useEffect, useState } from 'react'
import moment from 'moment'
import AppHelper from '../../app-helper'
import MonthlyChart from '../monthlyChart/index'
import { Row, Col, Alert, Form } from 'react-bootstrap'
import Addcomma from '../../toString'
import LineChart from '../lineChart/index'

export default function insights(){
    const[monthlyIncome, setMonthlyIncome] = useState([])
    const [finalMonthlyIncome, setFinalMonthlyIncome] = useState(0)
    const [finalYearyIncome, setFinalYearlyIncome] = useState(0)
    const  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [selectedDate, setSelectedDate] = useState(moment().month())
    const [trasnsactionData, setTransactionData] =useState([])
    const [months, setMonths] = useState(0)
    const [isActive, setIsActive] = useState(true)
   
    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.transactions.length > 0 ){
               const filter = data.transactions.filter(res => {
                    return res.type == "Expenses"
                })
                let monthlyIncome = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                let Arr =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                let YearlyIncome = 0
                filter.forEach(transaction => {
                    const index = moment(transaction.dateAdded).month()
                    monthlyIncome[index] += (parseInt(transaction.amount))
                    Arr[index] += (parseFloat(transaction.amount))
                })
                monthlyIncome.map(res => {
                    return YearlyIncome += res
                })
                setFinalMonthlyIncome(Arr[selectedDate])
                setMonthlyIncome(monthlyIncome)
                setFinalYearlyIncome(YearlyIncome)
               
            }
        })
    },[selectedDate,finalMonthlyIncome,monthlyIncome,trasnsactionData,finalYearyIncome,months]) 
    const setter = (e) => {
        var a = monthlyIncome[labels.indexOf(e.target.value)]
        // console.log(labels.indexOf(e.target.value))
        let filtering = monthlyIncome.map(res => {
            return res = 0
        })
        for(let i = 0; i <= labels.indexOf(e.target.value); i++ ){
            if(true){
                filtering[labels.indexOf(e.target.value)] = monthlyIncome[labels.indexOf(e.target.value)]
            }
        }
        setTransactionData(filtering)
    }
    
       
   return(
       <React.Fragment>
        <Row className="m-0">
            <Col xs={12} md={8} className="my-3 shadow">
            {isActive ?
                <LineChart figuresArray={monthlyIncome} label={`Yearly Charts`} Month={labels} />
             :<MonthlyChart figuresArray={trasnsactionData} label={`Monthly Charts`} Month={labels} /> }
            </Col>
            <Col xs={12} md={4} className="my-3 p-3">
            {isActive ?
                <Alert variant="info" className="text-center">
                 Total Expenses in one Year:<br /> ₱ {Addcomma(finalYearyIncome)}<br /></Alert> :
                <Alert variant="info" className="text-center">
                <a  className="text-10  text-dark text-right rounded p-2 pointer" onClick={() => {
                    setIsActive(true)
                    setMonths(0)
                }}>View Yearly Charts</a><br />
                 Total Expenses: ₱ {Addcomma(finalMonthlyIncome)}<br />{`Months of ${months}`}</Alert>
             }
                
                <Form.Group controlId="exampleForm.ControlSelect1" className="text-10 border p-4">
                <Form.Label>Select Month:</Form.Label>
                <Form.Control as="select" value={months} onChange={e => {
                     setSelectedDate(labels.indexOf(e.target.value))
                     setMonths(e.target.value)
                     setter(e)
                     setIsActive(false)
                }}>
                {labels.map(res => {
                    return(
                        <option key={res}>{res}</option>
                    )
                })}
                </Form.Control>
            </Form.Group>
            </Col>
        </Row>
        
       </React.Fragment>
       
   )
}

