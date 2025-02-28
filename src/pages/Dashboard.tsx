import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import image from './pics_profile/Sonic Evil Sonic GIF - Sonic Evil sonic Evil sonic licking lips - Descobrir e Compartilhar GIFs.gif'; // Import the image

const Dashboard: React.FC = () => {
  // Safely retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    history.push('/home'); // Redirect to the login page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Welcome, {user.email}!</h1>
        <p>You are now logged in.</p>

        <IonCard>
          <img alt="Silhouette of mountains" src={image} />
          <IonCardHeader>
            <IonCardTitle>Arj</IonCardTitle>
            <IonCardSubtitle>Unta maka pasar</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>"Malooy gali ang ginoo si sir pa kaha"</IonCardContent>
        </IonCard>

        <IonButton expand="full" onClick={handleLogout}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;