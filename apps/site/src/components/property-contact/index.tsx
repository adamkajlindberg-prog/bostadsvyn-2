"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MailIcon, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  createPropertyInquiry,
  createViewingRequest,
} from "@/lib/actions/messaging";

const contactSchema = z.object({
  first_name: z.string().min(2, "Förnamn krävs"),
  last_name: z.string().min(2, "Efternamn krävs"),
  email: z.string().email("Giltig e-post krävs"),
  phone: z.string().min(10, "Telefonnummer krävs"),
  message: z.string().min(10, "Meddelande måste vara minst 10 tecken"),
  has_loan_promise: z.enum(["yes", "no"], {
    message: "Vänligen svara på frågan",
  }),
  accepts_terms: z.boolean().refine((val) => val === true, {
    message: "Du måste godkänna villkoren",
  }),
});

const viewingSchema = z.object({
  name: z.string().min(2, "Namn krävs"),
  email: z.string().email("Giltig e-post krävs"),
  phone: z.string().min(10, "Telefonnummer krävs"),
  requested_date: z.date(),
  alternative_date_1: z.date().optional(),
  alternative_date_2: z.date().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;
type ViewingFormData = z.infer<typeof viewingSchema>;

interface PropertyContactProps {
  propertyId: string;
  propertyTitle: string;
  propertyStatus: string;
  propertyPrice?: number;
  propertyAddress?: string;
  propertyOwner?: {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
  };
  brokerId?: string;
  propertyUserId?: string;
}

export function PropertyContact({
  propertyId,
  propertyTitle: _propertyTitle,
  propertyStatus,
  propertyPrice: _propertyPrice,
  propertyAddress: _propertyAddress,
  propertyOwner,
  brokerId: _brokerId,
  propertyUserId: _propertyUserId,
}: PropertyContactProps) {
  const _router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showViewingDialog, setShowViewingDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const isRentalProperty = propertyStatus === "FOR_RENT";

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: "",
      has_loan_promise: undefined,
      accepts_terms: false,
    },
  });

  const viewingForm = useForm<ViewingFormData>({
    resolver: zodResolver(viewingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmitContact = async (data: ContactFormData) => {
    try {
      setLoading(true);

      const result = await createPropertyInquiry({
        propertyId,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone,
        message: data.message,
        inquiryType: "contact",
        status: "new",
      });

      if (!result.success) {
        throw new Error(result.error || "Kunde inte skicka meddelande");
      }

      // TODO: Send email notification via API route
      // await fetch("/api/send-property-inquiry", { ... });

      toast.success(
        `Din förfrågan har skickats till ${isRentalProperty ? "säljaren" : "mäklaren"}`,
      );
      setShowContactDialog(false);
      contactForm.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kunde inte skicka meddelande";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitViewing = async (data: ViewingFormData) => {
    try {
      setLoading(true);

      const result = await createViewingRequest({
        propertyId,
        requestedDate: data.requested_date,
        alternativeDate1: data.alternative_date_1,
        alternativeDate2: data.alternative_date_2,
        contactPhone: data.phone,
        contactEmail: data.email,
        message: data.message || null,
        status: "pending",
      });

      if (!result.success) {
        throw new Error(result.error || "Kunde inte skicka visningsförfrågan");
      }

      toast.success(
        `Din visningsförfrågan har skickats till ${isRentalProperty ? "säljaren" : "mäklaren"}`,
      );
      setShowViewingDialog(false);
      viewingForm.reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Kunde inte skicka visningsförfrågan";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Owner/Broker Info */}
          {propertyOwner && (
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={undefined}
                  alt={propertyOwner.fullName || ""}
                />
                <AvatarFallback>
                  {propertyOwner.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">
                  {propertyOwner.fullName || "Fastighetsägare"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRentalProperty ? "Hyresvärd" : "Mäklare"}
                </p>
              </div>
            </div>
          )}

          {/* Contact Actions */}
          <div className="space-y-2">
            <Dialog
              open={showContactDialog}
              onOpenChange={setShowContactDialog}
            >
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Kontakta {isRentalProperty ? "hyresvärd" : "mäklare"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Kontakta {isRentalProperty ? "hyresvärd" : "mäklare"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={contactForm.handleSubmit(onSubmitContact)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Förnamn</Label>
                      <Input
                        id="first_name"
                        {...contactForm.register("first_name")}
                      />
                      {contactForm.formState.errors.first_name && (
                        <p className="text-sm text-destructive mt-1">
                          {contactForm.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="last_name">Efternamn</Label>
                      <Input
                        id="last_name"
                        {...contactForm.register("last_name")}
                      />
                      {contactForm.formState.errors.last_name && (
                        <p className="text-sm text-destructive mt-1">
                          {contactForm.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      type="email"
                      {...contactForm.register("email")}
                    />
                    {contactForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...contactForm.register("phone")}
                    />
                    {contactForm.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      {...contactForm.register("message")}
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Har du lånelöfte?</Label>
                    <RadioGroup
                      onValueChange={(value) =>
                        contactForm.setValue(
                          "has_loan_promise",
                          value as "yes" | "no",
                        )
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="loan_yes" />
                        <Label htmlFor="loan_yes">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="loan_no" />
                        <Label htmlFor="loan_no">Nej</Label>
                      </div>
                    </RadioGroup>
                    {contactForm.formState.errors.has_loan_promise && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.has_loan_promise.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accepts_terms"
                      checked={contactForm.watch("accepts_terms")}
                      onCheckedChange={(checked) =>
                        contactForm.setValue("accepts_terms", !!checked)
                      }
                    />
                    <Label htmlFor="accepts_terms" className="text-sm">
                      Jag godkänner villkoren
                    </Label>
                  </div>
                  {contactForm.formState.errors.accepts_terms && (
                    <p className="text-sm text-destructive">
                      {contactForm.formState.errors.accepts_terms.message}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Skickar..." : "Skicka"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {!isRentalProperty && (
              <Dialog
                open={showViewingDialog}
                onOpenChange={setShowViewingDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="lg">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Boka visning
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Boka visning</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={viewingForm.handleSubmit(onSubmitViewing)}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="viewing_name">Namn</Label>
                      <Input
                        id="viewing_name"
                        {...viewingForm.register("name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="viewing_email">E-post</Label>
                      <Input
                        id="viewing_email"
                        type="email"
                        {...viewingForm.register("email")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="viewing_phone">Telefon</Label>
                      <Input
                        id="viewing_phone"
                        type="tel"
                        {...viewingForm.register("phone")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="viewing_message">
                        Meddelande (valfritt)
                      </Label>
                      <Textarea
                        id="viewing_message"
                        rows={3}
                        {...viewingForm.register("message")}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Skickar..." : "Skicka förfrågan"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {propertyOwner?.phone && (
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setShowPhoneDialog(true)}
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Ring {propertyOwner.fullName || "mäklare"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Phone Dialog */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Telefonnummer</DialogTitle>
          </DialogHeader>
          {propertyOwner?.phone && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ring {propertyOwner.fullName || "mäklare"} på:
              </p>
              <a
                href={`tel:${propertyOwner.phone}`}
                className="text-2xl font-semibold text-primary hover:underline"
              >
                {propertyOwner.phone}
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
