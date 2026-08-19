import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Wallet, CheckCircle, Loader2 } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2rem] shadow-xl text-center space-y-6 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Subscription Active!</h1>
        <p className="text-slate-500 font-medium">Thank you for subscribing to Managly. Your account has been set up successfully.</p>
        <button
          onClick={() => navigate('/Portal')}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 py-12">
      <button
        onClick={() => navigate('/Portal')}
        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Pricing
      </button>

      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Complete your setup</h1>
        <p className="text-slate-500 text-lg">Choose a payment method to activate your subscription.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
          
          <label className={`cursor-pointer flex items-center p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
            <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="hidden" />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selectedMethod === 'card' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Credit / Debit Card</h3>
              <p className="text-sm text-slate-500">Visa, Mastercard, Amex</p>
            </div>
            {selectedMethod === 'card' && <CheckCircle className="text-indigo-600" size={24} />}
          </label>

          <label className={`cursor-pointer flex items-center p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'bank' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
            <input type="radio" name="payment" value="bank" checked={selectedMethod === 'bank'} onChange={() => setSelectedMethod('bank')} className="hidden" />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selectedMethod === 'bank' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Building2 size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Bank Transfer</h3>
              <p className="text-sm text-slate-500">Direct wire transfer</p>
            </div>
            {selectedMethod === 'bank' && <CheckCircle className="text-indigo-600" size={24} />}
          </label>

          <label className={`cursor-pointer flex items-center p-5 rounded-2xl border-2 transition-all ${selectedMethod === 'wallet' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
            <input type="radio" name="payment" value="wallet" checked={selectedMethod === 'wallet'} onChange={() => setSelectedMethod('wallet')} className="hidden" />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selectedMethod === 'wallet' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Wallet size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Digital Wallet</h3>
              <p className="text-sm text-slate-500">Apple Pay, Google Pay</p>
            </div>
            {selectedMethod === 'wallet' && <CheckCircle className="text-indigo-600" size={24} />}
          </label>
        </div>

        {/* Order Summary & Pay Button */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-slate-600">
              <span>Selected Plan</span>
              <span className="font-bold text-slate-900">Premium Subscription</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Billing Cycle</span>
              <span className="font-bold text-slate-900">Monthly</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between text-lg">
              <span className="font-black text-slate-900">Total Due</span>
              <span className="font-black text-indigo-600">Secure Checkout</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-black text-white shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2
              ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              "Confirm & Subscribe"
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Secured by AES-256 Encryption. No actual charges will be made.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
