import { useState, useEffect } from 'react';
import { Card, Button , Row, Col, Nav, Image,  Container, Tabs, Tab, Alert, Form} from 'react-bootstrap'
import NavBar from '../navBar/index'
import History from '../history/index'
import ToString from '../../toString'
import Swal from 'sweetalert2'
import Chart from '../monthlyIncome/index'
import ExpensesChart from '../monthlyExpenses/index'

import AppHelper from '../../app-helper'
export default function Login(){
    const [transaction, setTransaction] = useState([])
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [userData, setUserData] = useState('')
    const [balance, setBalance] = useState(balance)
    const [amountButton, setAmountButton] = useState(false)
    const [expensesButton, setExpensesButton] = useState(false)
    const [amount, setAmount] = useState('')
    const [finalAmount, setFinalAmount] = useState('')
    const [transactionType, setTransactionType] = useState("Income")
    const [isActive, setIsActive] = useState(false)
    const [isActive2, setIsActive2] = useState(false)
    const [sort, setSort] =useState(0)
    const [categoryTriger, setCategoryTriger] = useState(true)
    const [value, setValue] = useState(0)
    const [categories, setCategories] = useState([])

    const openAmount = () => {
        setAmountButton(true)
        setExpensesButton(false)
        setIsActive(true)
        setIsActive2(false)
    } 
    const openExpeses = () => {
        setAmountButton(false)
        setExpensesButton(true)
        setIsActive(false)
        setIsActive2(true)
    } 
    const closeButton = () => {
        setAmountButton(false)
        setExpensesButton(false)
        setIsActive(false)
       
       
    } 
    const closeButton2 = () => {
        setIsActive2(false)
        setExpensesButton(false)
    } 
     const [show, setShow] = useState(false)
     const [expenseShow, setExpenseShow] = useState(false)

    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setValue(data._id)
            const result = data.transactions.map(res => {
                return res
            })
            setTransaction(result)
            const sortData = data.transactions.map(res =>{
                return res.Sort
            })
            setSort(sortData.length -1)
            setUserData(data.transactions)
            setBalance(data.balance)
            const categoryRes = result.map(res=> {
                return res.categoryName
            })                                                                        
            var unique = Array.from(new Set(categoryRes))                                                                   
            console.log(unique)
            setCategories(unique)
        })
       
    },[balance])


    const sorting = () =>{
        const sortAdded = userData.map(sorted => {
            const res = sorted.Sort + sorted.Sort
            return res
        })
        setSort(sortAdded)
    }
    function addCategory(e){
        sorting()
        e.preventDefault();
        setFinalAmount(parseFloat(amount))
        setCategoryName('')
        setCategoryTriger(true) 
        fetch(`${ AppHelper.API_URL }/users/updateBalance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ 
                balanceAfterTransaction: balance + parseFloat(amount),
                userId: value
            })
        })
        .then(res => res.json())
        .then(data => {
           
        })

        fetch(`${ AppHelper.API_URL }/users/addTransaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ 
                categoryName: categoryName,
                type: "Income",
                amount: amount,
                description: description,
                balanceAfterTransaction: balance + parseFloat(amount)
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data === true){
                    if(data === true){
                        setBalance(balance + parseFloat(amount))
                        setAmount('')
                        setDescription('')
                        setCategoryName('')
                        setAmountButton(false)
                        setExpenseShow(false)
                        setShow(true)
                        setIsActive(false)
                        Swal.fire({
                            text: `₱ ${ToString(amount)} Successfuly Added to Income!`,
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          })
                    }
            }
        })
    }

 // add Expenses Function
 function addExpenses(e){
    e.preventDefault();
    setFinalAmount(parseFloat(amount))

    fetch(`${ AppHelper.API_URL }/users/updateExpences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
            balanceAfterTransaction: balance - parseFloat(amount),
            userId: value
        })
    })
    .then(res => res.json())
    .then(data => {
       
    })

    fetch(`${ AppHelper.API_URL }/users/addTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
            categoryName: categoryName,
            type: "Expenses",
            amount: amount,
            description: description,
            balanceAfterTransaction: balance - parseFloat(amount)
        })
        
    })
    .then(res => res.json())
    .then(data => {
        if(data === true){
           
                if(data === true){
                    setBalance(balance + parseFloat(amount))
                    setAmount('')
                    setDescription('')
                    setCategoryName('')
                    setIsActive2(false)
        setExpensesButton(false)
                    setAmountButton(false)
                    setExpenseShow(true)
                    setShow(true)
                  
                    Swal.fire({
                        text: `₱ ${ToString(amount)} Successfuly Added to Expenses!`,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      })
                }
        }
    })
}

if(categoryName === "Add Category"){
    setCategoryTriger(false)
    setCategoryName('')
}
	return(
        <React.Fragment>
        <NavBar />
        <Container className="shadow mt-4 pb-4">
        <Card className="p-5" id="chart">
        <div className="text-center">
        {balance < 0 ? 
        <h3 className="balance text-danger">Balance ₱ {ToString(balance)}</h3>  
        :
        <h3 className="balance">Balance ₱ {ToString(balance)}</h3> 
        }
        <Card className="addButton">
            <Nav className="justify-content-center" activeKey="/home">
                <Nav.Item>
                {!isActive ?
                    <Nav.Link  onClick={openAmount} className="text-10 text-white">
                    <Image src="/add.png" className="buttonimg" />Income</Nav.Link>
                 : <Nav.Link  onClick={closeButton} className="text-10 text-white">
                    <Image src="/close.png" className="buttonimg" />Income</Nav.Link>
                }  
                </Nav.Item>

                <Nav.Item>
                {!isActive2 ? 
                    <Nav.Link onClick={openExpeses} className="text-10 text-white">
                    <Image src="/add.png" className="buttonimg"/> Expences</Nav.Link>
                :   <Nav.Link onClick={closeButton2} className="text-10 text-white">
                    <Image src="/close.png" className="buttonimg"/> Expences</Nav.Link>
                }
                </Nav.Item>
            </Nav>
            </Card>
        </div>
        </Card>
            {amountButton === false ? 
                null:
              /* adding category */
            <><Form onSubmit={(e) =>  addCategory(e)} className="mb-3">
            <Row className=" text=center border py-2 formHolder">
                    <Col md={12}>
                        <Row className="m-0 mb-1 px-0">
                            {categoryTriger === true ? 
                            <>
                            <Form.Control as="select" value={categoryName} onChange={e => setCategoryName(e.target.value)}>
                            <option>-- Select Category --</option>
                                {categories.map(res => {
                                    return(
                                        <option key={res._id}>{res}</option>
                                    )
                                })}
                                <option>Add Category</option>
                                </Form.Control>
                            </>
                            :
                            <><Col md={12} className="px-0 h-50">
                            <Form.Group controlId="name" className="addAmountForm">
                            <p className="text-10 mb-1 px-2 pointer" onClick={() => {
                                  setCategoryName('')
                                  setCategoryTriger(true) 
                            }}>Hide</p>
                            <Form.Control type="text"  className="inputText py-0" placeholder="New Category" value={categoryName} onChange={e => setCategoryName(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                            </>
                          }
                        </Row>
                        <Row className="m-0">
                            <Col md={8} xs={12} className="px-0 form-control-holder">
                            <Form.Group controlId="amount" className="addAmountForm1">
                                <Form.Control type="text"  className="inputText" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                            <Col md={4} xs={12} className="px-0">
                            <Form.Group md={6} controlId="amount" className="addAmountForm1">
                                <Form.Control type="number"  className="inputText" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Button variant="outline-primary" className="button text-muted ml-1 w-100  mx-3" type="submit" id="submitBtn2">Add Income</Button>
                </Row>
            </Form>
            </>
            }

            {/* add Expenses */}
            {expensesButton === false ? 
               null
             :
            <><Form onSubmit={(e) =>  addExpenses(e)} className="mb-3 ">
                <Row className=" text=center border py-2 formHolder">
                    <Col md={12}>
                        <Row className="m-0 mb-1 px-0">
                            {categoryTriger === true ? 
                            <>
                            <Form.Control as="select" value={categoryName} onChange={e => setCategoryName(e.target.value)}>
                                <option>-- Select Category --</option>
                                {categories.map(res => {
                                    return(
                                        <option key={res._id}>{res}</option>
                                    )
                                })}
                                <option>Add Category</option>
                                </Form.Control>
                            </>
                            :
                            <><Col md={12} className="px-0 h-50">
                            <Form.Group controlId="name" className="addAmountForm">
                            <p className="text-10 mb-1 px-2 pointer" onClick={() => {
                                  setCategoryName('')
                                  setCategoryTriger(true) 
                            }}>Hide</p>
                            <Form.Control type="text"  className="inputText py-0" placeholder="New Category" value={categoryName} onChange={e => setCategoryName(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                            </>
                          }
                        </Row>
                        <Row className="m-0">
                            <Col md={8} xs={12} className="px-0 form-control-holder">
                            <Form.Group controlId="amount" className="addAmountForm1">
                                <Form.Control type="text"  className="inputText" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                            <Col md={4} xs={12} className="px-0">
                            <Form.Group md={6} controlId="amount" className="addAmountForm1">
                                <Form.Control type="number"  className="inputText" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Button variant="outline-primary" className="button text-muted ml-1 w-100 mx-3 px-1 " type="submit" id="submitBtn2">Add Expeses</Button>
                </Row>
            </Form>
            </>
            }
            {/* tabpanes */}
            <Tabs defaultActiveKey="home" className="justify-content-center mt-5"  transition={false} id="noanim-tab-example">
            <Tab eventKey="home" title="History" className="text-muted text-12 bg-light">
                <History />
            </Tab>
            <Tab eventKey="profile" title="Monthly Income"  className="bg-light">
               <Chart />
            </Tab>
            <Tab eventKey="contact" title="Monthly Expense" className="bg-light">
            <ExpensesChart />
            </Tab>
            </Tabs>
        
        </Container>
        </React.Fragment>
	)
}