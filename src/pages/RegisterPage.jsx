import { useFormik } from "formik";
import { ArrowRight, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import * as Yup from "yup";
import { Input, InputPassword } from "../components/Input";
import Steps from "../components/Steps";
import { useAuth } from "../contexts/AuthContext";
import { faker } from "@faker-js/faker";

const FORM_STORAGE_KEY = "register_form_progress";

const getInitialValues = () => {
  const saved = localStorage.getItem(FORM_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultValues;
    }
  }
  return defaultValues;
};

const defaultValues = {
  name: "",
  phoneNumber: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "",
  agreeToPolicies: false,
};

const RegisterPage = () => {
  const { register, loading, error } = useAuth();
  const [step, setStep] = useState(0);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      ...(step === 0 && {
        name: Yup.string()
          .required("Full Name is required.")
          .max(255, "Maximum 255 letters."),
        phoneNumber: Yup.string()
          .required("Phone Number is required.")
          .matches(/^\d+$/, "Phone Number must contain only digits.")
          .max(15, "Phone Number must be at most 15 digits."),
        address: Yup.string()
          .required("Address is required.")
          .max(255, "Maximum 255 letters."),
      }),
      ...(step === 1 && {
        email: Yup.string()
          .email("Email is invalid.")
          .required("Email is required."),
        password: Yup.string()
          .required("Password is required.")
          .min(6, "Password must be at least 6 characters.")
          .matches(/[A-Z]/, "Must contain at least one uppercase letter.")
          .matches(/[a-z]/, "Must contain at least one lowercase letter.")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Must contain at least one special character."
          ),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords do not match.")
          .required("Confirm Password is required."),
      }),
      ...(step === 2 && {
        accountType: Yup.string().required("Account type is required."),
      }),
      ...(step === 3 && {
        agreeToPolicies: Yup.boolean().oneOf(
          [true],
          "You must agree to continue."
        ),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          address: values.address,
          accountType: values.accountType,
          isAdmin: false,
          imageProfile: `https://avatars.githubusercontent.com/u/${Math.floor(
            Math.random() * 1000000
          )}`,
          createdAt: new Date().toISOString(),
        });
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });

  const handleNextStep = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      setStep((prev) => prev + 1);
    } else {
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formik.values));
  }, [formik.values]);

  const accountTypeOptions = useMemo(() => {
    return Array.from(
      new Set(Array.from({ length: 50 }, () => faker.finance.accountName()))
    );
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-0">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-2xl">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Join BankTech Pro today</p>
      </div>

      <Steps current={step} length={4} />

      <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
        {step === 0 && (
          <>
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <Input
              label="Address"
              name="address"
              placeholder="Enter your address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && formik.errors.address}
            />
          </>
        )}

        {step === 1 && (
          <>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
            <InputPassword
              label="Password"
              name="password"
              placeholder="Enter a strong password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />
            <InputPassword
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-type your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              name="accountType"
              value={formik.values.accountType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="" disabled>
                Select account type
              </option>
              {accountTypeOptions.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {formik.touched.accountType && formik.errors.accountType && (
              <p className="text-red-500 text-sm mt-[-24px]">
                {formik.errors.accountType}
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Review Your Information
              </h2>
              <div className="mt-4 text-left space-y-2">
                <p>
                  <strong>Name:</strong> {formik.values.name}
                </p>
                <p>
                  <strong>Phone:</strong> {formik.values.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {formik.values.address}
                </p>
                <p>
                  <strong>Email:</strong> {formik.values.email}
                </p>
                <p>
                  <strong>Account Type:</strong> {formik.values.accountType}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeToPolicies"
                  checked={formik.values.agreeToPolicies}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree with the{" "}
                  <a href="#" className="text-blue-600 underline">
                    rules & policies
                  </a>
                  .
                </span>
              </label>
              {formik.touched.agreeToPolicies &&
                formik.errors.agreeToPolicies && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.agreeToPolicies}
                  </p>
                )}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-300 px-4 py-2 rounded-lg text-gray-800 hover:bg-stone-300 transition-all cursor-pointer"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer h-10 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login">
            <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Sign in
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
