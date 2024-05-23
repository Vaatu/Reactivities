import { Message, MessageList } from "semantic-ui-react";

interface Props{
    errors: string[];
}
export default function ValidationError({errors}: Props){
    return(
        <Message>
            {errors && (
                <MessageList>
                    {errors.map((err, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </MessageList>
            )}
        </Message>
    )

}