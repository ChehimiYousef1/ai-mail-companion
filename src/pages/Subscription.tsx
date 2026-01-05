import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  icon: React.ElementType;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    icon: Sparkles,
    price: '$0',
    period: '/month',
    description: 'Get started with basic mail management',
    current: true,
    features: [
      { text: '50 mail scans per month', included: true },
      { text: 'Basic AI summaries', included: true },
      { text: 'Manual categorization', included: true },
      { text: '7-day mail history', included: true },
      { text: 'Smart actions', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    icon: Zap,
    price: '$9',
    period: '/month',
    description: 'Perfect for personal mail management',
    popular: true,
    features: [
      { text: 'Unlimited mail scans', included: true },
      { text: 'Advanced AI summaries', included: true },
      { text: 'Auto-categorization', included: true },
      { text: 'Unlimited mail history', included: true },
      { text: 'Smart actions & reminders', included: true },
      { text: 'Email support', included: true },
    ],
  },
  {
    name: 'Business',
    icon: Crown,
    price: '$29',
    period: '/month',
    description: 'For teams and businesses',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Custom AI training', included: true },
      { text: 'API access', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority 24/7 support', included: true },
    ],
  },
];

const Subscription = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Choose your plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Unlock the full power of MailMate. Cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border-2 bg-card p-6 transition-all duration-300",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-105"
                  : "border-border hover:border-primary/50 hover:shadow-lg"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Badge */}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4",
                  plan.popular ? "bg-primary/10" : "bg-muted"
                )}>
                  <plan.icon className={cn(
                    "h-6 w-6",
                    plan.popular ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      feature.included 
                        ? "bg-success/10 text-success" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-foreground" : "text-muted-foreground line-through"
                    )}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full rounded-xl",
                  plan.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
                variant={plan.popular ? "default" : "secondary"}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.popular ? 'Upgrade to Pro' : `Choose ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <button className="text-sm text-primary hover:underline mt-2">
            Compare all features →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
