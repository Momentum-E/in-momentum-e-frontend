"use client";
import { useState, useEffect, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationCode: string) => void;
  email: string;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  email,
}) => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isResendActive, setIsResendActive] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds

  useEffect(() => {
    // Activate resend link after 1 minute
    const timerId = setTimeout(() => {
      setIsResendActive(true);
    }, 60000); // 1 minute

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(confirmationCode);
  };

  const handleResend = async () => {
    try {
      const response = await fetch(
        "https://in-momentum-e-backend.onrender.com/auth/resend-confirmation-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
          }),
        }
      );

      if (response.ok) {
        // Resend successful
        setResendTimer(60);
        setIsResendActive(false);
        toast.success("Code resent");
      } else {
        // Resend failed
        console.error("Failed to resend confirmation code");
      }
    } catch (error: any) {
      console.error("Error during resend:", error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-md ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-1/4 mx-auto my-8 p-4 border rounded-md">
        <span
          className="close text-gray-600 float-right text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>
        <h2 className="text-2xl font-bold mb-4">Email Confirmation</h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="confirmationCode"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmation Code:
          </label>
          <input
            type="text"
            id="confirmationCode"
            value={confirmationCode}
            onChange={handleChange}
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
          >
            Confirm
          </button>
        </form>
        <div className="mt-4">
          {isResendActive ? (
            <button
              onClick={handleResend}
              className="text-blue-500 hover:underline focus:outline-none focus:ring"
            >
              Resend Code
            </button>
          ) : (
            <span className="text-gray-500">
              Resend Code in {resendTimer} seconds
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
