import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const FORM_STORAGE_KEY = "transfer_form_progress";

const defaultValues = {
  recipient: "",
  amount: "",
  category: "",
  description: "",
  type: "internal",
};

const getInitialValues = () => {
  const saved = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || "null");
  return saved || defaultValues;
};

const Transfer = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);
  const [debouncedRecipient, setDebouncedRecipient] = useState("");
  const debounceTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      ...(step === 0 && {
        type: Yup.string().required("Transfer type is required."),
        recipient: Yup.string()
          .required("Recipient account is required.")
          .test(
            "recipient-format",
            "Invalid recipient format",
            function (value) {
              if (!value) return false;
              const trimmed = value.trim();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const accountRegex = /^\d{8,16}$/;
              return emailRegex.test(trimmed) || accountRegex.test(trimmed);
            }
          )
          .test(
            "account-exists",
            "Account not found in our database",
            async function (value) {
              if (!value || value !== debouncedRecipient) return true;

              const trimmed = value.trim().toLowerCase();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const accountRegex = /^\d{8,16}$/;

              if (!emailRegex.test(trimmed) && !accountRegex.test(trimmed))
                return false;

              try {
                const response = await axios.get(
                  "https://6871fab176a5723aacd33ea6.mockapi.io/api/v1/accounts"
                );
                const accounts = response.data;

                const accountExists = accounts.some((account) => {
                  return (
                    account?.email?.toLowerCase() === trimmed ||
                    account?.accountNumber === trimmed ||
                    account?.phoneNumber === trimmed ||
                    account?.id === trimmed ||
                    account?.name?.toLowerCase() === trimmed ||
                    account?.phone === trimmed
                  );
                });

                return accountExists;
              } catch (error) {
                console.error("Error verifying account:", error);
                return this.createError({
                  message: "Unable to verify account. Please try again later.",
                });
              }
            }
          ),
      }),
      ...(step === 1 && {
        amount: Yup.number()
          .required("Amount is required.")
          .positive("Amount must be positive.")
          .min(0.01, "Minimum amount is $0.01")
          .max(50000, "Maximum amount is $50,000")
          .test(
            "decimal-places",
            "Amount can have at most 2 decimal places",
            function (value) {
              if (!value) return true;
              return Number(value.toFixed(2)) === value;
            }
          ),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsProcessing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setIsSuccess(true);
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        setIsProcessing(false);
        console.error("Transfer failed:", error);
      }
    },
  });

  // Debounce effect
  useEffect(() => {
    if (step === 0) {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedRecipient(formik.values.recipient);
      }, 500);
    }
  }, [formik.values.recipient, step]);

  const handleNextStep = async () => {
    if (step === 0) setIsValidatingAccount(true);
    const errors = await formik.validateForm();
    const stepErrors = Object.keys(errors).filter((key) =>
      step === 0
        ? ["type", "recipient"].includes(key)
        : ["amount"].includes(key)
    );
    setIsValidatingAccount(false);

    if (stepErrors.length === 0) {
      setStep((prev) => prev + 1);
    } else {
      formik.setTouched(
        stepErrors.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const resetTransfer = () => {
    setStep(0);
    setIsSuccess(false);
    formik.resetForm();
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  const redirectListTransaction = () => navigate("/transaction");

  useEffect(() => {
    if (!isSuccess) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formik.values));
    }
  }, [formik.values, isSuccess]);

  const categoryOptions = [
    { value: "", label: "Select a category" },
    { value: "food", label: "FOOD & BEVERAGE" },
    { value: "shopping", label: "SHOPPING" },
    { value: "bills", label: "BILLS" },
    { value: "entertainment", label: "ENTERTAINMENT" },
    { value: "others", label: "OTHERS" },
  ];

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center space-y-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Transfer Successful!
            </h2>
            {/* <p className="text-gray-600">
              Your transfer of $
              {parseFloat(formik.values.amount).toLocaleString()} has been sent
              successfully.
            </p> */}

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetTransfer}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Another Transfer
              </button>

              <button
                onClick={redirectListTransaction}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                See Transaction List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600 mt-2">Send money quickly and securely</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[0, 1, 2].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNum + 1}
              </div>
              {stepNum < 2 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > stepNum ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Step 0: Recipient Details */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recipient Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Type
                  </label>
                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="internal">Internal Transfer</option>
                    <option value="external">External Transfer</option>
                  </select>
                  {formik.touched.type && formik.errors.type && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Account
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formik.values.recipient}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter account number or email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formik.touched.recipient && formik.errors.recipient
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.recipient && formik.errors.recipient && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.recipient}
                    </p>
                  )}
                  {isValidatingAccount && (
                    <p className="text-blue-500 text-sm mt-1 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      Checking account...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Transfer Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Transfer Amount
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formik.touched.amount && formik.errors.amount
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.amount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Optional)
                  </label>
                  <select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review Transfer */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Review Transfer
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">
                    {user?.name || "Your Account"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{formik.values.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ${parseFloat(formik.values.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">
                    {formik.values.type}
                  </span>
                </div>
                {formik.values.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">
                      {categoryOptions.find(
                        (opt) => opt.value === formik.values.category
                      )?.label || formik.values.category}
                    </span>
                  </div>
                )}
                {formik.values.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">
                      {formik.values.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isValidatingAccount}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isValidatingAccount ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validating...
                  </>
                ) : step === 0 ? (
                  "Next"
                ) : (
                  "Review"
                )}
              </button>
            ) : (
              <button
                type="button" // NOT submit to prevent auto-submit
                onClick={() => formik.handleSubmit()} // Manually trigger
                disabled={isProcessing}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Send Money
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
