import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    return (
        <Formik initialValues={{
            displayName: '', username: '',
            email: '', password: '', error: null
        }} onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({ error })

        )} validationSchema={Yup.object({
            displayName: Yup.string().required(),
            username: Yup.string().required(),
            password: Yup.string().required(),
            email: Yup.string().required().email(),
        })}>


            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="displayName" placeholder="Display Name" />
                    <MyTextInput name="username" placeholder="Username" />
                    <MyTextInput name="password" placeholder="Password" type="password" />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <ValidationError errors={errors.error as unknown as string[]} />}
                    />
                    <Button
                        disabled={!isValid || !dirty}
                        positive content="Register"
                        type="submit"
                        loading={isSubmitting} fluid />
                </Form>
            )}

        </Formik >
    )
})