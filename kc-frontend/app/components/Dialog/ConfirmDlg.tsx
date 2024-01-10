import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

type ConfirmDlgProps = {
  title: string,
  message: string,
}

type VoidFunc = () => void;

export default function ConfirmDlg({title, message} : ConfirmDlgProps) {
  //   return (<div className="card w-96 bg-base-100 shadow-xl">
  //   <figure><img src={`/images/${props.colour === Colors.WHITE ? 'white-king.jpeg' : 'black-king.jpeg'}`} alt="Shoes" /></figure>
  //   <div className="card-body">
  //     <h3 className="font-bold text-lg">Join the {props.colour.toUpperCase()} Team!</h3>
  //     {isConnected && <div className="text-xs">Connected: {address}</div>}
  //     <p>{desc}</p>
  //     <div className="modal-action">
  //       {!isConnected && <div className="join gap-1">
  //         <button className="btn join-item w-16" onClick={e => joinTeam(1)}><img src="/images/metamask.png" /></button>
  //         <button className="btn join-item w-16" onClick={e => joinTeam(2)}><img src="/images/walletconnect.png" /></button>
  //         <button className="btn join-item" onClick={e => joinTeam(0)}><FaGoogle /></button>
  //       </div>}
  //       {isConnected && <button className="btn bg-primary" onClick={e => joinTeam(0)}>Join Us!</button>}
  //       {<button className="btn" onClick={dismiss}>Maybe Later</button>}
  //       {/* {props.moves.length > 20 && <button className="btn" onClick={dismiss}>Ok!</button>} */}
  //     </div>
  //   </div>
  // </div>)

  const options = {
    title: title,
    message: message,
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypress: () => { },
    onKeypressEscape: () => { },
    overlayClassName: "overlay-custom-class-name",
    buttons: [] as Array<any>
  };

  return {
    show: (onYes: VoidFunc, onNo?: VoidFunc) => {
      options.buttons = [
        {
          label: 'Yes',
          onClick: onYes
        },
        {
          label: 'No',
          onClick: onNo
        }
      ]
      confirmAlert(options)
    }
  }
}