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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const ChangePassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleChangePassword = async () => {
    const payload = {
      email,
      oldPassword,
      newPassword,
    };

    try {
      const response = await axios.post('http://localhost:5000/change-password', payload);
      setAlertHeader('Success');
      setAlertMessage(response.data.message);
      setShowAlert(true);
      history.push('/login'); // Redirect to login page
    } catch (error) {
      if (error instanceof AxiosError) {
        setAlertMessage(error.response?.data?.message || 'Failed to change password');
      } else {
        setAlertMessage('Failed to change password');
      }
      setAlertHeader('Error');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Change Password</IonTitle>
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
          <IonLabel position="floating">Old Password</IonLabel>
          <IonInput
            type="password"
            value={oldPassword}
            onIonChange={(e) => setOldPassword(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">New Password</IonLabel>
          <IonInput
            type="password"
            value={newPassword}
            onIonChange={(e) => setNewPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="full" onClick={handleChangePassword}>
          Change Password
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertHeader}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;