import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/my-tickets',
        },
      });

      if (error) {
        toast({
          title: t("Payment Failed"),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("Payment Successful"),
          description: t("Thank you for your purchase!"),
        });
        // Redirect to tickets page will happen via return_url
      }
    } catch (err) {
      toast({
        title: t("Error"),
        description: t("An unexpected error occurred"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="rounded-md border p-4 shadow-sm">
        <PaymentElement />
      </div>
      
      <Button 
        disabled={!stripe || isProcessing} 
        className="w-full"
        type="submit"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            {t("Processing")}
          </>
        ) : (
          t("Complete Payment")
        )}
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get booking details from local storage
    const bookingData = localStorage.getItem('currentBooking');
    
    if (!bookingData) {
      setError(t("No booking information found"));
      setIsLoading(false);
      return;
    }
    
    const booking = JSON.parse(bookingData);

    // Create PaymentIntent as soon as the page loads
    setIsLoading(true);
    apiRequest("POST", "/api/create-payment-intent", booking)
      .then((res) => {
        if (!res.ok) {
          throw new Error(t("Failed to initialize payment"));
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [t]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">{t("Payment Error")}</h1>
        <p className="text-muted-foreground text-center mb-6">{error}</p>
        <Button onClick={() => setLocation('/events')}>{t("Browse Events")}</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("Initializing payment...")}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">{t("Complete Your Payment")}</h1>
      
      {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
      <Elements stripe={stripePromise} options={{ clientSecret, locale: 'ar' }}>
        <CheckoutForm />
      </Elements>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {t("Your payment is processed securely by Stripe")}
        </p>
        <div className="flex justify-center space-x-4">
          <div className="px-3 py-1 bg-card rounded border text-xs">
            <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
            {t("Secure Payment")}
          </div>
          <div className="px-3 py-1 bg-card rounded border text-xs">
            <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
            {t("Instant Confirmation")}
          </div>
        </div>
      </div>
    </div>
  );
};