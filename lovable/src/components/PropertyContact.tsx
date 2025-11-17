import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Building2,
  Calendar as CalendarIcon,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  first_name: z.string().min(2, "Förnamn krävs"),
  last_name: z.string().min(2, "Efternamn krävs"),
  email: z.string().email("Giltig e-post krävs"),
  phone: z.string().min(10, "Telefonnummer krävs"),
  message: z.string().min(10, "Meddelande måste vara minst 10 tecken"),
  has_loan_promise: z.enum(["yes", "no"], {
    required_error: "Vänligen svara på frågan",
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
    full_name?: string;
    email: string;
    phone?: string;
  };
  brokerId?: string;
  propertyUserId?: string;
}
export const PropertyContact: React.FC<PropertyContactProps> = ({
  propertyId,
  propertyTitle,
  propertyStatus,
  propertyPrice,
  propertyAddress,
  propertyOwner,
  brokerId,
  propertyUserId,
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showViewingDialog, setShowViewingDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const isRentalProperty = propertyStatus === "FOR_RENT";
  const navigate = useNavigate();
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: user?.email || "",
      phone: "",
      message: "",
      has_loan_promise: undefined,
      accepts_terms: false,
    },
  });
  const viewingForm = useForm<ViewingFormData>({
    resolver: zodResolver(viewingSchema),
    defaultValues: {
      name: profile?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      message: "",
    },
  });
  const onSubmitContact = async (data: ContactFormData) => {
    try {
      setLoading(true);

      // Save to database
      const { error } = await supabase.from("property_inquiries").insert([
        {
          property_id: propertyId,
          inquirer_id: user?.id || null,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          phone: data.phone,
          message: data.message,
          inquiry_type: "contact",
        },
      ]);
      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-property-inquiry", {
          body: {
            propertyId,
            propertyTitle,
            propertyPrice,
            propertyAddress,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            hasLoanPromise: data.has_loan_promise === "yes",
            brokerEmail: propertyOwner?.email,
            brokerName: propertyOwner?.full_name,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails
      }
      toast({
        title: "Meddelande skickat",
        description: `Din förfrågan har skickats till ${isRentalProperty ? "säljaren" : "mäklaren"}`,
      });
      setShowContactDialog(false);
      contactForm.reset();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka meddelande",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const onSubmitViewing = async (data: ViewingFormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("viewing_requests").insert([
        {
          property_id: propertyId,
          requester_id: user?.id || null,
          requested_date: data.requested_date.toISOString(),
          alternative_date_1: data.alternative_date_1?.toISOString(),
          alternative_date_2: data.alternative_date_2?.toISOString(),
          contact_phone: data.phone,
          contact_email: data.email,
          message: data.message,
        },
      ]);
      if (error) throw error;
      toast({
        title: "Visningsförfrågan skickad",
        description: `Din visningsförfrågan har skickats till ${isRentalProperty ? "säljaren" : "mäklaren"}`,
      });
      setShowViewingDialog(false);
      viewingForm.reset();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka visningsförfrågan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const DatePicker = ({
    value,
    onChange,
    placeholder = "Välj datum",
    disabled = false,
  }: {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "PPP", {
              locale: sv,
            })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date()}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
  return (
    <div className="space-y-4">
      {/* Contact Actions */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* Broker Info */}
          <div
            className="flex items-center gap-3 pb-3 border-b cursor-pointer hover:bg-muted/50 -mx-6 px-6 py-3 transition-colors"
            onClick={async () => {
              if (isRentalProperty) return;
              // Navigate if brokerId known
              if (brokerId) {
                navigate(`/maklare/${brokerId}`);
                return;
              }
              // Fallback: try to resolve broker by property user id
              try {
                if (propertyUserId) {
                  const { data } = await supabase
                    .from("brokers")
                    .select("id")
                    .eq("user_id", propertyUserId)
                    .maybeSingle();
                  if (data?.id) {
                    navigate(`/maklare/${data.id}`);
                  } else {
                    // Fallback: navigate using property user id for demo/test data
                    navigate(`/maklare/${propertyUserId}`);
                  }
                } else {
                  toast({
                    title: "Ingen mäklare kopplad",
                    description:
                      "Vi kunde inte fastställa vem som är ansvarig mäklare.",
                  });
                }
              } catch (_e) {
                toast({
                  title: "Fel vid uppslagning",
                  description: "Kunde inte hämta mäklarinformation just nu.",
                  variant: "destructive",
                });
              }
            }}
          >
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(propertyOwner?.full_name || "Erik Svensson")}&background=4F46E5&color=fff`}
              />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {(propertyOwner?.full_name || "Erik Svensson")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-base">
                {propertyOwner?.full_name || "Erik Svensson"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRentalProperty ? "Fastighetsägare" : "Ansvarig mäklare"}
              </p>
              {!isRentalProperty && (brokerId || propertyUserId) && (
                <p className="text-xs text-primary mt-0.5">
                  Klicka för att se mäklarens profil →
                </p>
              )}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPhoneDialog(true)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Telefonnummer
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowContactDialog(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              E-post
            </Button>
          </div>

          {/* Phone Number Dialog */}
          <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Telefonnummer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {propertyOwner?.full_name || "Erik Svensson"}
                    </p>
                    <a
                      href={`tel:${propertyOwner?.phone || "0701234567"}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {propertyOwner?.phone || "070-123 45 67"}
                    </a>
                  </div>
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = `tel:${propertyOwner?.phone || "0701234567"}`)
                  }
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Ring nu
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Contact Form Dialog - Hemnet Style */}
          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Kontakta mäklaren</DialogTitle>
              </DialogHeader>

              {/* Property Info Header */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                <h3 className="font-semibold text-lg">{propertyTitle}</h3>
                {propertyAddress && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {propertyAddress}
                  </p>
                )}
                {propertyPrice && (
                  <p className="text-base font-semibold">
                    {propertyPrice.toLocaleString("sv-SE")} kr
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Objektnummer: {propertyId.substring(0, 8)}
                </p>
              </div>

              <form
                onSubmit={contactForm.handleSubmit(onSubmitContact)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">Förnamn *</Label>
                    <Input
                      id="first-name"
                      {...contactForm.register("first_name")}
                      className="mt-1"
                      placeholder="Ange ditt förnamn"
                    />
                    {contactForm.formState.errors.first_name && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="last-name">Efternamn *</Label>
                    <Input
                      id="last-name"
                      {...contactForm.register("last_name")}
                      className="mt-1"
                      placeholder="Ange ditt efternamn"
                    />
                    {contactForm.formState.errors.last_name && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact-email">E-post *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      {...contactForm.register("email")}
                      className="mt-1"
                      placeholder="din.epost@exempel.se"
                    />
                    {contactForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact-phone">Telefonnummer *</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      {...contactForm.register("phone")}
                      placeholder="070-123 45 67"
                      className="mt-1"
                    />
                    {contactForm.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {contactForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-message">Meddelande *</Label>
                  <Textarea
                    id="contact-message"
                    {...contactForm.register("message")}
                    placeholder="Jag vill veta mer om denna bostad..."
                    rows={4}
                    className="mt-1"
                  />
                  {contactForm.formState.errors.message && (
                    <p className="text-sm text-destructive mt-1">
                      {contactForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                {/* Loan Promise Question */}
                <div className="space-y-2">
                  <Label>Har du lånelöfte? *</Label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="yes"
                        {...contactForm.register("has_loan_promise")}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm">Ja</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        {...contactForm.register("has_loan_promise")}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm">Nej</span>
                    </label>
                  </div>
                  {contactForm.formState.errors.has_loan_promise && (
                    <p className="text-sm text-destructive mt-1">
                      {contactForm.formState.errors.has_loan_promise.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                  <input
                    type="checkbox"
                    id="accepts-terms"
                    {...contactForm.register("accepts_terms")}
                    className="mt-1 h-4 w-4 rounded border-input"
                  />
                  <Label
                    htmlFor="accepts-terms"
                    className="cursor-pointer text-sm leading-relaxed"
                  >
                    Jag godkänner att mina uppgifter behandlas enligt{" "}
                    <a
                      href="/privacy"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener"
                    >
                      integritetspolicyn
                    </a>{" "}
                    och att mäklaren kontaktar mig angående denna bostad
                  </Label>
                </div>
                {contactForm.formState.errors.accepts_terms && (
                  <p className="text-sm text-destructive">
                    {contactForm.formState.errors.accepts_terms.message}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowContactDialog(false);
                      contactForm.reset();
                    }}
                  >
                    Avbryt
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>Skickar...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Skicka förfrågan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Broker Company */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base">
                Svensk Fastighetsförmedling
              </h3>
              <p className="text-sm text-muted-foreground">
                Auktoriserad mäklarfirma
              </p>
            </div>
          </div>

          {/* Scheduled Viewings */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Visningar
            </h3>
            <div className="space-y-2">
              {/* Example viewing times - replace with real data */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Måndag 27 januari
                    </span>
                    <span className="text-sm text-muted-foreground">
                      18:00 - 19:00
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Anmäl intresse
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Onsdag 29 januari
                    </span>
                    <span className="text-sm text-muted-foreground">
                      17:30 - 18:30
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Anmäl intresse
                </Button>
              </div>
            </div>
          </div>

          {!isRentalProperty && (
            <Dialog
              open={showViewingDialog}
              onOpenChange={setShowViewingDialog}
            >
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Boka egen visning
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Boka visning</DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={viewingForm.handleSubmit(onSubmitViewing)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="viewing-name">Namn *</Label>
                      <Input
                        id="viewing-name"
                        {...viewingForm.register("name")}
                        className="mt-1"
                      />
                      {viewingForm.formState.errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {viewingForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="viewing-email">E-post *</Label>
                      <Input
                        id="viewing-email"
                        type="email"
                        {...viewingForm.register("email")}
                        className="mt-1"
                      />
                      {viewingForm.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {viewingForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="viewing-phone">Telefon *</Label>
                      <Input
                        id="viewing-phone"
                        type="tel"
                        {...viewingForm.register("phone")}
                        placeholder="070-123 45 67"
                        className="mt-1"
                      />
                      {viewingForm.formState.errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {viewingForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Önskat datum *</Label>
                      <div className="mt-1">
                        <DatePicker
                          value={viewingForm.watch("requested_date")}
                          onChange={(date) =>
                            viewingForm.setValue("requested_date", date!)
                          }
                          placeholder="Välj önskat datum"
                        />
                      </div>
                      {viewingForm.formState.errors.requested_date && (
                        <p className="text-sm text-destructive mt-1">
                          Vänligen välj ett datum
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Alternativ 1</Label>
                        <div className="mt-1">
                          <DatePicker
                            value={viewingForm.watch("alternative_date_1")}
                            onChange={(date) =>
                              viewingForm.setValue("alternative_date_1", date)
                            }
                            placeholder="Alternativt datum"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Alternativ 2</Label>
                        <div className="mt-1">
                          <DatePicker
                            value={viewingForm.watch("alternative_date_2")}
                            onChange={(date) =>
                              viewingForm.setValue("alternative_date_2", date)
                            }
                            placeholder="Alternativt datum"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="viewing-message">Meddelande</Label>
                    <Textarea
                      id="viewing-message"
                      {...viewingForm.register("message")}
                      placeholder="Ytterligare information eller önskemål..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowViewingDialog(false)}
                    >
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>Skickar...</>
                      ) : (
                        <>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Skicka förfrågan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
