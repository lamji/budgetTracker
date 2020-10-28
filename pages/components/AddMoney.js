import { useState, useEffect } from 'react';
import { Button , Row, Col, Alert, Form} from 'react-bootstrap'

import AppHelper from '../../app-helper'
export default function Login(){
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [userData, setUserData] = useState('')
    const [balance, setBalance] = useState(0)
    const [amountButton, setAmountButton] = useState(false)
    const [amount, setAmount] = useState('')
    const [finalAmount, setFinalAmount] = useState('')
    const [transactionType, setTransactionType] = useState("Income")

     const [show, setShow] = useState(false)

    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setUserData(data)
            setBalance(data.balance)
        })
    },[])

    function addCategory(e){
        e.preventDefault();
        setFinalAmount(parseInt(amount))
        fetch(`${ AppHelper.API_URL }/users/addTransaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ 
                categoryName: categoryName,
                type: transactionType,
                amount: amount,
                description: transactionType,
                balanceAfterTransaction: balance + parseInt(amount)
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data === true){
                fetch(`${ AppHelper.API_URL }/users/updateBalance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    },
                    body: JSON.stringify({ 
                        balanceAfterTransaction: balance + parseInt(amount)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data === true){
                        setBalance(balance + parseInt(amount))
                        setAmount('')
                        setDescription('')
                        setCategoryName('')
                        setAmountButton(false)
                    }
                })
            }
        })
    }

	return(
        <React.Fragment>
            {amountButton === false ? 
                <>{show === true ? <Alert variant="success" onClose={() => setShow(false)} dismissible>
                    <p className="mb-0">Amount Added: ₱ {finalAmount}.00 </p>
                </Alert> : null
                    
                 }</>
             :
            <><Form onSubmit={(e) =>  addCategory(e)} className="mb-3">
                <Row className="m-0 text=center">
                    <Col md={12}>
                        <h6 className="text-center">Add Income</h6>
                        <Row className="m-0">
                            <Col xs={12} md={9} className="px-0">
                            <Form.Group controlId="name" className="addAmountForm">
                                <Form.Control type="text"  className="inputText" placeholder="Category Name" value={categoryName} onChange={e => setCategoryName(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                            <Col xs={12} md={3} className="px-0">
                            <Form.Group controlId="amount" className="addAmountForm">
                                <Form.Control type="number"  className="inputText" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="amount" className="addAmountForm">
                            <Form.Control type="text"  className="inputText" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required/>
                        </Form.Group>
                    <Button variant="outline-primary" className="button text-muted ml-1 " type="submit" id="submitBtn">Add</Button>
                    </Col>
                </Row>
            </Form>
            </>
            }
        </React.Fragment>
	)
}	