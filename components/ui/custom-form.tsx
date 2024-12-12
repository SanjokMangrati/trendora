import * as React from "react"
import { useForm, FormProvider, UseFormProps, SubmitHandler, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface FormProps<TFormValues extends FieldValues> {
    onSubmit: SubmitHandler<TFormValues>
    children: (methods: ReturnType<typeof useForm<TFormValues>>) => React.ReactNode
    schema: z.ZodType<TFormValues>
    useFormProps?: UseFormProps<TFormValues>
    className?: string
}

export function Form<TFormValues extends FieldValues>({
    onSubmit,
    children,
    schema,
    useFormProps,
    className,
}: FormProps<TFormValues>) {
    const methods = useForm<TFormValues>({
        ...useFormProps,
        resolver: zodResolver(schema),
    })

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
                {children(methods)}
            </form>
        </FormProvider>
    )
}

