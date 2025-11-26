import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Plus, ImageIcon } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(1, 'Titel krävs'),
  description: z.string().optional(),
  property_type: z.string().min(1, 'Fastighetstyp krävs'),
  price: z.number().min(0, 'Pris måste vara positivt'),
  address_street: z.string().min(1, 'Gatuadress krävs'),
  address_postal_code: z.string().min(1, 'Postnummer krävs'),
  address_city: z.string().min(1, 'Stad krävs'),
  living_area: z.number().optional(),
  plot_area: z.number().optional(),
  rooms: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  year_built: z.number().optional(),
  monthly_fee: z.number().optional(),
  energy_class: z.string().optional(),
  status: z.string(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  propertyId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const propertyTypes = [
  'Villa',
  'Lägenhet',
  'Radhus',
  'Bostadsrätt',
  'Fritidshus',
  'Tomt',
  'Kommersiell',
];

const statusOptions = [
  { value: 'FOR_SALE', label: 'Till salu' },
  { value: 'FOR_RENT', label: 'Till uthyrning' },
  { value: 'COMING_SOON', label: 'Kommer snart' },
  { value: 'SOLD', label: 'Såld' },
  { value: 'DRAFT', label: 'Utkast' },
];

const featuresList = [
  'Balkong',
  'Terrass',
  'Trädgård',
  'Garage',
  'Parkering',
  'Hiss',
  'Förråd',
  'Tvättstuga',
  'Öppen spis',
  'Pool',
  'Gym',
  'Bastu',
  'Vinkällare',
  'Fiber',
];

export const PropertyForm: React.FC<PropertyFormProps> = ({ 
  propertyId, 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'DRAFT',
      property_type: '',
    },
  });

  // Load existing property data if editing
  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;

      reset({
        ...data,
        price: Number(data.price),
      });
      
      setSelectedFeatures(data.features || []);
      setImageUrls(data.images || []);
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda fastighet',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 10 - images.length);
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number, isUploaded: boolean = false) => {
    if (isUploaded) {
      setImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return imageUrls;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return [...imageUrls, ...uploadedUrls];
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Ett fel uppstod vid bilduppladdning',
        variant: 'destructive',
      });
      return imageUrls;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const uploadedImageUrls = await uploadImages();

      const propertyData = {
        ...data,
        features: selectedFeatures,
        images: uploadedImageUrls,
        user_id: user.id,
        address_country: 'SE', // Default to Sweden
      } as any; // Temporary type assertion to fix build

      if (propertyId) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (error) throw error;

        toast({
          title: 'Framgång',
          description: 'Fastighet uppdaterad',
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert(propertyData);

        if (error) throw error;

        toast({
          title: 'Framgång',
          description: 'Fastighet skapad',
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: error.message || 'Ett fel uppstod',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grundinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="T.ex. Modern villa med havsutsikt"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Beskriv fastigheten..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_type">Fastighetstyp *</Label>
              <Select onValueChange={(value) => setValue('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj typ" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && (
                <p className="text-sm text-destructive mt-1">{errors.property_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Pris (SEK) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="5000000"
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)} defaultValue="DRAFT">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address_street">Gatuadress *</Label>
            <Input
              id="address_street"
              {...register('address_street')}
              placeholder="Storgatan 1"
            />
            {errors.address_street && (
              <p className="text-sm text-destructive mt-1">{errors.address_street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address_postal_code">Postnummer *</Label>
              <Input
                id="address_postal_code"
                {...register('address_postal_code')}
                placeholder="123 45"
              />
              {errors.address_postal_code && (
                <p className="text-sm text-destructive mt-1">{errors.address_postal_code.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address_city">Stad *</Label>
              <Input
                id="address_city"
                {...register('address_city')}
                placeholder="Stockholm"
              />
              {errors.address_city && (
                <p className="text-sm text-destructive mt-1">{errors.address_city.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fastighetsinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="living_area">Boarea (m²)</Label>
              <Input
                id="living_area"
                type="number"
                {...register('living_area', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="plot_area">Tomtarea (m²)</Label>
              <Input
                id="plot_area"
                type="number"
                {...register('plot_area', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="rooms">Rum</Label>
              <Input
                id="rooms"
                type="number"
                {...register('rooms', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Sovrum</Label>
              <Input
                id="bedrooms"
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Badrum</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="year_built">Byggår</Label>
              <Input
                id="year_built"
                type="number"
                {...register('year_built', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="monthly_fee">Månadsavgift (SEK)</Label>
              <Input
                id="monthly_fee"
                type="number"
                {...register('monthly_fee', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="energy_class">Energiklass</Label>
              <Select onValueChange={(value) => setValue('energy_class', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj klass" />
                </SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
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
          <CardTitle>Egenskaper</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {featuresList.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <Label htmlFor={feature} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
          {selectedFeatures.length > 0 && (
            <div className="mt-4">
              <Label>Valda egenskaper:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bilder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="images">Ladda upp bilder (max 10)</Label>
            <div className="mt-2">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('images')?.click()}
                className="w-full"
                disabled={images.length + imageUrls.length >= 10}
              >
                <Upload className="h-4 w-4 mr-2" />
                Välj bilder ({images.length + imageUrls.length}/10)
              </Button>
            </div>
          </div>

          {(imageUrls.length > 0 || images.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={`uploaded-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index, true)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {images.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <div className="w-full h-24 bg-muted rounded border flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b truncate">
                    {file.name}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index, false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex-1"
        >
          {isSubmitting || isUploading
            ? 'Sparar...'
            : propertyId
            ? 'Uppdatera fastighet'
            : 'Skapa fastighet'
          }
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
          >
            Avbryt
          </Button>
        )}
      </div>
    </form>
  );
};