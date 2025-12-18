"use client";

import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { addProperty } from "@/lib/actions/vitec/add-property";

const propertyTypes = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "COTTAGE", label: "Cottage" },
  { value: "PLOT", label: "Plot" },
  { value: "FARM", label: "Farm" },
  { value: "COMMERCIAL", label: "Commercial" },
];

type T_Form_Input = {
  title: string;
  type: string;
  objectId: string;
};

const PropertyAddPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<T_Form_Input>({
    defaultValues: {
      type: "APARTMENT",
    },
  });

  const onSubmit: SubmitHandler<T_Form_Input> = async (formData) => {
    const { title, type, objectId } = formData;

    const res = await addProperty(title, type, objectId);

    if (!res.success) {
      toast.error("Failed to add property", {
        description: res.error || "An unknown error occurred.",
      });
      return;
    }

    toast.success(res.message);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 @container">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card className="w-full max-w-md shadow-xs py-6">
          <CardHeader className="text-center">
            <CardTitle className="text-xl @sm:text-2xl text-left">
              New Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-y-6">
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...register("title", { required: true })} required />
                </Field>
                <Field>
                  <FieldLabel>Property Type</FieldLabel>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Object ID (from Vitec)</FieldLabel>
                  <Input
                    {...register("objectId", { required: true })}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : "Create"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyAddPage;
