import { useState, useEffect } from 'react';
import { Card, Button , Row, Col, Nav, Image,  Container, Tabs, Tab, Alert, Form, Table} from 'react-bootstrap'
import AppHelper from '../../app-helper'


export default function index(){
    const [isActive, setIsActive] = useState(false)
    const [toDo, setTodo] = useState([])
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState("")
    const [priceTotal, setPriceTotal] =useState(0)
    const [item, setItem] = useState("")
    const [tempAmount, setTempAmount] =useState(0)
    const [tempExpenses, setTemExpenses] = useState(0)
    const [arrItem, setArrItem] = useState([])
    const [arrPrice, setArrPrice] = useState([])
    const [arrQuantity, setArrQuantity] = useState([])
    const arr = []

    useEffect(() =>{
        fetch(`${ AppHelper.API_URL }/users/details`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setTodo(data.toDo)
        })
    },[])

  console.log(arr)

    function addCategory(e){
        e.preventDefault();
        // calculation
        setPriceTotal(price * quantity)
        setTemExpenses(priceTotal)
        set
        fetch(`${ AppHelper.API_URL }/users/addTodo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ 
                items: categoryName,
                quantity: transactionType,
                price: price,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }
    return(
        <React.Fragment>
        <Card className="bg-secondary sideNav text-white p-2">
            <p className="text-white text-right" onClick={() => setIsActive(false)}>X</p>
            <hr />
            <h4>Grocery Budgeting</h4>
            <Card>
                <h5 className="text-dark p-3 text-center">10,000</h5>
            </Card>
            <p className="text-10 text-left mb-0 " onClick={() => hide(true)}>Add</p>
            <Form className="border m-2 rounded p-2">
            <p className="text-10 text-right mb-0 " onClick={() => onhide(false)}>Hide</p>
            <h5 className="text-dark p-0 text-center" onClick={addCategory}><Image src="/add.png" className="Grocerybuttonimg"/></h5>
            <Form.Row className="text-10" onSubmit={(e) =>  addCategory(e)} >
                <Col>
                <Form.Control type="number" className="p-1 inputText" value={price} placeholder="Price" onChange={e => setPrice(e.target.value) } />
                </Col>
                <Col>
                <Form.Control type="number" className="p-1 inputText" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </Col>
                <Col md={12}>
                <Form.Control type="text" className="p-1 inputText mt-1" placeholder="Item" value={item} onChange={e => setItem(e.target.value)} />
                </Col>
            </Form.Row>
            </Form>


            {/* table */}
            <Table striped bordered hover className="w-100 scroll" >
            <thead>
                <tr className="t-head">
                    <th className="p-1 text-white">Date</th>
                    <th className="p-1 text-white">Items</th>
                    <th className="p-1 text-white">Quantity</th>
                    <th className="p-1 text-white"> Total Price</th>
                </tr>
            </thead>
            <tbody className="t-body text-14">
            {/* {toDo.map(res=> {
                return(
                    <tr key={res._id}>
                    <td className="p-1 text-white">{res.date}</td>
                    <td className="p-1 text-white">{res.item}</td>
                    <td className="p-1 text-white">{res.quantity}</td>
                    <td className="p-1 text-white">{res.price}</td>
                </tr>
                )
            })} */}
            </tbody>
            </Table>
        </Card>
        </React.Fragment>
    )
}