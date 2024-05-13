import React, { useState } from 'react';
import './home.css';
import { API } from '../../services/api';

const GetFare = () => {

  const [error, setError] = useState(''); 
  const [formData, setFormData] = useState({
    fingerprint: '',
    busType: '',
    boarding: '',
    destination: '',
    distance: 0,
    price: 0
  });

  const places = ['Nizamuddin Railway Station', 'Police Station Nizamuddin', 'J.L.N. Stadium (Sunhari Pullah Nallah Parking)', 'Lodhi Road X-ing', 'Prithviraj Road', 'Nirman Bhawan', 'Krishi Bhawan', 'AIIMS', 'Indira Gandhi International Airport', 'Regal', 'New Delhi Railway Station Gate 1', 'Police Station Paharganj', 'Police Station Sadar Bazar', 'Ice Factory', 'Malka Ganj', 'R.P. Bagh', 'Bara Bagh', 'Adarsh Nagar', 'Jahangir Puri E-Block']; // Add more places if needed

  const distances = {
    'Nizamuddin Railway Station': 0,
    'Police Station Nizamuddin': 6,
    'J.L.N. Stadium (Sunhari Pullah Nallah Parking)': 12,
    'Lodhi Road X-ing': 18,
    'Prithviraj Road': 23,
    'Nirman Bhawan': 28,
    'Krishi Bhawan': 33,
    'AIIMS': 39,
    'Indira Gandhi International Airport':47,
    'Regal': 53,
    'New Delhi Railway Station Gate 1': 59,
    'Police Station Paharganj': 63,
    'Police Station Sadar Bazar': 66,
    'Ice Factory': 70,
    'Malka Ganj': 72,
    'R.P. Bagh': 75,
    'Bara Bagh': 77,
    'Adarsh Nagar': 79,
    'Jahangir Puri E-Block': 85
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculatePrice = () => {
    const distanceToDestination = distances[formData.destination];
    const distanceToBoarding = distances[formData.boarding];
    const distance = distanceToDestination - distanceToBoarding;

    let pricePerKilometer = 2;
    if(formData.busType==='AC'){
        pricePerKilometer = 4;
    }
    else if(formData.busType==='Special-AC'){
        pricePerKilometer = 5;
    }
    const price = distance * pricePerKilometer;
    if(price<=0){
        setError("Select valid bus stops!")
    } else {
        setError('');
        setFormData({
            ...formData,
            distance: distance,
            price: price
        });
    }
    
  };

  const getFare = async () => {
    if (formData.price <= 0 || formData.fingerprint==='') {
      setError('Please enter all the details.');
      return;
    }

    // console.log(formData);
    let response = await API.submitPassengerDetails(formData);
    if (response.isSuccess) {
      setError('');
    } else {
      setError('Something went wrong! Please try again later');
    }
  };

  return (
    <div>
        <div className='container'>
            <input type="text" onChange={onInputChange} name="fingerprint" placeholder="Fingerprint Data" autoComplete='off' required />
            <select onChange={(event) => { onInputChange(event) }} name='busType' required>
                <option disabled selected >Select Bus Type</option>
                <option value='Non-AC'>Non-AC</option>
                <option value='AC'>AC</option>
                <option value='Special-AC'>Special AC</option>
            </select>
            <select onChange={(event) => { onInputChange(event) }} name="boarding" required>
                <option value="">Select Boarding</option>
                {places.map((place, index) => (
                <option key={place} value={place}>{place}</option>
                ))}
            </select>
            <select onChange={(event) => { onInputChange(event) }} name="destination" required>
                <option value="">Select Destination</option>
                {formData.boarding &&
                places.slice(places.indexOf(formData.boarding) + 1).map((place, index) => (
                    <option key={place} value={place}>{place}</option>
                ))
                }
            </select>
            <p>Trip Distance: {formData.distance} km</p>
            <p>Price: Rs.{formData.price}</p>
            <button className="btn1" type="button" onClick={calculatePrice}>Get Fare</button>
            <button className="btn2" type="submit" onClick={getFare} disabled={!formData.price > 0}>Submit</button>
            {error && <p className='error'>*{error}</p>}
        </div>
    </div>
  );
};

export default GetFare;
