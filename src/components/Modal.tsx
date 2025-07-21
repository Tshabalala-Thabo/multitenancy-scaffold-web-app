import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Interface for FAQ items or general content items
export interface ContentItem {
  id: string;
  title: string;
  content: string;
}

// Props interface for the dynamic dialog
export interface DynamicDialogProps {
  // Trigger button props
  triggerText: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  // Dialog content props
  dialogTitle: string;
  items: ContentItem[];
  
  // Footer props
  closeButtonText?: string;
  customFooter?: React.ReactNode;
  
  // Styling props
  maxHeight?: string;
  maxWidth?: string;
  className?: string;
  
  // Event handlers
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export default function DynamicDialog({
  triggerText,
  triggerVariant = "outline",
  dialogTitle,
  items,
  closeButtonText = "Okay",
  customFooter,
  maxHeight = "min(640px,80vh)",
  maxWidth = "lg",
  className = "",
  onOpenChange,
  onClose,
}: DynamicDialogProps) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent 
        className={`flex flex-col gap-0 p-0 sm:max-h-[${maxHeight}] sm:max-w-${maxWidth} [&>button:last-child]:top-3.5 ${className}`}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            {dialogTitle}
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  {items.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p>
                        <strong>{item.title}</strong>
                      </p>
                      <p>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </DialogDescription>
            <DialogFooter className="px-6 pb-6 sm:justify-start">
              {customFooter || (
                <DialogClose asChild>
                  <Button type="button" onClick={handleClose}>
                    {closeButtonText}
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Example FAQ data
const faqItems: ContentItem[] = [
  {
    id: "1",
    title: "Account Management",
    content: "Navigate to the registration page, provide required information, and verify your email address. You can sign up using your email or through social media platforms."
  },
  {
    id: "2",
    title: "Password Reset Process",
    content: "Users can reset their password through the account settings page. Click \"Forgot Password\" and follow the email verification steps to regain account access quickly and securely."
  },
  {
    id: "3",
    title: "Service Pricing Tiers",
    content: "We offer three primary subscription levels designed to meet diverse user needs: Basic (free with limited features), Professional (monthly fee with comprehensive access), and Enterprise (custom pricing with full platform capabilities)."
  },
  {
    id: "4",
    title: "Technical Support Channels",
    content: "Customer support is accessible through multiple communication methods including email support, live chat during business hours, an integrated support ticket system, and phone support specifically for enterprise-level customers."
  },
  {
    id: "5",
    title: "Data Protection Strategies",
    content: "Our platform implements rigorous security measures including 256-bit SSL encryption, regular comprehensive security audits, strict data access controls, and compliance with international privacy protection standards."
  },
  {
    id: "6",
    title: "Platform Compatibility",
    content: "The service supports multiple device and operating system environments, including web browsers like Chrome and Firefox, mobile applications for iOS and Android, and desktop applications compatible with Windows and macOS."
  },
  {
    id: "7",
    title: "Subscription Management",
    content: "Subscriptions can be cancelled at any time through account settings, with pro-rated refunds available within 30 days of payment. Both monthly and annual billing options are provided, with special discounts offered for annual commitments."
  },
  {
    id: "8",
    title: "Payment Method Options",
    content: "We accept a wide range of payment methods including major credit cards such as Visa, MasterCard, and American Express, digital payment platforms like PayPal, and direct bank transfers. Regional payment options may also be available depending on user location."
  },
  {
    id: "9",
    title: "Customer Support",
    content: "Our dedicated customer support team is available 24/7, providing quick and efficient assistance to address any inquiries or issues you may have."
  },
  {
    id: "10",
    title: "Privacy Policy",
    content: "Our privacy policy outlines how we collect, use, and protect your personal data, ensuring your privacy is protected at all times."
  }
];

// Example usage components
export function FAQDialog() {
  return (
    <DynamicDialog
      triggerText="Scrollable (sticky header)"
      dialogTitle="Frequently Asked Questions (FAQ)"
      items={faqItems}
      onOpenChange={(open) => console.log("Dialog open state:", open)}
      onClose={() => console.log("Dialog closed")}
    />
  );
}

export function TermsDialog() {
  const termsItems: ContentItem[] = [
    {
      id: "1",
      title: "Terms of Service",
      content: "By using our service, you agree to these terms and conditions."
    },
    {
      id: "2", 
      title: "User Responsibilities",
      content: "Users are responsible for maintaining account security and using the service appropriately."
    }
  ];

  return (
    <DynamicDialog
      triggerText="View Terms"
      triggerVariant="secondary"
      dialogTitle="Terms and Conditions"
      items={termsItems}
      closeButtonText="I Agree"
      maxWidth="xl"
    />
  );
}

export function CustomFooterDialog() {
  const items: ContentItem[] = [
    {
      id: "1",
      title: "Important Notice",
      content: "This is an important message that requires your attention."
    }
  ];

  const customFooter = (
    <div className="flex gap-2">
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button>Confirm</Button>
      </DialogClose>
    </div>
  );

  return (
    <DynamicDialog
      triggerText="Custom Footer"
      dialogTitle="Confirmation Required"
      items={items}
      customFooter={customFooter}
    />
  );
}