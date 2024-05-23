import { useField } from "formik";
import { FormField, Label } from "semantic-ui-react";
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';



export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta] = useField(props.name!);
    return (
        <FormField error={meta.touched && !!meta.error}  >
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => field.onChange({target: {name: field.name, value}})}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red' content={meta.error} />
            ) : null}
        </FormField>
    )
}