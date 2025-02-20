import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonAlert } from '@ionic/react';
import validator from 'validator';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Password:', password);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Validate password (at least 6 characters)
    if (!validator.isLength(password, { min: 6 })) {
      console.log('Password validation failed');
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // If validation passes, proceed with login API call
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email: email,
        password: password,
      });

      console.log('Login successful!', response.data);
      setErrorMessage('');

      // Save the token (e.g., in localStorage or state)
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log('Token saved:', token);

      // Redirect to the Dashboard
      history.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login Form</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin}>
          Login
        </IonButton>

        {/* Error Message Alert */}
        <IonAlert
          isOpen={!!errorMessage}
          onDidDismiss={() => setErrorMessage('')}
          header="Error"
          message={errorMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;