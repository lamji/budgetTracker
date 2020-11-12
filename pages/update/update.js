import { useState, useEffect } from 'react';
import { Card, Button , Row, Col, Nav, Image,  Container, Tabs, Tab, Alert, Form} from 'react-bootstrap'
import NavBar from '../navBar/index'
import ToString from '../../toString'

import AppHelper from '../../app-helper'
export default function Login(){
    const [balanceAfterTransaction, setBalanceAfterTransaction] = useState('')
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [userData, setUserData] = useState('')
    const [balance, setBalance] = useState(0)
    const [balanceButton, setBalanceButton] = useState(false)
    const [amount, setAmount] = useState('')
    const [finalAmount, setFinalAmount] = useState('')
    const [transactionType, setTransactionType] = useState("Income")

    const handleShow = () => setBalanceButton(true);
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
        fetch(`${ AppHelper.API_URL }/users/addBalance`, {
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
            
        })
    }
    console.log(balance + finalAmount)
	return(
        <React.Fragment>
        <NavBar />
        <Container className="shadow mt-4 pb-4">
        <Card className="p-5">
        <div className="text-center">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
        <p>Fatching Graph...</p>
        </div>
        </Card>
            <h6 className="balance">Balance ₱{ToString(balance)}.00</h6>
            <Card className="addButton">
            <Nav className="justify-content-center" activeKey="/home">
                <Nav.Item>
                <Nav.Link  onClick={handleShow} className="text-10 text-white">
                <Image
                src="/add.png"
                className="buttonimg"
                 />
                Income</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link href="#" className="text-10 text-white">
                <Image
                src="/add.png"
                className="buttonimg"
                 />
                Expences</Nav.Link>
                </Nav.Item>
            </Nav>
            </Card>
            {balanceButton === false ? 
                <>{!show ? null :
                    <Alert variant="success" onClose={() => setShow(false)} dismissible>
                    <p className="mb-0">Amount Added: ₱ {amount}.00 </p>
                </Alert>
                 }</>
             :
              /* adding category */
            <><Form onSubmit={(e) =>  addCategory(e)} className="mb-3">
                <Row className="m-0 text=center">
                    <Col md={12}>
                        <h6 className="text-center">Add Income</h6>
                        <Row className="m-0">
                            <Col xs={12} md={9} className="px-0">
                            
                            </Col>
                            <Col xs={12} md={3} className="px-0">
                            <Form.Group controlId="amount" className="addAmountForm">
                                <Form.Control type="number"  className="inputText" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required/>
                            </Form.Group>
                            </Col>
                        </Row>
        
                    <Button variant="outline-primary" className="button text-muted ml-1 " type="submit" id="submitBtn">Add</Button>
                    </Col>
                </Row>
            </Form>
            </>
            }



            {/* tabpanes */}
            <Tabs defaultActiveKey="home" className="justify-content-center"  transition={false} id="noanim-tab-example">
            <Tab eventKey="home" title="History" className="text-muted text-12">
                {userData.categories <= 0 ? 
                <Alert variant="success" className="text-center">No Records Yet!</Alert>
                : 
                <Alert variant="info" className="text-center">data Goes Here!</Alert>
                }
            </Tab>
            <Tab eventKey="profile" title="Monthly Income">
                <h1>Monthly Income</h1>
            </Tab>
            <Tab eventKey="contact" title="Monthly Expense">
            <h1>Monthly Expense</h1>
            </Tab>
            </Tabs>
        
        </Container>
        </React.Fragment>
	)
}	