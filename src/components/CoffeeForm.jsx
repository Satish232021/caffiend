import { coffeeOptions } from "../utils"
import { useState } from "react"
import Modal from "./Modal"
import Authentication from "./Authentication"
import { useAuth } from "../context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"

export default function CoffeeForm(props) {
    const {isAuthenticated} = props
    const [showModal, setShowModal] = useState(false)
    const [selectedCoffee, setSelectedCoffee] = useState('');
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCoffeeCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const {globalData, setGlobalData, globalUser} = useAuth();

    async function handleSubmitForm() {
        if (!isAuthenticated) {
            setShowModal(true)
            return;            
        }

        // define a gaurd clause that only submmit the form if it is completed
        if (!selectedCoffee) {
            return;
        }

        console.log("Submitting with values:", {
            selectedCoffee,
            coffeeCost,
            hour,
            min,
        });

        try {
            // then were going to create a new data object
            const newGlobalData = {
                ...(globalData || {} )
            }

            const nowTime = Date.now()
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)
            const timeStamp = nowTime - timeToSubtract
            const newData = {
                name: selectedCoffee, 
                cost: parseFloat(coffeeCost)
            }
            newGlobalData[timeStamp] = newData
            // console.log(timeStamp, selectedCoffee, coffeeCost)

            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            const userRef = doc(db, 'users', globalUser.uid)
            await setDoc(userRef, {
                [timeStamp]: newData
            }, {merge: true} )

            setSelectedCoffee(null);
            setHour(0);
            setMin(0);
            setCoffeeCost(null);
            // console.log("Values reset to defaults.", {
            //     selectedCoffee,
            //     coffeeCost,
            //     hour,
            //     min,
            // });



        } catch (error) {
            console.log(error.message)
        }

    }

    function handleCloseModal() {
        setShowModal(false)
    }

    return (
        <> 
            {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal}/>
                </Modal>
            )}
            <div className="section-header" >
                <i className="fa-solid fa-pencil" />
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
                    return (
                        <button onClick={() => {
                            setSelectedCoffee(option.name)
                            setShowCoffeeTypes(false)
                            }} className={"button-card " + (option.name === selectedCoffee ? 'coffee-button-selected' : '')} key={optionIndex} >
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    )
                })}
                <button onClick={() => {
                    setShowCoffeeTypes(true);
                    setSelectedCoffee(null);
                }} className={"button-card " + (showCoffeeTypes ? 'coffee-button-selected' : '')} >
                    <h4>Others</h4>
                    <p>n/a</p>
                </button>
            </div>
            {showCoffeeTypes && (
            <select onChange={(event) => {
                setSelectedCoffee(event.target.value);
            }} name="coffee-list" id="coffee-list">
                <option value={null}>Select type</option>
                {coffeeOptions.map((option, optionIndex) => {
                    return (
                        <option value={option.name} key={optionIndex}>
                            {option.name} ({option.caffeine}mg)
                        </option>
                    )
                })}
            </select>
            )}
            <h4>Add the cost(₹)</h4>
            <input value={coffeeCost} className="w-full" type="number" onChange={(event) => {
                    setCoffeeCost(event.target.value)
            }} placeholder="4.50" min={0} />
            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select value={hour} onChange={(event) => {
                                    setHour(event.target.value);
                                }} name="hours-select" id="hours-select">
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((hour, hourIndex) => {
                            return (
                                <option key={hourIndex} value={hour}>{hour}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                        <h6>Mins</h6>
                    <select value={min} onChange={(event) => {
                                    setMin(event.target.value);
                                }} name="mins-select" id="hours-select">
                        {[0,5,10,15,30,45].map((min, minIndex) => {
                            return (
                                <option key={minIndex} value={min}>{min}</option>
                            )
                        })}
                    </select>
                </div>
                <button onClick={ handleSubmitForm } >Add Entry</button>
            </div>
        </>
    )
}