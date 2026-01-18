import { camera } from 'ionicons/icons';
import './Tab2.css';
// CHANGE: Update import
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';

const Tab2: React.FC = () => {
  // CHANGE: Add `photos` array to destructure from `usePhotoGallery()`
  const { photos, addNewToGallery } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery รนร</IonTitle>
          <IonTitle>นางสาวอัญรินทร์ นิธิโพธิพงศ์ </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
             <IonTitle>นางสาวอัญรินทร์ นิธิโพธิพงศ์ 6773380023-2 </IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* CHANGE: Add a grid component to display the photos */}
        <IonGrid>
          <IonRow>
            {/* CHANGE: Create a new column and image component for each photo */}
            {photos.map((photo) => (
              <IonCol size="6" key={photo.filepath}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;