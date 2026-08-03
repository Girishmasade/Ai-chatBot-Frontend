import React, { useState } from "react";
import { CreditCard, Check, Zap, Sparkles, Award, HelpCircle, RefreshCw } from "lucide-react";
import CommonModal from "../components/CommonModal";
import {
  useGetSubscriptionPlansQuery,
  useCreateUserSubscriptionMutation,
} from "../redux/api/subscriptionApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useGetActiveTokenPackagesQuery } from "../redux/api/tokenApi";

interface SubscriptionPageProps {
  onUpgrade: (tier: "free" | "basic" | "pro" | "enterprise", credits: number) => void;
}

export default function SubscriptionPage({ onUpgrade }: SubscriptionPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");


  // Fetch real subscription plans from backend
  const { data: plansResponse, isLoading: plansLoading } = useGetSubscriptionPlansQuery();
  const [createSubscription, { isLoading: isSubscribing }] = useCreateUserSubscriptionMutation();

  const backendPlans = plansResponse?.data?.subscriptionPlan || [];

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  
  // Fetch active token packages for top-ups
  const { data: tokenPackagesRes, isLoading: packagesLoading } = useGetActiveTokenPackagesQuery();
  const tokenPackages = tokenPackagesRes?.data?.packages || [];

  const handleDirectUpgrade = async (tier: string, price: string, credits: number, planId?: string) => {
    // If we have a real backend plan ID, use the real API with Razorpay
    if (planId) {
      try {
        // 1. Create order
        const orderRes = await createOrder({
          itemType: "SUBSCRIPTION",
          itemId: planId,
        }).unwrap();

        // 2. Open Razorpay Checkout
        const options = {
          key: "rzp_test_THQUCyYxXJst74", // Ideally fetched from backend or env, but fine for test
          amount: orderRes.data.amount,
          currency: orderRes.data.currency,
          name: "GoChat AI Studio",
          description: `Subscription: ${tier}`,
          order_id: orderRes.data.orderId,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
              
              alert("🎉 Payment Successful! Subscription activated & Official Invoice sent to your registered Gmail address.");
            } catch (verErr) {
              console.error("Payment verification failed:", verErr);
              alert("Payment verification failed. Please contact support.");
            }
          },
          theme: {
            color: "#f59e0b", // Amber 500
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } catch (err: any) {
        console.error("Subscription order creation failed:", err);
        alert(err?.data?.message || "Failed to create Razorpay payment order.");
      }
      return;
    }

    // Fallback to mock upgrade callback
    const tierValue = tier.toLowerCase().includes("pro")
      ? "pro"
      : tier.toLowerCase().includes("basic")
      ? "basic"
      : "enterprise";
    
    onUpgrade(tierValue as any, credits);
  };

  const handleTokenPurchase = async (packageId: string, name: string) => {
    try {
      const orderRes = await createOrder({
        itemType: "TOKEN_PACKAGE",
        itemId: packageId,
      }).unwrap();

      const options = {
        key: "rzp_test_THQUCyYxXJst74",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "GoChat AI Studio",
        description: `Token Package: ${name}`,
        order_id: orderRes.data.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            alert("🎉 Tokens purchased successfully! Invoice sent to your registered Gmail address.");
          } catch (verErr) {
            console.error("Payment verification failed:", verErr);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#f59e0b" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Token order creation failed:", err);
      alert(err?.data?.message || "Failed to create Razorpay order for tokens.");
    }
  };

  // Build plan cards — merge backend plans with fallback hardcoded plans
  const fallbackPlans = [
    {
      name: "Free Sandbox",
      price: "₹0",
      description: "Ideal for testing core model structures",
      credits: "10 monthly credits",
      features: [
        "Default Gemini 3.5 Flash Access",
        "Standard latency response bounds",
        "Max 3 saved assets in history",
        "Public chat channels only"
      ],
      featured: false,
      buttonText: "Current Plan"
    },
    {
      name: "Basic Developer",
      price: billingCycle === "monthly" ? "₹499" : "₹399",
      period: "/month",
      description: "Great for building individual prototypes",
      credits: "500 credits / month",
      features: [
        "Gemini 3.5 Flash + Image Lite",
        "Dedicated proxy route bandwidth",
        "Full assets export to txt or local",
        "Essential cookie logging checks"
      ],
      featured: false,
      buttonText: "Upgrade to Basic"
    },
    {
      name: "Pro Unlimited",
      price: billingCycle === "monthly" ? "₹1,499" : "₹1,199",
      period: "/month",
      description: "The premium standard for elite creators",
      credits: "1,500 credits / month",
      features: [
        "All models including Veo Video Lite",
        "Sub-100ms ultra-low latency bounds",
        "Amber Glow luxury interface theme",
        "Advanced audit log logs history"
      ],
      featured: true,
      buttonText: "Claim Pro Membership"
    },
    {
      name: "Daily Access Pass",
      price: "₹99",
      period: "/24h",
      description: "Claim single-day premium unconstrained credentials",
      credits: "100 credits instant",
      features: [
        "Complete unconstrained model access",
        "24-hour expiration matrix window",
        "Perfect for quick research needs",
        "Instant vector compile links"
      ],
      featured: false,
      buttonText: "Purchase Daily Pass"
    }
  ];

  // If backend has real plans, build cards from them; otherwise use fallback
  const plans = backendPlans.length > 0
    ? backendPlans.map((bp, i) => ({
        name: bp.name,
        price: `₹${bp.price}`,
        period: bp.durationInDays ? `/${bp.durationInDays}d` : "/month",
        description: bp.description,
        credits: `${bp.tokens || 0} tokens`,
        features: bp.services.slice(0, 4),
        featured: i === 1,
        buttonText: bp.price === 0 ? "Current Plan" : `Subscribe to ${bp.name}`,
        planId: bp._id,
        priceValue: bp.price,
      }))
    : fallbackPlans.map((p) => ({ ...p, planId: undefined as string | undefined, priceValue: 0 }));

  return (
    <div className="space-y-8  p-1 text-left">
      {/* Banner */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-amber-500/[0.04] blur-2xl rounded-full" />
        <div className="space-y-2">
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1">
            <Award className="w-3.5 h-3.5 fill-amber-500/10" /> Prestige Access
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
            VIP Membership & Subscription Plans
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            All prices are calculated directly in **Indian Rupees (₹)** to optimize regional transaction routes. Claim your elite credentials.
          </p>
        </div>
      </div>

      {/* Monthly vs Yearly toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-zinc-400 font-medium">Monthly billing</span>
        <button
          id="billing-toggle-btn"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="w-12 h-6 rounded-full bg-[#1A1A1A] border border-[#242424] p-0.5 transition duration-300 flex items-center relative"
        >
          <div
            className={`w-4.5 h-4.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/30 transition duration-300 absolute ${
              billingCycle === "yearly" ? "right-1" : "left-1"
            }`}
          />
        </button>
        <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
          Yearly billing <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-500 font-bold uppercase tracking-wider">Save 20%</span>
        </span>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between space-y-6 relative transition duration-300 ${
              plan.featured
                ? "border-amber-500 shadow-2xl shadow-amber-500/[0.06] bg-[#111111]"
                : "border-[#242424] hover:border-zinc-800"
            }`}
          >
            {/* Featured top badge */}
            {plan.featured && (
              <span className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/15">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white tracking-wide">{plan.name}</h4>
                <p className="text-[11px] text-zinc-500">{plan.description}</p>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-1 py-2 border-y border-[#1F1F1F]">
                <span className="text-2xl font-bold text-white font-numbers">{plan.price}</span>
                {plan.period && <span className="text-[10px] text-zinc-500">{plan.period}</span>}
              </div>

              {/* Instant Credits marker */}
              <div className="text-[10px] font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1.5 rounded-lg w-fit">
                {plan.credits}
              </div>

              {/* Features list */}
              <ul className="space-y-2 pt-2">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-start gap-2 text-[11px] text-zinc-400">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upgrade CTA Button */}
            <button
              onClick={() => {
                const p = plan as any;
                if (p.price !== "₹0") {
                  handleDirectUpgrade(
                    plan.name,
                    `${plan.price}${plan.period || ""}`,
                    plan.name.includes("Daily") ? 100 : plan.name.includes("Pro") ? 1500 : 500,
                    p.planId,
                  );
                }
              }}
              disabled={plan.price === "₹0"}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                plan.price === "₹0"
                  ? "bg-[#18181B] border border-transparent text-zinc-500 cursor-default"
                  : plan.featured
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/15"
                  : "bg-[#1A1A1A] border border-[#242424] text-zinc-300 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Token Packages Section */}
      {tokenPackages.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              One-Time Token Top-Ups
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Need more tokens but don't want to change your subscription? Purchase unexpiring tokens a la carte.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenPackages.map((pkg: any) => (
              <div
                key={pkg._id}
                className="bg-[#111111] border border-[#242424] rounded-2xl p-5 flex flex-col justify-between space-y-5 hover:border-amber-500/50 transition"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{pkg.name}</h4>
                  <p className="text-[11px] text-zinc-500">{pkg.description}</p>
                </div>
                
                <div className="flex items-baseline gap-1 py-2 border-y border-[#1F1F1F]">
                  <span className="text-2xl font-bold text-white font-numbers">₹{pkg.price}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg w-fit">
                  <Zap className="w-3.5 h-3.5" />
                  {pkg.tokenAmount.toLocaleString()} Tokens
                </div>

                <button
                  onClick={() => handleTokenPurchase(pkg._id, pkg.name)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#1A1A1A] border border-[#242424] text-zinc-300 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
