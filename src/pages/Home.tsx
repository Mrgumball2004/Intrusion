import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonAlert,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import validator from 'validator';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const history = useHistory();

  const handleAuth = async () => {
    // Validate email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
  
    // Determine if it's a login or sign-up request
    const endpoint = isLogin ? 'login' : 'signup';
    const url = `http://localhost:5000/${endpoint}`;
  
    try {
      const response = await axios.post(url, {
        email: email,
        password: password,
      });
  
      console.log(`${isLogin ? 'Login' : 'Sign-up'} successful!`, response.data);
  
      // Display success message
      setErrorMessage(`${isLogin ? 'Login' : 'Sign-up'} successful!`);
  
      // Save user data to localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data saved:', response.data.user);
      }
  
      // Wait for 2 seconds before redirecting to the Dashboard
      setTimeout(() => {
        history.push('/dashboard');
      }, 2000); // 2-second delay
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Sign-up'} failed:`, error);
      setErrorMessage(
        isLogin
          ? 'Invalid email or password. Please try again.'
          : 'Sign-up failed. Please try again.'
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isLogin ? 'Login' : 'Sign Up'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Toggle between Login and Sign Up */}
        <IonSegment
          value={isLogin ? 'login' : 'signup'}
          onIonChange={(e) => setIsLogin(e.detail.value === 'login')}
        >
          <IonSegmentButton value="login">
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="signup">
            <IonLabel>Sign Up</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Email Input */}
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        {/* Password Input */}
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        {/* Login/Sign Up Button */}
        <IonButton expand="full" onClick={handleAuth}>
          {isLogin ? 'Login' : 'Sign Up'}
        </IonButton>

        {/* Error Message Alert */}
        <IonAlert
  isOpen={!!errorMessage}
  onDidDismiss={() => setErrorMessage('')}
  header={errorMessage.includes('success') ? 'Success' : 'Error'}
  message={errorMessage}
  buttons={['OK']}
/>
      </IonContent>
    </IonPage>
  );
};

export default Home;