import { create } from "zustand";

export const useTransferWizardStore = create((set) => ({
  step: 0,
  setStep: (step) => set({ step }),

  isSuccess: false,
  setIsSuccess: (isSuccess) => set({ isSuccess }),

  isValidatingAccount: false,
  setIsValidatingAccount: (status) => set({ isValidatingAccount: status }),

  sourceAccount: null,
  setSourceAccount: (account) => set({ sourceAccount: account }),

  receiverAccount: null,
  setReceiverAccount: (account) => set({ receiverAccount: account }),

  resetWizard: () =>
    set({
      step: 0,
      isSuccess: false,
      isValidatingAccount: false,
      sourceAccount: null,
      receiverAccount: null,
    }),
}));
