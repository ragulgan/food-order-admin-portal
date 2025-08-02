import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from '../../firebase/firebaseConfig';

const Notification = () => {
  const [notification, setNotification] = React.useState<any>({title: '', body: ''});
  const notify = () =>  toast(<ToastDisplay/>);
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    if (notification?.title ){
     notify()
    }
  }, [notification])

  requestForToken();

  onMessageListener()
    .then((payload: any) => {
    //   setNotification({title: payload?.notification?.title, body: payload?.notification?.body});  
    console.log('payload====>', payload)
    })
    .catch((err) => console.log('failed: ', err));

  return (
     <Toaster/>
  )
}

export default Notification
