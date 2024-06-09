import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import useQuery from "../../app/util/hooks";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import LoginForm from "./LoginForm";

export default function ConfirmEmail() {
    const { modalStore } = useStore();

    const email = useQuery().get('email') as string;
    const token = useQuery().get('token') as string;

    const Status = {
        Verifying: 'Verifying',
        Success: 'Success',
        Failed: 'Failed'
    }

    const [status, setStatus] = useState(Status.Verifying);

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email).then(() => {
            toast.success('Verification email resent - please check your email');

        }).catch(error => console.log(error));
    }

    useEffect(() => {
        agent.Account.verifyEmail(token, email).then(() => {
            setStatus(Status.Success);
        }).catch(() => {
            setStatus(Status.Failed);
        })

    }, [Status.Failed, Status.Success, email, token])

    function getBody(){
        switch (status) {
            case Status.Verifying:
                return (
                    <>
                        <p>Verifying email...</p>
                    </>
                )
            case Status.Success:
                return (
                    <>
                        <p>Email has been verified. You can now login</p>
                        <Button onClick={() => modalStore.openModal(<LoginForm/>)} primary content="Login" size="huge" />

                    </>
                )
            case Status.Failed:
                return (
                    <>
                        <p>Email verification failed. You can try to resend the verification email</p>
                        <Button onClick={handleConfirmEmailResend} primary content="Resend email" size="huge" />
                    </>
                )            
        }   
    }
    return (<Segment placeholder textAlign="center">
        <Header icon >
            <Icon name="envelope" />
            Email Verification
        </Header>

        <Segment.Inline>
            {getBody()}
        </Segment.Inline>
    

    </Segment>)

}