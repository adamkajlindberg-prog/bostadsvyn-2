import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  FileText,
  Home,
  Image,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const rentalSchema = z.object({
  title: z.string().min(1, "Titel krävs"),
  description: z.string().min(20, "Beskrivning måste vara minst 20 tecken"),
  contract_type: z.enum(["first_hand", "second_hand"], {
    required_error: "Kontraktstyp krävs",
  }),
  rooms: z.number().min(1, "Antal rum krävs"),
  is_shared: z.boolean(),
  rent: z.number().min(1, "Hyra krävs"),
  utilities_included: z.boolean(),
  furnished: z.boolean(),
  pets_allowed: z.boolean(),
  smoking_allowed: z.boolean(),
  address_street: z.string().min(1, "Gatuadress krävs"),
  address_postal_code: z.string().min(5, "Postnummer krävs"),
  address_city: z.string().min(1, "Stad krävs"),
  available_from: z.string().min(1, "Tillgänglig från datum krävs"),
  lease_duration: z.string().min(1, "Uthyrningsperiod krävs"),
  area: z.number().min(1, "Yta krävs"),
  // New property details
  floor_level: z.string().optional(),
  has_elevator: z.boolean(),
  has_balcony: z.boolean(),
  has_garden: z.boolean(),
  has_garage: z.boolean(),
  parking_available: z.boolean(),
  parking_type: z.string().optional(),
  internet_included: z.boolean(),
  building_year: z.number().optional(),
  energy_rating: z.string().optional(),
  // Tenant requirements
  min_income: z.number().optional(),
  min_age: z.number().optional(),
  max_occupants: z.number().optional(),
  references_required: z.boolean(),
  // Neighborhood and transport
  neighborhood_description: z.string().optional(),
  nearest_metro: z.string().optional(),
  transport_description: z.string().optional(),
  // Contact preferences
  contact_phone: z.string().optional(),
  viewing_instructions: z.string().optional(),
  preferred_contact_method: z.enum(["phone", "email", "message"]).optional(),
  // Amenities
  has_dishwasher: z.boolean(),
  has_washing_machine: z.boolean(),
  has_dryer: z.boolean(),
  has_microwave: z.boolean(),
  has_oven: z.boolean(),
  has_freezer: z.boolean(),
  has_bathtub: z.boolean(),
  has_shower: z.boolean(),
  has_bidet: z.boolean(),
  has_floor_heating: z.boolean(),
  has_tv: z.boolean(),
  has_wifi: z.boolean(),
  has_cable_tv: z.boolean(),
  has_air_conditioning: z.boolean(),
  has_heating: z.boolean(),
  has_alarm_system: z.boolean(),
  has_ev_charger: z.boolean(),
  has_fireplace: z.boolean(),
  has_sauna: z.boolean(),
  has_storage: z.boolean(),
  has_bike_room: z.boolean(),
  has_stroller_room: z.boolean(),
  has_gym: z.boolean(),
  has_common_room: z.boolean(),
  has_pool: z.boolean(),
  has_jacuzzi: z.boolean(),
  has_security_door: z.boolean(),
  has_garage_in_amenities: z.boolean(),
  has_parking_in_amenities: z.boolean(),
});
type RentalFormData = z.infer<typeof rentalSchema>;
interface RentalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
  adId?: string;
}
const contractTypes = [
  {
    value: "first_hand",
    label: "Förstahandskontrakt",
  },
  {
    value: "second_hand",
    label: "Andrahandskontrakt",
  },
];
const leaseDurations = [
  "1 månad",
  "3 månader",
  "6 månader",
  "12 månader",
  "18 månader",
  "24 månader",
  "Tillsvidare",
];
const parkingTypes = [
  "Parkering i garage",
  "Parkering på gård",
  "Gatuparking",
  "Hyrd parkeringsplats",
];
const energyRatings = ["A", "B", "C", "D", "E", "F", "G"];
const contactMethods = [
  {
    value: "email",
    label: "E-post",
  },
  {
    value: "phone",
    label: "Telefon",
  },
  {
    value: "message",
    label: "Meddelanden på plattformen",
  },
];
export const RentalForm: React.FC<RentalFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  adId,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      is_shared: false,
      utilities_included: false,
      furnished: false,
      pets_allowed: false,
      smoking_allowed: false,
      has_elevator: false,
      has_balcony: false,
      has_garden: false,
      has_garage: false,
      parking_available: false,
      internet_included: false,
      references_required: false,
      max_occupants: 2,
      has_dishwasher: false,
      has_washing_machine: false,
      has_dryer: false,
      has_microwave: false,
      has_oven: false,
      has_freezer: false,
      has_bathtub: false,
      has_shower: false,
      has_bidet: false,
      has_floor_heating: false,
      has_tv: false,
      has_wifi: false,
      has_cable_tv: false,
      has_air_conditioning: false,
      has_heating: false,
      has_alarm_system: false,
      has_ev_charger: false,
      has_fireplace: false,
      has_sauna: false,
      has_storage: false,
      has_bike_room: false,
      has_stroller_room: false,
      has_gym: false,
      has_common_room: false,
      has_pool: false,
      has_jacuzzi: false,
      has_security_door: false,
      has_garage_in_amenities: false,
      has_parking_in_amenities: false,
    },
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData?.properties) {
      const prop = initialData.properties;
      const rental = prop.rental_info || {};

      // Set existing images
      if (prop.images && prop.images.length > 0) {
        setExistingImageUrls(prop.images);
      }

      // Populate form fields
      setValue("title", prop.title || "");
      setValue("description", prop.description || "");
      setValue("contract_type", rental.contract_type || "first_hand");
      setValue("rooms", prop.rooms || 1);
      setValue("is_shared", rental.is_shared || false);
      setValue("rent", prop.price || 0);
      setValue("utilities_included", rental.utilities_included || false);
      setValue("furnished", rental.furnished || false);
      setValue("pets_allowed", rental.pets_allowed || false);
      setValue("smoking_allowed", false);
      setValue("address_street", prop.address_street || "");
      setValue("address_postal_code", prop.address_postal_code || "");
      setValue("address_city", prop.address_city || "");
      setValue("available_from", rental.available_from?.split("T")[0] || "");
      setValue("lease_duration", rental.lease_duration || "");
      setValue("area", prop.living_area || 0);
      setValue("floor_level", rental.floor_level || "");
      setValue("internet_included", rental.internet_included || false);
      setValue("building_year", rental.building_year || undefined);
      setValue("energy_rating", rental.energy_rating || "");
      setValue("min_income", rental.min_income || undefined);
      setValue("min_age", rental.min_age || undefined);
      setValue("max_occupants", rental.max_occupants || 2);
      setValue("references_required", rental.references_required || false);
      setValue(
        "neighborhood_description",
        rental.neighborhood_description || "",
      );
      setValue("nearest_metro", rental.nearest_metro || "");
      setValue("transport_description", rental.transport_description || "");
      setValue("contact_phone", rental.contact_phone || "");
      setValue("viewing_instructions", rental.viewing_instructions || "");
      setValue(
        "preferred_contact_method",
        rental.preferred_contact_method || "email",
      );

      // Populate amenities from arrays
      const kitchen = rental.kitchen_amenities || [];
      const bathroom = rental.bathroom_amenities || [];
      const tech = rental.tech_amenities || [];
      const other = rental.other_amenities || [];

      setValue("has_dishwasher", kitchen.includes("Diskmaskin"));
      setValue("has_microwave", kitchen.includes("Mikrovågsugn"));
      setValue("has_oven", kitchen.includes("Ugn"));
      setValue("has_freezer", kitchen.includes("Kyl/Frys"));
      setValue("has_washing_machine", bathroom.includes("Tvättmaskin"));
      setValue("has_dryer", bathroom.includes("Torktumlare"));
      setValue("has_bathtub", bathroom.includes("Badkar"));
      setValue("has_shower", bathroom.includes("Dusch"));
      setValue("has_bidet", bathroom.includes("Bidé"));
      setValue("has_floor_heating", bathroom.includes("Golvvärme"));
      setValue("has_wifi", tech.includes("Wifi/Internet"));
      setValue("has_tv", tech.includes("TV"));
      setValue("has_air_conditioning", tech.includes("AC"));
      setValue("has_heating", tech.includes("Uppvärmning"));
      setValue("has_alarm_system", tech.includes("Inbrottslarm"));
      setValue("has_ev_charger", tech.includes("Laddmöjlighet till bil"));
      setValue("has_fireplace", other.includes("Öppen spis"));
      setValue("has_sauna", other.includes("Bastu"));
      setValue("has_storage", other.includes("Förråd"));
      setValue("has_bike_room", other.includes("Cykelrum"));
      setValue("has_stroller_room", other.includes("Barnvagnsrum"));
      setValue("has_gym", other.includes("Gym"));
      setValue("has_common_room", other.includes("Gemensamhetslokal"));
      setValue("has_pool", other.includes("Pool"));
      setValue("has_jacuzzi", other.includes("Bubbelpool"));
      setValue("has_security_door", other.includes("Säkerhetsdörr"));
      setValue("has_garage_in_amenities", other.includes("Garageplats"));
      setValue("has_parking_in_amenities", other.includes("Parkering"));

      // Populate boolean features from prop.features or rental_info
      const features = prop.features || [];
      setValue("has_elevator", features.includes("Hiss"));
      setValue("has_balcony", features.includes("Balkong"));
      setValue("has_garden", features.includes("Trädgård"));
      setValue("has_garage", features.includes("Garage"));
      setValue("parking_available", features.includes("Parkering"));
    }
  }, [initialData, setValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allImages = [...existingImageUrls, ...images];
    if (files.length + allImages.length > 20) {
      toast({
        title: "För många bilder",
        description: "Maximalt 20 bilder tillåtna",
        variant: "destructive",
      });
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Reset featured image if it was removed
    if (
      index === featuredImageIndex &&
      featuredImageIndex === images.length - 1
    ) {
      setFeaturedImageIndex(0);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    // Reset featured image if it was removed
    if (
      index === featuredImageIndex &&
      featuredImageIndex === existingImageUrls.length - 1
    ) {
      setFeaturedImageIndex(0);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const allImages = [...existingImageUrls, ...images];
    const draggedItem = allImages[draggedIndex];
    const updatedImages = allImages.filter((_, i) => i !== draggedIndex);
    updatedImages.splice(index, 0, draggedItem);

    // Update featured index if needed
    let newFeaturedIndex = featuredImageIndex;
    if (draggedIndex === featuredImageIndex) {
      newFeaturedIndex = index;
    } else if (
      draggedIndex < featuredImageIndex &&
      index >= featuredImageIndex
    ) {
      newFeaturedIndex = featuredImageIndex - 1;
    } else if (
      draggedIndex > featuredImageIndex &&
      index <= featuredImageIndex
    ) {
      newFeaturedIndex = featuredImageIndex + 1;
    }
    setFeaturedImageIndex(newFeaturedIndex);

    // Split back into existing and new images
    const existingCount = existingImageUrls.length;
    setExistingImageUrls(
      updatedImages
        .slice(0, existingCount)
        .filter((img) => typeof img === "string") as string[],
    );
    setImages(
      updatedImages
        .slice(existingCount)
        .filter((img) => img instanceof File) as File[],
    );
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    setIsUploading(true);
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${index}.${fileExt}`;
      const filePath = `rental-images/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(filePath);
      return publicUrl;
    });
    try {
      const urls = await Promise.all(uploadPromises);
      setIsUploading(false);
      return urls;
    } catch (error) {
      setIsUploading(false);
      throw error;
    }
  };
  const verifyContent = async (
    title: string,
    description: string,
    imageUrls: string[],
  ) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-rental-content",
        {
          body: {
            title,
            description,
            imageUrls,
          },
        },
      );
      if (error) throw error;
      if (!data.approved) {
        throw new Error(
          data.reason || "Annonsen godkändes inte av AI-verifieringen",
        );
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message || "Verifiering misslyckades");
    } finally {
      setIsVerifying(false);
    }
  };
  const onSubmit = async (data: RentalFormData) => {
    setIsSubmitting(true);
    try {
      // Upload new images
      const newImageUrls = await uploadImages();

      // Combine existing images with new uploads
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // Verify content with AI (skip for edits or make optional)
      if (!adId || newImageUrls.length > 0) {
        await verifyContent(data.title, data.description, allImageUrls);
      }

      // Build amenities arrays
      const kitchenAmenities = [];
      if (data.has_dishwasher) kitchenAmenities.push("Diskmaskin");
      if (data.has_microwave) kitchenAmenities.push("Mikrovågsugn");
      if (data.has_oven) kitchenAmenities.push("Ugn");
      if (data.has_freezer) kitchenAmenities.push("Kyl/Frys");

      const bathroomAmenities = [];
      if (data.has_washing_machine) bathroomAmenities.push("Tvättmaskin");
      if (data.has_dryer) bathroomAmenities.push("Torktumlare");
      if (data.has_bathtub) bathroomAmenities.push("Badkar");
      if (data.has_shower) bathroomAmenities.push("Dusch");
      if (data.has_bidet) bathroomAmenities.push("Bidé");
      if (data.has_floor_heating) bathroomAmenities.push("Golvvärme");

      const techAmenities = [];
      if (data.has_wifi) techAmenities.push("Wifi/Internet");
      if (data.has_tv) techAmenities.push("TV");
      if (data.has_air_conditioning) techAmenities.push("AC");
      if (data.has_heating) techAmenities.push("Uppvärmning");
      if (data.has_alarm_system) techAmenities.push("Inbrottslarm");
      if (data.has_ev_charger) techAmenities.push("Laddmöjlighet till bil");

      const otherAmenities = [];
      if (data.has_fireplace) otherAmenities.push("Öppen spis");
      if (data.has_sauna) otherAmenities.push("Bastu");
      if (data.has_storage) otherAmenities.push("Förråd");
      if (data.has_bike_room) otherAmenities.push("Cykelrum");
      if (data.has_stroller_room) otherAmenities.push("Barnvagnsrum");
      if (data.has_gym) otherAmenities.push("Gym");
      if (data.has_common_room) otherAmenities.push("Gemensamhetslokal");
      if (data.has_pool) otherAmenities.push("Pool");
      if (data.has_jacuzzi) otherAmenities.push("Bubbelpool");
      if (data.has_security_door) otherAmenities.push("Säkerhetsdörr");
      if (data.has_garage_in_amenities) otherAmenities.push("Garageplats");
      if (data.has_parking_in_amenities) otherAmenities.push("Parkering");

      const basicFeatures = [
        ...(data.furnished ? ["Möblerad"] : []),
        ...(data.pets_allowed ? ["Husdjur tillåtna"] : []),
        ...(data.smoking_allowed ? ["Rökning tillåten"] : []),
        ...(data.utilities_included ? ["El/värme inkluderat"] : []),
        ...(data.is_shared ? ["Inneboende"] : []),
        ...(data.internet_included ? ["Internet inkluderat"] : []),
        ...(data.has_elevator ? ["Hiss finns"] : []),
        ...(data.has_balcony ? ["Balkong"] : []),
        ...(data.has_garden ? ["Trädgård/uteplats"] : []),
        ...(data.has_garage ? ["Garageplats tillgänglig"] : []),
        ...(data.parking_available ? ["Parkering tillgänglig"] : []),
      ];

      const propertyData = {
        title: data.title,
        description: data.description,
        property_type:
          data.contract_type === "first_hand"
            ? "Förstahandskontrakt"
            : "Andrahandskontrakt",
        price: data.rent,
        status: "FOR_RENT",
        address_street: data.address_street,
        address_postal_code: data.address_postal_code,
        address_city: data.address_city,
        living_area: data.area,
        rooms: data.rooms,
        images: allImageUrls,
        features: basicFeatures,
        monthly_fee: data.utilities_included ? 0 : null,
        rental_info: {
          contract_type:
            data.contract_type === "first_hand"
              ? "Förstahandskontrakt"
              : "Andrahandskontrakt",
          available_from: data.available_from,
          lease_duration: data.lease_duration,
          pets_allowed: data.pets_allowed,
          smoking_allowed: data.smoking_allowed,
          furnished: data.furnished,
          utilities_included: data.utilities_included,
          internet_included: data.internet_included,
          is_shared: data.is_shared,
          floor_level: data.floor_level,
          has_elevator: data.has_elevator,
          has_balcony: data.has_balcony,
          has_garden: data.has_garden,
          has_garage: data.has_garage,
          parking_available: data.parking_available,
          parking_type: data.parking_type,
          building_year: data.building_year,
          energy_rating: data.energy_rating,
          min_income: data.min_income,
          min_age: data.min_age,
          max_occupants: data.max_occupants,
          references_required: data.references_required,
          neighborhood_description: data.neighborhood_description,
          nearest_metro: data.nearest_metro,
          transport_description: data.transport_description,
          contact_phone: data.contact_phone,
          viewing_instructions: data.viewing_instructions,
          preferred_contact_method: data.preferred_contact_method,
          kitchen_amenities: kitchenAmenities,
          bathroom_amenities: bathroomAmenities,
          tech_amenities: techAmenities,
          other_amenities: otherAmenities,
        },
      };

      if (adId && initialData) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", initialData.properties.id)
          .eq("user_id", user?.id);

        if (error) throw error;

        toast({
          title: "Uppdaterat!",
          description: "Din hyresannons har uppdaterats.",
        });
      } else {
        // Create new rental property
        const { error } = await supabase.from("properties").insert({
          ...propertyData,
          user_id: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Hyresannons skapad!",
          description: "Din annons har verifierats och publicerats.",
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: adId ? "Fel vid uppdatering" : "Fel vid skapande av annons",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const steps = [
    {
      number: 1,
      title: "Grundinformation & Egenskaper",
      icon: Home,
    },
    {
      number: 2,
      title: "Bekvämligheter",
      icon: CheckCircle,
    },
    {
      number: 3,
      title: "Beskrivning",
      icon: FileText,
    },
    {
      number: 4,
      title: "Bilder",
      icon: Image,
    },
    {
      number: 5,
      title: "Uthyrningsvillkor",
      icon: FileText,
    },
    {
      number: 6,
      title: "Granska",
      icon: CheckCircle,
    },
  ];
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <div key={step.number} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors hover:opacity-80 ${isCompleted ? "bg-primary border-primary text-primary-foreground" : isActive ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground hover:border-primary/50"}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`ml-2 text-sm font-medium hover:opacity-80 transition-opacity ${isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground hover:text-primary/70"}`}
                >
                  {step.title}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-px mx-4 ${isCompleted ? "bg-primary" : "bg-muted-foreground"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Information & Property Features */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Grundinformation & Egenskaper</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  Grundläggande information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Rubrik för annonsen</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="T.ex. Ljus 2:a i centrala Stockholm"
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contract_type">Typ av kontrakt</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("contract_type", value as any)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.contract_type ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Välj kontraktstyp" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.contract_type && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.contract_type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rooms">Antal rum</Label>
                    <Input
                      id="rooms"
                      type="number"
                      {...register("rooms", {
                        valueAsNumber: true,
                      })}
                      placeholder="2"
                      className={errors.rooms ? "border-destructive" : ""}
                    />
                    {errors.rooms && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.rooms.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="area">Yta (kvm)</Label>
                    <Input
                      id="area"
                      type="number"
                      {...register("area", {
                        valueAsNumber: true,
                      })}
                      placeholder="45"
                      className={errors.area ? "border-destructive" : ""}
                    />
                    {errors.area && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.area.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="rent">Hyra per månad (SEK)</Label>
                    <Input
                      id="rent"
                      type="number"
                      {...register("rent", {
                        valueAsNumber: true,
                      })}
                      placeholder="12000"
                      className={errors.rent ? "border-destructive" : ""}
                    />
                    {errors.rent && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.rent.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address_street">Gatuadress</Label>
                    <Input
                      id="address_street"
                      {...register("address_street")}
                      placeholder="Storgatan 123"
                      className={
                        errors.address_street ? "border-destructive" : ""
                      }
                    />
                    {errors.address_street && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address_street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address_postal_code">Postnummer</Label>
                    <Input
                      id="address_postal_code"
                      {...register("address_postal_code")}
                      placeholder="11122"
                      className={
                        errors.address_postal_code ? "border-destructive" : ""
                      }
                    />
                    {errors.address_postal_code && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address_postal_code.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address_city">Stad</Label>
                    <Input
                      id="address_city"
                      {...register("address_city")}
                      placeholder="Stockholm"
                      className={
                        errors.address_city ? "border-destructive" : ""
                      }
                    />
                    {errors.address_city && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.address_city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="available_from">Tillgänglig från</Label>
                    <Input
                      id="available_from"
                      type="date"
                      {...register("available_from")}
                      className={
                        errors.available_from ? "border-destructive" : ""
                      }
                    />
                    {errors.available_from && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.available_from.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lease_duration">Uthyrningsperiod</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("lease_duration", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.lease_duration ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Välj period" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaseDurations.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.lease_duration && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.lease_duration.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Features */}
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium">Bostadens egenskaper</h3>

                <div className="space-y-4">
                  <h4 className="font-medium">Grundläggande funktioner</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_shared"
                        checked={watch("is_shared")}
                        onCheckedChange={(checked) =>
                          setValue("is_shared", checked as boolean)
                        }
                      />
                      <Label htmlFor="is_shared">
                        Inneboende (delad bostad)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="furnished"
                        checked={watch("furnished")}
                        onCheckedChange={(checked) =>
                          setValue("furnished", checked as boolean)
                        }
                      />
                      <Label htmlFor="furnished">Möblerad</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="utilities_included"
                        checked={watch("utilities_included")}
                        onCheckedChange={(checked) =>
                          setValue("utilities_included", checked as boolean)
                        }
                      />
                      <Label htmlFor="utilities_included">
                        El och värme inkluderat
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="internet_included"
                        checked={watch("internet_included")}
                        onCheckedChange={(checked) =>
                          setValue("internet_included", checked as boolean)
                        }
                      />
                      <Label htmlFor="internet_included">
                        Internet inkluderat
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pets_allowed"
                        checked={watch("pets_allowed")}
                        onCheckedChange={(checked) =>
                          setValue("pets_allowed", checked as boolean)
                        }
                      />
                      <Label htmlFor="pets_allowed">Husdjur tillåtna</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smoking_allowed"
                        checked={watch("smoking_allowed")}
                        onCheckedChange={(checked) =>
                          setValue("smoking_allowed", checked as boolean)
                        }
                      />
                      <Label htmlFor="smoking_allowed">Rökning tillåten</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Fastighetsinformation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="floor_level">Våning</Label>
                      <Input
                        id="floor_level"
                        {...register("floor_level")}
                        placeholder="T.ex. 3 tr, Bottenvåning"
                      />
                    </div>

                    <div>
                      <Label htmlFor="building_year">Byggnadsår</Label>
                      <Input
                        id="building_year"
                        type="number"
                        {...register("building_year", {
                          valueAsNumber: true,
                        })}
                        placeholder="1985"
                      />
                    </div>

                    <div>
                      <Label htmlFor="energy_rating">Energiklass</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("energy_rating", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj energiklass" />
                        </SelectTrigger>
                        <SelectContent>
                          {energyRatings.map((rating) => (
                            <SelectItem key={rating} value={rating}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Utrymmen och faciliteter</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_elevator"
                        checked={watch("has_elevator")}
                        onCheckedChange={(checked) =>
                          setValue("has_elevator", checked as boolean)
                        }
                      />
                      <Label htmlFor="has_elevator">Hiss finns</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_balcony"
                        checked={watch("has_balcony")}
                        onCheckedChange={(checked) =>
                          setValue("has_balcony", checked as boolean)
                        }
                      />
                      <Label htmlFor="has_balcony">Balkong</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_garden"
                        checked={watch("has_garden")}
                        onCheckedChange={(checked) =>
                          setValue("has_garden", checked as boolean)
                        }
                      />
                      <Label htmlFor="has_garden">Trädgård/uteplats</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_garage"
                        checked={watch("has_garage")}
                        onCheckedChange={(checked) =>
                          setValue("has_garage", checked as boolean)
                        }
                      />
                      <Label htmlFor="has_garage">
                        Garageplats tillgänglig
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking_available"
                      checked={watch("parking_available")}
                      onCheckedChange={(checked) =>
                        setValue("parking_available", checked as boolean)
                      }
                    />
                    <Label htmlFor="parking_available">
                      Parkering tillgänglig
                    </Label>
                  </div>

                  {watch("parking_available") && (
                    <div>
                      <Label htmlFor="parking_type">Typ av parkering</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("parking_type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj parkeringstyp" />
                        </SelectTrigger>
                        <SelectContent>
                          {parkingTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Amenities */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Bekvämligheter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vad ingår i hyran?</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Köksutrustning</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_dishwasher"
                          checked={watch("has_dishwasher")}
                          onCheckedChange={(checked) =>
                            setValue("has_dishwasher", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_dishwasher">Diskmaskin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_microwave"
                          checked={watch("has_microwave")}
                          onCheckedChange={(checked) =>
                            setValue("has_microwave", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_microwave">Mikrovågsugn</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_oven"
                          checked={watch("has_oven")}
                          onCheckedChange={(checked) =>
                            setValue("has_oven", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_oven">Ugn</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_freezer"
                          checked={watch("has_freezer")}
                          onCheckedChange={(checked) =>
                            setValue("has_freezer", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_freezer">Kyl/Frys</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Badrumsutrustning</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_washing_machine"
                          checked={watch("has_washing_machine")}
                          onCheckedChange={(checked) =>
                            setValue("has_washing_machine", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_washing_machine">Tvättmaskin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_dryer"
                          checked={watch("has_dryer")}
                          onCheckedChange={(checked) =>
                            setValue("has_dryer", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_dryer">Torktumlare</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_bathtub"
                          checked={watch("has_bathtub")}
                          onCheckedChange={(checked) =>
                            setValue("has_bathtub", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_bathtub">Badkar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_shower"
                          checked={watch("has_shower")}
                          onCheckedChange={(checked) =>
                            setValue("has_shower", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_shower">Dusch</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_bidet"
                          checked={watch("has_bidet")}
                          onCheckedChange={(checked) =>
                            setValue("has_bidet", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_bidet">Bidé</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_floor_heating"
                          checked={watch("has_floor_heating")}
                          onCheckedChange={(checked) =>
                            setValue("has_floor_heating", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_floor_heating">Golvvärme</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Teknik</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_wifi"
                          checked={watch("has_wifi")}
                          onCheckedChange={(checked) =>
                            setValue("has_wifi", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_wifi">Wifi/Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_tv"
                          checked={watch("has_tv")}
                          onCheckedChange={(checked) =>
                            setValue("has_tv", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_tv">TV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_air_conditioning"
                          checked={watch("has_air_conditioning")}
                          onCheckedChange={(checked) =>
                            setValue("has_air_conditioning", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_air_conditioning">AC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_heating"
                          checked={watch("has_heating")}
                          onCheckedChange={(checked) =>
                            setValue("has_heating", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_heating">Uppvärmning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_alarm_system"
                          checked={watch("has_alarm_system")}
                          onCheckedChange={(checked) =>
                            setValue("has_alarm_system", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_alarm_system">Inbrottslarm</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_ev_charger"
                          checked={watch("has_ev_charger")}
                          onCheckedChange={(checked) =>
                            setValue("has_ev_charger", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_ev_charger">
                          Laddmöjlighet till bil
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Övrigt</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_fireplace"
                          checked={watch("has_fireplace")}
                          onCheckedChange={(checked) =>
                            setValue("has_fireplace", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_fireplace">Öppen spis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_sauna"
                          checked={watch("has_sauna")}
                          onCheckedChange={(checked) =>
                            setValue("has_sauna", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_sauna">Bastu</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_storage"
                          checked={watch("has_storage")}
                          onCheckedChange={(checked) =>
                            setValue("has_storage", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_storage">Förråd</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_bike_room"
                          checked={watch("has_bike_room")}
                          onCheckedChange={(checked) =>
                            setValue("has_bike_room", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_bike_room">Cykelrum</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_stroller_room"
                          checked={watch("has_stroller_room")}
                          onCheckedChange={(checked) =>
                            setValue("has_stroller_room", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_stroller_room">Barnvagnsrum</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_gym"
                          checked={watch("has_gym")}
                          onCheckedChange={(checked) =>
                            setValue("has_gym", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_gym">Gym</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_common_room"
                          checked={watch("has_common_room")}
                          onCheckedChange={(checked) =>
                            setValue("has_common_room", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_common_room">
                          Gemensamhetslokal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_pool"
                          checked={watch("has_pool")}
                          onCheckedChange={(checked) =>
                            setValue("has_pool", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_pool">Pool</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_jacuzzi"
                          checked={watch("has_jacuzzi")}
                          onCheckedChange={(checked) =>
                            setValue("has_jacuzzi", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_jacuzzi">Bubbelpool</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_security_door"
                          checked={watch("has_security_door")}
                          onCheckedChange={(checked) =>
                            setValue("has_security_door", checked as boolean)
                          }
                        />
                        <Label htmlFor="has_security_door">Säkerhetsdörr</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_garage_in_amenities"
                          checked={watch("has_garage_in_amenities")}
                          onCheckedChange={(checked) =>
                            setValue(
                              "has_garage_in_amenities",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor="has_garage_in_amenities">
                          Garageplats
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_parking_in_amenities"
                          checked={watch("has_parking_in_amenities")}
                          onCheckedChange={(checked) =>
                            setValue(
                              "has_parking_in_amenities",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor="has_parking_in_amenities">
                          Parkering
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Description */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Beskrivning och område</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Beskriv din bostad</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Beskriv din bostad i detalj. Vad gör den speciell? Vilka faciliteter finns? Hur är området? Vad gör den attraktiv för hyresgäster?"
                  className={`min-h-[200px] ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Minst 20 tecken krävs. Ge en detaljerad beskrivning som
                  hjälper potentiella hyresgäster att förstå vad som gör din
                  bostad speciell.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Område och transport</h3>
                <div>
                  <Label htmlFor="neighborhood_description">
                    Beskrivning av området
                  </Label>
                  <Textarea
                    id="neighborhood_description"
                    {...register("neighborhood_description")}
                    placeholder="Beskriv området, närhet till butiker, skolor, parker etc."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nearest_metro">
                      Närmaste tunnelbana/station
                    </Label>
                    <Input
                      id="nearest_metro"
                      {...register("nearest_metro")}
                      placeholder="T.ex. Odenplan, 5 min promenad"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="transport_description">Kollektivtrafik</Label>
                  <Textarea
                    id="transport_description"
                    {...register("transport_description")}
                    placeholder="Beskriv närhet till kollektivtrafik, busslinjer, etc."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Images */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Bilder av bostaden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Ladda upp bilder
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      JPG, PNG eller WEBP. Max 20 bilder. Dra för att ändra
                      ordning.
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className="pointer-events-none"
                      >
                        Välj bilder
                      </Button>
                    </Label>
                  </div>
                </div>

                {/* Combined Images Display with Drag & Drop */}
                {(existingImageUrls.length > 0 || images.length > 0) && (
                  <div>
                    <h4 className="font-medium mb-3">
                      Dina bilder ({existingImageUrls.length + images.length})
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Dra bilderna för att ändra ordning. Klicka på stjärnan för
                      att välja förstabild.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...existingImageUrls, ...images].map((item, index) => {
                        const imageUrl =
                          typeof item === "string"
                            ? item
                            : URL.createObjectURL(item);
                        const isFeatured = index === featuredImageIndex;
                        const isExisting = index < existingImageUrls.length;

                        return (
                          <div
                            key={`image-${index}`}
                            className={`relative group cursor-move border-2 rounded-lg transition-all ${
                              isFeatured
                                ? "border-primary shadow-lg"
                                : "border-transparent"
                            } ${draggedIndex === index ? "opacity-50" : ""}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                          >
                            <img
                              src={imageUrl}
                              alt={`Bild ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />

                            {/* Featured badge */}
                            {isFeatured && (
                              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                                Förstabild
                              </div>
                            )}

                            {/* Featured star button */}
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setFeaturedImageIndex(index)}
                              title="Välj som förstabild"
                            >
                              {isFeatured ? "★" : "☆"}
                            </Button>

                            {/* Remove button */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                if (isExisting) {
                                  removeExistingImage(index);
                                } else {
                                  removeImage(index - existingImageUrls.length);
                                }
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            {/* Image number */}
                            <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs">
                              #{index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Rental Requirements */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Uthyrningsvillkor och krav</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Krav på hyresgäst</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_income">Minsta månadslön (SEK)</Label>
                    <Input
                      id="min_income"
                      type="number"
                      {...register("min_income", {
                        valueAsNumber: true,
                      })}
                      placeholder="25000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Rekommenderat: 3x hyran
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="min_age">Minimiålder</Label>
                    <Input
                      id="min_age"
                      type="number"
                      {...register("min_age", {
                        valueAsNumber: true,
                      })}
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_occupants">Max antal boende</Label>
                    <Input
                      id="max_occupants"
                      type="number"
                      {...register("max_occupants", {
                        valueAsNumber: true,
                      })}
                      placeholder="2"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="references_required"
                    checked={watch("references_required")}
                    onCheckedChange={(checked) =>
                      setValue("references_required", checked as boolean)
                    }
                  />
                  <Label htmlFor="references_required">Referenser krävs</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Kontaktinformation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">
                      Telefonnummer (valfritt)
                    </Label>
                    <Input
                      id="contact_phone"
                      {...register("contact_phone")}
                      placeholder="070-123 45 67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferred_contact_method">
                      Föredragen kontaktmetod
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("preferred_contact_method", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kontaktmetod" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="viewing_instructions">
                    Instruktioner för visning
                  </Label>
                  <Textarea
                    id="viewing_instructions"
                    {...register("viewing_instructions")}
                    placeholder="T.ex. Kontakta mig för att boka visning. Visningar vardagar efter 17:00."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Preview */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>Förhandsgranska annons</CardTitle>
              <p className="text-sm text-muted-foreground">
                Granska hur din annons kommer att se ut innan publicering
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Image */}
              {(existingImageUrls.length > 0 || images.length > 0) && (
                <div className="space-y-4">
                  <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                    {(() => {
                      const allImages = [...existingImageUrls, ...images];
                      const featuredItem = allImages[featuredImageIndex];
                      const featuredUrl =
                        typeof featuredItem === "string"
                          ? featuredItem
                          : featuredItem
                            ? URL.createObjectURL(featuredItem)
                            : "";

                      return featuredUrl ? (
                        <img
                          src={featuredUrl}
                          alt="Förstabild"
                          className="w-full h-full object-cover"
                        />
                      ) : null;
                    })()}
                  </div>

                  {/* Image Gallery */}
                  {existingImageUrls.length + images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {[...existingImageUrls, ...images]
                        .slice(1, 7)
                        .map((item, index) => {
                          const imageUrl =
                            typeof item === "string"
                              ? item
                              : URL.createObjectURL(item);
                          return (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Bild ${index + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          );
                        })}
                      {existingImageUrls.length + images.length > 7 && (
                        <div className="w-full h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                          +{existingImageUrls.length + images.length - 7} till
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Title and Price */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {watch("title")}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {watch("rent")?.toLocaleString("sv-SE")} kr
                  </span>
                  <span className="text-muted-foreground">/månad</span>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Kontraktstyp</p>
                  <p className="font-medium">
                    {
                      contractTypes.find(
                        (t) => t.value === watch("contract_type"),
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Antal rum</p>
                  <p className="font-medium">{watch("rooms")} rum</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yta</p>
                  <p className="font-medium">{watch("area")} kvm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tillgänglig från
                  </p>
                  <p className="font-medium">{watch("available_from")}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Beskrivning</h3>
                <p className="text-foreground whitespace-pre-line">
                  {watch("description")}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Adress</h3>
                <p className="text-foreground">
                  {watch("address_street")}, {watch("address_postal_code")}{" "}
                  {watch("address_city")}
                </p>
              </div>

              {/* Property Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Boendedetaljer</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {watch("floor_level") && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Våning:</span>
                      <span>{watch("floor_level")}</span>
                    </div>
                  )}
                  {watch("building_year") && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Byggnadsår:</span>
                      <span>{watch("building_year")}</span>
                    </div>
                  )}
                  {watch("energy_rating") && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Energiklass:
                      </span>
                      <span>{watch("energy_rating")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      Uthyrningsperiod:
                    </span>
                    <span>{watch("lease_duration")}</span>
                  </div>
                </div>
              </div>

              {/* Features and Amenities */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Tillval & Bekvämligheter
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watch("furnished") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Möblerad
                    </span>
                  )}
                  {watch("utilities_included") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      El/värme inkluderat
                    </span>
                  )}
                  {watch("internet_included") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Internet inkluderat
                    </span>
                  )}
                  {watch("pets_allowed") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Husdjur tillåtna
                    </span>
                  )}
                  {watch("smoking_allowed") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Rökning tillåten
                    </span>
                  )}
                  {watch("has_elevator") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Hiss
                    </span>
                  )}
                  {watch("has_balcony") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Balkong
                    </span>
                  )}
                  {watch("has_garden") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Trädgård
                    </span>
                  )}
                  {watch("has_garage") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Garage
                    </span>
                  )}
                  {watch("parking_available") && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Parkering
                    </span>
                  )}
                  {watch("has_dishwasher") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Diskmaskin
                    </span>
                  )}
                  {watch("has_washing_machine") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Tvättmaskin
                    </span>
                  )}
                  {watch("has_dryer") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Torktumlare
                    </span>
                  )}
                  {watch("has_wifi") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Wifi
                    </span>
                  )}
                  {watch("has_tv") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      TV
                    </span>
                  )}
                  {watch("has_air_conditioning") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      AC
                    </span>
                  )}
                  {watch("has_gym") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Gym
                    </span>
                  )}
                  {watch("has_sauna") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Bastu
                    </span>
                  )}
                  {watch("has_pool") && (
                    <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                      Pool
                    </span>
                  )}
                </div>
              </div>

              {/* Tenant Requirements */}
              {(watch("min_income") ||
                watch("min_age") ||
                watch("max_occupants") ||
                watch("references_required")) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Krav på hyresgäst</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {watch("min_income") && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Minsta lön:
                        </span>
                        <span>
                          {watch("min_income")?.toLocaleString("sv-SE")} kr/mån
                        </span>
                      </div>
                    )}
                    {watch("min_age") && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Minimiålder:
                        </span>
                        <span>{watch("min_age")} år</span>
                      </div>
                    )}
                    {watch("max_occupants") && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Max antal boende:
                        </span>
                        <span>{watch("max_occupants")} personer</span>
                      </div>
                    )}
                    {watch("references_required") && (
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓ Referenser krävs</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Neighborhood & Transport */}
              {(watch("neighborhood_description") ||
                watch("nearest_metro") ||
                watch("transport_description")) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Område & Transport</h3>
                  {watch("neighborhood_description") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Om området
                      </p>
                      <p className="text-foreground">
                        {watch("neighborhood_description")}
                      </p>
                    </div>
                  )}
                  {watch("nearest_metro") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Närmaste kollektivtrafik
                      </p>
                      <p className="text-foreground">
                        {watch("nearest_metro")}
                      </p>
                    </div>
                  )}
                  {watch("transport_description") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Transportbeskrivning
                      </p>
                      <p className="text-foreground">
                        {watch("transport_description")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Information */}
              {(watch("contact_phone") ||
                watch("viewing_instructions") ||
                watch("preferred_contact_method")) && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Kontakt & Visning</h3>
                  {watch("contact_phone") && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Telefon:</span>
                      <span>{watch("contact_phone")}</span>
                    </div>
                  )}
                  {watch("preferred_contact_method") && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Föredragen kontaktmetod:
                      </span>
                      <span>
                        {
                          contactMethods.find(
                            (m) =>
                              m.value === watch("preferred_contact_method"),
                          )?.label
                        }
                      </span>
                    </div>
                  )}
                  {watch("viewing_instructions") && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Visningsinstruktioner
                      </p>
                      <p className="text-foreground">
                        {watch("viewing_instructions")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Verification Notice */}
              <div className="bg-nordic-ice border border-primary/20 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">
                  AI-verifiering
                </h4>
                <p className="text-sm text-muted-foreground">
                  Din annons kommer att granskas av vår AI för att säkerställa
                  att den följer våra riktlinjer. Annonser med opassande språk
                  eller bilder kommer att avvisas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="default"
                onClick={prevStep}
                className="flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Föregående steg
              </Button>
            )}
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-muted-foreground"
              >
                Avbryt formulär
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">
              Steg {currentStep} av {steps.length}
            </span>

            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center"
              >
                Nästa steg
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || isUploading || isVerifying}
                className="min-w-[140px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Laddar upp bilder...
                  </>
                ) : isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    AI verifierar...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {adId ? "Sparar ändringar..." : "Skapar annons..."}
                  </>
                ) : adId ? (
                  "Spara ändringar"
                ) : (
                  "Publicera annons"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
export default RentalForm;
