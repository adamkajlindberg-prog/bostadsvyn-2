"use client";

import {
  Building2Icon,
  FileDigitIcon,
  MailIcon,
  MapPinnedIcon,
  PhoneIcon,
  SignpostIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import slugify from "slugify";
import { authClient } from "@/auth/client";
import { addOfficeAndBroker } from "@/lib/actions/broker";
import { cn } from "@/lib/utils";
import { formatPhone, phoneRegex } from "@/utils/format-phone";
import Logo from "../common/logo";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import SpinnerLoader from "../ui/spinner-loader";
import useAddBroker, { type T_Broker_Input } from "./hooks/use-add-broker";
import useAddOffice, { type T_Office_Input } from "./hooks/use-add-office";

type T_Form_Input = {
  office: T_Office_Input;
  broker: T_Broker_Input;
};

const BrokerOnBoarding = () => {
  const [step, setStep] = useState<number>(1);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<T_Form_Input>();

  const { mutate: mutateOffice } = useAddOffice();
  const { mutate: mutateBroker } = useAddBroker();

  const handlePhoneChange =
    (field: "office.phone" | "broker.phone") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setValue(field, formatted);
      };

  const onSubmit: SubmitHandler<T_Form_Input> = async (formData) => {
    const slug = slugify(formData.office.name, {
      lower: true,
      strict: true,
      replacement: "-",
    });

    if (step === 1) {
      const { error: slugError } = await authClient.organization.checkSlug({
        slug,
      });

      if (slugError?.code === "SLUG_IS_TAKEN") {
        setError("office.name", {
          type: "manual",
          message: "Detta kontorsnamn finns redan.",
        });
        return;
      }

      if (slugError) {
        console.log("Error on checking organization slug. Error:", slugError);
        return;
      }

      setStep(2);
    } else {
      const officeData = {
        name: formData.office.name,
        slug,
        metadata: {
          type: "broker",
          office: {
            address: formData.office.address,
            city: formData.office.city,
            postalCode: formData.office.postalCode,
            phone: formData.office.phone,
            email: formData.office.email,
          },
        },
      };

      addOfficeAndBroker(officeData);

      // mutateOffice(officeData, {
      //   onSuccess: (office) => {
      //     const brokerData = {
      //       userId: office.members[0]?.userId ?? "",
      //       organizationId: office.id,
      //       brokerName: formData.broker.fullName,
      //       brokerEmail: formData.broker.email,
      //       brokerPhone: formData.broker.phone,
      //       licenseNumber: formData.broker.license,
      //     };

      //     mutateBroker(brokerData, {
      //       onSuccess: (broker) => {
      //         console.log("Broker registered successfully:", broker);
      //       },
      //       onError: (error) => {
      //         console.error("Failed to add broker:", error);
      //       },
      //     });
      //   },
      //   onError: (error) => {
      //     console.error("Failed to create organization:", error);
      //   },
      // });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="w-full max-w-md shadow-xs py-6">
        <CardHeader className="text-center">
          <div className="flex mb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
                <Logo
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-lg font-semibold">Bostadsvyn.se</h2>
            </Link>
          </div>
          <CardTitle className="text-xl @sm:text-2xl text-left">
            Registrera mäklare
          </CardTitle>
          <CardDescription className="text-left">
            Vänligen fyll i informationen nedan för att registrera dig som
            mäklare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-6">
              {step === 1 && (
                <>
                  <Field>
                    <div className="text-sm text-primary font-semibold">
                      Kontorsinformation
                    </div>
                    <FieldLabel>Kontorets namn</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt kontor namn"
                        {...register("office.name", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <Building2Icon />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.office?.name && (
                      <div className="text-xs text-red-500">
                        {errors.office.name.message}
                      </div>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Gatuadress</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt kontor gatuadress"
                        {...register("office.address", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <MapPinnedIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Stad</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt kontor stad"
                        {...register("office.city", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <MapPinnedIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Postnummer</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt kontor postnummer"
                        {...register("office.postalCode", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <SignpostIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Kontorets telefon</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="+46123456789"
                        {...register("office.phone", {
                          required: true,
                          pattern: {
                            value: phoneRegex,
                            message: "Ogiltigt telefonnummerformat.",
                          },
                          onChange: handlePhoneChange("office.phone"),
                        })}
                        required
                      />
                      <InputGroupAddon>
                        <PhoneIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.office?.phone && (
                      <div className="text-xs text-red-500">
                        {errors.office.phone.message}
                      </div>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Kontorets e-post</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="email"
                        placeholder="info@kontor.se"
                        {...register("office.email", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field>
                    <div className="text-sm text-primary font-semibold">
                      Din information som mäklare
                    </div>
                    <FieldLabel>Fullständigt namn</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt fullständiga namn"
                        {...register("broker.fullName", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <UserIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Telefonnummer</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="+46123456789"
                        {...register("broker.phone", {
                          required: true,
                          pattern: {
                            value: phoneRegex,
                            message: "Ogiltigt telefonnummerformat.",
                          },
                          onChange: handlePhoneChange("broker.phone"),
                        })}
                        required
                      />
                      <InputGroupAddon>
                        <PhoneIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.broker?.phone && (
                      <div className="text-xs text-red-500">
                        {errors.broker.phone.message}
                      </div>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="license">Mäklarlicens</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Ditt mäklarlicensnummer"
                        {...register("broker.license", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <FileDigitIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>E-postadress</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="email"
                        placeholder="din.epost@maklare.se"
                        {...register("broker.email", { required: true })}
                        required
                      />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </>
              )}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <SpinnerLoader />
                  ) : step === 1 ? (
                    "Fortsätta"
                  ) : (
                    "Registrera"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerOnBoarding;
