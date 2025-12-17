"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Property } from "db";
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
import { createProperty, updateProperty } from "@/lib/actions/property";
import { getPropertyImageUrl } from "@/image";

const formSchema = z.object({
  title: z.string().min(1, "Titel krävs"),
  description: z.string().optional(),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "COTTAGE",
    "PLOT",
    "FARM",
    "COMMERCIAL",
  ]),
  status: z.enum([
    "COMING_SOON",
    "FOR_SALE",
    "FOR_RENT",
    "SOLD",
    "RENTED",
    "DRAFT",
  ]),
  price: z.coerce.number().nonnegative(),
  addressStreet: z.string().min(1, "Gatuadress krävs"),
  addressPostalCode: z.string().min(1, "Postnummer krävs"),
  addressCity: z.string().min(1, "Stad krävs"),
  livingArea: z.coerce.number().optional(),
  plotArea: z.coerce.number().optional(),
  rooms: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  yearBuilt: z.coerce.number().optional(),
  monthlyFee: z.coerce.number().optional(),
  energyClass: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
  features: z.array(z.string()).optional(),
  adTier: z.enum(["free", "plus", "premium"]).default("free"),
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PROPERTY_TYPES: { value: FormValues["propertyType"]; label: string }[] = [
  { value: "HOUSE", label: "Villa" },
  { value: "APARTMENT", label: "Lägenhet" },
  { value: "COTTAGE", label: "Fritidshus" },
  { value: "PLOT", label: "Tomt" },
  { value: "FARM", label: "Gård" },
  { value: "COMMERCIAL", label: "Kommersiell" },
];

const STATUS_OPTIONS: { value: FormValues["status"]; label: string }[] = [
  { value: "FOR_SALE", label: "Till salu" },
  { value: "FOR_RENT", label: "Till uthyrning" },
  { value: "COMING_SOON", label: "Kommer snart" },
  { value: "SOLD", label: "Såld" },
  { value: "RENTED", label: "Uthyrd" },
  { value: "DRAFT", label: "Utkast" },
];

const FEATURES = [
  "Balkong",
  "Terrass",
  "Trädgård",
  "Garage",
  "Parkering",
  "Hiss",
  "Förråd",
  "Tvättstuga",
  "Öppen spis",
  "Pool",
  "Gym",
  "Bastu",
  "Vinkällare",
  "Fiber",
];

const AD_TIERS: { value: FormValues["adTier"]; label: string }[] = [
  { value: "free", label: "Grund" },
  { value: "plus", label: "Plus" },
  { value: "premium", label: "Exklusiv" },
];

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropertyForm({
  property,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: property?.title ?? "",
      description: property?.description ?? "",
      propertyType: property?.propertyType ?? "HOUSE",
      status: property?.status ?? "DRAFT",
      price: property?.price ?? 0,
      addressStreet: property?.addressStreet ?? "",
      addressPostalCode: property?.addressPostalCode ?? "",
      addressCity: property?.addressCity ?? "",
      livingArea: property?.livingArea ?? undefined,
      plotArea: property?.plotArea ?? undefined,
      rooms: property?.rooms ?? undefined,
      bedrooms: property?.bedrooms ?? undefined,
      bathrooms: property?.bathrooms ?? undefined,
      yearBuilt: property?.yearBuilt ?? undefined,
      monthlyFee: property?.monthlyFee ?? undefined,
      energyClass: property?.energyClass ?? undefined,
      features: property?.features ?? [],
      adTier: property?.adTier ?? "free",
      images: property?.images ?? [],
    }),
    [property],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const payload = {
        ...values,
        price: Number(values.price || 0),
        livingArea: values.livingArea ? Number(values.livingArea) : undefined,
        plotArea: values.plotArea ? Number(values.plotArea) : undefined,
        rooms: values.rooms ? Number(values.rooms) : undefined,
        bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
        yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : undefined,
        monthlyFee: values.monthlyFee ? Number(values.monthlyFee) : undefined,
        images: values.images ?? [],
      };

      const result = property
        ? await updateProperty(property.id, payload, files)
        : await createProperty(payload, files);

      if (result.success) {
        toast.success(
          property ? "Fastighet uppdaterad" : "Fastighet skapad",
        );
        setFiles([]);
        onSuccess?.();
      } else {
        toast.error(result.error || "Något gick fel");
      }
    });
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const next = Array.from(fileList).slice(0, 10 - files.length);
    setFiles((prev) => [...prev, ...next]);
  };

  const removeExistingImage = (idx: number) => {
    const current = form.getValues("images") || [];
    form.setValue(
      "images",
      current.filter((_, i) => i !== idx),
    );
  };

  const removeNewImage = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const selectedFeatures = form.watch("features") || [];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grundinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="T.ex. Modern villa med havsutsikt"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Beskriv fastigheten..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fastighetstyp *</Label>
              <Select
                defaultValue={form.getValues("propertyType")}
                onValueChange={(val) =>
                  form.setValue("propertyType", val as FormValues["propertyType"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.propertyType && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.propertyType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue={form.getValues("status")}
                onValueChange={(val) =>
                  form.setValue("status", val as FormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pris (SEK) *</Label>
              <Input
                type="number"
                inputMode="numeric"
                {...form.register("price")}
                placeholder="5000000"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Annonsnivå</Label>
              <Select
                defaultValue={form.getValues("adTier")}
                onValueChange={(val) =>
                  form.setValue("adTier", val as FormValues["adTier"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AD_TIERS.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gatuadress *</Label>
            <Input {...form.register("addressStreet")} placeholder="Storgatan 1" />
            {form.formState.errors.addressStreet && (
              <p className="text-sm text-destructive">
                {form.formState.errors.addressStreet.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Postnummer *</Label>
              <Input
                {...form.register("addressPostalCode")}
                placeholder="123 45"
              />
              {form.formState.errors.addressPostalCode && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.addressPostalCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Stad *</Label>
              <Input {...form.register("addressCity")} placeholder="Stockholm" />
              {form.formState.errors.addressCity && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.addressCity.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fastighetsinfo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "livingArea", label: "Boarea (m²)" },
            { name: "plotArea", label: "Tomtarea (m²)" },
            { name: "rooms", label: "Rum" },
            { name: "bedrooms", label: "Sovrum" },
            { name: "bathrooms", label: "Badrum" },
            { name: "yearBuilt", label: "Byggår" },
            { name: "monthlyFee", label: "Månadsavgift (SEK)" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type="number"
                inputMode="numeric"
                {...form.register(field.name as keyof FormValues)}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label>Energiklass</Label>
            <Select
              defaultValue={form.getValues("energyClass")}
              onValueChange={(val) =>
                form.setValue("energyClass", val as FormValues["energyClass"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj klass" />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C", "D", "E", "F", "G"].map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Egenskaper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FEATURES.map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selectedFeatures, feature]
                      : selectedFeatures.filter((f) => f !== feature);
                    form.setValue("features", next);
                  }}
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
          {selectedFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-secondary px-3 py-1 text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bilder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Ladda upp bilder (max 10)</Label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("images")?.click()}
              className="w-full"
              disabled={(files.length + (form.getValues("images")?.length || 0)) >= 10}
            >
              Välj bilder ({files.length + (form.getValues("images")?.length || 0)}
              /10)
            </Button>
          </div>

          {(form.getValues("images")?.length || 0) > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.getValues("images")?.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className="relative overflow-hidden rounded border"
                >
                  <img
                    src={getPropertyImageUrl(img)}
                    alt={`Bild ${idx + 1}`}
                    className="h-28 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/300x200?text=Bild";
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => removeExistingImage(idx)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="relative overflow-hidden rounded border bg-muted"
                >
                  <div className="h-28 w-full flex items-center justify-center text-xs text-muted-foreground px-2 text-center">
                    {file.name}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => removeNewImage(idx)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Sparar..." : property ? "Uppdatera" : "Skapa"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Avbryt
          </Button>
        )}
      </div>
    </form>
  );
}

