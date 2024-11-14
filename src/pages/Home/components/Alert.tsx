import { useEffect } from "react";
import { useAlert } from "../../../context/AlertProp";

function AlertCard() {
  const { alertMessage, setAlert } = useAlert();

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  }, [alertMessage]);

  return (
    <div className="flex justify-center items-center mt-1 mb-3 w-64 h-8">
      {alertMessage && (
        <span className="text-white text-1xl font-sans font-semibold tracking-widest bg-slate-500 pt-1 pb-1 text-center w-full ">
          {alertMessage}
        </span>
      )}
    </div>
  );
}

export default AlertCard;
